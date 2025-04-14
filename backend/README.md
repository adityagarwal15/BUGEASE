# CampusBuggy Backend

This is the backend for the CampusBuggy project, built using Django, Django REST Framework, Django Channels (for WebSockets), and Daphne as the ASGI server. It includes admin functionality, REST APIs, WebSocket endpoints, and serves static files using WhiteNoise.

---

## 🔧 Requirements

- Python 3.11.7  
- `virtualenv` (recommended)  
- Git  
- **Redis (required for WebSockets)**

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <REPO_URL>
cd backend
```

### 2. Set Up a Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Navigate into the Django Project Directory

```bash
cd campusbuggy
```

---

## 📦 Redis Setup (Required for WebSockets)

Django Channels uses Redis as a channel layer for managing WebSocket communication.

### 🧠 Why Redis?

WebSockets need a **channel layer backend** for real-time message delivery. Redis is the recommended and production-grade option used here.

---

### 💻 Redis Installation Instructions

#### 🖥 macOS

Install via Homebrew:

```bash
brew install redis
brew services start redis
```

Verify Redis is running:

```bash
redis-cli ping
# Should return: PONG
```

---

#### 🪟 Windows

Redis doesn't officially support Windows. Use one of the following:

##### Option 1: Docker

```bash
docker run -p 6379:6379 redis
```

Then test:

```bash
docker exec -it <container_id> redis-cli ping
# Should return: PONG
```

##### Option 2: WSL (Windows Subsystem for Linux)

Inside WSL terminal:

```bash
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

Test:

```bash
redis-cli ping
# Should return: PONG
```

---

#### 🐧 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

Verify it's running:

```bash
redis-cli ping
# Should return: PONG
```

---

### 🔧 Configuration (Optional)

