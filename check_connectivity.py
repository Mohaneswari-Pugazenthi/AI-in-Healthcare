import requests

def check(url, name):
    try:
        resp = requests.get(url, timeout=2)
        print(f"{name}: UP ({resp.status_code})")
    except Exception as e:
        print(f"{name}: DOWN ({e})")

if __name__ == "__main__":
    check("http://localhost:8001/", "Backend")
    check("http://localhost:5501/patient-dashboard.html", "Frontend")
