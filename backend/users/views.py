from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, CookProfileSerializer
from .models import CookProfile

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class BecomeCookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_cook:
            return Response({"detail": "Already a cook"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_cook = True
        user.save()
        CookProfile.objects.create(user=user)
        return Response({"detail": "You are now a cook!"}, status=status.HTTP_201_CREATED)