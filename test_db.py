from database import SessionLocal
from services.auth import create_user, get_user_by_email
from schemas.auth import UserRegister

db = SessionLocal()
try:
    user = UserRegister(name='test', email='test@test.com', password='password')
    create_user(db, user)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
