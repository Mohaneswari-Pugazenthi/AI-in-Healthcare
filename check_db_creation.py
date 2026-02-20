from app.database import engine, SessionLocal, Base
from app.models import User
from sqlalchemy import text

def check():
    print("Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created.")
    except Exception as e:
        print(f"Error creating tables: {e}")
        return

    print("Checking schema...")
    with engine.connect() as conn:
        try:
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result]
            print(f"Columns: {columns}")
            if "age" not in columns:
                print("FATAL: 'age' column missing!")
            else:
                print("Schema looks correct.")
        except Exception as e:
             print(f"Error checking schema: {e}")

    print("Adding user...")
    db = SessionLocal()
    try:
        u = User(user_id="manual_test", password="pw", role="patient", name="Manual", age=25)
        db.add(u)
        db.commit()
        print("User added successfully.")
    except Exception as e:
        print(f"Error adding user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
