from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4

class User(AbstractUser):
    name = models.CharField(max_length=150, blank=True)  # 👈 Add this

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('dev', 'Developer'),
        ('mod', 'Moderator'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    )

    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='inactive')
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    reset_token = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        # Only generate token for new non-superuser users
        if not self.pk and not self.is_superuser:
            if not self.verification_token:  # Only generate if not already set
                self.verification_token = str(uuid4())
                print(f"Generated token for {self.email}: {self.verification_token}")
        super().save(*args, **kwargs)

        
class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)