// ===============================
// PANEL TOGGLE
// ===============================
const container = document.getElementById('container');

document.getElementById('register-btn').addEventListener('click', () => {
    container.classList.add('active');
});

document.getElementById('login-btn').addEventListener('click', () => {
    container.classList.remove('active');
});


// ===============================
// PASSWORD TOGGLE
// ===============================
document.querySelectorAll('.togglePassword').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('input');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.replace(
            isPassword ? 'fa-eye-slash' : 'fa-eye',
            isPassword ? 'fa-eye' : 'fa-eye-slash'
        );
    });
});


// ===============================
// LOGIN
// ===============================
document.querySelector('.login_tab').addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById("user_email").value.trim();
    const password = document.getElementById("login_password").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    try {
        const formData = new URLSearchParams({ email, password, role: "CUSTOMER" });

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include"
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            window.location.replace(result.redirect);
        } else {
            alert(result.message || "Login failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error during login");
    }
});


// ===============================
// OTP + REGISTER LOGIC
// ===============================


const nameInput = document.getElementById("user_name");
const emailInput = document.querySelector(".email-box input");
const sendOtpBtn = document.querySelector(".sendOtpToMail");
const verifyOtpBtn = document.querySelector(".checkOtp");
const otpInputs = document.querySelectorAll(".otp-box input");
const registerBtn = document.querySelector(".register_tab");
let otpVerified = false;

// ===============================
// SEND OTP
// ===============================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
sendOtpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        alert("Enter your name and email");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address (example: user@gmail.com)");
        return;
    }
    try {
        const formData = new URLSearchParams({ name, email });

        const res = await fetch("/api/auth/signup-init", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include"
        });

        const data = await res.json();

        if (data.status === "success") {
            alert("OTP sent! Check your email.");
        } else {
            alert(data.message || "Failed to send OTP");
        }

    } catch (err) {
        console.error(err);
        alert("Server error sending OTP");
    }
});


// ===============================
// OTP AUTO FOCUS
// ===============================
otpInputs.forEach((input, index) => {

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");

        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

});


// ===============================
// VERIFY OTP
// ===============================
// verifyOtpBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
verifyOtpBtn.addEventListener("click", async () => {
    let otp = "";
    otpInputs.forEach(input => otp += input.value.trim());

    if (otp.length !== 6) {
        alert("Enter full 6-digit OTP");
        return;
    }

    try {
        const formData = new URLSearchParams({ otp });

        const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include"
        });

        const data = await res.json();

        if (data.status === "success") {
            otpVerified = true;
            alert("OTP verified successfully!");

            otpInputs.forEach(i => i.disabled = true);
            sendOtpBtn.disabled = true;
            alert("OTP verified!");
        } else {
            otpVerified = false;
            alert(data.message || "OTP verification failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error verifying OTP");
    }
});


// ===============================
// FINAL REGISTER
// ===============================
// registerBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
registerBtn.addEventListener("click", async () => {
    if (!otpVerified) {
        alert("Please verify OTP first!");
        return;
    }

    const password = document.getElementById("register_password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();

    if (!password || !confirmPassword) {
        alert("Fill all password fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    try {
        const formData = new URLSearchParams({ password });
        const res = await fetch("/api/auth/signup-complete", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include"
        });

        const data = await res.json();
        if (data.status === "success") {
            alert("Registration successful!");
            window.location.href = "/login";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Server error during registration");
    }
});
