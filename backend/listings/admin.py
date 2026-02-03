from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'cook', 'price', 'cuisine_type', 'available', 'created_at']
    list_filter = ['cuisine_type', 'available']
    search_fields = ['title', 'description']