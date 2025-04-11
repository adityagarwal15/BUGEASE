from django.urls import path
from .views import LiveLocationView, LocationHistoryView, AvailableBuggiesView, AssignedBuggyView, UpdateBuggyStatusView

urlpatterns = [
    path('tracking/live-location/', LiveLocationView.as_view(), name='live-location'),
    path('tracking/location-history/', LocationHistoryView.as_view(), name='location-history'),
    path('tracking/available-buggies/', AvailableBuggiesView.as_view(), name='available-buggies'),
    path('tracking/assigned-buggy/', AssignedBuggyView.as_view(), name='assigned-buggy'),
    path('tracking/update-buggy-status/', UpdateBuggyStatusView.as_view(), name='update-buggy-status'),
]