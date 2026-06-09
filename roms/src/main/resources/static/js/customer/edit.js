const input = document.getElementById("profileInput");
const img = document.getElementById("profileImg");
const saveBtn = document.querySelector(".save-btn");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");

/* =========================
   LOAD PROFILE FROM BACKEND
========================= */
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/profile", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Not authenticated");
        }

        const data = await response.json();

        nameInput.value = data.name || "";
        emailInput.value = data.email || "";

        if (data.photoUrl) {
            img.src = data.photoUrl;
        }

    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Please login first.");
        window.location.href = "/login.html";
    }
});

/* =========================
   IMAGE PREVIEW
========================= */
input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        input.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});

/* =========================
   SAVE PROFILE
========================= */
saveBtn.addEventListener("click", async function () {

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        alert("Please fill in all fields.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email address.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (input.files[0]) {
        formData.append("image", input.files[0]);
    }

    try {
        const response = await fetch("/api/auth/editProfile", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("✅ Profile updated successfully!");
            location.reload();
        } else {
            alert("❌ " + result.message);
        }

    } catch (error) {
        console.error("Error saving profile:", error);
        alert("❌ Failed to save profile.");
    }
});
