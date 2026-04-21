from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_cook = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.username


class CookProfile(models.Model):
    class CuisineSpecialty(models.TextChoices):
        AMERICAN = "american", "American"
        MEXICAN = "mexican", "Mexican"
        ITALIAN = "italian", "Italian"
        CHINESE = "chinese", "Chinese"
        INDIAN = "indian", "Indian"
        JAPANESE = "japanese", "Japanese"
        MEDITERRANEAN = "mediterranean", "Mediterranean"
        CARIBBEAN = "caribbean", "Caribbean"
        KOREAN = "korean", "Korean"
        THAI = "thai", "Thai"
        VIETNAMESE = "vietnamese", "Vietnamese"
        MIDDLE_EASTERN = "middle_eastern", "Middle Eastern"
        AFRICAN = "african", "African"
        FRENCH = "french", "French"
        OTHER = "other", "Other"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cook_profile')
    
    # Basic Info
    bio = models.TextField(blank=True, help_text="Tell customers about yourself")
    years_experience = models.PositiveIntegerField(default=0)
    
    # Specialties
    cuisine_specialties = models.JSONField(default=list, blank=True)  # ['mexican', 'italian']
    signature_dishes = models.TextField(blank=True, help_text="What are you known for?")
    
    # Kitchen Info
    kitchen_description = models.TextField(blank=True)
    food_safety_certified = models.BooleanField(default=False)
    certified_details = models.CharField(max_length=200, blank=True)
    
    # Payment Methods
    accepted_payments = models.JSONField(default=list, blank=True)  # ['cash', 'venmo', 'zelle', 'paypal']
    payment_notes = models.CharField(max_length=200, blank=True, help_text="e.g. Venmo: @username")
    
    # Availability
    available_days = models.JSONField(default=list, blank=True)  # ['monday', 'tuesday', ...]
    pickup_instructions = models.TextField(blank=True, help_text="How/where to pick up orders")
    
    # Stats (auto-updated)
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_orders = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cook Profile: {self.user.username}"