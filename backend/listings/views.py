from rest_framework import viewsets, permissions
from .models import Listing
from .serializers import ListingSerializer


class IsCookOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_cook

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.cook == request.user


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.filter(available=True)
    serializer_class = ListingSerializer
    permission_classes = [IsCookOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(cook=self.request.user)