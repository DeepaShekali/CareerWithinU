import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # "student" or "admin"
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="user", cascade="all, delete-orphan")
    interests = relationship("StudentInterest", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("CareerRecommendation", back_populates="user", cascade="all, delete-orphan")
    saved_careers = relationship("SavedCareer", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="user", cascade="all, delete-orphan")
    shortlisted_colleges = relationship("ShortlistedCollege", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    degree = Column(String(255), default="B.Tech / B.E.")
    specialization = Column(String(255), default="Computer Science & Engineering")
    graduation_year = Column(Integer, default=2026)
    bio = Column(Text, default="Aspiring technologist enthusiastic about AI, modern web stacks, and solving real-world challenges.")
    target_role = Column(String(255), default="AI Engineer")
    phone = Column(String(50), default="+1 (555) 234-5678")
    college_name = Column(String(255), default="Stanford University / MIT Institute")
    city = Column(String(100), default="San Francisco, CA")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    score = Column(Float, default=70.0)  # 0 - 100
    category = Column(String(50), default="Technical")  # Technical, Soft, Tool

    user = relationship("User", back_populates="skills")


class StudentInterest(Base):
    __tablename__ = "student_interests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    interest_name = Column(String(100), nullable=False)

    user = relationship("User", back_populates="interests")


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, unique=True)
    slug = Column(String(255), nullable=False, unique=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    average_salary = Column(String(100), default="$115,000 - $165,000")
    growth_rate = Column(String(100), default="+24% (Very High)")
    required_education = Column(String(255), default="Bachelor's in Computer Science, Data or related field")
    job_responsibilities = Column(Text, default="Design, develop, test and optimize high-scale systems and models.")
    opportunities = Column(Text, default="Massive industry demand across tech startups, fintech, healthcare and global enterprise.")
    learning_recommendations = Column(Text, default="Focus on deep algorithmic foundations, system design, and hands-on portfolio projects.")
    required_tech = Column(Text, default="Python, PyTorch, Docker, Git, Cloud Services")
    icon = Column(String(50), default="Code")
    is_featured = Column(Boolean, default=True)

    skills = relationship("CareerSkillRequirement", back_populates="career", cascade="all, delete-orphan")


class CareerSkillRequirement(Base):
    __tablename__ = "career_skill_requirements"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    required_level = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    importance = Column(String(50), default="High")  # Critical, High, Medium, Nice-to-have
    weight = Column(Float, default=1.0)

    career = relationship("Career", back_populates="skills")


class CareerRecommendation(Base):
    __tablename__ = "career_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    match_percentage = Column(Float, nullable=False)
    why_match = Column(Text, nullable=False)
    matching_skills_json = Column(Text, default="[]")
    missing_skills_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
    career = relationship("Career")


class SavedCareer(Base):
    __tablename__ = "saved_careers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_careers")
    career = relationship("Career")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    assessment_type = Column(String(50), default="comprehensive")  # psychometric, career_aptitude, technical, comprehensive
    score = Column(Float, default=85.0)
    max_score = Column(Float, default=100.0)
    progress = Column(Integer, default=100)  # percentage
    status = Column(String(50), default="Completed")  # Completed, In Progress, Pending
    summary = Column(Text, nullable=True)
    answers_json = Column(Text, default="{}")
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="assessments")


class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    progress_percentage = Column(Float, default=0.0)
    current_phase = Column(Integer, default=1)
    total_phases = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
    career = relationship("Career")
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("learning_roadmaps.id"), nullable=False)
    phase_number = Column(Integer, nullable=False)
    phase_title = Column(String(255), nullable=False)
    task_title = Column(String(255), nullable=False)
    task_description = Column(Text, nullable=True)
    resource_url = Column(String(500), nullable=True)
    estimated_hours = Column(Integer, default=5)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("LearningRoadmap", back_populates="tasks")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # Python, Java, Web Development, Data Science, AI, etc.
    format = Column(String(50), default="Interactive Course")  # Video, Course, Documentation, Article, Project
    url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Beginner")  # Beginner, Intermediate, Advanced
    rating = Column(Float, default=4.8)
    duration = Column(String(50), default="6 hours")
    provider = Column(String(100), default="FreeCodeCamp / Official Docs")


class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    country = Column(String(100), default="USA")
    ranking = Column(Integer, default=1)
    degrees_offered_json = Column(Text, default="[\"B.Tech\", \"M.Tech\", \"MS\", \"Ph.D\"]")
    specializations_json = Column(Text, default="[\"Computer Science\", \"AI & ML\", \"Data Science\", \"Robotics\"]")
    fees_per_year = Column(String(100), default="$35,000 / year")
    rating = Column(Float, default=4.9)
    acceptance_rate = Column(String(50), default="7.5%")
    admission_info = Column(Text, default="Requires strong academic record, standardized test scores, SOP, and recommendation letters.")
    website_url = Column(String(500), default="https://example.edu")
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=True)


class ShortlistedCollege(Base):
    __tablename__ = "shortlisted_colleges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="shortlisted_colleges")
    college = relationship("College")


class JobOpportunity(Base):
    __tablename__ = "job_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    job_type = Column(String(50), default="Full-time")  # Full-time, Internship, Remote
    experience_level = Column(String(50), default="Entry Level")  # Entry Level, Associate, Junior
    salary_range = Column(String(100), default="$90,000 - $130,000")
    skills_required_json = Column(Text, default="[\"Python\", \"Git\", \"SQL\"]")
    description = Column(Text, nullable=False)
    apply_url = Column(String(500), default="https://example.com/careers/apply")
    is_demo = Column(Boolean, default=True)
    posted_date = Column(String(50), default="2 days ago")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String(100), default="default")
    sender = Column(String(50), nullable=False)  # "user" or "assistant"
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    intent_tag = Column(String(100), nullable=True)

    user = relationship("User", back_populates="chat_messages")
