from django.contrib import admin

# Register your models here.
from .models import User, ActivityLog
admin.site.register(User)
admin.site.register(ActivityLog)