import requests
import os
from create_pdf import create_pdf

BASE_URL = "http://localhost:8000"
PATIENT_ID = "tamil@34"

def test_upload():
    print("\n--- Testing Upload ---")
    file_path = "sample_report.pdf"
    if not os.path.exists(file_path):
        print("Run create_pdf.py first")
        return

    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {"patient_id": PATIENT_ID}
        response = requests.post(f"{BASE_URL}/upload/", files=files, data=data)
        
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_timeline():
    print("\n--- Testing Timeline ---")
    response = requests.get(f"{BASE_URL}/timeline/{PATIENT_ID}")
    print(f"Status: {response.status_code}")
    events = response.json()
    print(f"Found {len(events)} events")
    for event in events:
        print(event)

def test_chat():
    print("\n--- Testing Chat ---")
    queries = [
        "What was my last BP?",
        "How is my creatinine?",
        "Do I have any glucose data?"
    ]
    
    for q in queries:
        print(f"Query: {q}")
        response = requests.post(f"{BASE_URL}/chat/query", json={"query": q, "patient_id": PATIENT_ID})
        print(f"Answer: {response.json()['answer']}")

import time
if __name__ == "__main__":
    create_pdf("sample_report.pdf")
    print("Waiting for server reload...")
    time.sleep(5)
    test_upload()
    test_timeline()
    test_chat()
