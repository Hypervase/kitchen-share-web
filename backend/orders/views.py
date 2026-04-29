from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, Review
from django.shortcuts import render
from .serializers import OrderSerializer, ReviewSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'incoming':
            return Order.objects.filter(listing__cook=user)
        return Order.objects.filter(buyer=user)

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        quantity = serializer.validated_data['quantity']
        total = listing.price * quantity
        serializer.save(buyer=self.request.user, total_price=total)

    @action(detail=False, methods=['get'])
    def incoming(self, request):
        """Get orders for cook's listings"""
        if not request.user.is_cook:
            return Response({"detail": "Not a cook"}, status=status.HTTP_403_FORBIDDEN)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Cook updates order status"""
        order = self.get_object()
        if order.listing.cook != request.user:
            return Response({"detail": "Not your order"}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        #if new_status not in dict(Order.STATUS_CHOICES):
        if new_status not in dict(choice[0] for choice in Order.Status.choices):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Buyer leaves review after order completed"""
        order = self.get_object()
        if order.buyer != request.user:
            return Response({"detail": "Not your order"}, status=status.HTTP_403_FORBIDDEN)
        if order.status != 'completed':
            return Response({"detail": "Order not completed"}, status=status.HTTP_400_BAD_REQUEST)
        if hasattr(order, 'review'):
            return Response({"detail": "Already reviewed"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order, reviewer=request.user)
            from users.models import CookProfile
            from django.db.models import Avg
            cook = order.listing.cook
            cook_profile = CookProfile.objects.get(user=cook)
            avg = Review.objects.filter(order__listing__cook=cook).aggregate(Avg('rating'))['rating__avg']
            cook_profile.rating = round(avg,2)
            cook_profile.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)