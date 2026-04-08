from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
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


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({"detail": "Token required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the Google token
            client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
            
            email = idinfo.get('email')
            name = idinfo.get('name', '')
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': name.split()[0] if name else '',
                    'last_name': ' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
                }
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            })
            
        except ValueError as e:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)