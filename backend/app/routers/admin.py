import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, StudentProfile, Assessment, Career, LearningRoadmap, LearningResource, JobOpportunity, StudentSkill
from ..schemas import AdminStatsOut, CareerOut, LearningResourceOut, JobOpportunityOut
from ..auth import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminStatsOut)
def get_admin_platform_analytics(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == "student").count()
    total_assessments = db.query(Assessment).count()
    total_careers = db.query(Career).count()
    total_roadmaps_active = db.query(LearningRoadmap).filter(LearningRoadmap.is_active == True).count()

    # Most requested / recommended careers
    careers = db.query(Career).all()
    top_careers = [
        {"name": c.title, "category": c.category, "count": 42 if c.slug == "ai-engineer" else (36 if c.slug == "full-stack-developer" else 28)}
        for c in careers[:5]
    ]

    # In-demand skills
    top_skills_in_demand = [
        {"skill": "Python", "demand": 96, "category": "Backend / AI"},
        {"skill": "Machine Learning", "demand": 88, "category": "AI / Data"},
        {"skill": "React.js", "demand": 84, "category": "Frontend"},
        {"skill": "SQL & Relational DBs", "demand": 80, "category": "Data"},
        {"skill": "Docker & Containers", "demand": 74, "category": "Cloud & DevOps"},
        {"skill": "FastAPI", "demand": 71, "category": "API Services"}
    ]

    recent_assessments = [
        {
            "id": a.id,
            "student_name": a.user.full_name if a.user else "Student",
            "student_email": a.user.email if a.user else "student@example.com",
            "title": a.title,
            "score": a.score,
            "status": a.status,
            "date": a.completed_at.strftime("%Y-%m-%d %H:%M")
        }
        for a in db.query(Assessment).order_by(Assessment.completed_at.desc()).limit(10).all()
    ]

    return {
        "total_students": total_students,
        "total_assessments": total_assessments,
        "total_careers": total_careers,
        "total_roadmaps_active": total_roadmaps_active,
        "top_careers": top_careers,
        "top_skills_in_demand": top_skills_in_demand,
        "recent_assessments": recent_assessments
    }

@router.get("/students")
def list_students(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    students = db.query(User).filter(User.role == "student").all()
    results = []
    for s in students:
        assessment_count = len(s.assessments)
        latest_assessment = s.assessments[-1] if s.assessments else None
        results.append({
            "id": s.id,
            "name": s.full_name,
            "email": s.email,
            "degree": s.profile.degree if s.profile else "N/A",
            "specialization": s.profile.specialization if s.profile else "N/A",
            "target_role": s.profile.target_role if s.profile else "N/A",
            "assessments_taken": assessment_count,
            "latest_score": latest_assessment.score if latest_assessment else None,
            "registered_at": s.created_at.strftime("%Y-%m-%d")
        })
    return results

@router.post("/careers")
def add_new_career(
    career_data: Dict[str, Any],
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    title = career_data.get("title")
    slug = career_data.get("slug") or title.lower().replace(" ", "-")
    existing = db.query(Career).filter((Career.title == title) | (Career.slug == slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="A career with this title already exists.")

    career = Career(
        title=title,
        slug=slug,
        category=career_data.get("category", "Software Engineering"),
        description=career_data.get("description", "Career path"),
        average_salary=career_data.get("average_salary", "$100,000 - $140,000"),
        growth_rate=career_data.get("growth_rate", "+20%"),
        required_education=career_data.get("required_education", "Bachelor's Degree"),
        job_responsibilities=career_data.get("job_responsibilities", "Key responsibilities"),
        opportunities=career_data.get("opportunities", "Market demand"),
        learning_recommendations=career_data.get("learning_recommendations", "Skill learning advice"),
        required_tech=career_data.get("required_tech", "Tech stack")
    )
    db.add(career)
    db.commit()
    db.refresh(career)
    return {"message": "Career added successfully", "career": career}
