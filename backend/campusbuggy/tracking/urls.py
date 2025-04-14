from django.urls import path
from .views import LiveLocationView, LocationHistoryView, AvailableBuggiesView, AssignedBuggyView, UpdateBuggyStatusView

urlpatterns = [
    path('live-location/', LiveLocationView.as_view(), name='live-location'),
    path('location-history/', LocationHistoryView.as_view(), name='location-history'),
    path('available-buggies/', AvailableBuggiesView.as_view(), name='available-buggies'),
    path('assigned-buggy/', AssignedBuggyView.as_view(), name='assigned-buggy'),
    path('update-buggy-status/', UpdateBuggyStatusView.as_view(), name='update-buggy-status'),
]