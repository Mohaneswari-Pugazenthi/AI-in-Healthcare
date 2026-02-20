from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User

def list_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Found {len(users)} users:")
    for u in users:
        print(f"ID: {u.user_id}, Name: {u.name}, Role: {u.role}, Password: {u.password}")
    db.close()

if __name__ == "__main__":
    list_users()
