from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('driver', 'Driver'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    phone_number = models.CharField(max_length=10, blank=False, null=False, unique=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"
