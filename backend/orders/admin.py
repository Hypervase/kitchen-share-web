from django.contrib import admin
from .models import Order, Review


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'listing', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['order', 'rating', 'created_at']