import requests
import os

BASE_URL = "http://localhost:8000"
PATIENT_ID = "tamil@34"

def test_upload():
    print("\n--- Testing Upload ---")
    file_path = "sample_report.pdf"
    if not os.path.exists(file_path):
        print("sample_report.pdf missing")
        return

    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {"patient_id": PATIENT_ID}
        try:
            response = requests.post(f"{BASE_URL}/upload/", files=files, data=data)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error: {e}")

def test_timeline():
    print("\n--- Testing Timeline ---")
    try:
        response = requests.get(f"{BASE_URL}/timeline/{PATIENT_ID}")
        print(f"Status: {response.status_code}")
        events = response.json()
        print(f"Found {len(events)} events")
        for event in events:
            print(event)
    except Exception as e:
        print(f"Error: {e}")

def test_chat():
    print("\n--- Testing Chat ---")
    queries = [
        "What was my last BP?",
        "How is my creatinine?",
        "Do I have any glucose data?"
    ]
    
    for q in queries:
        print(f"Query: {q}")
        try:
            response = requests.post(f"{BASE_URL}/chat/query", json={"query": q, "patient_id": PATIENT_ID})
            print(f"Answer: {response.json().get('answer', 'No answer')}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_upload()
    test_timeline()
    test_chat()
