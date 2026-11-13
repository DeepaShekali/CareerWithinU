from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models import Career, StudentSkill

LEVEL_SCORES = {
    "beginner": 45.0,
    "intermediate": 75.0,
    "advanced": 95.0,
    "expert": 100.0,
    "none": 0.0
}

IMPROVEMENT_TIPS = {
    "python": "Build 3 end-to-end Python projects including an API service, CLI tool, and automation script.",
    "fastapi": "Master asynchronous route handlers, Pydantic data validation, and dependency injection patterns.",
    "react": "Build responsive SPAs utilizing modern React Hooks, Context API, and Tailwind CSS styling.",
    "sql": "Practice indexing, complex joins, transactions, and relational schema optimization on PostgreSQL/SQLite.",
    "machine learning": "Train and evaluate supervised and unsupervised models using Scikit-Learn and cross-validation.",
    "deep learning": "Build CNN and Transformer models using PyTorch or TensorFlow on real image/text datasets.",
    "docker": "Containerize microservices, write optimized multi-stage Dockerfiles, and orchestrate with Docker Compose.",
    "git": "Practice git feature branching, interactive rebasing, merge conflict resolution, and GitHub Actions CI/CD.",
    "data structures": "Solve algorithmic challenges covering trees, graphs, dynamic programming, and binary search.",
    "cloud computing": "Deploy web applications and serverless functions to AWS/GCP with secure IAM policies.",
    "cybersecurity": "Study OWASP Top 10 vulnerabilities, penetration testing basics, and TLS/cryptography fundamentals.",
    "ui/ux design": "Design responsive Figma wireframes, component design systems, and conduct usability testing.",
    "data analysis": "Clean messy real-world datasets with Pandas and build interactive visual dashboards with Matplotlib/Seaborn.",
    "system design": "Study high-level architectural patterns: load balancers, caching, distributed messaging, and rate limiters."
}

def analyze_skill_gap(
    user_id: int,
    career_id: int,
    db: Session
) -> Dict[str, Any]:
    """
    Performs in-depth skill gap analysis between student's skillset and the target career.
    """
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise ValueError(f"Career with ID {career_id} not found.")

    student_skills = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skill_map = {}
    for s in student_skills:
        user_skill_map[s.skill_name.strip().lower()] = {
            "name": s.skill_name,
            "proficiency": s.proficiency,
            "score": s.score
        }

    gap_items: List[Dict[str, Any]] = []
    existing_count = 0
    missing_count = 0
    total_score_sum = 0.0
    total_max_sum = 0.0

    for req in career.skills:
        req_norm = req.skill_name.strip().lower()
        req_level = req.required_level or "Intermediate"
        req_target_score = LEVEL_SCORES.get(req_level.lower(), 75.0)
        total_max_sum += req_target_score

        # Check match in user skill map
        user_match = None
        for u_norm, u_data in user_skill_map.items():
            if req_norm in u_norm or u_norm in req_norm:
                user_match = u_data
                break

        # Find tailored tip or generic tip
        tip = None
        for key, val in IMPROVEMENT_TIPS.items():
            if key in req_norm:
                tip = val
                break
        if not tip:
            tip = f"Review foundational and practical tutorials for {req.skill_name} and build a dedicated mini-project."

        if user_match:
            existing_count += 1
            student_level = user_match["proficiency"]
            student_score = float(user_match["score"])
            total_score_sum += min(req_target_score, student_score)

            # Determine priority of remaining gap if any
            score_diff = req_target_score - student_score
            if score_diff > 20:
                priority = "High" if req.importance in ["Critical", "High"] else "Medium"
            elif score_diff > 0:
                priority = "Medium"
            else:
                priority = "Low (Mastered)"

            gap_items.append({
                "skill_name": req.skill_name,
                "existing": True,
                "student_level": student_level,
                "student_score": round(student_score, 1),
                "required_level": req_level,
                "required_score": round(req_target_score, 1),
                "priority": priority,
                "improvement_tip": tip if score_diff > 0 else f"You meet the benchmark! Continue maintaining proficiency."
            })
        else:
            missing_count += 1
            priority = "Critical" if req.importance == "Critical" else ("High" if req.importance == "High" else "Medium")
            gap_items.append({
                "skill_name": req.skill_name,
                "existing": False,
                "student_level": "Missing",
                "student_score": 0.0,
                "required_level": req_level,
                "required_score": round(req_target_score, 1),
                "priority": priority,
                "improvement_tip": tip
            })

    # Calculate overall readiness
    readiness_score = round((total_score_sum / total_max_sum * 100.0), 1) if total_max_sum > 0 else 50.0
    overall_match = round(min(98.0, max(35.0, (existing_count / max(1, len(career.skills)) * 80.0) + (readiness_score * 0.2))), 1)

    # Sort gaps so critical and high priority items appear first
    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low (Mastered)": 3}
    gap_items.sort(key=lambda x: priority_order.get(x["priority"], 4))

    return {
        "career_title": career.title,
        "overall_match_percentage": overall_match,
        "readiness_score": readiness_score,
        "existing_skills_count": existing_count,
        "missing_skills_count": missing_count,
        "gap_items": gap_items
    }
