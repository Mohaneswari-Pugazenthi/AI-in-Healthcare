const API_BASE_URL = "http://localhost:8000";
// For now, hardcode a doctor ID or get from login. 
// Since we don't have full login persistence in this simple demo, I'll assume Dr. Arjun (e.g. "dr_arjun").
// In a real app, localStorage.getItem("user_id") would be used.
const doctorId = localStorage.getItem("user_id") || "dr_arjun";

async function init() {
    await fetchProfile();
    await fetchStats();
    await fetchPatients();
}

async function fetchProfile() {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile/${doctorId}`);
        const user = await res.json();

        if (document.getElementById('doc-name')) document.getElementById('doc-name').innerText = user.name || "Doctor";
        if (document.getElementById('doc-spec')) document.getElementById('doc-spec').innerText = user.spec || "Specialist";

        // Handle contact info
        if (document.getElementById('doc-email')) document.getElementById('doc-email').innerText = `Email : ${user.user_id}`;
        if (document.getElementById('doc-phone') && user.contact) document.getElementById('doc-phone').innerText = `Phone : ${user.contact}`;

    } catch (e) {
        console.error("Error fetching profile:", e);
    }
}

async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/stats`);
        const data = await res.json();
        if (document.getElementById('total-patients')) document.getElementById('total-patients').innerText = data.total_patients || 0;
        if (document.getElementById('today-appts')) document.getElementById('today-appts').innerText = data.today_appointments || 0;
        if (document.getElementById('pending-reports')) document.getElementById('pending-reports').innerText = data.pending_reports || 0;
        if (document.getElementById('emergency-cases')) document.getElementById('emergency-cases').innerText = data.emergency_cases || 0;
    } catch (e) {
        console.error("Error fetching stats:", e);
    }
}

async function fetchPatients() {
    const tableBody = document.getElementById('patientList');
    tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    try {
        const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/patients`);
        const patients = await res.json();

        tableBody.innerHTML = "";

        if (patients.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No patients assigned yet. Add one above.</td></tr>";
            return;
        }

        patients.forEach(p => {
            let row = `
                <tr>
                    <td style="color: #10b981; font-weight: bold;">${p.user_id}</td>
                    <td>${p.name || '-'}</td>
                    <td>${p.age || '-'}</td>
                    <td>${p.conditions || '-'}</td>
                    <td><span class="status-tag ${p.status === 'Critical' ? 'status-critical' : 'status-stable'}">${p.status}</span></td>
                    <td><button class="btn" onclick="viewPatient('${p.user_id}')">View Details</button></td>
                </tr>`;
            tableBody.innerHTML += row;
        });

    } catch (e) {
        console.error("Error fetching patients:", e);
        tableBody.innerHTML = "<tr><td colspan='6' style='color:red;'>Error loading patients.</td></tr>";
    }
}

async function addPatient() {
    const patientId = document.getElementById('newPatientId').value;
    if (!patientId) {
        alert("Please enter a Patient ID");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/add-patient`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patient_id: patientId })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            document.getElementById('newPatientId').value = "";
            fetchStats();
            fetchPatients();
        } else {
            alert("Error: " + data.detail);
        }
    } catch (e) {
        console.error(e);
        alert("Failed to add patient");
    }
}

function viewPatient(patientId) {
    // Redirect to patient view in read-only mode (implementation simplification)
    // Or open a modal with fetched details.
    // User requested "redirect like a doctor add his patient detail and then click to view the full details"
    // I will use the Modal for quick view as per previous pattern, but populate it dynamically.
    // For "Full Details", maybe open patient dashboard? 
    // Let's implement dynamic modal first as it's cleaner.

    // Actually, user said "redirect... view full details". 
    // Let's use the modal but populate it fully.

    openPatientModal(patientId);
}

/* --- DYNAMIC MODAL LOGIC --- */
async function openPatientModal(id) {
    const modal = document.getElementById('patientModal');
    modal.style.display = "flex";
    modal.classList.remove('hidden');

    // Clear previous data
    document.getElementById('m-name').innerText = "Loading...";

    try {
        // Fetch User Profile
        const res = await fetch(`${API_BASE_URL}/auth/profile/${id}`);
        if (!res.ok) throw new Error("Patient not found");
        const p = await res.json();

        // Fetch Timeline for latest vitals/history
        const resTimeline = await fetch(`${API_BASE_URL}/timeline/${id}`);
        const timeline = await resTimeline.json();

        // Basic Info
        document.getElementById('m-name').innerText = p.name || "N/A";
        document.getElementById('m-id').innerText = `ID: ${p.user_id}`;
        document.getElementById('m-age-gen').innerText = `${p.age || '-'} / ${p.gender || '-'}`;
        document.getElementById('m-blood').innerText = p.blood_group || "-";
        document.getElementById('m-emergency').innerText = p.contact || "-";

        // Conditions
        document.getElementById('m-diag').innerText = p.conditions || "None";
        document.getElementById('m-symp').innerText = p.allergies || "None"; // Using allergies as symptoms/alerts

        // Vitals & Latest Event Logic
        if (timeline.length > 0) {
            const latest = timeline[0]; // Assuming sorted by date descending (or we sort)
            document.getElementById('m-last').innerText = latest.date;
            document.getElementById('m-plan').innerText = latest.meds || "See latest report";

            // Try to find BP/HR in latest event description or notes (basic parsing)
            // Ideally we'd have structured vitals, but for now:
            document.getElementById('m-notes').innerText = latest.notes || latest.desc;
        } else {
            document.getElementById('m-last').innerText = "No visits yet";
            document.getElementById('m-plan').innerText = "-";
            document.getElementById('m-notes').innerText = "No history available.";
        }

        // Reset Vitals (since we don't have dedicated fields yet)
        document.getElementById('m-bp').innerText = "--";
        document.getElementById('m-hr').innerText = "--";
        document.getElementById('m-sugar').innerText = "--";

    } catch (e) {
        console.error(e);
        document.getElementById('m-name').innerText = "Error loading details";
    }
}

function closeModal() {
    document.getElementById('patientModal').style.display = "none";
    document.getElementById('patientModal').classList.add('hidden');
}

function switchTab(tabName, btn) {
    // Hide all views
    document.querySelectorAll('.tab-view').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));

    // Show selected view
    document.getElementById(tabName + '-view').style.display = 'block';

    // Activate button
    if (btn) btn.classList.add('active');
}

window.onload = init;
