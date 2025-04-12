# CampusBuggy Backend

This is the backend for the CampusBuggy project, built using Django, Django REST Framework, Django Channels (for WebSockets), and Daphne as the ASGI server. It includes admin functionality, REST APIs, WebSocket endpoints, and serves static files using WhiteNoise.

---

## 🔧 Requirements

- Python 3.11.7
- `virtualenv` (recommended)
- Git

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

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create a Superuser (for admin access)

```bash
python manage.py createsuperuser
```

> Suggested credentials for local use:  
> **Username:** `admin`  
> **Password:** `admin`  
> (Email can be left blank)

### 6. Run the ASGI Server with Daphne

```bash
daphne -b 127.0.0.1 -p 8000 campusbuggy.asgi:application
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

## 🔑 Accessing the Application

Once Daphne is running on `127.0.0.1:8000`, you can access:

- **Admin Panel**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **API Docs (Swagger)**: [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)

---

## 🛠 Development Notes

- Database: Using **SQLite** for development (auto-generated locally after migrations).
- This backend is meant to be run alongside a frontend locally.
- All settings are development-friendly. Do not use this setup for production.

---

## 📫 Contact

If you run into issues setting this up locally, please ping me directly.
