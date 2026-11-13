import os
from pathlib import Path

# Base directories
APP_DIR = Path(__file__).resolve().parent  # backend/app
BACKEND_DIR = APP_DIR.parent  # backend/
ROOT_DIR = BACKEND_DIR.parent  # project root

# Database configuration
DATABASE_URL_ENV = os.getenv("DATABASE_URL", "").strip()

if not DATABASE_URL_ENV:
    # Auto-resolve existing SQLite database file location
    backend_db = BACKEND_DIR / "careerwithinu.db"
    root_db = ROOT_DIR / "careerwithinu.db"
    
    if backend_db.exists():
        DATABASE_URL = f"sqlite:///{backend_db.as_posix()}"
    elif root_db.exists():
        DATABASE_URL = f"sqlite:///{root_db.as_posix()}"
    else:
        DATABASE_URL = f"sqlite:///{backend_db.as_posix()}"
else:
    # Convert Render postgres:// to postgresql:// for SQLAlchemy 1.4+ & 2.0+ compatibility
    if DATABASE_URL_ENV.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL_ENV.replace("postgres://", "postgresql://", 1)
    else:
        DATABASE_URL = DATABASE_URL_ENV

# JWT & Authentication Secret
SECRET_KEY = os.getenv("SECRET_KEY", "careerwithinu_secret_super_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# CORS configuration
ALLOWED_ORIGINS_RAW = os.getenv("ALLOWED_ORIGINS", "*")
if ALLOWED_ORIGINS_RAW.strip() == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    parsed = [o.strip() for o in ALLOWED_ORIGINS_RAW.split(",") if o.strip()]
    # Ensure local development ports are always preserved
    defaults = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    for d in defaults:
        if d not in parsed:
            parsed.append(d)
    ALLOWED_ORIGINS = parsed

# Regex to allow all Vercel deployments (production & preview subdomains)
ALLOW_ORIGIN_REGEX = os.getenv(
    "ALLOW_ORIGIN_REGEX",
    r"https://.*\.vercel\.app" if ALLOWED_ORIGINS != ["*"] else None
)
