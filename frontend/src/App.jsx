from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView, BecomeCookView, GoogleLoginView, 
    CookProfileView, PublicCookProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('become-cook/', BecomeCookView.as_view(), name='become_cook'),
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('cook-profile/', CookProfileView.as_view(), name='cook_profile'),
    path('cook/<str:username>/', PublicCookProfileView.as_view(), name='public_cook_profile'),
]