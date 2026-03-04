from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Listing(models.Model):

    class Cuisine(models.TextChoices):
        AMERICAN = "american", "American"
        MEXICAN = "mexican", "Mexican"
        ITALIAN = "italian", "Italian"
        CHINESE = "chinese", "Chinese"
        INDIAN = "indian", "Indian"
        JAPANESE = "japanese", "Japanese"
        MEDITERRANEAN = "mediterranean", "Mediterranean"
        OTHER = "other", "Other"


    cook = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='listings/', blank=True, null=True)
    cuisine_type = models.CharField(max_length=50, choices=Cuisine.choices, default=Cuisine.OTHER,db_index=True)
    dietary_tags = models.JSONField(default=list, blank=True)
    available = models.BooleanField(default=True, db_index=True)
    prep_time = models.PositiveIntegerField(help_text="Preparation time in minutes") 
    servings = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def str(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Review(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='Reviews')