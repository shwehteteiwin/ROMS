// ===== Get elements =====
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const sendOtpBtn = document.getElementById("sendOtpBtn");

const otpSection = document.getElementById("otpSection");
const otpInputs = document.querySelectorAll(".otp-box input");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");


// ===== Auto-fill name & email from sessionStorage =====
window.addEventListener("DOMContentLoaded", () => {
    const savedName = sessionStorage.getItem("TMP_NAME");
    const savedEmail = sessionStorage.getItem("TMP_EMAIL");

    if (savedName && nameInput) {
        nameInput.value = savedName;
    }

    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        emailInput.readOnly = true; // optional: prevent editing
    }
});


// ===== Step 1: Send OTP =====
sendOtpBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        alert("Enter your name and email");
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
            otpSection.style.display = "block";
        } else {
            alert(data.message || "Failed to send OTP");
        }
    } catch (err) {
        console.error(err);
        alert("Server error sending OTP");
    }
});


// ===== Step 2: OTP auto-focus =====
otpInputs.forEach((input, idx) => {

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");

        if (input.value && idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && idx > 0) {
            otpInputs[idx - 1].focus();
        }
    });

});


// ===== Step 3: Verify OTP =====
verifyOtpBtn.addEventListener("click", async () => {
    let otp = "";

    otpInputs.forEach(input => {
        otp += input.value.trim();
    });

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

            // Clear temporary session data
            sessionStorage.removeItem("TMP_NAME");
            sessionStorage.removeItem("TMP_EMAIL");

            alert("OTP verified! Set your password next.");

            window.location.href = "./set_ps.html";
        } else {
            alert(data.message || "OTP verification failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error verifying OTP");
    }
});
// const nameInput = document.getElementById("name");
// const emailInput = document.getElementById("email");
// const sendOtpBtn = document.getElementById("sendOtpBtn");

// const otpSection = document.getElementById("otpSection");
// const otpInputs = document.querySelectorAll(".otp-box input");
// const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// // Step 1: Send OTP
// sendOtpBtn.addEventListener("click", async () => {
//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();

//     if (!name || !email) {
//         alert("Enter your name and email");
//         return;
//     }

//     try {
//         const formData = new URLSearchParams({ name, email });

//         const res = await fetch("/api/auth/signup-init", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: formData,
//             credentials: "include"
//         });

//         const data = await res.json();

//         if (data.status === "success") {
//             alert("OTP sent! Check your email.");
//             otpSection.style.display = "block";
//         } else {
//             alert(data.message || "Failed to send OTP");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Server error sending OTP");
//     }
// });

// // Step 2: OTP input auto-focus
// otpInputs.forEach((input, idx) => {
//     input.addEventListener("input", () => {
//         input.value = input.value.replace(/[^0-9]/g, "");
//         if (input.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
//     });
//     input.addEventListener("keydown", (e) => {
//         if (e.key === "Backspace" && !input.value && idx > 0) otpInputs[idx - 1].focus();
//     });
// });

// // Step 3: Verify OTP
// verifyOtpBtn.addEventListener("click", async () => {
//     let otp = "";
//     otpInputs.forEach(i => otp += i.value.trim());

//     if (otp.length !== 6) { alert("Enter full 6-digit OTP"); return; }

//     try {
//         const formData = new URLSearchParams({ otp });

//         const res = await fetch("/api/auth/verify-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: formData,
//             credentials: "include"
//         });

//         const data = await res.json();

//         if (data.status === "success") {
//             alert("OTP verified! Set your password next.");
//             window.location.href = "./set_ps.html"; // go to set password page
//         } else {
//             alert(data.message || "OTP verification failed");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Server error verifying OTP");
//     }
// });
// const otpInputs = document.querySelectorAll(".otp-box input");
// const checkOTP = document.querySelector(".check-btn");

// otpInputs.forEach((input, index) => {

//     input.addEventListener("input", () => {
//         // Allow only numbers
//         input.value = input.value.replace(/[^0-9]/g, "");

//         // Move to next input if number entered
//         if (input.value && index < otpInputs.length - 1) {
//             otpInputs[index + 1].focus();
//         }
//     });

//     input.addEventListener("keydown", (e) => {
//         // Move back on backspace
//         if (e.key === "Backspace" && !input.value && index > 0) {
//             otpInputs[index - 1].focus();
//         }
//     });

// });
// checkOTP.addEventListener("click", () => {
//     window.location.href = './set_ps.html';
// })
// // getOtp.js
// const sendBtn = document.querySelector(".send-btn");
// const emailInput = document.querySelector(".email-box input");
// const overlay = document.getElementById("overlay"); // if you want blur overlay

// sendBtn.addEventListener("click", async () => {
//     const email = emailInput.value.trim();
//     const name = prompt("Enter your name for signup"); // simple prompt or create a name field

//     if (!email || !name) {
//         alert("Enter your name and email");
//         return;
//     }

//     try {
//         const formData = new URLSearchParams({ name, email });

//         const res = await fetch("/api/auth/signup-init", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: formData,
//             credentials: "include"
//         });

//         const data = await res.json();

//         if (data.status === "success") {
//             alert("OTP sent to your email");
//             // redirect to OTP page
//             window.location.href = "./otp.html"; // create a separate OTP page if needed
//         } else {
//             alert(data.message || "Failed to send OTP");
//         }
//     } catch (err) {
//         console.error("Error sending OTP:", err);
//         alert("Server error sending OTP");
//     }
// });