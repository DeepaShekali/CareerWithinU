from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import (
    auth,
    students,
    assessments,
    recommendations,
    roadmaps,
    colleges,
    resources,
    jobs,
    chatbot,
    admin
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Initialize application
app = FastAPI(
    title="CareerWithinU API",
    description="Enterprise-grade AI-powered career guidance, skill gap analysis, and roadmap platform.",
    version="2.0.0"
)

# Enable CORS for frontend Vite development server & localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(assessments.router)
app.include_router(recommendations.router)
app.include_router(roadmaps.router)
app.include_router(colleges.router)
app.include_router(resources.router)
app.include_router(jobs.router)
app.include_router(chatbot.router)
app.include_router(admin.router)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "platform": "CareerWithinU AI",
        "status": "operational",
        "documentation": "/docs",
        "message": "Welcome to CareerWithinU - Discover Your Future. Find Your Perfect Career."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "careerwithinu-backend"}
