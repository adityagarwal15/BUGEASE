# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.utils import timezone
# from .models import Buggy, BuggyLocation, Location

# class LocationConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         print(f"WebSocket connect request: {self.scope['url_route']['kwargs']}")
#         self.user = self.scope["user"]
        
#         # Determine group based on user type
#         if self.user.is_authenticated:
#             if self.user.user_type == 'driver':
#                 self.group_name = f"driver_{self.user.id}"
#             else:  # student or any other authenticated user
#                 self.group_name = "location_updates"
                
#             # Join group
#             await self.channel_layer.group_add(
#                 self.group_name,
#                 self.channel_name
#             )
#             await self.accept()
#         else:
#             # Reject connection if not authenticated
#             await self.close()
    
#     async def disconnect(self, close_code):
#         # Leave group
#         if hasattr(self, 'group_name'):
#             await self.channel_layer.group_discard(
#                 self.group_name,
#                 self.channel_name
#             )
    
#     async def receive(self, text_data):
#         print(f"Data received: {text_data}")
#         if self.user.user_type != 'driver':
#             # Only drivers can send location updates
#             return
            
#         data = json.loads(text_data)
#         buggy_id = data.get('buggy_id')
#         latitude = data.get('latitude')
#         longitude = data.get('longitude')
#         direction = data.get('direction', None)
        
#         if buggy_id and latitude is not None and longitude is not None:
#             # Update location in database
#             success = await self.update_buggy_location(
#                 buggy_id, latitude, longitude, direction
#             )
            
#             if success:
#                 # Broadcast to all connected students
#                 await self.channel_layer.group_send(
#                     "location_updates",
#                     {
#                         "type": "location_update",
#                         "buggy_id": buggy_id,
#                         "latitude": latitude,
#                         "longitude": longitude,
#                         "direction": direction,
#                         "driver_name": self.user.username,
#                         "timestamp": timezone.now().isoformat()
#                     }
#                 )
    
#     async def location_update(self, event):
#         # Send location update to WebSocket
#         await self.send(text_data=json.dumps({
#             "buggy_id": event["buggy_id"],
#             "latitude": event["latitude"],
#             "longitude": event["longitude"],
#             "direction": event["direction"],
#             "driver_name": event["driver_name"],
#             "timestamp": event["timestamp"]
#         }))
    
#     @database_sync_to_async
#     def update_buggy_location(self, buggy_id, latitude, longitude, direction):
#         try:
#             # Get buggy assigned to this driver
#             buggy = Buggy.objects.get(
#                 id=buggy_id, 
#                 assigned_driver=self.user,
#                 is_running=True
#             )
            
#             # Update or create live location
#             BuggyLocation.objects.update_or_create(
#                 buggy=buggy,
#                 defaults={
#                     'latitude': latitude,
#                     'longitude': longitude,
#                     'direction': direction
#                 }
#             )
            
#             # Store in history
#             Location.objects.create(
#                 buggy=buggy,
#                 driver=self.user,
#                 latitude=latitude,
#                 longitude=longitude
#             )
            
#             return True
#         except Buggy.DoesNotExist:
#             return False

# tracking/consumers.py
# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.utils import timezone
# from .models import Buggy, BuggyLocation, Location

# from channels.auth import AuthMiddlewareStack
# from django.contrib.auth.models import AnonymousUser
# from rest_framework.authtoken.models import Token
# from urllib.parse import parse_qs

# class LocationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user = self.scope["user"]
        
#         # Determine group based on user type
#         if self.user.is_authenticated:
#             if self.user.user_type == 'driver':
#                 self.group_name = f"driver_{self.user.id}"
#                 await self.channel_layer.group_add(
#                     self.group_name,
#                     self.channel_name
#                 )
#             else:  # student or any other authenticated user
#                 # By default, join the general updates group
#                 self.group_name = "location_updates"
#                 await self.channel_layer.group_add(
#                     self.group_name,
#                     self.channel_name
#                 )
                
#                 # Also join the student-specific group
#                 self.student_group = f"student_{self.user.id}"
#                 await self.channel_layer.group_add(
#                     self.student_group,
#                     self.channel_name
#                 )
                
#             await self.accept()
#         else:
#             # Reject connection if not authenticated
#             await self.close()
    
#     async def disconnect(self, close_code):
#         # Leave groups
#         if hasattr(self, 'group_name'):
#             await self.channel_layer.group_discard(
#                 self.group_name,
#                 self.channel_name
#             )
            
