from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    cook_name = serializers.CharField(source='cook.username', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'cook', 'cook_name', 'title', 'description', 'price',
            'image', 'cuisine_type', 'dietary_tags', 'available',
            'prep_time', 'servings', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'cook', 'created_at', 'updated_at']