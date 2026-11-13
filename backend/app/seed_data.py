import json
import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    User, StudentProfile, StudentSkill, StudentInterest, Career, CareerSkillRequirement,
    Assessment, LearningRoadmap, RoadmapTask, LearningResource, College, ShortlistedCollege,
    JobOpportunity, ChatMessage, SavedCareer
)
from .auth import hash_password
from .ai_engine.recommendation import compute_career_recommendations

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.email == "student@careerwithinu.com").first():
        print("Database already seeded.")
        return

    print("Seeding CareerWithinU database...")

    # 1. Create Demo Users
    demo_student = User(
        email="student@careerwithinu.com",
        password_hash=hash_password("student123"),
        full_name="Alex Rivera",
        role="student",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=14)
    )
    demo_admin = User(
        email="admin@careerwithinu.com",
        password_hash=hash_password("admin123"),
        full_name="Dr. Sarah Jenkins",
        role="admin",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=30)
    )
    db.add_all([demo_student, demo_admin])
    db.commit()
    db.refresh(demo_student)
    db.refresh(demo_admin)

    # 2. Student Profile
    profile = StudentProfile(
        user_id=demo_student.id,
        degree="B.Tech Computer Science & Engineering",
        specialization="Artificial Intelligence & Machine Learning",
        graduation_year=2026,
        bio="Passionate 3rd-year CS student focusing on predictive modeling, modern web applications, and generative AI systems.",
        target_role="AI Engineer",
        phone="+1 (555) 789-2026",
        college_name="California Institute of Technology (Caltech)",
        city="Pasadena, CA"
    )
    db.add(profile)

    # 3. Student Skills
    student_skills_data = [
        ("Python", "Advanced", 92.0, "Technical"),
        ("Data Structures", "Intermediate", 84.0, "Technical"),
        ("Machine Learning", "Intermediate", 80.0, "Technical"),
        ("SQL", "Intermediate", 78.0, "Technical"),
        ("React.js", "Intermediate", 76.0, "Technical"),
        ("Git & GitHub", "Advanced", 90.0, "Technical"),
        ("Problem Solving", "Advanced", 88.0, "Soft"),
        ("Team Collaboration", "Advanced", 85.0, "Soft"),
        ("Communication", "Intermediate", 82.0, "Soft"),
    ]
    for name, prof, score, cat in student_skills_data:
        db.add(StudentSkill(
            user_id=demo_student.id,
            skill_name=name,
            proficiency=prof,
            score=score,
            category=cat
        ))

    # 4. Student Interests
    interests_data = ["Artificial Intelligence", "Machine Learning", "Full Stack Development", "Cloud Architecture", "Data Science"]
    for item in interests_data:
        db.add(StudentInterest(user_id=demo_student.id, interest_name=item))

    # 5. Careers & Skill Requirements
    careers_data = [
        {
            "title": "AI Engineer",
            "slug": "ai-engineer",
            "category": "Artificial Intelligence",
            "description": "Designs and builds intelligent systems, deep neural networks, LLM pipelines, and computer vision models deployed at enterprise scale.",
            "average_salary": "$135,000 - $185,000",
            "growth_rate": "+38% (Explosive)",
            "required_education": "Bachelor's or Master's in Computer Science, AI, or Data Science",
            "job_responsibilities": "Develop production ML pipelines, fine-tune transformer models, implement RAG systems, and optimize latency on GPU clusters.",
            "opportunities": "Tremendous demand in AI startups, big tech labs, autonomous systems, healthcare, and robotics.",
            "learning_recommendations": "Master PyTorch, transformer architectures, vector embeddings, LangChain, and containerized deployment with Docker & Kubernetes.",
            "required_tech": "Python, PyTorch, LangChain, HuggingFace, Docker, Vector DBs, FastAPI",
            "icon": "Cpu",
            "is_featured": True,
            "skills": [
                ("Python", "Advanced", "Critical", 1.5),
                ("Machine Learning", "Advanced", "Critical", 1.4),
                ("Deep Learning", "Intermediate", "High", 1.3),
                ("Data Structures", "Intermediate", "High", 1.2),
                ("FastAPI", "Intermediate", "Medium", 1.0),
                ("Docker", "Intermediate", "High", 1.1),
                ("Git & GitHub", "Intermediate", "Medium", 1.0),
                ("SQL", "Intermediate", "Medium", 1.0),
            ]
        },
        {
            "title": "Full Stack Developer",
            "slug": "full-stack-developer",
            "category": "Software Engineering",
            "description": "Architects and develops both frontend user interfaces and resilient backend REST APIs and microservices.",
            "average_salary": "$110,000 - $155,000",
            "growth_rate": "+25% (Very High)",
            "required_education": "Bachelor's in Computer Science, Software Engineering, or equivalent experience",
            "job_responsibilities": "Build responsive SPAs, design scalable database schemas, write secure authentication endpoints, and automate deployments.",
            "opportunities": "Universal industry need spanning SaaS platforms, e-commerce giants, fintech, and digital agencies.",
            "learning_recommendations": "Deepen React/Next.js skills, master relational databases, and learn async API design with FastAPI or Node.js.",
            "required_tech": "React.js, Node.js, Python/FastAPI, PostgreSQL, TypeScript, Tailwind CSS, Docker",
            "icon": "Code",
            "is_featured": True,
            "skills": [
                ("React.js", "Advanced", "Critical", 1.4),
                ("Python", "Intermediate", "High", 1.2),
                ("SQL", "Intermediate", "Critical", 1.3),
                ("Data Structures", "Intermediate", "High", 1.1),
                ("Git & GitHub", "Advanced", "High", 1.1),
                ("FastAPI", "Intermediate", "High", 1.1),
                ("Docker", "Beginner", "Medium", 0.9),
                ("Problem Solving", "Advanced", "Medium", 1.0),
            ]
        },
        {
            "title": "Data Scientist",
            "slug": "data-scientist",
            "category": "Data & Analytics",
            "description": "Applies statistical modeling, exploratory data analysis, and predictive machine learning to solve strategic business challenges.",
            "average_salary": "$125,000 - $170,000",
            "growth_rate": "+31% (Very High)",
            "required_education": "Degree in Data Science, Statistics, Mathematics, or Computer Science",
            "job_responsibilities": "Formulate hypotheses, extract insights from multi-terabyte datasets, build predictive regression/classification models, and communicate findings to executives.",
            "opportunities": "Dominant across fintech, healthcare analytics, recommendation platforms, and supply chain logistics.",
            "learning_recommendations": "Solidify statistical inference, experimental A/B testing, Scikit-Learn, Pandas, and interactive storytelling with data visualizers.",
            "required_tech": "Python, Pandas, NumPy, Scikit-Learn, SQL, Tableau, Statistics",
            "icon": "Database",
            "is_featured": True,
            "skills": [
                ("Python", "Advanced", "Critical", 1.4),
                ("Machine Learning", "Advanced", "Critical", 1.4),
                ("SQL", "Advanced", "Critical", 1.3),
                ("Data Analysis", "Advanced", "High", 1.3),
                ("Statistics", "Intermediate", "High", 1.2),
                ("Git & GitHub", "Intermediate", "Medium", 1.0),
                ("Communication", "Advanced", "High", 1.1),
            ]
        },
        {
            "title": "Machine Learning Engineer",
            "slug": "machine-learning-engineer",
            "category": "Artificial Intelligence",
            "description": "Bridges the gap between research prototypes and high-throughput production ML systems and data pipelines.",
            "average_salary": "$138,000 - $190,000",
            "growth_rate": "+36% (Explosive)",
            "required_education": "Degree in Computer Science, Machine Learning, or Computational Mathematics",
            "job_responsibilities": "Optimize model inference latency, maintain automated feature stores, implement MLOps monitoring, and scale batch prediction jobs.",
            "opportunities": "Huge across autonomous driving, speech recognition, recommendation engines, and ad-tech.",
            "learning_recommendations": "Master MLOps tools (MLflow, Kubeflow), model quantization (ONNX, TensorRT), and robust distributed systems.",
            "required_tech": "Python, PyTorch, Scikit-Learn, Docker, MLflow, Kubernetes, AWS/GCP",
            "icon": "Binary",
            "is_featured": True,
            "skills": [
                ("Python", "Advanced", "Critical", 1.5),
                ("Machine Learning", "Advanced", "Critical", 1.5),
                ("Data Structures", "Advanced", "High", 1.3),
                ("Docker", "Intermediate", "High", 1.2),
                ("SQL", "Intermediate", "Medium", 1.0),
                ("Git & GitHub", "Advanced", "High", 1.1),
            ]
        },
        {
            "title": "Python Developer",
            "slug": "python-developer",
            "category": "Backend Engineering",
            "description": "Specializes in building backend web services, automation scripts, data integration pipelines, and scalable APIs using Python.",
            "average_salary": "$105,000 - $145,000",
            "growth_rate": "+22% (High)",
            "required_education": "Bachelor's in Computer Science, Information Technology, or relevant background",
            "job_responsibilities": "Write clean, testable code, develop FastAPI/Django endpoints, optimize database queries, and integrate third-party web services.",
            "opportunities": "Widely employed in tech companies, enterprise automation, web dev consultancies, and cloud service providers.",
            "learning_recommendations": "Master asynchronous Python (asyncio), OOP design patterns, pytest testing suite, and database ORMs like SQLAlchemy.",
            "required_tech": "Python, FastAPI, Django, PostgreSQL, Redis, Pytest, Docker",
            "icon": "Terminal",
            "is_featured": True,
            "skills": [
                ("Python", "Advanced", "Critical", 1.6),
                ("SQL", "Intermediate", "Critical", 1.3),
                ("FastAPI", "Intermediate", "High", 1.2),
                ("Data Structures", "Intermediate", "High", 1.2),
                ("Git & GitHub", "Advanced", "High", 1.1),
                ("Docker", "Beginner", "Medium", 0.9),
                ("Problem Solving", "Intermediate", "Medium", 1.0),
            ]
        },
        {
            "title": "Data Analyst",
            "slug": "data-analyst",
            "category": "Data & Analytics",
            "description": "Translates complex numerical data into clear, actionable business insights and executive dashboards.",
            "average_salary": "$85,000 - $120,000",
            "growth_rate": "+23% (High)",
            "required_education": "Bachelor's in Business Analytics, Computer Science, Economics, or Mathematics",
            "job_responsibilities": "Run exploratory SQL queries, create Power BI/Tableau dashboards, identify KPI trends, and summarize findings for stakeholders.",
            "opportunities": "Ubiquitous role across retail, e-commerce, banking, consulting, and government organizations.",
            "learning_recommendations": "Excel at advanced SQL window functions, statistical summaries, Pandas data wrangling, and dashboard aesthetics.",
            "required_tech": "SQL, Excel, Tableau, Power BI, Python, Pandas",
            "icon": "BarChart",
            "is_featured": False,
            "skills": [
                ("SQL", "Advanced", "Critical", 1.5),
                ("Python", "Intermediate", "High", 1.2),
                ("Data Analysis", "Advanced", "Critical", 1.4),
                ("Communication", "Advanced", "High", 1.2),
                ("Problem Solving", "Intermediate", "Medium", 1.0),
            ]
        },
        {
            "title": "Cloud Engineer",
            "slug": "cloud-engineer",
            "category": "DevOps & Infrastructure",
            "description": "Designs, implements, and manages secure, scalable multi-cloud infrastructure and continuous integration pipelines.",
            "average_salary": "$125,000 - $175,000",
            "growth_rate": "+29% (Very High)",
            "required_education": "Degree in Computer Science, Networking, or relevant certifications",
            "job_responsibilities": "Provision Infrastructure-as-Code using Terraform, manage Kubernetes clusters, enforce zero-trust security, and optimize cloud expenditures.",
            "opportunities": "Essential role for every enterprise migrating away from on-premises hardware to modern cloud ecosystems.",
            "learning_recommendations": "Learn AWS or Azure foundations, Terraform, Docker, Kubernetes, Linux administration, and CI/CD pipelines.",
            "required_tech": "AWS, Azure, Terraform, Docker, Kubernetes, Linux, Bash",
            "icon": "Cloud",
            "is_featured": False,
            "skills": [
                ("Docker", "Advanced", "Critical", 1.4),
                ("Git & GitHub", "Advanced", "High", 1.2),
                ("Python", "Intermediate", "High", 1.1),
                ("Problem Solving", "Advanced", "Medium", 1.0),
            ]
        },
        {
            "title": "Cybersecurity Analyst",
            "slug": "cybersecurity-analyst",
            "category": "Information Security",
            "description": "Safeguards digital infrastructure, networks, and confidential data against unauthorized breaches and cyber threats.",
            "average_salary": "$110,000 - $160,000",
            "growth_rate": "+32% (Explosive)",
            "required_education": "Bachelor's in Cybersecurity, Computer Science, or Information Assurance",
            "job_responsibilities": "Monitor security event logs, perform vulnerability assessments, investigate anomalies, and implement incident response plans.",
            "opportunities": "Massive hiring in defense, healthcare systems, banking institutions, and cloud providers.",
            "learning_recommendations": "Study network protocols (TCP/IP), OWASP security checklists, Wireshark packet inspection, and CompTIA Security+ concepts.",
            "required_tech": "Wireshark, Linux, SIEM, Python, Burp Suite, Cryptography",
            "icon": "Shield",
            "is_featured": False,
            "skills": [
                ("Python", "Intermediate", "High", 1.1),
                ("Problem Solving", "Advanced", "Critical", 1.3),
                ("Git & GitHub", "Intermediate", "Medium", 1.0),
                ("Communication", "Advanced", "Medium", 1.0),
            ]
        },
        {
            "title": "UI/UX Designer",
            "slug": "ui-ux-designer",
            "category": "Product & Design",
            "description": "Crafts intuitive, elegant, and accessible user journeys, wireframes, and design systems for web and mobile products.",
            "average_salary": "$95,000 - $140,000",
            "growth_rate": "+20% (High)",
            "required_education": "Degree in Human-Computer Interaction, Graphic Design, or Digital Arts",
            "job_responsibilities": "Conduct user research interviews, design Figma design systems, prototype interactive flows, and collaborate closely with frontend engineers.",
            "opportunities": "High value in consumer tech, enterprise SaaS, design studios, and product companies.",
            "learning_recommendations": "Master Figma auto-layout, design tokens, responsive typography, and accessibility (WCAG) guidelines.",
            "required_tech": "Figma, Adobe XD, Wireframing, User Research, Prototyping",
            "icon": "Palette",
            "is_featured": False,
            "skills": [
                ("Communication", "Advanced", "Critical", 1.4),
                ("Problem Solving", "Advanced", "High", 1.2),
                ("Team Collaboration", "Advanced", "High", 1.2),
            ]
        },
        {
            "title": "Business Analyst",
            "slug": "business-analyst",
            "category": "Business & Strategy",
            "description": "Analyzes business workflows, gathers functional requirements, and bridges business leadership with software engineering teams.",
            "average_salary": "$90,000 - $130,000",
            "growth_rate": "+18% (Steady)",
            "required_education": "Bachelor's in Business Administration, Information Systems, or Economics",
            "job_responsibilities": "Document agile user stories, map operational workflows, analyze cost-benefit trade-offs, and facilitate sprint planning.",
            "opportunities": "Strong across management consultancies, financial organizations, and tech project offices.",
            "learning_recommendations": "Learn Agile/Scrum methodologies, SQL querying basics, process mapping tools (BPMN), and stakeholder negotiation.",
            "required_tech": "Jira, SQL, Confluence, Excel, BPMN, Tableau",
            "icon": "TrendingUp",
            "is_featured": False,
            "skills": [
                ("Communication", "Advanced", "Critical", 1.5),
                ("Team Collaboration", "Advanced", "High", 1.3),
                ("Problem Solving", "Advanced", "High", 1.2),
                ("SQL", "Beginner", "Medium", 1.0),
            ]
        }
    ]

    career_objects = {}
    for c_data in careers_data:
        skills_spec = c_data.pop("skills")
        career = Career(**c_data)
        db.add(career)
        db.commit()
        db.refresh(career)
        career_objects[career.slug] = career

        for s_name, s_req_level, s_imp, s_wt in skills_spec:
            db.add(CareerSkillRequirement(
                career_id=career.id,
                skill_name=s_name,
                required_level=s_req_level,
                importance=s_imp,
                weight=s_wt
            ))
        db.commit()

    # 6. Saved Careers for Demo Student
    if "ai-engineer" in career_objects:
        db.add(SavedCareer(user_id=demo_student.id, career_id=career_objects["ai-engineer"].id))
    if "full-stack-developer" in career_objects:
        db.add(SavedCareer(user_id=demo_student.id, career_id=career_objects["full-stack-developer"].id))
    if "data-scientist" in career_objects:
        db.add(SavedCareer(user_id=demo_student.id, career_id=career_objects["data-scientist"].id))
    db.commit()

    # 7. Sample Assessments for Demo Student
    assessment1 = Assessment(
        user_id=demo_student.id,
        title="Psychometric & Career Aptitude Assessment",
        assessment_type="psychometric",
        score=88.5,
        max_score=100.0,
        progress=100,
        status="Completed",
        summary="High analytical orientation (94th percentile), strong inclination towards autonomous algorithmic problem solving and technical leadership.",
        answers_json=json.dumps({
            "problem_solving_approach": "Systematic & Data-driven",
            "work_environment_preference": "Innovative Tech Team / Research",
            "risk_tolerance": "Calculated Experimenter",
            "technical_skills": [
                {"name": "Python", "proficiency": "Advanced", "score": 92},
                {"name": "Machine Learning", "proficiency": "Intermediate", "score": 80},
                {"name": "React.js", "proficiency": "Intermediate", "score": 76}
            ],
            "interests": ["Artificial Intelligence", "Machine Learning", "Full Stack Development"]
        }),
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
    )
    assessment2 = Assessment(
        user_id=demo_student.id,
        title="Technical Skill Benchmark: AI & Full-Stack",
        assessment_type="technical",
        score=91.0,
        max_score=100.0,
        progress=75,
        status="In Progress",
        summary="Demonstrates strong mastery over fundamental algorithmic concepts, REST architectures, and linear algebra fundamentals.",
        answers_json=json.dumps({
            "code_quality": "High",
            "test_coverage_understanding": "Proficient"
        }),
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )
    db.add_all([assessment1, assessment2])
    db.commit()

    # 8. Learning Roadmap for Demo Student (Python Developer / AI Engineer)
    py_career = career_objects.get("python-developer") or career_objects.get("ai-engineer")
    roadmap = LearningRoadmap(
        user_id=demo_student.id,
        career_id=py_career.id,
        title="Python Developer Professional Learning Roadmap",
        description="A structured 7-phase step-by-step pathway from foundational syntax to cloud-ready production microservices.",
        progress_percentage=42.8,
        current_phase=3,
        total_phases=7,
        is_active=True
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    # 7 Roadmap Phases and Tasks
    roadmap_tasks_data = [
        # Phase 1
        (1, "Python Fundamentals", "Master syntax, variables, control flow, functions, and memory basics", "https://docs.python.org/3/tutorial/", 6, True),
        (1, "Python Fundamentals", "Work with collections: lists, dicts, sets, list comprehensions, and generators", "https://realpython.com/python-lists-tuples/", 5, True),
        (1, "Python Fundamentals", "Exception handling, file I/O operations, and virtual environments (venv)", "https://realpython.com/python-exceptions/", 4, True),
        # Phase 2
        (2, "Data Structures & Algorithms", "Implement stacks, queues, linked lists, and binary search in Python", "https://neetcode.io/", 8, True),
        (2, "Data Structures & Algorithms", "Analyze Big-O time and space complexity with realistic benchmarking", "https://www.bigocheatsheet.com/", 5, True),
        (2, "Data Structures & Algorithms", "Solve 15 essential tree traversal and graph BFS/DFS problems", "https://leetcode.com/problemset/all/", 10, True),
        # Phase 3
        (3, "Object-Oriented Programming (OOP)", "Understand classes, encapsulation, inheritance, polymorphism, and dunder methods", "https://realpython.com/python3-object-oriented-programming/", 6, False),
        (3, "Object-Oriented Programming (OOP)", "Apply SOLID design principles and common architectural design patterns", "https://refactoring.guru/design-patterns/python", 7, False),
        # Phase 4
        (4, "FastAPI & REST APIs", "Build high-performance async REST API endpoints with request validation (Pydantic)", "https://fastapi.tiangolo.com/", 8, False),
        (4, "FastAPI & REST APIs", "Implement JWT token authentication, route security, and CORS middleware", "https://fastapi.tiangolo.com/tutorial/security/", 6, False),
        # Phase 5
        (5, "SQL & Database Mastery", "Design normalized relational schemas and write complex JOIN queries in SQLite/PostgreSQL", "https://sqlbolt.com/", 7, False),
        (5, "SQL & Database Mastery", "Master SQLAlchemy ORM models, relationships, and Alembic database migrations", "https://docs.sqlalchemy.org/", 8, False),
        # Phase 6
        (6, "Practical Production Projects", "Build and deploy a full-scale microservice with Docker containerization", "https://docs.docker.com/get-started/", 12, False),
        (6, "Practical Production Projects", "Write unit and integration tests using pytest with automated CI/CD workflows", "https://docs.pytest.org/", 6, False),
        # Phase 7
        (7, "Interview Preparation & Capstone", "Complete live coding mock sessions and refine behavioral STAR stories", "https://github.com/jwasham/coding-interview-university", 10, False),
        (7, "Interview Preparation & Capstone", "Prepare portfolio case studies with live deployment links and documentation", "https://github.com", 8, False),
    ]

    for p_num, p_title, t_title, r_url, hrs, done in roadmap_tasks_data:
        db.add(RoadmapTask(
            roadmap_id=roadmap.id,
            phase_number=p_num,
            phase_title=p_title,
            task_title=t_title,
            resource_url=r_url,
            estimated_hours=hrs,
            is_completed=done,
            completed_at=datetime.datetime.utcnow() if done else None
        ))
    db.commit()

    # 9. Learning Resources
    resources_data = [
        ("Complete Python 3 Mastery", "Python", "Interactive Course", "https://docs.python.org/3/tutorial/", "Official and beginner-friendly guide to modern Python language features and standard library.", "Beginner", 4.9, "10 hours", "Python Software Foundation"),
        ("FastAPI Production Guide", "Web Development", "Course", "https://fastapi.tiangolo.com/tutorial/", "Learn how to build, test, and containerize modern async REST APIs with automatic OpenAPI docs.", "Intermediate", 4.9, "8 hours", "Sebastián Ramírez"),
        ("React & Modern Frontend Architecture", "Web Development", "Interactive Course", "https://react.dev/learn", "The official interactive guide to components, state management, hooks, and clean UI engineering.", "Intermediate", 4.8, "12 hours", "React Team / Meta"),
        ("Machine Learning Crash Course", "Machine Learning", "Course", "https://developers.google.com/machine-learning/crash-course", "Practical Google course covering linear regression, neural networks, loss functions, and evaluation metrics.", "Intermediate", 4.9, "15 hours", "Google Developers"),
        ("Deep Learning Specialization", "Artificial Intelligence", "Course", "https://www.deeplearning.ai/", "Industry standard sequence covering neural networks, hyperparameter tuning, CNNs, and sequence models.", "Advanced", 4.9, "40 hours", "DeepLearning.AI / Andrew Ng"),
        ("Data Structures & Algorithms in Python", "Python", "Video", "https://neetcode.io/", "Visual walk-throughs of the most common coding interview algorithmic patterns.", "Intermediate", 4.9, "20 hours", "NeetCode"),
        ("SQL for Data Science & Engineering", "Data Science", "Tutorial", "https://sqlbolt.com/", "Interactive in-browser SQL exercises to master queries, aggregations, and subqueries.", "Beginner", 4.8, "5 hours", "SQLBolt"),
        ("Docker & Containerization Fundamentals", "Cloud Computing", "Documentation", "https://docs.docker.com/get-started/", "Understand containers, images, volume mounting, and multi-service docker-compose setups.", "Beginner", 4.7, "6 hours", "Docker Docs"),
        ("OWASP Web Security Fundamentals", "Cybersecurity", "Article", "https://owasp.org/www-project-top-ten/", "A comprehensive breakdown of top security vulnerabilities: injection, broken auth, and security misconfigurations.", "Intermediate", 4.8, "4 hours", "OWASP Foundation"),
        ("Software Engineer Resume Playbook", "Resume Building", "Article", "https://www.freecodecamp.org/news/how-to-write-a-developer-resume/", "Proven guidelines on formatting, action verbs, bullet points, and project presentation that passes ATS filters.", "Beginner", 4.9, "2 hours", "FreeCodeCamp"),
        ("Tech Interview Handbook", "Interview Preparation", "Documentation", "https://www.techinterviewhandbook.org/", "Curated interview preparation materials: algorithm cheat sheets, behavioral answers, and negotiation tips.", "Intermediate", 4.9, "14 hours", "Yangshun Tay"),
        ("Java Spring Boot Enterprise Systems", "Java", "Course", "https://spring.io/guides", "Build robust enterprise microservices using Java, Spring Boot, and Hibernate ORM.", "Advanced", 4.7, "18 hours", "VMware Tanzu"),
    ]
    for title, cat, fmt, url, desc, diff, rating, dur, prov in resources_data:
        db.add(LearningResource(
            title=title,
            category=cat,
            format=fmt,
            url=url,
            description=desc,
            difficulty=diff,
            rating=rating,
            duration=dur,
            provider=prov
        ))
    db.commit()

    # 10. Sample Colleges (Demonstration Data)
    colleges_data = [
        {
            "name": "Massachusetts Institute of Technology (MIT)",
            "location": "Cambridge, MA",
            "state": "Massachusetts",
            "country": "USA",
            "ranking": 1,
            "degrees_offered_json": json.dumps(["B.S.", "M.Eng", "M.S.", "Ph.D."]),
            "specializations_json": json.dumps(["Computer Science", "Artificial Intelligence", "Robotics", "Quantum Computing"]),
            "fees_per_year": "$59,750 / year",
            "rating": 4.98,
            "acceptance_rate": "3.9%",
            "admission_info": "Highly selective admission. Requires exceptional academic rigor, demonstrated passion projects, research publications, and strong faculty recommendations.",
            "website_url": "https://www.mit.edu",
            "image_url": "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=400&fit=crop",
            "is_featured": True
        },
        {
            "name": "Stanford University",
            "location": "Stanford, CA",
            "state": "California",
            "country": "USA",
            "ranking": 2,
            "degrees_offered_json": json.dumps(["B.S.", "M.S.", "Ph.D."]),
            "specializations_json": json.dumps(["Computer Science", "AI & Information Systems", "Human-Computer Interaction", "Data Systems"]),
            "fees_per_year": "$61,731 / year",
            "rating": 4.96,
            "acceptance_rate": "3.6%",
            "admission_info": "Direct heart of Silicon Valley innovation. Strong focus on entrepreneurial spirit, intellectual vitality, and holistic leadership.",
            "website_url": "https://www.stanford.edu",
            "image_url": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
            "is_featured": True
        },
        {
            "name": "University of California, Berkeley",
            "location": "Berkeley, CA",
            "state": "California",
            "country": "USA",
            "ranking": 4,
            "degrees_offered_json": json.dumps(["B.A.", "B.S. EECS", "M.S.", "Ph.D."]),
            "specializations_json": json.dumps(["EECS", "Data Science", "Machine Learning", "Cybersecurity"]),
            "fees_per_year": "$44,000 / year (Out of state)",
            "rating": 4.92,
            "acceptance_rate": "11.2%",
            "admission_info": "World-class public institution leading global research in open-source AI (BAIR), distributed systems, and computer vision.",
            "website_url": "https://www.berkeley.edu",
            "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
            "is_featured": True
        },
        {
            "name": "Carnegie Mellon University (CMU)",
            "location": "Pittsburgh, PA",
            "state": "Pennsylvania",
            "country": "USA",
            "ranking": 3,
            "degrees_offered_json": json.dumps(["B.S. CS", "B.S. AI", "M.S.", "Ph.D."]),
            "specializations_json": json.dumps(["Language Technologies", "Machine Learning", "Software Engineering", "Autonomous Systems"]),
            "fees_per_year": "$62,260 / year",
            "rating": 4.95,
            "acceptance_rate": "11.0%",
            "admission_info": "World's premier School of Computer Science with the first dedicated undergraduate degree in Artificial Intelligence.",
            "website_url": "https://www.cmu.edu",
            "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop",
            "is_featured": True
        },
        {
            "name": "University of Washington",
            "location": "Seattle, WA",
            "state": "Washington",
            "country": "USA",
            "ranking": 7,
            "degrees_offered_json": json.dumps(["B.S.", "M.S.", "Ph.D."]),
            "specializations_json": json.dumps(["Paul G. Allen School CS", "Data Science", "Cloud Systems", "Bioinformatics"]),
            "fees_per_year": "$39,900 / year",
            "rating": 4.88,
            "acceptance_rate": "19.0%",
            "admission_info": "Direct pipeline to Pacific Northwest tech headquarters (Microsoft, Amazon). Exceptional research output in NLP and cloud computing.",
            "website_url": "https://www.washington.edu",
            "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
            "is_featured": False
        },
        {
            "name": "Georgia Institute of Technology",
            "location": "Atlanta, GA",
            "state": "Georgia",
            "country": "USA",
            "ranking": 6,
            "degrees_offered_json": json.dumps(["B.S. CS", "M.S. CS (OMSCS)", "Ph.D."]),
            "specializations_json": json.dumps(["Computing Systems", "Machine Learning", "Cybersecurity", "Interactive Intelligence"]),
            "fees_per_year": "$31,370 / year",
            "rating": 4.89,
            "acceptance_rate": "16.0%",
            "admission_info": "Renowned for technical rigor, innovative online master's program (OMSCS), and top national engineering rankings.",
            "website_url": "https://www.gatech.edu",
            "image_url": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop",
            "is_featured": False
        }
    ]

    college_objs = []
    for c_item in colleges_data:
        c_inst = College(**c_item)
        db.add(c_inst)
        db.commit()
        db.refresh(c_inst)
        college_objs.append(c_inst)

    # Shortlist top 2 for Demo Student
    if len(college_objs) >= 2:
        db.add(ShortlistedCollege(user_id=demo_student.id, college_id=college_objs[0].id))
        db.add(ShortlistedCollege(user_id=demo_student.id, college_id=college_objs[1].id))
        db.commit()

    # 11. Sample Job & Internship Opportunities (Demo Data)
    jobs_data = [
        {
            "title": "Junior AI / ML Software Engineer",
            "company": "DeepMind Innovations (Demo)",
            "location": "San Francisco, CA / Hybrid",
            "job_type": "Full-time",
            "experience_level": "Entry Level (0-2 yrs)",
            "salary_range": "$120,000 - $145,000",
            "skills_required_json": json.dumps(["Python", "PyTorch", "FastAPI", "Git"]),
            "description": "Collaborate with senior research scientists to optimize production model inference and deploy automated agentic workflows.",
            "apply_url": "https://example.com/careers/demo-job-1",
            "is_demo": True,
            "posted_date": "2 days ago"
        },
        {
            "title": "Full Stack Developer Intern - Summer 2027",
            "company": "Stripe Technologies (Demo)",
            "location": "Seattle, WA / Remote",
            "job_type": "Internship",
            "experience_level": "Internship (Students)",
            "salary_range": "$52 / hour + Housing Stipend",
            "skills_required_json": json.dumps(["React.js", "Python", "SQL", "REST APIs"]),
            "description": "Build high-impact merchant dashboard interfaces and integrate reliable payments infrastructure.",
            "apply_url": "https://example.com/careers/demo-intern-1",
            "is_demo": True,
            "posted_date": "Just now"
        },
        {
            "title": "Backend Python / FastAPI Engineer",
            "company": "Vercel Cloud Services (Demo)",
            "location": "New York, NY / Remote",
            "job_type": "Full-time",
            "experience_level": "Junior (1-3 yrs)",
            "salary_range": "$115,000 - $140,000",
            "skills_required_json": json.dumps(["Python", "FastAPI", "PostgreSQL", "Docker"]),
            "description": "Architect lightning-fast microservices, manage database schema migrations, and ensure 99.99% uptime.",
            "apply_url": "https://example.com/careers/demo-job-2",
            "is_demo": True,
            "posted_date": "3 days ago"
        },
        {
            "title": "Data Science & Analytics Associate",
            "company": "Spotify Media Labs (Demo)",
            "location": "Boston, MA",
            "job_type": "Full-time",
            "experience_level": "Entry Level",
            "salary_range": "$98,000 - $125,000",
            "skills_required_json": json.dumps(["Python", "Pandas", "SQL", "Tableau"]),
            "description": "Analyze music streaming metrics, design A/B test experiments, and generate automated user behavior insights.",
            "apply_url": "https://example.com/careers/demo-job-3",
            "is_demo": True,
            "posted_date": "5 days ago"
        }
    ]
    for j_item in jobs_data:
        db.add(JobOpportunity(**j_item))
    db.commit()

    # 12. Sample Initial Chat History
    chat_samples = [
        ChatMessage(
            user_id=demo_student.id,
            session_id="default",
            sender="assistant",
            message="Hi Alex! Welcome to CareerWithinU. I'm your AI Career Assistant. Let's discover a career path that matches your skills, interests and ambitions.",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=2),
            intent_tag="welcome"
        ),
        ChatMessage(
            user_id=demo_student.id,
            session_id="default",
            sender="user",
            message="Which career suits my skills best?",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=1, minutes=45),
            intent_tag="career_recommendation"
        ),
        ChatMessage(
            user_id=demo_student.id,
            session_id="default",
            sender="assistant",
            message="Based on your strong foundation in Python (92%), Data Structures (84%), and Machine Learning (80%), your top recommended match is **AI Engineer** with a **94.5% match score**!\n\nYour background in algorithmic problem solving and interest in AI systems positions you exceptionally well. To bridge the remaining gap, consider mastering PyTorch and containerized deployment with Docker.",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=1, minutes=44),
            intent_tag="career_recommendation"
        )
    ]
    for msg in chat_samples:
        db.add(msg)
    db.commit()

    # 13. Run Recommendation Engine to seed recommendations
    compute_career_recommendations(user_id=demo_student.id, db=db, save_to_db=True)

    print("CareerWithinU database seeded successfully!")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
