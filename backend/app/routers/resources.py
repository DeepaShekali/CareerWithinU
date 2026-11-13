from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LearningResource
from ..schemas import LearningResourceOut

router = APIRouter(prefix="/api/resources", tags=["Learning Resources"])

@router.get("", response_model=List[LearningResourceOut])
def get_learning_resources(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search resource title or description"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    db: Session = Depends(get_db)
):
    query = db.query(LearningResource)

    if category and category != "All":
        query = query.filter(LearningResource.category.ilike(f"%{category.strip()}%"))
    if difficulty and difficulty != "All":
        query = query.filter(LearningResource.difficulty.ilike(f"%{difficulty.strip()}%"))
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (LearningResource.title.ilike(search_filter)) |
            (LearningResource.description.ilike(search_filter)) |
            (LearningResource.provider.ilike(search_filter))
        )

    return query.order_by(LearningResource.rating.desc()).all()