If using a remote Redis instance (e.g., Railway or Upstash), update `settings.py`:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("your-redis-host", 6379)],
        },
    },
}
```

Or load from `.env`:

```python
import os

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.environ.get("REDIS_URL", "127.0.0.1"), 6379)],
        },
    },
}
```

---

## 📂 Notes on Static Files

- Static files are handled using **WhiteNoise**.
- After installing dependencies and before running the server, **you must run the `collectstatic` command**:

  ```bash
  python manage.py collectstatic
  ```

  This gathers all static assets into the `staticfiles/` directory for serving via WhiteNoise.

- The `staticfiles/` folder is **auto-generated** and **gitignored**, so it won't appear in version control.

- You don't need to modify or commit this folder manually — just make sure `collectstatic` is run locally.

---

### 🗂 Run Migrations

```bash
python manage.py migrate
```

---

### 👤 Create a Superuser (for admin access)

```bash
python manage.py createsuperuser
```

> Suggested credentials for local use:  
> **Username:** `admin`  
> **Password:** `admin`  
> (Email can be left blank)

---

### ⚙️ Run the ASGI Server with Daphne

```bash
daphne -b 127.0.0.1 -p 8000 campusbuggy.asgi:application
```

---

## 🔑 Accessing the Application

Once Daphne is running on `127.0.0.1:8000`, you can access:

- **Admin Panel**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **API Docs (Swagger)**: [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)

---

## 🛠 Development Notes

- Database: Using **SQLite** for development (auto-generated locally after migrations).
- Redis is **required** to enable real-time WebSocket functionality.
- Do not use this setup as-is for production.

---

## 📦 Project Architecture

### App Structure

The project is organized into the following Django apps:

1. **users**: User management, authentication, and profiles
   - Custom User model
   - Authentication endpoints
   - User profile management

2. **tracking**: Core buggy tracking functionality
   - Buggy and location models
   - Location tracking endpoints
   - WebSocket consumers for real-time updates

3. **booking**: Booking functionality (initial implementation)
   - Campus location models
   - (Future) Booking functionality

4. **campusbuggy**: Main project configuration
   - Settings
   - URL routing
   - ASGI configuration

### Data Models

#### Users App

- **User**: Custom user model extending Django's AbstractUser
  - Fields: username, email, first_name, last_name, phone_number, user_type (student/driver)

#### Tracking App

- **Buggy**: Represents campus buggies
  - Fields: number_plate, capacity, assigned_driver, is_running

- **BuggyLocation**: Represents current live location of a buggy
  - Fields: buggy, latitude, longitude, direction, last_updated

- **Location**: Historical location records for buggies
  - Fields: buggy, driver, latitude, longitude, timestamp

#### Booking App (Future Implementation)

- **CampusLocation**: Represents locations on campus
  - (To be implemented)

---

## 🔒 Authentication System

This backend uses a secure cookie-based token authentication system. Here's what you need to know:

### How Authentication Works

1. **Token Storage**:
   - Authentication tokens are stored in HTTP-only, secure cookies
   - Tokens expire after 7 days by default
   - The frontend should not attempt to directly access the auth token

2. **CSRF Protection**:
   - For any non-GET requests, you must include a CSRF token
   - Get a CSRF token by calling `GET /api/user/csrf-token/`
   - Include the token in the `X-CSRFToken` header for POST/PUT/PATCH/DELETE requests

3. **Required Headers for Auth Endpoints**:
   - `Content-Type: application/json` (for requests with a body)
   - `X-CSRFToken: <csrf-token>` (for non-GET requests)
   - Set `credentials: 'include'` in fetch options to include cookies

### Authentication Flow

1. **Registration**: `POST /api/user/register/`
   - Creates a new user and sets the auth token cookie
   - Returns user information and token value

2. **Login**: `POST /api/user/login/`
   - Authenticates user and sets the auth token cookie
   - Returns user type and token value

3. **Logout**: `POST /api/user/logout/`
   - Invalidates the current token and clears the cookie

4. **Token Refresh**: `POST /api/user/refresh-token/`
   - Creates a new token and updates the cookie
   - Should be called before token expiration (recommended ~6 days)

5. **Profile**: `GET /api/user/profile/`
   - Returns the user profile
   - Requires authentication

### Best Practices for Frontend

1. Store minimal authentication state in localStorage:
   - `isLoggedIn`: Boolean indicating login status
   - `userType`: 'student' or 'driver'
   - `lastAuthTime`: Timestamp when auth was last refreshed

2. Validate authentication on app startup by calling profile endpoint

3. Implement token refresh logic:
   - Track token age using `lastAuthTime`
   - Refresh token if it's close to expiration (e.g., after 6 days)

4. Handle authentication errors:
   - 401 Unauthorized: Clear localStorage and redirect to login
   - Always include proper error handling for auth endpoints

5. For secure operations:
   - Always get a fresh CSRF token before making non-GET requests
   - Include `credentials: 'include'` in all API requests

---

## 🌐 API Endpoints

### User Management

#### Registration and Authentication

- **Register Student**: `POST /api/user/register/`
  - Body: `{username, email, password, first_name, last_name, phone_number}`
  - Returns: `{token, user_type}`

- **Login**: `POST /api/user/login/`
  - Body: `{username, password}`
  - Returns: `{token, user_type}`

- **Logout**: `POST /api/user/logout/`
  - Requires: Authentication
  - Returns: Success message

- **Get CSRF Token**: `GET /api/user/csrf-token/`
  - Returns: `{csrfToken}`

- **Refresh Token**: `POST /api/user/refresh-token/`
  - Requires: Authentication
  - Returns: `{token}`

#### User Profile

- **Get Profile**: `GET /api/user/profile/`
  - Requires: Authentication
  - Returns: User profile information

### Buggy Tracking

#### Location Endpoints

- **Live Location**: `GET /api/tracking/live-location/`
  - Requires: Authentication
  - Returns: List of all running buggies with their current locations

- **Location History**: `GET /api/tracking/location-history/?buggy_id=<id>&since=<time>`
  - Requires: Authentication
  - Query Parameters:
    - `buggy_id`: ID of the buggy
    - `since`: Time range (e.g., "1h", "30m", "1d")
  - Returns: Historical locations for the specified buggy

#### Buggy Management

- **Available Buggies**: `GET /api/tracking/available-buggies/`
  - Requires: Authentication
  - Returns: List of all currently running buggies

- **Assigned Buggy**: `GET /api/tracking/assigned-buggy/`
  - Requires: Authentication (driver only)
  - Returns: Details of the buggy assigned to the authenticated driver

- **Update Buggy Status**: `POST /api/tracking/update-buggy-status/`
  - Requires: Authentication (driver only)
  - Body: `{is_running: true/false}`
  - Returns: Updated buggy status

---

## 📡 WebSocket API

The application uses WebSockets for real-time location updates. The primary WebSocket endpoint is:

### Location Updates

- **Endpoint**: `ws://localhost:8000/ws/location/updates/`
- **Authentication**: Uses the same cookie-based token authentication
- **Connection**: Frontend must include credentials (cookies) when connecting

