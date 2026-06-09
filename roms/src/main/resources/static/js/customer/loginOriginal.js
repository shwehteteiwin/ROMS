// ===== Container toggle for switching between login and register forms =====
const container = document.getElementById('container');
document.querySelectorAll('#register-btn, #login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        container.classList.toggle('active', btn.id === 'register-btn');
    });
});

// ===== Password toggle icons =====
document.querySelectorAll('.togglePassword').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('input');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.replace(isPassword ? 'fa-eye-slash' : 'fa-eye',
                               isPassword ? 'fa-eye' : 'fa-eye-slash');
    });
});

// ===== Form button handlers =====
document.querySelectorAll('button.register, button.login_tab').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();

        // ===== LOGIN =====
        if (btn.classList.contains('login_tab')) {
    const email = document.getElementById("user_email").value.trim();
    const password = document.getElementById("login_password").value.trim();
    if (!email || !password) { alert("Enter email and password"); return; }

    try {
        const formData = new URLSearchParams({ email, password, role: "CUSTOMER" });

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include" // important for session cookie
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            // Redirect using backend-provided URL
            window.location.replace(result.redirect);
            
        } else {
            alert(result.message || "Login failed");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Server error during login");
    }
}

        // ===== REGISTER =====
        if (btn.classList.contains('register')) {
            const name = document.getElementById("user_name").value.trim();
            const email = document.getElementById("reg_email").value.trim();
            const password = document.getElementById("register_password").value.trim();
            const confirm = document.getElementById("confirm_password").value.trim();

            if (!name || !email || !password || !confirm) { alert("Fill all fields"); return; }
            if (password !== confirm) { alert("Passwords do not match"); return; }

            try {
                const formData = new URLSearchParams({ name, email, password });

                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData
                });

                const result = await response.text();
                alert(result);
            } catch (err) {
                console.error("Signup error:", err);
                alert("Server error during signup");
            }
        }
    });
});


async function loadDashboard() {
    const el = document.getElementById("welcome");
    if (!el) return; // only run if welcome element exists

    try {
        const res = await fetch("/api/dashboard/dashboard", { credentials: "include" });
        if (res.ok) {
            const data = await res.json();
            el.textContent = `Welcome ${data.email}! Your role: ${data.role}`;
        } else {
            // Session expired or not logged in
            alert("Not logged in or session expired");
            window.location.href = "/login";
        }
    } catch (err) {
        console.error("Error loading dashboard:", err);
        alert("Server error while loading dashboard");
    }
}

// Auto-run when page loads
window.addEventListener("DOMContentLoaded", loadDashboard);

// ===== Profile loader =====
async function loadProfile() {
    if (!document.getElementById("name")) return; // only run on profile page
    try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (res.ok) {
            const profile = await res.json();
            document.getElementById("name").textContent = profile.name;
            document.getElementById("email").textContent = profile.email;
            document.getElementById("role").textContent = profile.role;
        } else {
            alert("Not logged in or session expired");
            window.location.href = "/login";
        }
    } catch (err) {
        console.error("Error loading profile:", err);
        alert("Server error while loading profile");
    }
}

// ===== Auto-load dashboard/profile =====
window.onload = () => {
    loadDashboard();
    loadProfile();
};