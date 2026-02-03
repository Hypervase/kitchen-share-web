from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CookProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'is_cook', 'is_staff']
    list_filter = ['is_cook', 'is_staff']


@admin.register(CookProfile)
class CookProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_verified', 'rating', 'created_at']