#### Messages FROM Client TO Server:

1. **Location Update** (driver only):
   ```json
   {
     "type": "location_update",
     "buggy_id": 1,
     "latitude": 37.7749,
     "longitude": -122.4194,
     "direction": 45.0
   }
   ```

2. **Subscribe to Buggies** (student only):
   ```json
   {
     "type": "subscribe",
     "buggy_ids": [1, 2, 3]
   }
   ```

#### Messages FROM Server TO Client:

1. **Location Update**:
   ```json
   {
     "type": "location_update",
     "buggy_id": 1,
     "latitude": 37.7749,
     "longitude": -122.4194,
     "direction": 45.0,
     "driver_name": "John",
     "timestamp": "2023-04-15T12:34:56.789Z"
   }
   ```

2. **Subscription Confirmation**:
   ```json
   {
     "type": "subscription_confirmed",
     "buggy_ids": [1, 2, 3]
   }
   ```

### WebSocket Authentication

- WebSocket connections are authenticated using the same cookie-based token
- The cookie must be valid when establishing the WebSocket connection
- If the token expires, the WebSocket connection will be closed
- No additional authentication is needed for WebSocket messages

---

## 🧠 Advanced Technical Details

### Authentication Implementation

- **Token Storage**: Django REST Framework's Token model in database
- **Cookie Security**: HTTP-only, Secure, SameSite=Lax
- **Token Expiration**: 7 days (configurable in settings)
- **Custom Authentication**: TokenCookieAuthentication class extending DRF

### WebSocket Implementation

- **Channel Layer**: Redis-backed for scalability
- **Consumer Types**: AsyncWebsocketConsumer for asynchronous processing
- **Groups**:
  - "location_updates": Broadcast channel for all students
  - "driver_{id}": Individual channel for each driver
  - "student_{id}": Individual channel for each student

### Performance Considerations

- **Location History**: Stores points at 5-minute intervals to avoid database bloat
- **Query Optimization**: Indexes on commonly queried fields (buggy, timestamp)
- **Static Files**: Served efficiently via WhiteNoise

### Security Features

- **CSRF Protection**: For all state-changing operations
- **Authentication**: Token-based with proper expiration
- **Cookie Security**: HTTP-only, SameSite, and Secure flags
- **Input Validation**: Via Django REST Framework serializers

---

## 🔄 Extending the System

### Adding New API Endpoints

1. Create a serializer in the app's `serializers.py`
2. Create a view in the app's `views.py`
3. Add the URL pattern to the app's `urls.py`
4. Document the endpoint in Swagger via @swagger_auto_schema

### Creating a New App

1. Run `python manage.py startapp app_name`
2. Add the app to INSTALLED_APPS in `settings.py`
3. Create models, serializers, views, and URLs
4. Add the app's URLs to the main `urls.py`

### Working with WebSockets

To add a new WebSocket consumer:
1. Create a new consumer class in the app's `consumers.py`
2. Add the routing pattern to the app's `routing.py`
3. Include the routing in the main ASGI application

---

## 📞 Contact

If you run into issues setting this up locally, please ping me directly.