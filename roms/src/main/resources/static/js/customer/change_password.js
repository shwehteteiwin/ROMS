const discardBtn = document.querySelector(".discard-btn");
const applyBtn = document.querySelector(".apply-btn");

/* APPLY button click */
applyBtn.addEventListener("click", async () => {

    const currentPwd = document.getElementById("currentPwd").value.trim();
    const newPwd = document.getElementById("newPwd").value.trim();
    const confirmPwd = document.getElementById("confirmPwd").value.trim();

    // 1️⃣ Empty fields
    if (!currentPwd || !newPwd || !confirmPwd) {
        alert("Please fill all fields");
        return;
    }

    // 2️⃣ Password mismatch
    if (newPwd !== confirmPwd) {
        alert("New passwords don't match");
        return;
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPwd);
    formData.append("newPassword", newPwd);

    try {

        const response = await fetch("/api/auth/change-password", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await response.json();

        if (data.status === "success") {

            alert("Password changed successfully!");

            // redirect to profile page
            window.location.href = "/profile";

        } else {

            alert(data.message || "Failed to change password");

        }

    } catch (error) {

        console.error(error);
        alert("Server error while changing password");

    }

});


/* DISCARD button click */
discardBtn.addEventListener("click", () => {

    const confirmDiscard = confirm("Discard changes?");

    if (confirmDiscard) {

        // redirect to profile page
        window.location.href = "/profile";

    }

});


/* TOGGLE password visibility */
function togglePwd(id, icon) {

    const input = document.getElementById(id);

    if (icon.classList.contains("fa-eye")) {

        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

    }
}