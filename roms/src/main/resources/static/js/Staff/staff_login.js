document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorBox = document.getElementById('error-box');
    const spaceWarning = document.getElementById('space-warning');
    const submitBtn = document.getElementById('submitBtn');

    const customSelect = document.getElementById('customSelect');
    const trigger = customSelect.querySelector('.select-trigger');
    const options = customSelect.querySelectorAll('.option');
    const roleInput = document.getElementById('role');
    const selectedText = document.getElementById('selectedRole');

    // Role dropdown toggle
    trigger.addEventListener('click', () => {
        customSelect.classList.toggle('active');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            const text = option.innerText;

            selectedText.innerText = text;
            roleInput.value = value;
            customSelect.classList.remove('active');
            selectedText.style.color = "var(--text-main)";
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('active');
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Block spaces in password
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            spaceWarning.style.display = 'block';
            setTimeout(() => { spaceWarning.style.display = 'none'; }, 2000);
        }
    });

    // Form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleInput.value.trim();

            errorBox.style.display = 'none';

    // Show what we're about to send
    // alert(`Attempting login:\nEmail: ${email}\nRole: ${role}\nPassword length: ${password.length}`);

        // Basic validation
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        if (!role) {
            alert("Please select a staff role.");
            return;
        }
        if (!password || password.length < 8) {
            alert("Please enter a valid password (min 8 characters).");
            return;
        }

        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        console.log("[Login] Attempt:", { email, role });

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, password, role })
            });

            const data = await res.json();
            console.log("[Login] Response:", data);

            if (data.status === 'success') {

                alert("Login successful!");

                window.location.href = data.redirect;
            } else {
                errorBox.style.display = 'block';
                passwordInput.value = '';
                errorBox.querySelector('p').innerText = `❌ ${data.message || 'Login failed'}`;
            }
        } catch (err) {
            console.error("[Login] Exception:", err);
            errorBox.style.display = 'block';
            errorBox.querySelector('p').innerText = `❌ Server error. Try again.`;
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
});