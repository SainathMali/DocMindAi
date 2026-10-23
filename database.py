from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from utils.config import get_settings

settings = get_settings()
SQLALCHEMY_DATABASE_URL = settings.database_url

if not SQLALCHEMY_DATABASE_URL:
    print("WARNING: DATABASE_URL is not set in .env")

# Engine initialization
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
) if SQLALCHEMY_DATABASE_URL else None

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
