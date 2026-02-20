import requests
try:
    print("Checking root...")
    resp = requests.get("http://127.0.0.1:8001/")
    print(f"Root: {resp.status_code}")
    
    print("Uploading...")
    with open('sample_report.pdf', 'rb') as f:
        files = {'file': f}
        data = {'patient_id': 'tamil@34'}
        resp = requests.post("http://127.0.0.1:8001/upload/", files=files, data=data)
        print(f"Upload: {resp.status_code}")
        print(f"Body: {resp.text}")
    
    print("Checking Timeline...")
    resp = requests.get("http://127.0.0.1:8001/timeline/tamil@34")
    print(f"Timeline: {resp.status_code}")
    print(f"Events: {len(resp.json())}")

    print("Checking Chat...")
    resp = requests.post("http://127.0.0.1:8001/chat/query", json={"query": "What was my last BP?", "patient_id": "tamil@34"})
    print(f"Chat: {resp.status_code}")
    print(f"Answer: {resp.json().get('answer')}")
except Exception as e:
    print(f"Error: {e}")
