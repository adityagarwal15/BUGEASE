from django.contrib import admin
from .models import Buggy, BuggyLocation, Location

@admin.register(Buggy)
class BuggyAdmin(admin.ModelAdmin):
    list_display = ('number_plate', 'assigned_driver', 'is_running')
    list_filter = ('is_running',)
    search_fields = ('number_plate', 'assigned_driver__username')

@admin.register(BuggyLocation)
class BuggyLocationAdmin(admin.ModelAdmin):
    list_display = ('buggy', 'latitude', 'longitude', 'last_updated')
    search_fields = ('buggy__number_plate',)

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('buggy', 'driver', 'latitude', 'longitude', 'timestamp')
    list_filter = ('buggy', 'timestamp')
    search_fields = ('buggy__number_plate', 'driver__username')