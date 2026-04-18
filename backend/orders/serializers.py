from rest_framework import serializers
from .models import Order, Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'order', 'rating', 'comment', 'created_at', 'reviewer', 'reviewer_name']
        read_only_fields = ['id', 'order', 'created_at', 'reviewer']


class OrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_image = serializers.ImageField(source='listing.image', read_only=True)
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'listing', 'listing_title', 'listing_image',
            'quantity', 'total_price', 'status', 'pickup_time',
            'notes', 'selected_options', 'selected_add_ons',
            'review', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'buyer', 'total_price', 'status', 'created_at', 'updated_at']