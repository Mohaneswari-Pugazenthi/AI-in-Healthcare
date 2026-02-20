const API_BASE_URL = "http://localhost:8000";
let currentRole = "";

/* ---------------- ROLE SELECTION ---------------- */

function showLogin(role) {
    currentRole = role;

    const roleSection = document.getElementById("role-selection");
    const loginContainer = document.getElementById("login-container");
    const loginTitle = document.getElementById("login-title");
    const idLabel = document.getElementById("id-label");

    const regContainer = document.getElementById("register-container");
    const regText = document.getElementById("register-text");
    const regLink = document.getElementById("register-link");

    roleSection.classList.add("hidden");
    loginContainer.classList.remove("hidden");
    loginContainer.classList.add("fade-in");

    if (role === "patient") {
        loginTitle.innerText = "Patient Portal";
        idLabel.innerText = "Patient ID / Email";

        regContainer.classList.remove("hidden");
        regText.innerText = "Don't have an account?";
        regLink.href = "register.html";
        regLink.innerText = "Register here";

    } else if (role === "doctor") {
        loginTitle.innerText = "Doctor Consultation Login";
        idLabel.innerText = "Medical License ID";

        regContainer.classList.remove("hidden");
        regText.innerText = "New Consultant?";
        regLink.href = "doctor-register.html";
        regLink.innerText = "Register here";

    } else {
        regContainer.classList.add("hidden");
    }
}

function showRoles() {
    document.getElementById("role-selection").classList.remove("hidden");
    document.getElementById("login-container").classList.add("hidden");
}

/* ---------------- LOGIN SUBMIT ---------------- */

document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = document.getElementById("username").value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                password: password,
                role: currentRole
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            alert("Login Failed: " + (errData.detail || "Unknown error"));
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", userId);

        if (data.role === "patient") {
            window.location.href = "patient-dashboard.html";
        } else {
            window.location.href = "doctor-dashboard.html";
        }

    } catch (error) {
        alert("Backend not reachable");
        console.error(error);
    }
});
