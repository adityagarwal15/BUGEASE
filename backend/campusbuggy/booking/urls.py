from django.urls import path
from .views import CampusLocationListView, CampusLocationDetailView

urlpatterns = [
    path('locations/names/', CampusLocationListView.as_view(), name='campus-location-names'),
    path('locations/details/', CampusLocationDetailView.as_view(), name='campus-location-details'),
]