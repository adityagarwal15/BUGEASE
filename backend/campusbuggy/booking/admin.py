from django.contrib import admin
from .models import CampusLocation

# Define custom actions
@admin.action(description="Activate selected locations")
def activate_locations(modeladmin, request, queryset):
    queryset.update(is_active=True)

@admin.action(description="Deactivate selected locations")
def deactivate_locations(modeladmin, request, queryset):
    queryset.update(is_active=False)

# Register CampusLocation with custom actions
@admin.register(CampusLocation)
class CampusLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
    actions = [activate_locations, deactivate_locations]
