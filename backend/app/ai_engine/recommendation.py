import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from ..models import Career, StudentSkill, StudentInterest, Assessment, CareerRecommendation

# Level to numeric score conversion
LEVEL_WEIGHTS = {
    "beginner": 0.5,
    "intermediate": 0.8,
    "advanced": 1.0,
    "expert": 1.1
}

def normalize_text(text: str) -> str:
    return text.strip().lower()

def compute_career_recommendations(
    user_id: int,
    db: Session,
    save_to_db: bool = True
) -> List[Dict[str, Any]]:
    """
    Computes top career recommendations for a student using a transparent weighted 
    multi-dimensional matching algorithm:
    1. Skill Vector Overlap (Weighted by importance and proficiency level)
    2. Interest Alignment (Domain overlap)
    3. Assessment Aptitude & Specialization Factors
    """
    # 1. Fetch student data
    student_skills = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    student_interests = db.query(StudentInterest).filter(StudentInterest.user_id == user_id).all()
    latest_assessment = db.query(Assessment).filter(Assessment.user_id == user_id).order_by(Assessment.completed_at.desc()).first()

    # Map student skills for fast lookup: {normalized_name: (proficiency_weight, score)}
    user_skill_map = {}
    for s in student_skills:
        s_name = normalize_text(s.skill_name)
        weight = LEVEL_WEIGHTS.get(normalize_text(s.proficiency), 0.7)
        user_skill_map[s_name] = (weight, s.score)

    user_interests = {normalize_text(i.interest_name) for i in student_interests}

    # If student took an assessment, enrich skills/interests from assessment answers if available
    assessment_score_factor = 1.0
    if latest_assessment and latest_assessment.answers_json:
        try:
            answers = json.loads(latest_assessment.answers_json)
            # Add technical skills from assessment if not already present
            if "technical_skills" in answers and isinstance(answers["technical_skills"], list):
                for item in answers["technical_skills"]:
                    if isinstance(item, dict):
                        name = normalize_text(item.get("name", ""))
                        if name and name not in user_skill_map:
                            prof = item.get("proficiency", "Intermediate")
                            score = float(item.get("score", 70.0))
                            user_skill_map[name] = (LEVEL_WEIGHTS.get(normalize_text(prof), 0.7), score)
            if "interests" in answers and isinstance(answers["interests"], list):
                for interest in answers["interests"]:
                    user_interests.add(normalize_text(str(interest)))
            if latest_assessment.score:
                assessment_score_factor = min(1.15, max(0.85, latest_assessment.score / 100.0 * 1.1))
        except Exception:
            pass

    # 2. Evaluate all careers
    all_careers = db.query(Career).all()
    scored_careers: List[Dict[str, Any]] = []

    for career in all_careers:
        career_reqs = career.skills
        if not career_reqs:
            continue

        matched_skills = []
        missing_skills = []
        total_career_weight = 0.0
        student_match_score = 0.0

        for req in career_reqs:
            req_name = normalize_text(req.skill_name)
            req_weight = req.weight if req.weight else 1.0
            if req.importance == "Critical":
                req_weight *= 1.4
            elif req.importance == "High":
                req_weight *= 1.2
            total_career_weight += req_weight

            # Check if student has skill
            found = False
            for u_skill_name, (u_weight, u_score) in user_skill_map.items():
                if req_name in u_skill_name or u_skill_name in req_name:
                    found = True
                    matched_skills.append(req.skill_name)
                    # Quality of match based on proficiency
                    req_level_weight = LEVEL_WEIGHTS.get(normalize_text(req.required_level), 0.8)
                    proficiency_ratio = min(1.0, u_weight / req_level_weight)
                    score_factor = (u_score / 100.0)
                    student_match_score += req_weight * (0.6 * proficiency_ratio + 0.4 * score_factor)
                    break
            
            if not found:
                missing_skills.append(req.skill_name)

        # Base skill match percentage (0 to 100)
        base_skill_match = (student_match_score / total_career_weight * 100.0) if total_career_weight > 0 else 50.0

        # Interest & Category alignment boost
        interest_boost = 0.0
        career_cat = normalize_text(career.category)
        career_title = normalize_text(career.title)
        for interest in user_interests:
            if interest in career_cat or interest in career_title or career_title in interest:
                interest_boost += 6.0
            elif any(interest in normalize_text(m) for m in matched_skills):
                interest_boost += 3.0

        interest_boost = min(15.0, interest_boost)

        # Final calculated percentage (bounded between 45% and 98%)
        final_percentage = (base_skill_match * 0.75) + interest_boost + (assessment_score_factor * 10.0)
        final_percentage = round(min(97.5, max(42.0, final_percentage)), 1)

        # Generate transparent explanation
        if len(matched_skills) >= 3:
            why_match = (
                f"Strong alignment in core requirements: {', '.join(matched_skills[:3])}. "
                f"Your background and technical strengths show high aptitude for {career.title}."
            )
        elif len(matched_skills) >= 1:
            why_match = (
                f"Solid foundational match with {', '.join(matched_skills)}. "
                f"Developing skills in {', '.join(missing_skills[:2]) if missing_skills else 'advanced workflows'} "
                f"will accelerate your readiness."
            )
        else:
            why_match = (
                f"Great growth pathway aligned with your technology curiosity. "
                f"Focus on mastering {', '.join(missing_skills[:3]) if missing_skills else 'core tools'} to get started."
            )

        scored_careers.append({
            "career_id": career.id,
            "career": career,
            "match_percentage": final_percentage,
            "why_match": why_match,
            "matching_skills": matched_skills,
            "missing_skills": missing_skills,
        })

    # Sort descending by match percentage
    scored_careers.sort(key=lambda x: x["match_percentage"], reverse=True)
    top_5 = scored_careers[:5]

    # Save to database if requested
    if save_to_db:
        # Clear previous recommendations for user to avoid stale recommendations
        db.query(CareerRecommendation).filter(CareerRecommendation.user_id == user_id).delete()
        for item in top_5:
            rec = CareerRecommendation(
                user_id=user_id,
                career_id=item["career_id"],
                match_percentage=item["match_percentage"],
                why_match=item["why_match"],
                matching_skills_json=json.dumps(item["matching_skills"]),
                missing_skills_json=json.dumps(item["missing_skills"]),
            )
            db.add(rec)
        db.commit()

    return top_5
