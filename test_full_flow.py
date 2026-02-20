import requests
import time

BASE_URL = "http://localhost:8001"

def test_flow():
    # 1. Register
    reg_data = {
        "user_id": "test_user_99",
        "password": "password123",
        "role": "patient",
        "name": "Test User 99",
        "age": 30,
        "gender": "Male",
        "blood_group": "O+",
        "contact": "1234567890"
    }
    print("Registering...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        print(f"Register Status: {resp.status_code}")
        print(f"Register Response: {resp.text}")
    except Exception as e:
        print(f"Registration Failed: {e}")
        return

    # 2. Login
    login_data = {
        "user_id": "test_user_99",
        "password": "password123",
        "role": "patient"
    }
    print("\nLogging via API...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login Status: {resp.status_code}")
        data = resp.json()
        print(f"Login Response Key: {list(data.keys())}")
        
        if resp.status_code != 200:
            return
            
    except Exception as e:
        print(f"Login Failed: {e}")
        return

    # 3. Get Profile
    print(f"\nFetching Profile for {reg_data['user_id']}...")
    try:
        resp = requests.get(f"{BASE_URL}/auth/profile/{reg_data['user_id']}")
        print(f"Profile Status: {resp.status_code}")
        print(f"Profile Data: {resp.text}")
    except Exception as e:
        print(f"Fetch Profile Failed: {e}")

if __name__ == "__main__":
    test_flow()
