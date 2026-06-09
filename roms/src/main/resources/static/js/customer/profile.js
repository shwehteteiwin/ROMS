// /js/customer/profile.js

async function loadProfile() {
    try {
        const response = await fetch("/api/profile", {
            credentials: "include" // send session cookie
        });

        if (!response.ok) {
            // session expired or not logged in
            window.location.href = "/login";
            return;
        }

        const data = await response.json();

        // Update profile info
        document.querySelector(".profile-container h1").textContent = data.name;
        document.querySelector(".email-badge").textContent = data.email;
            // ✅ Update profile image
        const profileImg = document.querySelector(".profile-container img"); // adjust selector
        if (profileImg) {
            profileImg.src = data.photoUrl || "/images/photos/cus5.jpg"; // default if null
        }

    } catch (error) {
        console.error("Failed to load profile:", error);
        window.location.href = "/login";
    }
}

// Logout function (called from HTML)
async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
    } catch (e) {
        console.error("Logout error:", e);
    } finally {
        window.location.href = "/login";
    }
}

// Load profile when page is ready
document.addEventListener("DOMContentLoaded", loadProfile);