#         if hasattr(self, 'student_group'):
#             await self.channel_layer.group_discard(
#                 self.student_group,
#                 self.channel_name
#             )
    
#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message_type = data.get('type', '')
        
#         if self.user.user_type == 'driver' and message_type == 'location_update':
#             # Handle location update from driver
#             buggy_id = data.get('buggy_id')
#             latitude = data.get('latitude')
#             longitude = data.get('longitude')
#             direction = data.get('direction', None)
            
#             if buggy_id and latitude is not None and longitude is not None:
#                 # Update location in database
#                 success = await self.update_buggy_location(
#                     buggy_id, latitude, longitude, direction
#                 )
                
#                 if success:
#                     # Broadcast to all connected students
#                     await self.channel_layer.group_send(
#                         "location_updates",
#                         {
#                             "type": "location_update",
#                             "buggy_id": buggy_id,
#                             "latitude": latitude,
#                             "longitude": longitude,
#                             "direction": direction,
#                             "driver_name": self.user.username,
#                             "timestamp": timezone.now().isoformat()
#                         }
#                     )
        
#         elif self.user.user_type != 'driver' and message_type == 'subscribe':
#             # Handle subscription request from student
#             buggy_ids = data.get('buggy_ids', [])
            
#             if buggy_ids:
#                 # Store subscription info for future reference
#                 self.subscribed_buggies = set(buggy_ids)
                
#                 # Confirm subscription to the client
#                 await self.send(text_data=json.dumps({
#                     "type": "subscription_confirmed",
#                     "buggy_ids": list(self.subscribed_buggies)
#                 }))
    
#     async def location_update(self, event):
#         # Send location update to WebSocket
#         await self.send(text_data=json.dumps({
#             "type": "location_update",
#             "buggy_id": event["buggy_id"],
#             "latitude": event["latitude"],
#             "longitude": event["longitude"],
#             "direction": event["direction"],
#             "driver_name": event["driver_name"],
#             "timestamp": event["timestamp"]
#         }))
    
#     @database_sync_to_async
#     def update_buggy_location(self, buggy_id, latitude, longitude, direction):
#         try:
#             # Get buggy assigned to this driver
#             buggy = Buggy.objects.get(
#                 id=buggy_id, 
#                 assigned_driver=self.user,
#                 is_running=True
#             )
            
#             # Update or create live location
#             BuggyLocation.objects.update_or_create(
#                 buggy=buggy,
#                 defaults={
#                     'latitude': latitude,
#                     'longitude': longitude,
#                     'direction': direction
#                 }
#             )
            
#             # Store in history
#             Location.objects.create(
#                 buggy=buggy,
#                 driver=self.user,
#                 latitude=latitude,
#                 longitude=longitude
#             )
            
#             return True
#         except Buggy.DoesNotExist:
#             return False

# class TokenAuthMiddleware:
#     def __init__(self, inner):
#         self.inner = inner

#     async def __call__(self, scope, receive, send):
#         query_string = scope.get('query_string', b'').decode()
#         query_params = parse_qs(query_string)
#         token = query_params.get('token', [None])[0]
        
#         if token:
#             user = await self.get_user(token)
#             if user:
#                 scope['user'] = user
        
#         return await self.inner(scope, receive, send)
    
#     @database_sync_to_async
#     def get_user(self, token_key):
#         try:
#             token = Token.objects.get(key=token_key)
#             return token.user
#         except Token.DoesNotExist:
#             return AnonymousUser()

# def TokenAuthMiddlewareStack(inner):
#     return TokenAuthMiddleware(AuthMiddlewareStack(inner))

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from urllib.parse import parse_qs

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

        try:
            buggy = Buggy.objects.get(
                id=buggy_id, 
                assigned_driver=self.user,
                is_running=True
            )
            BuggyLocation.objects.update_or_create(
                buggy=buggy,
                defaults={
                    'latitude': latitude,
                    'longitude': longitude,
                    'direction': direction
                }
            )
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
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        if token:
            user = await self.get_user(token)
            if user:
                scope['user'] = user
        
        return await self.inner(scope, receive, send)
    
    @database_sync_to_async
    def get_user(self, token_key):
        from rest_framework.authtoken.models import Token
        from django.contrib.auth.models import AnonymousUser

        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return AnonymousUser()

def TokenAuthMiddlewareStack(inner):
    from channels.auth import AuthMiddlewareStack
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
