from django.db import models
from django.conf import settings


class Listing(models.Model):
    CUISINE_CHOICES = [
        ('american', 'American'),
        ('mexican', 'Mexican'),
        ('italian', 'Italian'),
        ('chinese', 'Chinese'),
        ('indian', 'Indian'),
        ('japanese', 'Japanese'),
        ('mediterranean', 'Mediterranean'),
        ('other', 'Other'),
    ]

    cook = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='listings/', blank=True, null=True)
    cuisine_type = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='other')
    dietary_tags = models.JSONField(default=list, blank=True)
    available = models.BooleanField(default=True)
    prep_time = models.IntegerField(help_text="Preparation time in minutes")
    servings = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']