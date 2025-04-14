import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import DenyConnection
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.utils import timezone
from urllib.parse import parse_qs
from datetime import timedelta
from django.conf import settings
from users.utils.token_utils import token_expire_handler

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user.is_authenticated:
            if self.user.user_type == 'driver':
                self.group_name = f"driver_{self.user.id}"
                await self.channel_layer.group_add(
                    self.group_name,
                    self.channel_name
                )
            else:
                self.group_name = "location_updates"
                await self.channel_layer.group_add(
                    self.group_name,
                    self.channel_name
                )

                self.student_group = f"student_{self.user.id}"
                await self.channel_layer.group_add(
                    self.student_group,
                    self.channel_name
                )
                
            await self.accept()
        else:
            await self.close()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
                
        if hasattr(self, 'student_group'):
            await self.channel_layer.group_discard(
                self.student_group,
                self.channel_name
            )
        
        # Clear the buggy location when a driver disconnects
        if hasattr(self, 'user') and self.user.is_authenticated and self.user.user_type == 'driver':
            await self.clear_driver_buggy_location()

    @database_sync_to_async
    def clear_driver_buggy_location(self):
        from .models import Buggy, BuggyLocation
        
        try:
            # Find any buggies assigned to this driver
            buggies = Buggy.objects.filter(assigned_driver=self.user)
            
            # Delete the BuggyLocation records for these buggies
            BuggyLocation.objects.filter(buggy__in=buggies).delete()
            
            return True
        except Exception as e:
            print(f"Error clearing buggy location: {e}")
            return False
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', '')
        
        if self.user.user_type == 'driver' and message_type == 'location_update':
            buggy_id = data.get('buggy_id')
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            direction = data.get('direction', None)
            
            if buggy_id and latitude is not None and longitude is not None:
                success = await self.update_buggy_location(
                    buggy_id, latitude, longitude, direction
                )
                
                if success:
                    await self.channel_layer.group_send(
                        "location_updates",
                        {
                            "type": "location_update",
                            "buggy_id": buggy_id,
                            "latitude": latitude,
                            "longitude": longitude,
                            "direction": direction,
                            "driver_name": self.user.username,
                            "timestamp": timezone.now().isoformat()
                        }
                    )
        
        elif self.user.user_type != 'driver' and message_type == 'subscribe':
            buggy_ids = data.get('buggy_ids', [])
            
            if buggy_ids:
                self.subscribed_buggies = set(buggy_ids)
                
                await self.send(text_data=json.dumps({
                    "type": "subscription_confirmed",
                    "buggy_ids": list(self.subscribed_buggies)
                }))
    
    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "location_update",
            "buggy_id": event["buggy_id"],
            "latitude": event["latitude"],
            "longitude": event["longitude"],
            "direction": event["direction"],
            "driver_name": event["driver_name"],
            "timestamp": event["timestamp"]
        }))
    
    @database_sync_to_async
    def update_buggy_location(self, buggy_id, latitude, longitude, direction):
        from .models import Buggy, BuggyLocation, Location  # moved inside
        from django.utils import timezone

        try:
            buggy = Buggy.objects.get(
                id=buggy_id, 
                assigned_driver=self.user,
                is_running=True
            )
            
            # Always update the live location
            buggy_location, created = BuggyLocation.objects.update_or_create(
                buggy=buggy,
                defaults={
                    'latitude': latitude,
                    'longitude': longitude,
                    'direction': direction
                }
            )
            
            # Check if we need to create a history entry
            # Get the most recent Location entry for this buggy
            five_minutes_ago = timezone.now() - timedelta(minutes=5)
            recent_history = Location.objects.filter(
                buggy=buggy,
                timestamp__gte=five_minutes_ago
            ).exists()
            
            # If no recent history (within last 5 minutes), create a new entry
            if not recent_history:
                Location.objects.create(
                    buggy=buggy,
                    driver=self.user,
                    latitude=latitude,
                    longitude=longitude
                )
                
            return True
        except Buggy.DoesNotExist:
            return False


# ------------------ Token Auth Middleware ------------------
class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        user = await self.get_user_from_cookie(scope)
        scope['user'] = user 
        return await self.inner(scope, receive, send)
    
    @database_sync_to_async
    def get_user_from_cookie(self, scope):
        # Extract cookies from headers
        headers = dict(scope.get('headers', []))
        cookie_header = headers.get(b'cookie', b'').decode()
        
        # Parse cookies
        cookies = {}
        if cookie_header:
            cookie_pairs = cookie_header.split('; ')
            for pair in cookie_pairs:
                if '=' in pair:
                    key, value = pair.split('=', 1)
                    cookies[key] = value
        
        # Get auth token from cookie
        token_key = cookies.get(settings.AUTH_COOKIE_NAME)
        
        if not token_key:
            raise DenyConnection("No auth token provided in cookies.")
            
        try:
            token = Token.objects.get(key=token_key)
            
            # Check if token has expired
            is_expired, token = token_expire_handler(token)
            if is_expired:
                raise DenyConnection("Authentication token has expired. Please log in again.")
                
            return token.user
        except Token.DoesNotExist:
            raise DenyConnection("Invalid auth token.")