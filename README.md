# Social Media Content Scheduler

## Features Complete
- Django Backend
  - SQLite Database
  - JWT Authentication
  - Complete REST API (`scheduler` app)
- React+Vite Frontend
  - Tailwind CSS for modern, clean UI
  - Axios API integration with interceptors
  - Auth context and protected routes
  - Dashboard with dynamic filter/sort capabilities
  - Custom Calendar grid without external calendar libraries

## How to Run Locally

### 1. Backend Server
```bash
cd backend
source ../venv/bin/activate
python manage.py runserver
```

### 2. Frontend Development Server
```bash
cd frontend
npm run dev
```

Visit the link given by Vite (usually `http://localhost:5173`) and you will get redirected to the login. Register for a new account and begin creating scheduled posts.

### 3. Verification Steps
- Try registering/login
- Navigate to Dashboard and create a post (caption, scheduled date in the future).
- Validate that it shows up, edit or delete it.
- Navigate to the Calendar page to view your post scheduled in a custom minimalist grid. Highlight a date to view all related statuses.
