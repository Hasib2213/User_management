from django.contrib import admin
from django.urls import path
from core.views import (
    RegisterView, VerifyEmailView, LoginView, ForgotPasswordView, ResetPasswordView,
    ProfileView, AdminUserListView, AdminEditUserView, ActivityLogView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view()),
    path('api/verify/<str:token>/', VerifyEmailView.as_view()),
    path('api/login/', LoginView.as_view()),
    path('api/refresh/', TokenRefreshView.as_view()),
    path('api/forgot/', ForgotPasswordView.as_view()),
    path('api/reset/<str:token>/', ResetPasswordView.as_view()),
    path('api/profile/', ProfileView.as_view()),
    path('api/admin/users/', AdminUserListView.as_view()),
    path('api/admin/users/<int:pk>/', AdminEditUserView.as_view()),
    path('api/logs/', ActivityLogView.as_view()),
    
]