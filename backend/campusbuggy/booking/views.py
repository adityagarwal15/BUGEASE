from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import CampusLocation
from .serializers import CampusLocationNameSerializer, CampusLocationDetailSerializer

class CampusLocationListView(generics.ListAPIView):
    """
    List all active campus locations with only their names.
    """
    queryset = CampusLocation.objects.filter(is_active=True)
    serializer_class = CampusLocationNameSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get a list of all active campus location names",
        responses={
            200: CampusLocationNameSerializer(many=True),
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class CampusLocationDetailView(generics.ListAPIView):
    serializer_class = CampusLocationDetailSerializer
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Get details of campus locations including coordinates",
        manual_parameters=[
            openapi.Parameter(
                'name', 
                openapi.IN_QUERY,
                description="Filter by location name(s)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'id', 
                openapi.IN_QUERY,
                description="Filter by location ID(s)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
        ],
        responses={
            200: CampusLocationDetailSerializer(many=True),
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = CampusLocation.objects.filter(is_active=True)
        
        # Handle filtering by location name(s)
        location_names = self.request.query_params.getlist('name')
        if location_names:
            queryset = queryset.filter(name__in=location_names)
            
        # Handle filtering by location ID(s)
        location_ids = self.request.query_params.getlist('id')
        if location_ids:
            queryset = queryset.filter(id__in=location_ids)
            
        return queryset