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

## 📫 Contact

If you run into issues setting this up locally, please ping me directly.

---

## 🔒 Authentication System

This backend uses a secure cookie-based token authentication system. Here's what frontend developers need to know:

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

### WebSocket Authentication

WebSocket connections are authenticated using the same cookie-based token:

1. The cookie must be valid when establishing the WebSocket connection
2. If the token expires, the WebSocket connection will be closed
3. No additional authentication is needed for WebSocket messages

This consistent authentication approach ensures security while simplifying frontend implementation.