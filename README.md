# 🚀 Campus Buggy Tracking Website

A real-time buggy tracking system for campus transportation that allows students to track, book, and manage campus buggy rides with AI-optimized routes.

## 📌 Features

- **Live Buggy Tracking** - Track campus buggies in real-time on a map
- **Ride Booking System** - Request and book buggies with a few clicks
- **Trip History** - View your past rides and route details
- **Admin Dashboard** - Comprehensive management of drivers and buggies
- **AI-Powered Routes** - Machine learning optimized route suggestions
- **Real-time Updates** - WebSocket integration for instant location updates

## 👥 Team Members

- **Aditya** (Frontend) - HTML, CSS, JavaScript, GSAP
- **Ishaan** (Backend) - Django, Django Rest Framework, WebSockets, PostgreSQL

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- GSAP for smooth animations
- Google Maps API for location tracking

### Backend
- Django & Django Rest Framework (DRF)
- WebSockets with Django Channels
- PostgreSQL Database
- AI route optimization with Scikit-learn

### Deployment
- Frontend: Netlify/Vercel
- Backend: Render/Railway

## 📊 Database Schema

### User Model
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [('student', 'Student'), ('driver', 'Driver')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
```

### Buggy Model
```python
class Buggy(models.Model):
    driver = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="buggy")
    location = models.JSONField()  # Stores latitude & longitude
    is_available = models.BooleanField(default=True)
```

### Ride Booking Model
```python
class RideBooking(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    buggy = models.ForeignKey(Buggy, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed')])
    pickup_location = models.JSONField()
    drop_location = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register/ | Register a student or driver |
| POST | /api/login/ | Login and get auth token |

### Student APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/buggies/ | Get list of active buggies |
| POST | /api/request-ride/ | Request a buggy |
| GET | /api/trip-history/ | Get past rides |

### Driver APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/update-location/ | Send live location |
| GET | /api/my-trips/ | View completed trips |

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/all-rides/ | View all rides in system |
| POST | /api/add-buggy/ | Add new buggy |

## 🔧 Key Implementations

### WebSocket Real-time Tracking (Backend)
```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class BuggyTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("buggy_tracking", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("buggy_tracking", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            "buggy_tracking",
            {"type": "send_location", "message": data}
        )

    async def send_location(self, event):
        await self.send(text_data=json.dumps(event["message"]))
```

### WebSocket Integration (Frontend)
```javascript
const socket = new WebSocket("ws://localhost:8000/ws/track/");

socket.onmessage = function(event) {
    let buggyData = JSON.parse(event.data);
    updateMap(buggyData);
};
```

### GSAP Animations
```javascript
gsap.from(".buggy-marker", { scale: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
```

### AI Route Optimization
```python
from sklearn.cluster import KMeans
import numpy as np

data = np.array([[lat1, lon1], [lat2, lon2], [lat3, lon3]])  # Past trip locations
kmeans = KMeans(n_clusters=3).fit(data)
optimized_routes = kmeans.cluster_centers_
```

## 🛣️ Project Development Timeline

| Day | Task | Responsibility |
|---------|---------|-------------------|
| Day 1 | Plan database, frontend UI, and API structure | Team Discussion |
| Day 2 | Setup Django backend (User auth, models, database) | Ishaan |
| Day 3 | Design homepage & login page with GSAP animations | Aditya |
| Day 4 | Integrate Google Maps API for real-time tracking | Aditya |
| Day 5 | Build student & driver dashboards | Aditya & Ishaan |
| Day 6 | Implement WebSockets for real-time buggy tracking | Ishaan |
| Day 7 | Add trip history for students & drivers | Ishaan |
| Day 8 | Build Admin Panel for managing drivers & buggies | Ishaan |
| Day 9 | AI-powered route optimization | Ishaan |
| Day 10 | Final testing, bug fixes, and deployment | Team |

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/campus-buggy-tracking.git
cd campus-buggy-tracking
```

2. Set up the backend
```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

3. Set up the frontend
```bash
cd frontend
npm install
npm start
```
