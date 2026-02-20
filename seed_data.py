import urllib.request
import json

BASE_URL = "http://localhost:8000"

def register(user_id, role, name, **kwargs):
    data = {
        "user_id": user_id,
        "password": "password",
        "role": role,
        "name": name,
        **kwargs
    }
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/register", 
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"✅ Registered {role}: {user_id} - {response.status}")
    except urllib.error.HTTPError as e:
        print(f"ℹ️ {role} {user_id}: {e.code} - {e.reason}")
    except Exception as e:
        print(f"🔥 Error registering {user_id}: {e}")

# Register Doctor (dr_arjun)
register("dr_arjun", "doctor", "Dr. Arjun Kumar", 
         specialization="Cardiologist", contact="+91 98765 43210")

# Register Patient (tamil@34)
register("tamil@34", "patient", "Tamil Selvan", 
         age=34, gender="Male", contact="9988776655", blood_group="O+")
