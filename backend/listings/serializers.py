from rest_framework import serializers
from .models import Listing
import json


class ListingSerializer(serializers.ModelSerializer):
    cook_name = serializers.CharField(source='cook.username', read_only=True)
    cook_image = serializers.ImageField(source='cook.profile_image', read_only=True)
    distance = serializers.SerializerMethodField()
    
    # Accept strings and parse as JSON
    dietary_tags = serializers.JSONField(required=False, default=list)
    allergens = serializers.JSONField(required=False, default=list)
    customization_options = serializers.JSONField(required=False, default=list)
    add_ons = serializers.JSONField(required=False, default=list)

    class Meta:
        model = Listing
        fields = [
            'id', 'cook', 'cook_name', 'cook_image', 'title', 'description', 'price',
            'image', 'cuisine_type', 'dietary_tags', 'available',
            'prep_time', 'servings', 'latitude', 'longitude', 'distance',
            'ingredients', 'allergens', 'spice_level', 'calories',
            'customization_options', 'add_ons',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'cook', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Parse JSON strings from FormData
        if isinstance(data, dict):
            data = data.copy()
            for field in ['dietary_tags', 'allergens', 'customization_options', 'add_ons']:
                if field in data and isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                    except (json.JSONDecodeError, TypeError):
                        data[field] = []
        return super().to_internal_value(data)

    def get_distance(self, obj):
        request = self.context.get('request')
        if request and obj.latitude and obj.longitude:
            user_lat = request.query_params.get('lat')
            user_lng = request.query_params.get('lng')
            if user_lat and user_lng:
                from math import radians, sin, cos, sqrt, atan2
                
                lat1 = radians(float(user_lat))
                lat2 = radians(float(obj.latitude))
                lon1 = radians(float(user_lng))
                lon2 = radians(float(obj.longitude))
                
                dlat = lat2 - lat1
                dlon = lon2 - lon1
                a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                c = 2 * atan2(sqrt(a), sqrt(1-a))
                
                r = 3956
                distance = r * c
                return round(distance, 1)
        return None