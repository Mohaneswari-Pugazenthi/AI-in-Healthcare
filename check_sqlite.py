import sqlite3
import os

db_path = "app/test.db"
if not os.path.exists(db_path):
    print(f"Database file not found at {db_path}")
    # Try just test.db if relative path is different
    if os.path.exists("test.db"):
        db_path = "test.db"
    else:
        print("checked test.db too, not found")
        exit(1)

print(f"Opening database at {db_path}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT user_id, password, role FROM users")
    users = cursor.fetchall()
    if not users:
        print("No users found.")
    else:
        print("Users found:")
        for user in users:
            print(f"User: {user[0]}, Password: {user[1]}, Role: {user[2]}")
except Exception as e:
    print(f"Error querying users: {e}")

conn.close()
