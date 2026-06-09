// -------------------------
// Selectors
const otpInputs = document.querySelectorAll(".otp-box input");
const checkOTPBtn = document.querySelector(".check-btn");
const sendOtpBtn = document.querySelector(".send-btn");
const emailInput = document.querySelector(".email-box input");
const timerText = document.querySelector(".timer-text span");

let countdownInterval;

// -------------------------
// OTP Input Navigation
otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, ""); // only numbers
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

// -------------------------
// Send OTP
sendOtpBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) {
        alert("Please enter your email");
        return;
    }

    try {
        const res = await fetch("/api/auth/forgot-password-init", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email })
        });
        const data = await res.json();
        if (data.status === "success") {
            alert("OTP sent to your email!");
            startTimer(30); // start 30-second countdown
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to send OTP. Try again.");
    }
});

// -------------------------
// Verify OTP
checkOTPBtn.addEventListener("click", async () => {
    let otp = "";
    otpInputs.forEach(input => otp += input.value);

    if (otp.length !== otpInputs.length) {
        alert("Please enter full OTP");
        return;
    }

    try {
        const res = await fetch("/api/auth/verify-reset-otp", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ otp })
        });
        const data = await res.json();
        if (data.status === "success") {
            alert("OTP verified! Redirecting to reset password page...");
            window.location.href = "/reset_ps";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("OTP verification failed. Try again.");
    }
});

// -------------------------
// Countdown Timer
function startTimer(duration) {
    clearInterval(countdownInterval);
    let time = duration;
    timerText.textContent = time;
    countdownInterval = setInterval(() => {
        time--;
        timerText.textContent = time;
        if (time <= 0) {
            clearInterval(countdownInterval);
            alert("OTP expired. Please resend OTP.");
        }
    }, 1000);
}