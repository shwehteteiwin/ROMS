const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const lengthNote = document.getElementById("lengthNote");
const resetBtn = document.getElementById("resetBtn");

// Eye toggle
document.querySelectorAll(".eye-icon").forEach(icon => {
    const targetId = icon.dataset.target;
    const input = document.getElementById(targetId);

    icon.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        }
    });
});

// Password length validation
passwordInput.addEventListener("input", () => {
    if (passwordInput.value.length < 8) {
        lengthNote.textContent = "Must be at least 8 characters!";
        lengthNote.style.color = "red";
    } else {
        lengthNote.textContent = "Password length is valid ✔";
        lengthNote.style.color = "green";
    }
});

// Submit password
resetBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (password.length < 8) { alert("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { alert("Passwords do not match"); return; }

    try {
        const formData = new URLSearchParams({ password });

        const res = await fetch("/api/auth/set-password", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include"
        });

        const data = await res.json();

        if (data.status === "success") {
            alert("Signup complete! You can now login");
            window.location.href = "./login.html";
        } else {
            alert(data.message || "Failed to set password");
        }
    } catch (err) {
        console.error(err);
        alert("Server error setting password");
    }
});

// // const overlay = document.querySelector(".overlay");
// const resetContainer = document.querySelector(".reset-container");
// const background = document.querySelector(".background");

// const successPopup = document.getElementById("successPopup");
// const failPopup = document.getElementById("failPopup");
// const failMsg = document.getElementById("failMsg");

// // Eye toggle (show / hide password)
// document.querySelectorAll(".eye-icon").forEach(icon => {
  
//         const targetId = icon.getAttribute("data-target");
//         const input = document.getElementById(targetId);
       

//     icon.addEventListener("click", () => {
//         if (input.type === "text") {
//             input.type = "password"; // hide text
//             icon.classList.remove("fa-eye");
//             icon.classList.add("fa-eye-slash");
//         } else {
//             input.type = "text"; // show text
//             icon.classList.remove("fa-eye-slash");
//             icon.classList.add("fa-eye");
//         }
        
//     });
// });

// // 8 chars check in text box
// const passwordInput = document.getElementById("password");
// const lengthNote = document.getElementById("lengthNote");

// passwordInput.addEventListener("input", () => {
//     if (passwordInput.value.length < 8) {
//         lengthNote.textContent = "Must be at least 8 characters!";
//         lengthNote.style.color = "red";
//     } else {
//         lengthNote.textContent = "Password length is valid ✔";
//         lengthNote.style.color = "green";
//     }
// });

// // Reset button logic
// document.getElementById("resetBtn").addEventListener("click", () => {
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     successPopup.style.display = "none";
//     failPopup.style.display = "none";
//     resetContainer.classList.remove("blur-background");
  
//     // overlay.style.display = "none";
    
       


//     if (password.length < 8) {
//         failMsg.textContent = "Password must be at least 8 characters!";
//         // overlay.style.display = "block";
//         failPopup.style.display = "block";
//         resetContainer.classList.add("blur-background");
            
//         return;
//     }

//     if (password !== confirmPassword) {
//         failMsg.textContent = "New passwords don't match!";
//          overlay.style.display = "block";
//         failPopup.style.display = "block";
//         resetContainer.classList.add("blur-background");
        
//         return;
//     }
// //    overlay.style.display = "block";
//     successPopup.style.display = "block";
//     resetContainer.classList.add("blur-background");
     
// });

// // Close icons
// document.querySelectorAll(".close-popup").forEach(closeBtn => {
//     closeBtn.addEventListener("click", () => {
//         // overlay.style.display = "none";
//         successPopup.style.display = "none";
//         failPopup.style.display = "none";
//         resetContainer.classList.remove("blur-background");
   
//     });
// });
