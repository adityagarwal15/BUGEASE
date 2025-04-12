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

- The `staticfiles/` folder is **auto-generated** and **gitignored**, so it won’t appear in version control.

- You don’t need to modify or commit this folder manually — just make sure `collectstatic` is run locally.

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