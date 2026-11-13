import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Career, LearningRoadmap, RoadmapTask
from ..schemas import LearningRoadmapOut
from ..auth import get_current_user

router = APIRouter(prefix="/api/roadmaps", tags=["Learning Roadmaps"])

# Standard 7-Phase Templates for careers
ROADMAP_TEMPLATES = {
    "default": [
        (1, "Core Foundations & Language Fundamentals", [
            ("Master Core Syntax, Types & Control Structures", "https://docs.python.org/3/tutorial/", 6),
            ("Build 5 Modular Utility Functions & Scripting Automation", "https://realpython.com/", 5),
            ("Version Control Workflows with Git & GitHub", "https://git-scm.com/doc", 4)
        ]),
        (2, "Data Structures & Algorithmic Patterns", [
            ("Arrays, Hash Maps, Stacks and Queues Implementation", "https://neetcode.io/", 8),
            ("Recursion, Trees & Graph Search (BFS / DFS)", "https://leetcode.com/", 10),
            ("Time and Space Complexity (Big-O) Benchmarking", "https://www.bigocheatsheet.com/", 4)
        ]),
        (3, "Object-Oriented Design & Clean Code Architecture", [
            ("Classes, Encapsulation, Polymorphism & Metaprogramming", "https://refactoring.guru/", 7),
            ("Design Patterns: Factory, Observer, Singleton, Adapter", "https://refactoring.guru/design-patterns", 8),
            ("Unit Testing with Pytest / Jest & Test-Driven Development", "https://docs.pytest.org/", 6)
        ]),
        (4, "Frameworks, Microservices & REST APIs", [
            ("Design Scalable REST API Endpoints with Pydantic & FastAPI", "https://fastapi.tiangolo.com/", 9),
            ("JWT Token Authentication, RBAC, and Route Protection", "https://fastapi.tiangolo.com/tutorial/security/", 7),
            ("Asynchronous I/O, Concurrency & Background Workers", "https://docs.python.org/3/library/asyncio.html", 6)
        ]),
        (5, "Database Systems & Schema Optimization", [
            ("Relational Modeling, Indexing & Complex Joins (PostgreSQL / SQLite)", "https://sqlbolt.com/", 8),
            ("ORM Implementation with SQLAlchemy / Prisma", "https://docs.sqlalchemy.org/", 7),
            ("Caching Strategies with Redis & In-Memory Stores", "https://redis.io/docs/", 5)
        ]),
        (6, "Production Engineering, Docker & Cloud Deployment", [
            ("Containerizing Microservices with Docker & Docker Compose", "https://docs.docker.com/get-started/", 10),
            ("Automated CI/CD Pipelines with GitHub Actions", "https://docs.github.com/en/actions", 6),
            ("Cloud Deployment & Observability (AWS / Render / Vercel)", "https://aws.amazon.com/free/", 8)
        ]),
        (7, "Capstone Project & Technical Interview Mastery", [
            ("End-to-End Capstone Production Application Deployment", "https://github.com", 16),
            ("System Design & Architecture Whiteboard Preparation", "https://github.com/donnemartin/system-design-primer", 12),
            ("Behavioral Interview Preparation with the STAR Framework", "https://www.techinterviewhandbook.org/", 8)
        ])
    ]
}

@router.get("/active", response_model=LearningRoadmapOut)
def get_active_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id,
        LearningRoadmap.is_active == True
    ).first()

    if not roadmap:
        # If no active roadmap, generate one for their top career or Python Developer
        career = db.query(Career).filter(Career.slug == "python-developer").first() or db.query(Career).first()
        if not career:
            raise HTTPException(status_code=404, detail="No careers found to create roadmap.")
        roadmap = create_roadmap_for_career(user_id=current_user.id, career_id=career.id, db=db)

    return roadmap

@router.get("/career/{career_id}", response_model=LearningRoadmapOut)
def get_or_create_roadmap_for_career(
    career_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id,
        LearningRoadmap.career_id == career_id
    ).first()

    if not roadmap:
        roadmap = create_roadmap_for_career(user_id=current_user.id, career_id=career_id, db=db)

    # Set as active roadmap
    db.query(LearningRoadmap).filter(LearningRoadmap.user_id == current_user.id).update({"is_active": False})
    roadmap.is_active = True
    db.commit()
    db.refresh(roadmap)

    return roadmap

def create_roadmap_for_career(user_id: int, career_id: int, db: Session) -> LearningRoadmap:
    career = db.query(Career).filter(Career.id == career_id).first()
    title = f"{career.title} Professional Learning Roadmap" if career else "Career Learning Roadmap"

    new_roadmap = LearningRoadmap(
        user_id=user_id,
        career_id=career_id,
        title=title,
        description=f"Structured 7-phase learning roadmap for mastering {career.title if career else 'Target Career'}.",
        progress_percentage=0.0,
        current_phase=1,
        total_phases=7,
        is_active=True
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    template = ROADMAP_TEMPLATES["default"]
    for phase_num, phase_title, tasks in template:
        for t_title, t_url, hrs in tasks:
            db.add(RoadmapTask(
                roadmap_id=new_roadmap.id,
                phase_number=phase_num,
                phase_title=phase_title,
                task_title=t_title,
                resource_url=t_url,
                estimated_hours=hrs,
                is_completed=False
            ))
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

@router.post("/tasks/{task_id}/toggle")
def toggle_task_completion(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(RoadmapTask).join(LearningRoadmap).filter(
        RoadmapTask.id == task_id,
        LearningRoadmap.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied.")

    task.is_completed = not task.is_completed
    task.completed_at = datetime.datetime.utcnow() if task.is_completed else None
    db.commit()

    # Recalculate roadmap progress
    roadmap = task.roadmap
    total_tasks = len(roadmap.tasks)
    completed_tasks = len([t for t in roadmap.tasks if t.is_completed])
    new_pct = round((completed_tasks / total_tasks * 100.0), 1) if total_tasks > 0 else 0.0
    roadmap.progress_percentage = new_pct

    # Determine current active phase
    phases_status = {}
    for t in roadmap.tasks:
        if t.phase_number not in phases_status:
            phases_status[t.phase_number] = []
        phases_status[t.phase_number].append(t.is_completed)

    current_p = 1
    for p_num in sorted(phases_status.keys()):
        if not all(phases_status[p_num]):
            current_p = p_num
            break
        current_p = max(p_num, current_p)
    roadmap.current_phase = current_p

    db.commit()
    db.refresh(roadmap)

    return {
        "task_id": task.id,
        "is_completed": task.is_completed,
        "progress_percentage": new_pct,
        "current_phase": current_p,
        "completed_tasks": completed_tasks,
        "total_tasks": total_tasks
    }
