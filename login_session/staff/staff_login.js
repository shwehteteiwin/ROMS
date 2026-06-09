document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorBox = document.getElementById('error-box');
    const spaceWarning = document.getElementById('space-warning');
    const submitBtn = document.getElementById('submitBtn');

    // document.addEventListener('mousemove', (e) => {
    //     glow.style.left = e.clientX + 'px';
    //     glow.style.top = e.clientY + 'px';
    // });

    const customSelect = document.getElementById('customSelect');
    const trigger = customSelect.querySelector('.select-trigger');
    const options = customSelect.querySelectorAll('.option');
    const roleInput = document.getElementById('role'); 
    const selectedText = document.getElementById('selectedRole');

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

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('active');
        }
    });

    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            spaceWarning.style.display = 'block';
            setTimeout(() => { spaceWarning.style.display = 'none'; }, 2000);
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const role = roleInput.value; 
        const pass = passwordInput.value;

   
        if (!role) { 
            alert("Please select a staff role."); 
            return; 
        }
        if (pass.length < 8) { 
            alert("Security key must be at least 8 characters."); 
            return; 
        }

        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;

            if (pass === 'admin123') {
                alert("Login Successful!");
                errorBox.style.display = 'none';
            } else {
                errorBox.style.display = 'block';
                
                const card = document.querySelector('.login-card');
                
                passwordInput.value = '';
            }
        }, 1500);
    });
});