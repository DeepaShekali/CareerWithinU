import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, College, ShortlistedCollege
from ..schemas import CollegeOut
from ..auth import get_current_user

router = APIRouter(prefix="/api/colleges", tags=["College Search"])

@router.get("", response_model=List[CollegeOut])
def search_colleges(
    search: Optional[str] = Query(None, description="Search by college name or city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    degree: Optional[str] = Query(None, description="Filter by degree type"),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(College)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter((College.name.ilike(search_filter)) | (College.location.ilike(search_filter)))
    if state and state != "All":
        query = query.filter(College.state.ilike(f"%{state.strip()}%"))

    colleges = query.order_by(College.ranking.asc()).all()

    # Get student's shortlisted IDs if logged in
    shortlisted_ids = set()
    if current_user:
        shortlisted_ids = {
            sc.college_id for sc in db.query(ShortlistedCollege).filter(ShortlistedCollege.user_id == current_user.id).all()
        }

    results = []
    for c in colleges:
        try:
            degrees = json.loads(c.degrees_offered_json)
        except Exception:
            degrees = ["B.Tech", "M.Tech"]
        try:
            specs = json.loads(c.specializations_json)
        except Exception:
            specs = ["Computer Science"]

        # Apply in-memory filters for JSON fields if requested
        if degree and degree != "All" and not any(degree.lower() in d.lower() for d in degrees):
            continue
        if specialization and specialization != "All" and not any(specialization.lower() in s.lower() for s in specs):
            continue

        results.append({
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "state": c.state,
            "country": c.country,
            "ranking": c.ranking,
            "degrees_offered": degrees,
            "specializations": specs,
            "fees_per_year": c.fees_per_year,
            "rating": c.rating,
            "acceptance_rate": c.acceptance_rate,
            "admission_info": c.admission_info,
            "website_url": c.website_url,
            "image_url": c.image_url,
            "is_featured": c.is_featured,
            "is_shortlisted": c.id in shortlisted_ids
        })

    return results

@router.post("/shortlist/{college_id}")
def toggle_shortlist_college(
    college_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    college = db.query(College).filter(College.id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found.")

    existing = db.query(ShortlistedCollege).filter(
        ShortlistedCollege.user_id == current_user.id,
        ShortlistedCollege.college_id == college_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"shortlisted": False, "message": f"{college.name} removed from your shortlist."}
    else:
        new_shortlist = ShortlistedCollege(user_id=current_user.id, college_id=college_id)
        db.add(new_shortlist)
        db.commit()
        return {"shortlisted": True, "message": f"{college.name} added to your shortlist!"}
