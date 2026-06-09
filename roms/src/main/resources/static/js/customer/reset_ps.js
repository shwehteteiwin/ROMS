// -------------------------
// Selectors
const resetContainer = document.querySelector(".reset-container");
const successPopup = document.getElementById("successPopup");
const failPopup = document.getElementById("failPopup");
const failMsg = document.getElementById("failMsg");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const lengthNote = document.getElementById("lengthNote");
const resetBtn = document.getElementById("resetBtn");

// Eye toggle (show/hide password)
document.querySelectorAll(".eye-icon").forEach(icon => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    icon.addEventListener("click", () => {
        if (input.type === "text") {
            input.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    });
});

// Password length check
passwordInput.addEventListener("input", () => {
    if (passwordInput.value.length < 8) {
        lengthNote.textContent = "Must be at least 8 characters!";
        lengthNote.style.color = "red";
    } else {
        lengthNote.textContent = "Password length is valid ✔";
        lengthNote.style.color = "green";
    }
});

// -------------------------
// Reset password
resetBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Hide popups
    successPopup.style.display = "none";
    failPopup.style.display = "none";
    resetContainer.classList.remove("blur-background");

    // Validation
    if (password.length < 8) {
        failMsg.textContent = "Password must be at least 8 characters!";
        failPopup.style.display = "block";
        resetContainer.classList.add("blur-background");
        return;
    }

    if (password !== confirmPassword) {
        failMsg.textContent = "Passwords do not match!";
        failPopup.style.display = "block";
        resetContainer.classList.add("blur-background");
        return;
    }

    // Call backend API to update password
    try {
        const res = await fetch("/api/auth/set-password", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ password })
        });

        const data = await res.json();

        if (data.status === "success") {
            successPopup.style.display = "block";
            resetContainer.classList.add("blur-background");
        } else {
            failMsg.textContent = data.message || "Failed to reset password!";
            failPopup.style.display = "block";
            resetContainer.classList.add("blur-background");
        }
    } catch (err) {
        console.error(err);
        failMsg.textContent = "Server error. Please try again later.";
        failPopup.style.display = "block";
        resetContainer.classList.add("blur-background");
    }
});

// -------------------------
// Close popups
document.querySelectorAll(".close-popup").forEach(btn => {
    btn.addEventListener("click", () => {
        successPopup.style.display = "none";
        failPopup.style.display = "none";
        resetContainer.classList.remove("blur-background");
    });
});

// -------------------------
// Login button in success popup
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = "/login";
});