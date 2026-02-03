from rest_framework import serializers
from .models import Order, Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'order', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'order', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'listing', 'listing_title',
            'quantity', 'total_price', 'status', 'pickup_time',
            'notes', 'review', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'buyer', 'total_price', 'status', 'created_at', 'updated_at']