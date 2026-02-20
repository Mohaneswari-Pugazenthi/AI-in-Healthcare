const API_BASE_URL = "http://localhost:8000";
const userId = localStorage.getItem("user_id") || "tamil@34"; // Fallback for dev

async function init() {
    closeDoctorModal(); // Ensure modal is hidden on load
    await fetchProfile();
    await fetchTimeline();
    await fetchPrescriptions();
    await fetchInsights();
    // Pre-load other data if needed
}

async function fetchProfile() {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const user = await res.json();

        document.getElementById('p-name').innerText = user.name || "N/A";
        document.getElementById('p-id').innerText = `Patient ID: ${user.user_id}`;
        document.getElementById('p-age-gender').innerText = `${user.age || '-'} / ${user.gender || '-'}`;
        document.getElementById('p-blood').innerText = user.blood_group || "-";
        document.getElementById('p-contact').innerText = user.contact || "-";

        // Update Stats
        document.getElementById('total-visits').innerText = user.total_visits || 0;
        document.getElementById('major-conditions').innerText = user.conditions || "None";
        document.getElementById('allergies').innerText = user.allergies || "None";

        // Update Doctor Details
        const noDocView = document.getElementById('no-doctor-view');
        const docDetailsView = document.getElementById('doctor-details-view');
        const doctorsContainer = document.getElementById('doctors-list');

        // Clear previous list
        doctorsContainer.innerHTML = '';

        const doctors = user.assigned_doctors || [];

        if (doctors.length > 0) {
            // Show Details View (List)
            noDocView.classList.add('hidden');
            noDocView.style.display = 'none';

            docDetailsView.classList.remove('hidden');
            docDetailsView.style.display = 'block';

            doctors.forEach(doc => {
                const docCard = document.createElement('div');
                docCard.className = 'detail-row';
                docCard.style.borderBottom = '1px solid #eee';
                docCard.style.paddingBottom = '10px';
                docCard.style.marginBottom = '10px';
                docCard.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${doc.name}</strong>
                        <span style="font-size:0.8em; color:#666;">${doc.spec || '-'}</span>
                    </div>
                    <div style="font-size:0.9em;">
                        test ${doc.hospital || '-'} <br>
                        Contact: ${doc.contact || '-'}
                    </div>
                `;
                doctorsContainer.appendChild(docCard);
            });

        } else {
            // Show Add Button View (Empty State)
            docDetailsView.classList.add('hidden');
            docDetailsView.style.display = 'none';

            noDocView.classList.remove('hidden');
            noDocView.style.display = 'flex';
        }

        // Update initials
        if (user.name) {
            const initials = user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            document.querySelector('.profile-pic').innerText = initials;
        }

    } catch (e) {
        console.error("Error loading profile:", e);
    }
}

/* --- Doctor Assignment Modal Logic --- */
function openDoctorModal() {
    const modal = document.getElementById('doctor-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; // Use flex to center, as per CSS
}

function closeDoctorModal() {
    const modal = document.getElementById('doctor-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

async function saveDoctorDetails() {
    const name = document.getElementById('edit-doc-name').value;
    const spec = document.getElementById('edit-doc-spec').value;
    const hosp = document.getElementById('edit-doc-hosp').value;
    const contact = document.getElementById('edit-doc-contact').value;

    if (!name) { alert("Doctor Name is required"); return; }

    try {
        // Changed to POST to add new doctor
        const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}/doctor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                spec: spec,
                hospital: hosp,
                contact: contact
            })
        });

        if (res.ok) {
            alert("Doctor assigned successfully!");
            closeDoctorModal();
            // Clear inputs for next time
            document.getElementById('edit-doc-name').value = '';
            document.getElementById('edit-doc-spec').value = '';
            document.getElementById('edit-doc-hosp').value = '';
            document.getElementById('edit-doc-contact').value = '';

            fetchProfile(); // Refresh UI
        } else {
            alert("Failed to update doctor");
        }
    } catch (e) {
        console.error(e);
        alert("Error updating doctor details");
    }
}

function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(tabName + '-view').classList.add('active');
    btn.classList.add('active');
}

/* --- Stats Modal Logic --- */
function openStatsModal() {
    const modal = document.getElementById('stats-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Pre-fill
    document.getElementById('edit-conditions').value = document.getElementById('major-conditions').innerText;
    document.getElementById('edit-allergies').value = document.getElementById('allergies').innerText;
}

function closeStatsModal() {
    const modal = document.getElementById('stats-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

async function saveStats() {
    const conditions = document.getElementById('edit-conditions').value;
    const allergies = document.getElementById('edit-allergies').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conditions: conditions,
                allergies: allergies
            })
        });

        if (res.ok) {
            alert("Stats updated!");
            closeStatsModal();
            fetchProfile(); // Refresh UI
        } else {
            alert("Failed to update stats");
        }
    } catch (e) {
        console.error(e);
        alert("Error updating stats");
    }
}

async function fetchPrescriptions() {
    try {
        const res = await fetch(`${API_BASE_URL}/timeline/prescriptions/${userId}`);
        const data = await res.json();
        const container = document.getElementById('prescriptions-list');

        if (data.length === 0) {
            container.innerHTML = "<p>No prescriptions found.</p>";
            return;
        }

        container.innerHTML = data.map(p => `
            <div class="timeline-item">
                <span style="color:#10b981; font-weight:bold;">${p.date}</span>
                <h3>${p.name}</h3>
                <p><strong>Type:</strong> ${p.type}</p>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error fetching prescriptions:", e);
    }
}

async function fetchTimeline() {
    try {
        const res = await fetch(`${API_BASE_URL}/timeline/${userId}`);
        const data = await res.json();

        const timelineContainer = document.getElementById('health-timeline');

        if (data.length === 0) {
            timelineContainer.innerHTML = "<p>No records found. Upload a report to get started.</p>";
            return;
        }

        timelineContainer.innerHTML = data.map(d => `
            <div class="timeline-item">
                <span style="color:#10b981; font-weight:bold;">${d.date}</span>
                <h3>${d.issue}</h3>
                <p><strong>Diagnosis:</strong> ${d.diag}</p>
                <p><strong>Medicines:</strong> ${d.meds}</p>
                <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; margin-top:10px; font-style:italic;">
                    "${d.notes}"
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error fetching timeline:", e);
    }
}

async function uploadReport() {
    const fileInput = document.getElementById('pdf-upload');
    const status = document.getElementById('upload-status');

    if (fileInput.files.length === 0) {
        alert("Please select a file");
        return;
    }

    status.innerText = "Uploading & Analyzing...";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("patient_id", userId);

    try {
        const res = await fetch(`${API_BASE_URL}/upload/`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        status.innerText = "Success: " + data.message;

        // Refresh timeline
        await fetchTimeline();

    } catch (e) {
        status.innerText = "Error uploading file";
        console.error(e);
    }
}

async function sendChat() {
    const input = document.getElementById('chat-query');
    const container = document.getElementById('chat-history');
    const query = input.value;

    if (!query) return;

    // Add User Message
    container.innerHTML += `<div class="chat-msg user">${query}</div>`;
    input.value = "";
    container.scrollTop = container.scrollHeight;

    try {
        const res = await fetch(`${API_BASE_URL}/chat/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query, patient_id: userId })
        });
        const data = await res.json();

        // Format newlines
        const answer = data.answer.replace(/\n/g, "<br>");

        // Add Bot Message
        container.innerHTML += `<div class="chat-msg bot">${answer}</div>`;
        container.scrollTop = container.scrollHeight;

    } catch (e) {
        container.innerHTML += `<div class="chat-msg bot" style="color:var(--error-red);">Error connecting to assistant</div>`;
    }
}

async function fetchInsights() {
    try {
        const res = await fetch(`${API_BASE_URL}/insights/${userId}`);
        const data = await res.json();

        document.getElementById('insight-summary').innerText = data.summary;
        document.getElementById('insight-trend').innerText = data.trend;
        document.getElementById('insight-risk').innerText = data.risk;
    } catch (e) {
        console.error("Error fetching insights:", e);
        document.getElementById('insight-summary').innerText = "Failed to load insights.";
    }
}

function downloadInsights() {
    window.location.href = `${API_BASE_URL}/insights/${userId}/download`;
}

window.onload = init;