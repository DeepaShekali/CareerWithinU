# CareerWithinU – AI Career Guidance Platform

> **"Discover Your Future. Find Your Perfect Career."**

CareerWithinU is an enterprise-grade, full-stack, AI-driven career guidance and mentorship platform. Designed specifically for students and early-career technologists, it features an elegant **lavender-purple pastel interface**, an authentic **three-column dashboard layout**, a transparent **AI career recommendation engine**, **skill gap analysis**, **interactive 7-phase learning roadmaps**, and a 24/7 **AI Career Assistant chatbot**.

The entire system is completely local and does not require paid external API keys.

---

## 🌟 Key Architecture & Features

### 1. Three-Column Student Dashboard (Reference Recreated)
- **Left Sidebar**:
  - Branding with gradient logo icon
  - Navigation: AI Chat, Assessments, Career Recommendations, Learning Roadmap, Progress Tracker, College Search, Learning Resources, Jobs & Internships, My Profile, Settings, and Logout.
  - Active route indicator with rounded lavender pills.
  - Current student identity badge and real-time system status.
- **Middle Panel**:
  - Top greeting banner with calculated Career Readiness Score (0-100%).
  - Upcoming assessments card with countdown and direct "Start Assessment" action.
  - Psychometric test progress (score, analytical traits summary).
  - Career assessment progress bar.
  - Career roadmap progress (Phase X of 7 with progress percentage).
  - Saved careers quick grid.
  - Shortlisted colleges preview.
  - Upcoming learning activities checklist (interactive checkboxes that update database live).
- **Right Panel (Large AI Chatbot)**:
  - Header with green online status and reset conversation button.
  - Persistent message stream in SQLite database.
  - Student and AI chat bubbles with avatars and timestamps.
  - Suggested question pills for quick 1-tap inquiries.
  - Responsive prompt input with auto-scrolling.

### 2. Multi-Step Career Assessment Module
- **Stage 1: Educational Foundation** (Degree, specialization, graduation year, university).
- **Stage 2: Technical Competencies & Hands-on Tools** (Multi-select with Beginner, Intermediate, Advanced ratings).
- **Stage 3: Engineering Mindset & Aptitude** (Algorithmic first-principles, prototyping, systematic thinking).
- **Stage 4: Domain Passions & Preferred Industries** (AI, Full Stack, Data Science, Cloud, Cybersecurity, UI/UX, Fintech).
- **Stage 5: Career Goals & Work Environment Review**.
- Form validation, progress bar, and instant recommendation results modal.

### 3. Transparent AI Career Recommendation Engine
- Multi-dimensional weighted matching algorithm:
  $$\text{Score} = w_{\text{skills}} \cdot \text{SkillOverlap} + w_{\text{interest}} \cdot \text{DomainAlignment} + w_{\text{aptitude}} \cdot \text{AssessmentScore}$$
- Recommends the **Top 5 suitable careers** (e.g. AI Engineer, Full Stack Developer, Data Scientist, Machine Learning Engineer, Python Developer, etc.).
- Transparent breakdowns:
  - Match percentage (e.g. 94.5%).
  - "Why this matches you" personalized explanation.
  - Matching verified skills.
  - Missing skills to develop next.
  - Required technologies, average salary, growth rate, and job responsibilities.

### 4. In-Depth Skill Gap Analysis
- Interactive modal / drawer comparing student skills against career benchmarks.
- Recharts Radar Chart visualizing student proficiencies vs industry expectations.
- Actionable priority matrix: Critical, High, Medium, and Mastered.
- Tailored improvement tips for every skill gap.

### 5. Personalized 7-Phase Learning Roadmaps
- Structured curriculum (e.g. Python Developer: Fundamentals → DSA → OOP → FastAPI & REST APIs → SQL & Databases → Practical Projects → Capstone & Technical Interviews).
- Interactive task completion checkboxes with real-time recalculation of phase status and progress percentage saved to the database.
- Working documentation and video resource links.

### 6. College Discovery Hub
- Search by name, city, state, and degree program.
- College details: ranking, acceptance rate, tuition fees, rating, and admission prerequisites.
- Save / shortlist toggle button.

### 7. Learning Resources Library
- Filterable across 10 categories (Python, Web Dev, AI, ML, Data Science, Cloud, Cybersecurity, Java, Interview Prep, Resume Building).
- Working external resource links, difficulty levels, and ratings.

### 8. Jobs & Internships Module
- Realistic opportunities with required skills pills, salary ranges, location, and application buttons.
- Labeled clearly as sample demonstration listings.

### 9. Admin Operations Dashboard
- Platform analytics: total students, total assessments taken, active roadmaps, and career catalog count.
- In-demand skill popularity metrics.
- Student roster with assessment history.
- "Add New Technology Career Pathway" modal.

---

## 🔑 Demonstration Accounts

| Role | Email | Password | Features Accessible |
|------|-------|----------|---------------------|
| **Demo Student** | `student@careerwithinu.com` | `student123` | Full 3-column dashboard, roadmap progress, assessments, chatbot, saved careers |
| **Demo Admin** | `admin@careerwithinu.com` | `admin123` | Platform analytics, student roster, add careers |

> **Pro-Tip**: On the `/login` page, you can click **"Demo Student"** or **"Demo Admin"** for instant 1-click login without typing!

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React, Recharts, React Router v6.
- **Backend**: Python 3.14 / 3.11+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2, Bcrypt.
- **Database**: SQLite (`careerwithinu.db`) with automatic schema initialization and seeding.

---

## 🚀 Running the Platform Locally

### 1. Backend Setup & Startup
```powershell
# Navigate to backend directory
cd "AI_CAREER GUIDANCE PLATFORM"

# Run database seeder (seeds initial careers, colleges, demo users & roadmaps)
python -m backend.app.seed_data

# Start FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API documentation is available at `http://localhost:8000/docs`.

### 2. Frontend Setup & Startup
```powershell
# Navigate to frontend directory
cd "AI_CAREER GUIDANCE PLATFORM/frontend"

# Install dependencies (if not already done)
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints Summary

- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/demo-login/{role}`
- **Student & Middle Panel**: `GET /api/student/dashboard`, `GET /api/student/profile`, `PUT /api/student/profile`, `GET /api/student/skills`, `POST /api/student/skills`
- **Assessments**: `GET /api/assessments/questions`, `POST /api/assessments/submit`, `GET /api/assessments/history`
- **Recommendations**: `GET /api/recommendations`, `GET /api/recommendations/careers`, `GET /api/recommendations/gap-analysis/{id}`, `POST /api/recommendations/save/{id}`
- **Roadmaps**: `GET /api/roadmaps/active`, `GET /api/roadmaps/career/{id}`, `POST /api/roadmaps/tasks/{id}/toggle`
- **Colleges**: `GET /api/colleges`, `POST /api/colleges/shortlist/{id}`
- **Resources**: `GET /api/resources`
- **Jobs**: `GET /api/jobs`
- **AI Chatbot**: `GET /api/chat/history`, `POST /api/chat/message`, `POST /api/chat/clear`
- **Admin**: `GET /api/admin/stats`, `GET /api/admin/students`, `POST /api/admin/careers`
