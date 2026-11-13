import json
import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Assessment, StudentSkill, StudentInterest, StudentProfile
from ..schemas import AssessmentSubmission, AssessmentOut
from ..auth import get_current_user
from ..ai_engine.recommendation import compute_career_recommendations

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

ASSESSMENT_QUESTIONS = [
    {
        "id": 1,
        "step": 1,
        "category": "education",
        "title": "Academic Foundation & Current Education",
        "description": "Tell us about your educational background to help us baseline industry prerequisites.",
        "fields": ["education_level", "degree", "specialization", "graduation_year"]
    },
    {
        "id": 2,
        "step": 2,
        "category": "technical_skills",
        "title": "Technical Competencies & Hands-on Tools",
        "description": "Select the tools, languages, and technologies you have worked with and rate your comfort level.",
        "options": [
            "Python", "JavaScript / TypeScript", "React.js", "SQL & Relational DBs",
            "Machine Learning / Scikit-Learn", "FastAPI / Node.js", "Docker & Containers",
            "Cloud (AWS / GCP / Azure)", "Data Structures & Algorithms", "Cybersecurity Basics"
        ]
    },
    {
        "id": 3,
        "step": 3,
        "category": "problem_solving",
        "title": "Problem-Solving & Engineering Approach",
        "description": "How do you prefer to tackle ambiguous technical challenges?",
        "question": "When faced with an unfamiliar architectural bug or open-ended project requirement, what is your initial instinct?",
        "options": [
            {"id": "a", "label": "Break it down into mathematical or algorithmic first principles", "score": 90, "trait": "Algorithmic / Analytical"},
            {"id": "b", "label": "Build a quick prototype or sandbox to experiment interactively", "score": 85, "trait": "Builder / Product-Minded"},
            {"id": "c", "label": "Research documentation, RFCs, and peer benchmarks thoroughly", "score": 88, "trait": "Research & Systems Oriented"},
            {"id": "d", "label": "Collaborate with peers to brainstorm user impact and scope", "score": 82, "trait": "Collaborative / Strategy"}
        ]
    },
    {
        "id": 4,
        "step": 4,
        "category": "interests",
        "title": "Passions, Domains & Preferred Industries",
        "description": "Which domains excite your curiosity the most?",
        "options": [
            "Artificial Intelligence & LLMs", "Full Stack Web & Mobile", "Cloud Architecture & DevOps",
            "Big Data & Analytics", "Information Security & Defense", "UI/UX & Product Design",
            "Fintech & Quant Systems", "Healthcare & Biotech Tech"
        ]
    },
    {
        "id": 5,
        "step": 5,
        "category": "strengths_goals",
        "title": "Strengths & Long-Term Career Vision",
        "description": "Define where you see yourself creating value in the next 3-5 years.",
        "fields": ["strengths", "career_goals", "work_environment_preference"]
    }
]

@router.get("/questions")
def get_assessment_questions():
    """Returns the multi-step questionnaire schema."""
    return {
        "title": "CareerWithinU Comprehensive Career Aptitude & Skill Assessment",
        "total_steps": 5,
        "estimated_minutes": 15,
        "steps": ASSESSMENT_QUESTIONS
    }

@router.get("/history", response_model=List[AssessmentOut])
def get_user_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Assessment).filter(Assessment.user_id == current_user.id).order_by(Assessment.completed_at.desc()).all()

@router.post("/submit", response_model=Dict[str, Any])
def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits student assessment:
    - Saves assessment answers & score to DB
    - Updates student profile, technical skills, and interests
    - Triggers AI Career Recommendation Engine
    """
    # 1. Update Student Profile if degree info provided
    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
    if submission.degree:
        profile.degree = submission.degree
    if submission.specialization:
        profile.specialization = submission.specialization
    if submission.career_goals:
        profile.target_role = submission.career_goals

    # 2. Update Student Skills
    for skill_item in submission.technical_skills:
        name = skill_item.get("name") if isinstance(skill_item, dict) else str(skill_item)
        if not name:
            continue
        prof = skill_item.get("proficiency", "Intermediate") if isinstance(skill_item, dict) else "Intermediate"
        score = float(skill_item.get("score", 75.0)) if isinstance(skill_item, dict) else 75.0
        
        existing = db.query(StudentSkill).filter(
            StudentSkill.user_id == current_user.id,
            StudentSkill.skill_name.ilike(name.strip())
        ).first()

        if existing:
            existing.proficiency = prof
            existing.score = score
        else:
            db.add(StudentSkill(
                user_id=current_user.id,
                skill_name=name.strip(),
                proficiency=prof,
                score=score,
                category="Technical"
            ))

    # Add Soft Skills
    for soft_s in submission.soft_skills:
        if not db.query(StudentSkill).filter(
            StudentSkill.user_id == current_user.id,
            StudentSkill.skill_name.ilike(soft_s.strip())
        ).first():
            db.add(StudentSkill(
                user_id=current_user.id,
                skill_name=soft_s.strip(),
                proficiency="Advanced",
                score=85.0,
                category="Soft"
            ))

    # 3. Update Interests
    for interest in submission.interests:
        if not db.query(StudentInterest).filter(
            StudentInterest.user_id == current_user.id,
            StudentInterest.interest_name.ilike(interest.strip())
        ).first():
            db.add(StudentInterest(user_id=current_user.id, interest_name=interest.strip()))

    # 4. Calculate Assessment Overall Score
    calculated_score = 85.0
    if submission.technical_skills:
        skill_scores = [float(s.get("score", 75)) for s in submission.technical_skills if isinstance(s, dict)]
        if skill_scores:
            calculated_score = round(sum(skill_scores) / len(skill_scores), 1)

    summary_text = (
        f"Assessment indicates strong technical aptitude in {', '.join([s.get('name', '') for s in submission.technical_skills[:3] if isinstance(s, dict)]) or 'core programming'}. "
        f"Shows high analytical mindset and readiness for professional technology internships."
    )

    assessment = Assessment(
        user_id=current_user.id,
        title=submission.title or "Comprehensive Career Aptitude Assessment",
        assessment_type=submission.assessment_type or "comprehensive",
        score=calculated_score,
        max_score=100.0,
        progress=100,
        status="Completed",
        summary=summary_text,
        answers_json=json.dumps(submission.model_dump()),
        completed_at=datetime.datetime.utcnow()
    )
    db.add(assessment)
    db.commit()

    # 5. Recompute AI Career Recommendations based on fresh assessment data
    top_recommendations = compute_career_recommendations(user_id=current_user.id, db=db, save_to_db=True)

    return {
        "message": "Assessment submitted and processed successfully!",
        "assessment_id": assessment.id,
        "score": calculated_score,
        "summary": summary_text,
        "top_career": top_recommendations[0]["career"].title if top_recommendations else "Software Engineer",
        "top_match_percentage": top_recommendations[0]["match_percentage"] if top_recommendations else 90.0,
        "total_recommendations": len(top_recommendations)
    }
