import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import User, Career, StudentSkill, LearningRoadmap, Assessment
from .recommendation import compute_career_recommendations
from .skill_gap import analyze_skill_gap

def generate_chat_response(
    user_id: int,
    user_message: str,
    db: Session
) -> Dict[str, Any]:
    """
    Intelligent Career Assistant engine with comprehensive local knowledge base,
    direct integration with student profile, skills, assessments, and roadmaps.
    """
    text = user_message.strip().lower()
    user = db.query(User).filter(User.id == user_id).first()
    student_skills = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skill_names = [s.skill_name for s in student_skills]

    # Intent 1: "Which career suits my skills?" / Recommendation query
    if any(q in text for q in ["suit my skill", "which career", "recommend a career", "what career", "best career for me", "where should i work"]):
        recs = compute_career_recommendations(user_id=user_id, db=db, save_to_db=False)
        if recs:
            top_rec = recs[0]
            second_rec = recs[1] if len(recs) > 1 else None
            reply = (
                f"Based on your profile and skills ({', '.join(user_skill_names[:4]) if user_skill_names else 'your registered skills'}), "
                f"your top matching career is **{top_rec['career'].title}** with a **{top_rec['match_percentage']}% match score**!\n\n"
                f"**Why this fits you:** {top_rec['why_match']}\n\n"
                f"**Key Matching Skills:** {', '.join(top_rec['matching_skills']) if top_rec['matching_skills'] else 'Foundational background'}\n"
                f"**Skills to Master Next:** {', '.join(top_rec['missing_skills'][:3]) if top_rec['missing_skills'] else 'Advanced production workflows'}\n\n"
            )
            if second_rec:
                reply += f"Another great alternative is **{second_rec['career'].title}** ({second_rec['match_percentage']}% match)."
            
            return {
                "reply": reply,
                "intent_tag": "career_recommendation",
                "suggested_actions": [
                    "What skills am I missing?",
                    f"Suggest a roadmap for {top_rec['career'].title}",
                    "How to prepare for tech interviews?"
                ],
                "career_suggestions": [
                    {"title": r["career"].title, "match": r["match_percentage"]} for r in recs[:3]
                ]
            }

    # Intent 2: "How can I become an AI Engineer?" or "How to become a <career>?"
    target_career_name = None
    all_careers = db.query(Career).all()
    for c in all_careers:
        if c.title.lower() in text or c.slug.replace("-", " ") in text:
            target_career_name = c.title
            break

    if "ai engineer" in text or "artificial intelligence" in text:
        target_career_name = "AI Engineer"
    elif "full stack" in text or "web developer" in text:
        target_career_name = "Full Stack Developer"
    elif "data scientist" in text:
        target_career_name = "Data Scientist"
    elif "data analyst" in text:
        target_career_name = "Data Analyst"
    elif "cybersecurity" in text or "security" in text:
        target_career_name = "Cybersecurity Analyst"
    elif "cloud" in text:
        target_career_name = "Cloud Engineer"
    elif "ui/ux" in text or "designer" in text:
        target_career_name = "UI/UX Designer"
    elif "python developer" in text:
        target_career_name = "Python Developer"

    if any(q in text for q in ["how can i become", "how to become", "steps to become", "how to be an", "become an"]):
        c_name = target_career_name or "AI Engineer"
        career_obj = db.query(Career).filter(Career.title.ilike(f"%{c_name}%")).first()
        req_tech = career_obj.required_tech if career_obj else "Python, PyTorch, Transformers, LangChain, REST APIs"
        reply = (
            f"### How to become a high-impact **{c_name}**:\n\n"
            f"1. **Core Foundations**: Deep understanding of Python programming, algorithms, and modular object-oriented architecture.\n"
            f"2. **Specialized Toolchain**: Master **{req_tech}**.\n"
            f"3. **Hands-on Projects**: Build end-to-end applications solving real business problems (deploy on cloud with Docker).\n"
            f"4. **Portfolio & GitHub**: Document your projects with live demos, API docs, and architectural diagrams.\n"
            f"5. **System Design & Interview Prep**: Practice behavioral questions, coding challenges, and scalable architecture design.\n\n"
            f"Would you like me to generate a personalized 7-phase learning roadmap for {c_name}?"
        )
        return {
            "reply": reply,
            "intent_tag": "career_pathway",
            "suggested_actions": [
                f"Suggest a roadmap for {c_name}",
                f"What skills am I missing for {c_name}?",
                "Which colleges offer good programs for this?"
            ],
            "career_suggestions": []
        }

    # Intent 3: "What skills am I missing?"
    if any(q in text for q in ["skill am i missing", "missing skill", "skill gap", "what do i lack", "what should i learn"]):
        # Find active roadmap or recommended career
        active_roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == user_id, LearningRoadmap.is_active == True).first()
        career_to_check = None
        if target_career_name:
            career_to_check = db.query(Career).filter(Career.title.ilike(f"%{target_career_name}%")).first()
        elif active_roadmap:
            career_to_check = active_roadmap.career
        else:
            career_to_check = db.query(Career).first()

        if career_to_check:
            gap = analyze_skill_gap(user_id=user_id, career_id=career_to_check.id, db=db)
            missing = [item for item in gap["gap_items"] if not item["existing"] or item["priority"] in ["Critical", "High"]]
            
            missing_bullet_points = "\n".join([
                f"- **{m['skill_name']}** ({m['priority']} Priority): {m['improvement_tip']}"
                for m in missing[:4]
            ])
            
            reply = (
                f"### Skill Gap Analysis for **{career_to_check.title}**\n\n"
                f"- **Current Readiness Score:** {gap['readiness_score']}%\n"
                f"- **Verified Skills:** {gap['existing_skills_count']} of {len(gap['gap_items'])}\n\n"
                f"**Top Skills to Focus On:**\n"
                f"{missing_bullet_points if missing_bullet_points else 'You have satisfied the key foundational requirements! Focus on polishing production deployment.'}\n\n"
                f"Check the **Skill Gap Analysis** tab in the dashboard for interactive comparison charts!"
            )
            return {
                "reply": reply,
                "intent_tag": "skill_gap",
                "suggested_actions": [
                    f"Suggest a roadmap for {career_to_check.title}",
                    "Show learning resources for these skills",
                    "Which career suits my skills?"
                ],
                "career_suggestions": []
            }

    # Intent 4: "Suggest a roadmap for <career>"
    if any(q in text for q in ["roadmap", "learning path", "curriculum", "study plan"]):
        c_name = target_career_name or "Data Science"
        reply = (
            f"### Comprehensive 7-Phase Learning Roadmap for **{c_name}**:\n\n"
            f"- **Phase 1: Foundations & Core Language** (Syntax, Git, Clean Code)\n"
            f"- **Phase 2: Data Structures & Algorithmic Thinking** (Arrays, Trees, Big-O Complexity)\n"
            f"- **Phase 3: Domain Specialization & Frameworks** (Key libraries & industry-standard patterns)\n"
            f"- **Phase 4: Database Design & Backend REST APIs** (SQL, Schema Optimization, FastAPI/Node)\n"
            f"- **Phase 5: Cloud Deployment & DevOps** (Docker containerization, CI/CD, Cloud hosting)\n"
            f"- **Phase 6: Real-World Capstone Project** (Full-stack end-to-end production build)\n"
            f"- **Phase 7: Career Readiness & Interview Prep** (System design, resume review, mock interviews)\n\n"
            f"You can view, track, and check off individual weekly tasks on the **Learning Roadmap** page!"
        )
        return {
            "reply": reply,
            "intent_tag": "roadmap_suggestion",
            "suggested_actions": [
                f"Show resources for {c_name}",
                "How to prepare for tech interviews?",
                "What skills am I missing?"
            ],
            "career_suggestions": []
        }

    # Intent 5: Resume & Interview Guidance
    if any(q in text for q in ["resume", "cv", "portfolio"]):
        reply = (
            "### Essential Resume Tips for Tech & Career Success:\n\n"
            "1. **Use the STAR Method**: For each bullet point, state **Situation, Task, Action, and Measurable Result** (e.g., 'Improved API response time by 42% by indexing SQL queries').\n"
            "2. **Lead with Technical Skills**: Group skills logically into Languages, Frameworks, Cloud & Databases, and Tools.\n"
            "3. **Showcase 2-3 High-Quality Projects**: Include live deployment URLs, GitHub repository links, and architecture diagrams.\n"
            "4. **Keep it Clean & Scannable**: Use single-column ATS-friendly formats, strong action verbs, and consistent typography.\n"
            "5. **Tailor for Target Job**: Align your project keywords with the job description requirements."
        )
        return {
            "reply": reply,
            "intent_tag": "resume_guidance",
            "suggested_actions": [
                "How to prepare for tech interviews?",
                "Which career suits my skills?",
                "What skills am I missing?"
            ],
            "career_suggestions": []
        }

    if any(q in text for q in ["interview", "mock interview", "coding test", "interview prep"]):
        reply = (
            "### Strategic Interview Preparation Framework:\n\n"
            "1. **Data Structures & Algorithms**: Master two pointers, sliding window, BFS/DFS, hash maps, and binary search.\n"
            "2. **System Design (for Junior/Mid)**: Practice modular thinking, database normalization, caching layers, and API contract design.\n"
            "3. **Behavioral Questions**: Prepare 4-5 core stories covering leadership, overcoming technical setbacks, resolving conflicts, and project delivery under tight deadlines.\n"
            "4. **Live Coding Mindset**: Always communicate your thought process aloud before writing code, validate edge cases, and analyze Big-O time and space complexity.\n"
            "5. **Ask Insightful Questions**: Inquire about team engineering culture, deployment pipelines, and upcoming technical challenges."
        )
        return {
            "reply": reply,
            "intent_tag": "interview_prep",
            "suggested_actions": [
                "Suggest a roadmap for Python Developer",
                "What skills am I missing?",
                "Which career suits my skills?"
            ],
            "career_suggestions": []
        }

    # Intent 6: Colleges / Higher Education
    if any(q in text for q in ["college", "university", "admission", "higher study", "masters", "b.tech"]):
        reply = (
            "### Higher Education & College Discovery:\n\n"
            "When selecting top institutions for computer science, data science, and AI, consider:\n"
            "- **Faculty & Research Labs**: Look for active publications in top conferences (NeurIPS, ICML, CVPR, SIGMOD).\n"
            "- **Industry Partnerships & Placement**: Check historical alumni hiring at top tech hubs.\n"
            "- **Curriculum Modernity**: Programs offering electives in Distributed Systems, Generative AI, and Cloud Architecture.\n\n"
            "Explore our **College Search** module in the sidebar to search, filter by degree/ranking, and shortlist premier institutions!"
        )
        return {
            "reply": reply,
            "intent_tag": "college_guidance",
            "suggested_actions": [
                "Open College Search",
                "Which career suits my skills?",
                "Suggest a roadmap for AI Engineer"
            ],
            "career_suggestions": []
        }

    # Default / General career assistant response
    user_name = user.full_name if user else "there"
    reply = (
        f"Hello {user_name}! I'm **CareerWithinU AI**, your dedicated career and technical mentor.\n\n"
        f"I can help you:\n"
        f"1. **Match Careers** based on your current skills and interests.\n"
        f"2. **Detect Skill Gaps** and provide customized improvement tips.\n"
        f"3. **Explore Personalized Learning Roadmaps** with step-by-step milestones.\n"
        f"4. **Find Curated Resources & Colleges** tailored to your educational goals.\n"
        f"5. **Prepare for Technical Interviews & Resumes** with actionable frameworks.\n\n"
        f"Feel free to ask any question or tap one of the suggested prompts below!"
    )
    return {
        "reply": reply,
        "intent_tag": "general_guidance",
        "suggested_actions": [
            "Which career suits my skills?",
            "How can I become an AI Engineer?",
            "What skills am I missing?",
            "Suggest a roadmap for Data Science",
            "Which career has opportunities for my interests?"
        ],
        "career_suggestions": []
    }
