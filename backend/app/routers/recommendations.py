from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Career, CareerRecommendation, SavedCareer
from ..schemas import CareerOut, CareerRecommendationOut, SkillGapAnalysisOut
from ..auth import get_current_user
from ..ai_engine.recommendation import compute_career_recommendations
from ..ai_engine.skill_gap import analyze_skill_gap

router = APIRouter(prefix="/api/recommendations", tags=["Career Recommendations"])

@router.get("", response_model=List[CareerRecommendationOut])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves the top 5 personalized career recommendations for the logged-in student.
    If no recommendations exist yet, computes them dynamically.
    """
    recs = compute_career_recommendations(user_id=current_user.id, db=db, save_to_db=True)
    saved_ids = {sc.career_id for sc in db.query(SavedCareer).filter(SavedCareer.user_id == current_user.id).all()}

    output = []
    for r in recs:
        c_obj = r["career"]
        output.append({
            "career_id": c_obj.id,
            "career": c_obj,
            "match_percentage": r["match_percentage"],
            "why_match": r["why_match"],
            "matching_skills": r["matching_skills"],
            "missing_skills": r["missing_skills"],
            "is_saved": c_obj.id in saved_ids
        })
    return output

@router.get("/careers", response_model=List[CareerOut])
def get_all_careers(db: Session = Depends(get_db)):
    """Browse all available careers catalog."""
    return db.query(Career).all()

@router.get("/careers/{career_id}", response_model=CareerOut)
def get_career_by_id(career_id: int, db: Session = Depends(get_db)):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")
    return career

@router.get("/gap-analysis/{career_id}", response_model=SkillGapAnalysisOut)
def get_skill_gap_analysis(
    career_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Performs real-time skill gap analysis between student's skillset and the selected career.
    """
    try:
        return analyze_skill_gap(user_id=current_user.id, career_id=career_id, db=db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/save/{career_id}")
def toggle_save_career(
    career_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggles bookmarking a career for the student."""
    existing = db.query(SavedCareer).filter(
        SavedCareer.user_id == current_user.id,
        SavedCareer.career_id == career_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Career removed from saved list."}
    else:
        new_save = SavedCareer(user_id=current_user.id, career_id=career_id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Career successfully saved to your dashboard."}

@router.get("/saved", response_model=List[CareerOut])
def get_saved_careers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_items = db.query(SavedCareer).filter(SavedCareer.user_id == current_user.id).all()
    return [sc.career for sc in saved_items if sc.career]
