from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, StudentProfile, StudentSkill, StudentInterest, Assessment, LearningRoadmap, SavedCareer, ShortlistedCollege, Career
from ..schemas import UserProfileUpdate, UserOut, StudentSkillCreate, StudentSkillOut
from ..auth import get_current_user

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("/profile", response_model=UserOut)
def get_student_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_student_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name

    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    if profile_data.degree is not None:
        profile.degree = profile_data.degree
    if profile_data.specialization is not None:
        profile.specialization = profile_data.specialization
    if profile_data.graduation_year is not None:
        profile.graduation_year = profile_data.graduation_year
    if profile_data.bio is not None:
        profile.bio = profile_data.bio
    if profile_data.target_role is not None:
        profile.target_role = profile_data.target_role
    if profile_data.phone is not None:
        profile.phone = profile_data.phone
    if profile_data.college_name is not None:
        profile.college_name = profile_data.college_name
    if profile_data.city is not None:
        profile.city = profile_data.city

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/skills", response_model=List[StudentSkillOut])
def get_student_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()

@router.post("/skills", response_model=StudentSkillOut)
def add_student_skill(
    skill_in: StudentSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if existing
    existing = db.query(StudentSkill).filter(
        StudentSkill.user_id == current_user.id,
        StudentSkill.skill_name.ilike(skill_in.skill_name.strip())
    ).first()

    if existing:
        existing.proficiency = skill_in.proficiency
        existing.score = skill_in.score
        existing.category = skill_in.category
        db.commit()
        db.refresh(existing)
        return existing

    new_skill = StudentSkill(
        user_id=current_user.id,
        skill_name=skill_in.skill_name.strip(),
        proficiency=skill_in.proficiency,
        score=skill_in.score,
        category=skill_in.category
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.delete("/skills/{skill_id}")
def delete_student_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(StudentSkill).filter(
        StudentSkill.id == skill_id,
        StudentSkill.user_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found.")
    db.delete(skill)
    db.commit()
    return {"message": "Skill removed successfully."}

@router.get("/dashboard")
def get_student_dashboard_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns data for the middle panel of the three-column layout:
    - Upcoming assessments card
    - Psychometric test progress
    - Career assessment progress
    - College shortlist
    - Career roadmap progress
    - Saved careers
    - Upcoming learning activities
    """
    # 1. Assessments
    assessments = db.query(Assessment).filter(Assessment.user_id == current_user.id).all()
    psychometric = next((a for a in assessments if a.assessment_type == "psychometric"), None)
    technical_eval = next((a for a in assessments if a.assessment_type == "technical"), None)

    # 2. Roadmap
    active_roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id,
        LearningRoadmap.is_active == True
    ).first()

    roadmap_data = None
    upcoming_tasks = []
    if active_roadmap:
        total_tasks = len(active_roadmap.tasks)
        completed_tasks = len([t for t in active_roadmap.tasks if t.is_completed])
        calc_pct = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0
        roadmap_data = {
            "id": active_roadmap.id,
            "title": active_roadmap.title,
            "career_title": active_roadmap.career.title if active_roadmap.career else "Target Career",
            "progress_percentage": calc_pct,
            "current_phase": active_roadmap.current_phase,
            "total_phases": active_roadmap.total_phases,
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks
        }
        # Gather up to 3 upcoming incomplete tasks
        upcoming_tasks = [
            {
                "id": t.id,
                "title": t.task_title,
                "phase": t.phase_title,
                "estimated_hours": t.estimated_hours,
                "resource_url": t.resource_url
            }
            for t in active_roadmap.tasks if not t.is_completed
        ][:3]

    # 3. Saved Careers
    saved_records = db.query(SavedCareer).filter(SavedCareer.user_id == current_user.id).all()
    saved_careers = [
        {
            "id": sc.career.id,
            "title": sc.career.title,
            "category": sc.career.category,
            "average_salary": sc.career.average_salary,
            "growth_rate": sc.career.growth_rate,
            "icon": sc.career.icon
        }
        for sc in saved_records if sc.career
    ]

    # 4. Shortlisted Colleges
    shortlists = db.query(ShortlistedCollege).filter(ShortlistedCollege.user_id == current_user.id).all()
    shortlisted_colleges = [
        {
            "id": sc.college.id,
            "name": sc.college.name,
            "location": sc.college.location,
            "ranking": sc.college.ranking,
            "rating": sc.college.rating,
            "fees_per_year": sc.college.fees_per_year,
            "image_url": sc.college.image_url
        }
        for sc in shortlists if sc.college
    ]

    # 5. Readiness Score calculation
    skills = db.query(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    avg_skill_score = sum(s.score for s in skills) / len(skills) if skills else 70.0
    readiness_indicator = round(min(98.0, (avg_skill_score * 0.7) + (30.0 if psychometric else 10.0)), 1)

    return {
        "student": {
            "name": current_user.full_name,
            "email": current_user.email,
            "degree": current_user.profile.degree if current_user.profile else "B.Tech Computer Science",
            "target_role": current_user.profile.target_role if current_user.profile else "AI Engineer",
            "readiness_score": readiness_indicator
        },
        "upcoming_assessment_card": {
            "title": "National Technical & Cognitive Aptitude Evaluation",
            "due_in": "2 Days Remaining",
            "status": "Registration Confirmed",
            "estimated_duration": "45 Mins",
            "reward_points": "+250 Career XP"
        },
        "psychometric_progress": {
            "score": psychometric.score if psychometric else 85.0,
            "status": psychometric.status if psychometric else "Completed",
            "summary": psychometric.summary if psychometric else "Analytical, Systematic Problem Solver"
        },
        "career_assessment_progress": {
            "progress_percent": 75 if technical_eval else 60,
            "status": "In Progress" if technical_eval else "Pending",
            "title": "Technical Skill Benchmark"
        },
        "roadmap_progress": roadmap_data,
        "upcoming_activities": upcoming_tasks,
        "saved_careers": saved_careers,
        "college_shortlist": shortlisted_colleges
    }
