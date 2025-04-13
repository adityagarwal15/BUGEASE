from django.db import models
from django.conf import settings

# For buggy 
class Buggy(models.Model):
    number_plate = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    assigned_driver = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        limit_choices_to={'user_type': 'driver'}
    )
    is_running = models.BooleanField(default=False)
    
    def __str__(self):
        return self.number_plate

# For live location 
class BuggyLocation(models.Model):
    buggy = models.OneToOneField(Buggy, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    direction = models.FloatField(null=True, blank=True)  # (optional) in degrees
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.buggy.number_plate} @ ({self.latitude}, {self.longitude})"

# For location history
class Location(models.Model):
    buggy = models.ForeignKey(Buggy, on_delete=models.CASCADE)
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['buggy', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]