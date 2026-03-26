// CYSE 411 Exam Application
// WARNING: This code contains security vulnerabilities.
// Students must repair the implementation.

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveSession");
const loadSessionBtn = document.getElementById("loadSession");

loadBtn.addEventListener("click", loadProfile);
saveBtn.addEventListener("click", saveSession);
loadSessionBtn.addEventListener("click", loadSession);

let currentProfile = null;

function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeProfile(raw) {
    if (!isPlainObject(raw)) {
        return null;
    }

    if (typeof raw.username !== "string") {
        return null;
    }

    if (!Array.isArray(raw.notifications)) {
        return null;
    }

    const username = raw.username.trim();
    if (username.length === 0) {
        return null;
    }

    const notifications = [];
    for (const item of raw.notifications) {
        if (typeof item !== "string") {
            return null;
        }
        notifications.push(item);
    }

    return {
        username,
        notifications
    };
}

function parseAndValidateProfile(text) {
    try {
        const parsed = JSON.parse(text);
        return sanitizeProfile(parsed);
    } catch (error) {
        return null;
    }
}

function clearProfileDisplay() {
    document.getElementById("username").textContent = "";
    document.getElementById("notifications").textContent = "";
}

/* -------------------------
   Load Profile
-------------------------- */

function loadProfile() {

    const text = document.getElementById("profileInput").value;
   
    const profile = parseAndValidateProfile(text);

     if (!profile) {
        currentProfile = null;
        clearProfileDisplay();
        alert("Invalid profile data");
        return;
    }

    currentProfile = profile;

    renderProfile(profile);
}


/* -------------------------
   Render Profile
-------------------------- */

function renderProfile(profile) {

    
    document.getElementById("username").textContent = profile.username;

    const list = document.getElementById("notifications");
    list.textContent = "";

    for (const n of profile.notifications) {

        const li = document.createElement("li");

        
        li.textContent = n;

        list.appendChild(li);
    }
}


/* -------------------------
   Browser Storage
-------------------------- */

function saveSession() {
   
   if (!currentProfile) {
        alert("No valid session to save");
        return;
    }

    const safeProfile = {
        username: currentProfile.username,
        notifications: [...currentProfile.notifications]
    };
   
    localStorage.setItem("profile", JSON.stringify(safeProfile));

    alert("Session saved");
}


function loadSession() {

    const stored = localStorage.getItem("profile");

    if (!stored) {
        alert("No saved session found");
        return;
    }

    const profile = parseAndValidateProfile(stored);

    if (!profile) {
        currentProfile = null;
        localStorage.removeItem("profile");
        clearProfileDisplay();
        alert("Stored session data is invalid");
        return;
    }

    currentProfile = profile;

    renderProfile(profile);
}
