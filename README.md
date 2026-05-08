# 🗓️ Schedly

**Schedly** is a modern, full-stack social media content scheduling and productivity platform built for creators, developers, and teams who want to plan, optimize, and manage their content workflow efficiently.

It goes beyond basic scheduling by combining **automation, AI assistance, workflow management, and analytics** into a unified experience.

---

## 🚀 Key Highlights

* ⚡ Workflow-driven content management (Kanban system)
* 🤖 AI-powered caption improvement & idea generation
* 📊 Real-time analytics and productivity insights
* 📅 Interactive calendar with drag & drop scheduling
* 🎯 Goal tracking & weekly performance reports
* ⚡ Command palette for fast navigation
* 🌗 Premium light & dark mode UI
* 📱 Fully responsive across all devices

---

## 🔐 Authentication & User Management

* Email/Password Registration
* JWT Authentication (access + refresh tokens)
* Google OAuth Login
* Secure Password Change (password users only)
* Account Deletion with confirmation
* Custom Logout Confirmation Modal

---

## 📋 Post Management

* Create, edit, delete posts
* Platform-specific posting (X, LinkedIn, Instagram, Facebook)
* Live preview while editing
* Mark posts as completed
* Past-due locking system
* Platform & status filters
* Workflow stage integration

---

## 📅 Calendar System

* Monthly calendar view
* Drag & drop rescheduling
* Post indicators on dates
* Click-to-edit functionality

---

## 🧠 AI Features

* ✨ Caption Improvement (Pollinations AI)
* 🎨 Tone-based rewriting (professional, casual, etc.)
* 💡 Content idea generation
* 🕒 Smart time suggestions
* 💬 Nova AI chatbot assistant

---

## 🧩 Workflow System (Smart Content Queue)

A Kanban-style content pipeline:

* Ideas
* Drafting
* Ready
* Scheduled
* Posted

Drag & drop posts across stages for seamless workflow management.

---

## ⚡ Command Palette

Quick navigation system (`Ctrl + K / Cmd + K`):

* Create post
* Open pages instantly
* Search & execute actions

Inspired by modern tools like Linear and Raycast.

---

## 🎯 Goal System

* Set weekly/monthly posting goals
* Track progress visually
* Motivational feedback system
* Completion percentages

---

## 📊 Analytics & Reports

### Dashboard Analytics

* Total posts
* Scheduled posts
* Completed posts
* Current streak

### Weekly Reports

* Posting activity summary
* Most active platform
* Productivity insights
* Visual charts & stats

---

## 📝 Content Templates

* Save reusable caption templates
* Apply templates instantly
* Delete/manage templates

---

## 👁️ Live Preview System

Platform-specific previews:

* Instagram
* LinkedIn
* X (Twitter)
* Facebook / General

Updates in real-time while editing.

---

## 🔔 Notification System

* In-app notifications
* 24-hour reminders
* Due alerts
* Email notifications
* Notification center with history

---

## ⚙️ Background Scheduler

* APScheduler integration
* Runs every 60 seconds
* Prevents duplicate notifications
* Auto-start on server boot

---

## 👤 Profile Management

* View & edit account info
* Username updates
* Password change (conditional)
* Account deletion (Danger Zone)

---

## 🎨 UI / UX Features

* Premium light & dark mode
* Emerald/teal modern color system
* Fully responsive design
* Smooth animations (Framer Motion)
* Interactive onboarding tutorial
* Nova mascot assistant
* Glassmorphism UI elements

---

## 📱 Responsiveness

Schedly is fully optimized for:

* Mobile devices
* Tablets
* Laptops
* Large screens

Includes:

* Adaptive layouts
* Mobile sidebar
* Responsive calendar
* Touch-friendly UI

---

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* DaisyUI
* Framer Motion
* React Query

### Backend

* Django
* Django REST Framework
* JWT (SimpleJWT)
* Google OAuth2

### Database

* SQLite (development)

### Background Jobs

* APScheduler

### AI Integration

* Pollinations AI (no API key required)

### Other

* Gmail SMTP (email)
* CORS handling

---

## 📦 Project Structure (Simplified)

```
frontend/
  src/
    components/
    pages/
    services/

backend/
  scheduler/
    models.py
    views.py
    serializers.py
```

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Scope

* Team collaboration
* Media library
* Advanced AI analytics
* Performance-based recommendations

---

## 📌 Final Note

Schedly is designed not just as a scheduling tool, but as a **complete creator productivity system** — combining planning, automation, and intelligent insights into a single platform.

---
