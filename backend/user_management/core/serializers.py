from rest_framework import serializers
from .models import User, ActivityLog
from django.contrib.auth.password_validation import validate_password
from uuid import uuid4
 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'phone', 'role', 'status', 'email_verified']  # Adjusted for AbstractUser
        extra_kwargs = {'password': {'write_only': True}}

# serializers.py
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    name = serializers.CharField(required=True)  # Explicitly define name

    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'phone', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered.")
        
        if User.objects.filter(username=data['email']).exists():
            raise serializers.ValidationError("Username already exists.")
            
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        
        # Create user with proper fields
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            verification_token=str(uuid4()),
            email_verified=False,
            status='inactive'  # Changed from 'pending' to match your choices
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'phone', 'password']

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        return super().update(instance, validated_data)

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'