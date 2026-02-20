// 1. DATA DECLARATION (Only once!)  array of objects.
const patients = [
    {
        id: "P001", name: "Ravi Kumar", age: 45, gender: "Male",
        condition: "Heart Issue", status: "Critical", blood: "O+",
        emergency: "+91 99000 11000", bp: "150/95", hr: "88 bpm",
        sugar: "140 mg/dL", diag: "Myocardial Ischemia", symp: "Chest Pain",
        plan: "Beta-blockers", lastVisit: "2026-02-10", 
        next: "2026-02-25", notes: "Regular ECG monitoring required."
    },
    {
        id: "P002", name: "Meena", age: 32, gender: "Female",
        condition: "BP Issues", status: "Stable", blood: "A-",
        emergency: "+91 98000 22000", bp: "120/80", hr: "72 bpm",
        sugar: "95 mg/dL", diag: "Hypertension", symp: "Dizziness",
        plan: "Daily walking", lastVisit: "2026-01-15", 
        next: "2026-03-01", notes: "Condition stable."
    },
{
    id: "P003", 
    name: "Arjun Das", 
    age: 58, 
    gender: "Male",
    condition: "Type 2 Diabetes", 
    status: "Stable", 
    blood: "B+",
    emergency: "+91 97000 33000", 
    bp: "135/85", 
    hr: "76 bpm",
    sugar: "185 mg/dL", 
    diag: "Chronic Hyperglycemia", 
    symp: "Fatigue, Increased Thirst",
    plan: "Metformin 500mg, Carbohydrate-controlled diet", 
    lastVisit: "2026-02-05", 
    next: "2026-03-10", 
    notes: "Sugar levels are slightly elevated. AI agent suggests reviewing diet logs."
}
    
];

// 2. LOAD TABLE FUNCTION
function loadTable() {  //it will load the page patient data into the page
    const tableBody = document.getElementById('patientList');  //find the table body where patients will be displayed
    if(!tableBody) return;   //If table does not exist → stop the function.
    
    tableBody.innerHTML = "";   //removes previous table rows before loading new ones.

    patients.forEach(p => {   //loop
        let row = `
            <tr>
                <td style="color: #10b981; cursor: pointer; font-weight: bold;" onclick="openPatient('${p.id}')">${p.id}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.condition}</td>
                <td><span class="status-tag ${p.status === 'Critical' ? 'status-critical' : 'status-stable'}">${p.status}</span></td>
                <td><button class="btn" onclick="openPatient('${p.id}')">View Details</button></td>
            </tr>`;
        tableBody.innerHTML += row; //add new row in the table
    });
}

// 3. MODAL LOGIC
function openPatient(id) {   //it will receives the patiend id
    const p = patients.find(p => p.id === id);  //it will search the id which is we entered
    if (!p) return;

    document.getElementById('m-name').innerText = p.name;
    document.getElementById('m-id').innerText = `ID: ${p.id}`;
    document.getElementById('m-age-gen').innerText = `${p.age} / ${p.gender}`;
    document.getElementById('m-blood').innerText = p.blood;
    document.getElementById('m-emergency').innerText = p.emergency;
    document.getElementById('m-bp').innerText = p.bp;
    document.getElementById('m-hr').innerText = p.hr;
    document.getElementById('m-sugar').innerText = p.sugar;
    document.getElementById('m-diag').innerText = p.diag;
    document.getElementById('m-symp').innerText = p.symp;
    document.getElementById('m-plan').innerText = p.plan;
    document.getElementById('m-last').innerText = p.lastVisit;
    document.getElementById('m-next').innerText = p.next;
    document.getElementById('m-notes').innerText = p.notes;

    // This makes the pop-up appear
    document.getElementById('patientModal').style.display = "flex";
}

function closeModal() {
    // This makes the pop-up disappear
    document.getElementById('patientModal').style.display = "none";
}

// Run table load when the page is ready
window.onload = loadTable;