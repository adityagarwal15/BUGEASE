from rest_framework import serializers
from .models import CampusLocation

class CampusLocationNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusLocation
        fields = ['id', 'name']

class CampusLocationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusLocation
        fields = ['id', 'name', 'latitude', 'longitude']