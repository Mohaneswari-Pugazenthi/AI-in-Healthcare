import requests

URL = "http://localhost:8001/auth/login"
CREDENTIALS = {
    "user_id": "tamil@34",
    "password": "8520",
    "role": "patient"
}

try:
    print(f"Testing login at {URL}...")
    resp = requests.post(URL, json=CREDENTIALS)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
