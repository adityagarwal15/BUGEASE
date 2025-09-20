# 🤝 Contributing to BUGEASE

Welcome to *BUGEASE*, a real-time campus transportation management system (Campus Buggy Tracker). Our mission is to improve campus mobility by providing a safe, efficient, and user-friendly platform. We welcome contributions of all kinds—code, documentation, design, or ideas. This guide will help you get started.

---

## 🚀 Getting Started

### Prerequisites
- Git
- Node.js v16+ and npm
- Python v3.9+ and pip
- PostgreSQL
- A code editor (VS Code recommended)

### Tech Stack
- *Frontend*: React 18, TypeScript, Tailwind CSS, Shadcn/UI, React Query
- *Backend*: Django with Django Rest Framework
- *Database*: PostgreSQL
- *Maps*: Google Maps API
- *Real-time Communication*: WebSockets

### Development Setup

#### 1. Fork the Repository
Click the "Fork" button on the [BUGEASE GitHub repository](https://github.com/adityagarwal15/BUGEASE) page.

#### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR-USERNAME/BUGEASE.git
cd BUGEASE
```

### 3️⃣ Set Up Git Upstream
```bash
git remote add upstream https://github.com/adityagarwal15/BUGEASE.git
git fetch upstream
```

### 4️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 5️⃣ Set Up Frontend Environment Variables

Create a .env file in the frontend folder with your Google Maps API key:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

⚠ Never commit API keys to the repository.

### 6️⃣ Install Backend Dependencies
```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 7️⃣ Set Up Backend Environment Variables
Copy the example file and edit it with your database credentials and secret key:
```bash
cp .env.example .env
```

### 8️⃣ Run the App Locally
Open two terminal windows simultaneously—one for frontend, one for backend.

*Frontend*
```bash
cd frontend
npm run dev
```

*Backend*
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

The app will be available at:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## ⚙ How to Contribute

### 1️⃣ Pick an Issue
Browse our GitHub issues and comment on one to let us know you're working on it.

### 2️⃣ Create a Branch
```bash
git checkout main
git pull upstream main  # Sync your fork with the original repository
git checkout -b feature/your-feature-name
```

### 3️⃣ Make Changes & Commit
Implement and test your changes locally:
```bash
git add .
git commit -m "feat: add feature description"
```

### 4️⃣ Push and Open a Pull Request
```bash
git push origin feature/your-feature-name
```
Go to your fork on GitHub and click Compare & Pull Request to submit a PR to the main branch of the original BUGEASE repo.

---

## 📝 Contribution Guidelines

To maintain consistency and clarity in BUGEASE, please follow these guidelines:

### 👨‍💻 Coding Standards
- Follow React/TypeScript and Django/DRF conventions.
- Write clean, readable, and modular code.
- Add comments for complex logic or calculations.
- Follow the DRY principle (Don't Repeat Yourself).

### 🧪 Testing
- Test your feature locally before submitting.
- Ensure the UI is responsive on desktop and mobile.
- Verify that all new functions or API calls behave as expected.
- Add unit tests where appropriate.

### 📚 Documentation
- Update README.md if your changes add or modify a feature.
- Include code examples or screenshots if helpful.
- Keep inline documentation concise and clear.

### 🔄 Pull Request Process
- All PRs are reviewed by project maintainers.
- Respond to feedback and push updates to the same branch.
- Write descriptive commit messages (e.g., feat: add real-time bug tracking).

### 🔒 Security & Secrets
- Never commit API keys, database credentials, or any sensitive information.
- Use .env files for all environment variables.

### ⚖ Code of Conduct
- We follow a [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a safe, inclusive, and respectful environment for all contributors.
- By contributing, you agree to abide by the rules outlined in this file.

---

## ⚡ Good First Issues
Beginner-friendly tasks to get started:
- Fix typos or improve documentation.
- Minor UI improvements on dashboards or maps.
- Add simple validation or helper functions.
- Write small unit tests.

---

## 🙏 Acknowledgements
We appreciate every contribution! Outstanding work will be recognized through:
- Project leaderboard.
- Official contributors list.
- Community shout-outs in GitHub discussions.

Together, we make *BUGEASE* a safer, smarter, and more efficient campus transportation system.
