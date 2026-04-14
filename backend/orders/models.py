from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        PREPARING = 'preparing', 'Preparing'
        READY = 'ready', 'Ready for Pickup'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='orders')
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    pickup_time = models.DateTimeField()
    notes = models.TextField(blank=True)
    
    # Store customization selections
    # Format: {"Size": "Large", "Spice Level": "Medium"}
    selected_options = models.JSONField(default=dict, blank=True)
    
    # Store add-on selections
    # Format: [{"name": "Extra Cheese", "price": 1.50}]
    selected_add_ons = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.buyer.username}"

    class Meta:
        ordering = ['-created_at']


class Review(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='review')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Review for Order #{self.order.id}"