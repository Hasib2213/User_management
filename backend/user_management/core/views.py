from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .models import User, ActivityLog
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, ActivityLogSerializer
from uuid import uuid4


# views.py - RegisterView
class RegisterView(APIView):
    permission_classes = []  # Allow unauthenticated access

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()

                # Send verification email
                try:
                    verify_url = f"http://localhost:5173/verify/{user.verification_token}"
                    send_mail(
                        'Verify Your Email',
                        f'Click to verify: {verify_url}',
                        settings.EMAIL_HOST_USER,
                        [user.email],
                        fail_silently=False,
                    )
                except Exception:
                    pass

                return Response({"message": "Registration successful. Verify email."}, 
                              status=status.HTTP_201_CREATED)
                
            except Exception:
                return Response({"error": "User creation failed"}, 
                              status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = []  # Make sure this is added
    
    def get(self, request, token):
        token = token.strip()
        
        try:
            user = User.objects.get(verification_token=token)
            # Update user
            user.email_verified = True
            user.status = 'active'
            user.verification_token = ''  # Clear the token after use
            user.save()
            
            ActivityLog.objects.create(user=user, activity="Email verified")
            return Response({"message": "Email verified successfully. You can now login."})
            
        except User.DoesNotExist:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = User.objects.filter(email=email).first()
        
        if user:
            password_ok = user.check_password(password)
            email_verified = user.email_verified
            status_active = user.status == 'active'
            
            if password_ok and email_verified and status_active:
                refresh = RefreshToken.for_user(user)
                ActivityLog.objects.create(user=user, activity="Logged in")
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'role': user.role,
                    'name': user.name
                })
            else:
                if not email_verified:
                    return Response({"error": "Email not verified. Please check your email."}, status=status.HTTP_400_BAD_REQUEST)
                elif not status_active:
                    return Response({"error": "Account is not active. Please contact support."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": "Invalid password."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid credentials or unverified."}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            user.reset_token = str(uuid4())
            user.save()
            reset_url = f"http://localhost:5173/reset/{user.reset_token}"
            send_mail(
                'Reset Password',
                f'Click to reset: {reset_url}',
                settings.EMAIL_HOST_USER,
                [email],
            )
            return Response({"message": "Reset email sent."})
        except User.DoesNotExist:
            return Response({"error": "Email not found."}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request, token):
        try:
            user = User.objects.get(reset_token=token)
            password = request.data.get('password')
            confirm = request.data.get('confirm_password')
            if password != confirm:
                return Response({"error": "Passwords don't match."})
            user.set_password(password)
            user.reset_token = ''
            user.save()
            ActivityLog.objects.create(user=user, activity="Password reset")
            return Response({"message": "Password reset successful."})
        except User.DoesNotExist:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            ActivityLog.objects.create(user=request.user, activity="Profile updated")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class AdminEditUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                ActivityLog.objects.create(user=user, activity=f"User edited by admin {request.user.id}")
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            ActivityLog.objects.create(user=request.user, activity=f"User {pk} deleted by admin")
            return Response({"message": "User deleted."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class ActivityLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'dev', 'mod']:
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
        logs = ActivityLog.objects.all() if request.user.role == 'admin' else ActivityLog.objects.filter(user=request.user)
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
