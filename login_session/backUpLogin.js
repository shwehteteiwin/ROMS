
const passwordInput = document.querySelector('.password');
// const togglePassword = document.getElementById('togglePassword');
const container= document.getElementById('container');
const registerBtn=document.getElementById('register-btn');
const loginBtn=document.getElementById('login-btn');
const loginPg=document.querySelector('.login_tab');



loginPg.addEventListener("click", async () => {

    const email = document.getElementById("user_email").value;
    const password = document.getElementById("login_password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                email: email,
                password: password
            })
        });

        const result = await response.text();

        if (result === "Login successful") {
            window.location.href = "/profile";
        } else {
            alert(result);
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Server error");
    }

});

// togglePassword.addEventListener('click', () => {
//     const isPassword = passwordInput.type === 'password';
//     passwordInput.type = isPassword ? 'text' : 'password';
//     togglePassword.classList.toggle('fa-eye');
//     togglePassword.classList.toggle('fa-eye-slash');
// });
registerBtn.addEventListener('click', ()=>{
    container.classList.add('active');
})
loginBtn.addEventListener('click',()=>{
    container.classList.remove('active');
})
// document.querySelector(".btn.login").addEventListener("click", function(e){
//     e.preventDefault();

//     const pwd = document.getElementById("loginPassword").value;
//     const err = document.getElementById("loginError");

//     if(pwd.length < 8){
//         err.innerText = "Password must be at least 8 characters!";
//     }else{
//         err.innerText = "";
//         alert("Login success (demo)");
//     }
// });
document.querySelectorAll('.togglePassword').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('input');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
});

