from rest_framework import serializers
from .models import Buggy, BuggyLocation, Location

class BuggyLocationSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    buggy_number = serializers.CharField(source='buggy.number_plate')
    
    class Meta:
        model = BuggyLocation
        fields = ['buggy_number', 'latitude', 'longitude', 'direction', 
                  'driver_name', 'last_updated']
    
    def get_driver_name(self, obj):
        if obj.buggy.assigned_driver:
            return obj.buggy.assigned_driver.username
        return None

class LocationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude', 'timestamp']

class BuggySerializer(serializers.ModelSerializer):
    class Meta:
        model = Buggy
        fields = ['id', 'number_plate', 'capacity', 'is_running']