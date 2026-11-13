import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# Auth & User
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class StudentProfileOut(BaseModel):
    degree: Optional[str] = None
    specialization: Optional[str] = None
    graduation_year: Optional[int] = None
    bio: Optional[str] = None
    target_role: Optional[str] = None
    phone: Optional[str] = None
    college_name: Optional[str] = None
    city: Optional[str] = None

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime.datetime
    profile: Optional[StudentProfileOut] = None

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    degree: Optional[str] = None
    specialization: Optional[str] = None
    graduation_year: Optional[int] = None
    bio: Optional[str] = None
    target_role: Optional[str] = None
    phone: Optional[str] = None
    college_name: Optional[str] = None
    city: Optional[str] = None

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserOut

# Skills
class StudentSkillBase(BaseModel):
    skill_name: str
    proficiency: str = "Intermediate"
    score: float = 75.0
    category: str = "Technical"

class StudentSkillCreate(StudentSkillBase):
    pass

class StudentSkillOut(StudentSkillBase):
    id: int
    class Config:
        from_attributes = True

# Career & Recommendation
class CareerSkillRequirementOut(BaseModel):
    skill_name: str
    required_level: str
    importance: str

    class Config:
        from_attributes = True

class CareerOut(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    description: str
    average_salary: str
    growth_rate: str
    required_education: str
    job_responsibilities: str
    opportunities: str
    learning_recommendations: str
    required_tech: str
    icon: Optional[str] = "Code"
    is_featured: bool
    skills: List[CareerSkillRequirementOut] = []

    class Config:
        from_attributes = True

class CareerRecommendationOut(BaseModel):
    career_id: int
    career: CareerOut
    match_percentage: float
    why_match: str
    matching_skills: List[str]
    missing_skills: List[str]
    is_saved: bool = False

class SkillGapItem(BaseModel):
    skill_name: str
    existing: bool
    student_level: Optional[str] = "None"
    student_score: float = 0.0
    required_level: str = "Intermediate"
    required_score: float = 75.0
    priority: str = "Medium"  # Critical, High, Medium, Low
    improvement_tip: str

class SkillGapAnalysisOut(BaseModel):
    career_title: str
    overall_match_percentage: float
    readiness_score: float
    existing_skills_count: int
    missing_skills_count: int
    gap_items: List[SkillGapItem]

# Assessment
class AssessmentSubmission(BaseModel):
    title: str = "Career Aptitude & Skill Assessment"
    assessment_type: str = "comprehensive"
    education_level: Optional[str] = None
    degree: Optional[str] = None
    specialization: Optional[str] = None
    technical_skills: List[Dict[str, Any]] = []  # [{"name": "Python", "proficiency": "Intermediate", "score": 80}]
    soft_skills: List[str] = []
    interests: List[str] = []
    strengths: List[str] = []
    preferred_industries: List[str] = []
    career_goals: Optional[str] = None
    answers: Dict[str, Any] = {}

class AssessmentOut(BaseModel):
    id: int
    user_id: int
    title: str
    assessment_type: str
    score: float
    max_score: float
    progress: int
    status: str
    summary: Optional[str] = None
    completed_at: datetime.datetime

    class Config:
        from_attributes = True

# Roadmap
class RoadmapTaskOut(BaseModel):
    id: int
    phase_number: int
    phase_title: str
    task_title: str
    task_description: Optional[str] = None
    resource_url: Optional[str] = None
    estimated_hours: int
    is_completed: bool
    completed_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class LearningRoadmapOut(BaseModel):
    id: int
    career_id: int
    title: str
    description: Optional[str] = None
    progress_percentage: float
    current_phase: int
    total_phases: int
    is_active: bool
    tasks: List[RoadmapTaskOut] = []

    class Config:
        from_attributes = True

# College
class CollegeOut(BaseModel):
    id: int
    name: str
    location: str
    state: str
    country: str
    ranking: int
    degrees_offered: List[str]
    specializations: List[str]
    fees_per_year: str
    rating: float
    acceptance_rate: str
    admission_info: str
    website_url: str
    image_url: Optional[str] = None
    is_featured: bool
    is_shortlisted: bool = False

# Resources
class LearningResourceOut(BaseModel):
    id: int
    title: str
    category: str
    format: str
    url: str
    description: str
    difficulty: str
    rating: float
    duration: str
    provider: str

    class Config:
        from_attributes = True

# Jobs
class JobOpportunityOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    job_type: str
    experience_level: str
    salary_range: str
    skills_required: List[str]
    description: str
    apply_url: str
    is_demo: bool
    posted_date: str

# Chat
class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatMessageOut(BaseModel):
    id: int
    sender: str
    message: str
    timestamp: datetime.datetime
    intent_tag: Optional[str] = None

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    reply: str
    intent_tag: str
    suggested_actions: List[str] = []
    career_suggestions: List[Dict[str, Any]] = []

# Admin
class AdminStatsOut(BaseModel):
    total_students: int
    total_assessments: int
    total_careers: int
    total_roadmaps_active: int
    top_careers: List[Dict[str, Any]]
    top_skills_in_demand: List[Dict[str, Any]]
    recent_assessments: List[Dict[str, Any]]
