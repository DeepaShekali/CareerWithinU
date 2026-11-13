import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JobOpportunity
from ..schemas import JobOpportunityOut

router = APIRouter(prefix="/api/jobs", tags=["Jobs & Internships"])

@router.get("", response_model=List[JobOpportunityOut])
def get_job_opportunities(
    job_type: Optional[str] = Query(None, description="Full-time or Internship"),
    search: Optional[str] = Query(None, description="Search by title, company, or skills"),
    db: Session = Depends(get_db)
):
    query = db.query(JobOpportunity)

    if job_type and job_type != "All":
        query = query.filter(JobOpportunity.job_type.ilike(f"%{job_type.strip()}%"))
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (JobOpportunity.title.ilike(search_filter)) |
            (JobOpportunity.company.ilike(search_filter)) |
            (JobOpportunity.location.ilike(search_filter))
        )

    jobs = query.all()
    results = []
    for j in jobs:
        try:
            skills = json.loads(j.skills_required_json)
        except Exception:
            skills = ["Python", "SQL"]

        results.append({
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "job_type": j.job_type,
            "experience_level": j.experience_level,
            "salary_range": j.salary_range,
            "skills_required": skills,
            "description": j.description,
            "apply_url": j.apply_url,
            "is_demo": j.is_demo,
            "posted_date": j.posted_date
        })

    return results
