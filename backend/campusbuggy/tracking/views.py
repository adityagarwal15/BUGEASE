from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Buggy, BuggyLocation, Location
from .serializers import BuggyLocationSerializer, LocationHistorySerializer, BuggySerializer
import datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class LiveLocationView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: BuggyLocationSerializer(many=True)}
    ) 
    def get(self, request):
        # Get all currently running buggies
        running_locations = BuggyLocation.objects.filter(
            buggy__is_running=True
        ).select_related('buggy', 'buggy__assigned_driver')
        
        serializer = BuggyLocationSerializer(running_locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class LocationHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'buggy_id', openapi.IN_QUERY,
                description="ID of the buggy", type=openapi.TYPE_INTEGER, required=True
            ),
            openapi.Parameter(
                'since', openapi.IN_QUERY,
                description="Time range (e.g., 1h, 30m, 1d)", type=openapi.TYPE_STRING, required=False
            ),
        ],
        responses={200: LocationHistorySerializer(many=True)}
    )
    
    def get(self, request):
        buggy_id = request.query_params.get('buggy_id')
        since = request.query_params.get('since', '1h')  
        
        if not buggy_id:
            return Response(
                {"error": "buggy_id parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse time interval
        try:
            time_value = int(since[:-1])
            time_unit = since[-1].lower()
            
            if time_unit == 'h':
                delta = datetime.timedelta(hours=time_value)
            elif time_unit == 'm':
                delta = datetime.timedelta(minutes=time_value)
            elif time_unit == 'd':
                delta = datetime.timedelta(days=time_value)
            else:
                raise ValueError("Invalid time unit")
                
            start_time = timezone.now() - delta
            
        except (ValueError, IndexError):
            return Response(
                {"error": "Invalid 'since' parameter format. Use {number}{unit} where unit is h, m, or d"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get location history
        locations = Location.objects.filter(
            buggy_id=buggy_id,
            timestamp__gte=start_time
        ).order_by('timestamp')
        
        serializer = LocationHistorySerializer(locations, many=True)
        return Response(serializer.data)

class AvailableBuggiesView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: BuggySerializer(many=True)}
    )
    
    def get(self, request):
        # Get all running buggies
        running_buggies = Buggy.objects.filter(is_running=True)
        serializer = BuggySerializer(running_buggies, many=True)
        return Response(serializer.data)