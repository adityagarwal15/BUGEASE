from django.contrib import admin
from .models import CampusLocation
from django.utils.html import format_html

# Custom actions
@admin.action(description="Activate selected locations")
def activate_locations(modeladmin, request, queryset):
    queryset.update(is_active=True)

@admin.action(description="Deactivate selected locations")
def deactivate_locations(modeladmin, request, queryset):
    queryset.update(is_active=False)

@admin.register(CampusLocation)
class CampusLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'is_active', 'map_preview')
    list_filter = ('is_active',)
    search_fields = ('name',)
    actions = [activate_locations, deactivate_locations]

    def map_preview(self, obj):
        if obj.latitude and obj.longitude:
            return format_html(
                '<iframe width="250" height="150" frameborder="0" '
                'style="border:1px solid #ccc" '
                'src="https://www.google.com/maps?q={},{}&hl=en&z=16&output=embed">'
                '</iframe>',
                obj.latitude, obj.longitude
            )
        return "No location"
    map_preview.short_description = "Map"
