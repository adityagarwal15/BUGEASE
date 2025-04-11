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

class AssignedBuggyView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get the buggy assigned to the authenticated driver",
        responses={
            200: BuggySerializer,
            403: openapi.Response(description="Only drivers can access assigned buggies"),
            404: openapi.Response(description="No buggy is currently assigned")
        }
    )
    
    def get(self, request):
        # Check if the user is a driver
        if request.user.user_type != 'driver':
            return Response(
                {"detail": "Only drivers can access assigned buggies"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Get the buggy assigned to this driver
            buggy = Buggy.objects.get(assigned_driver=request.user)
            serializer = BuggySerializer(buggy)
            return Response(serializer.data)
        except Buggy.DoesNotExist:
            return Response(
                {"detail": "No buggy is currently assigned to you"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class UpdateBuggyStatusView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Update the is_running status of a driver's assigned buggy",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["is_running"],
            properties={
                "is_running": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="New status of the buggy"),
            }
        ),
        responses={
            200: openapi.Response(description="Status updated successfully"),
            400: openapi.Response(description="Missing 'is_running' parameter"),
            403: openapi.Response(description="Only drivers can update buggy status"),
            404: openapi.Response(description="No buggy is currently assigned"),
        }
    )
    
    def post(self, request):
        # Check if the user is a driver
        if request.user.user_type != 'driver':
            return Response(
                {"detail": "Only drivers can update buggy status"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Get the buggy assigned to this driver
            buggy = Buggy.objects.get(assigned_driver=request.user)
            
            # Update the status
            is_running = request.data.get('is_running')
            if is_running is not None:
                buggy.is_running = is_running
                buggy.save()
                
                return Response({"status": "success", "is_running": buggy.is_running})
            else:
                return Response(
                    {"detail": "Missing 'is_running' parameter"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Buggy.DoesNotExist:
            return Response(
                {"detail": "No buggy is currently assigned to you"}, 
                status=status.HTTP_404_NOT_FOUND
            )