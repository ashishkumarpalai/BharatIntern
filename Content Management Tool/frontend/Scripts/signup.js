document.addEventListener("DOMContentLoaded", function () {
    const loginToggle = document.getElementById("login-toggle");
    const signupToggle = document.getElementById("signup-toggle");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    loginToggle.addEventListener("click", function () {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        loginToggle.style.backgroundColor = "#eee";
        signupToggle.style.backgroundColor = "transparent";
    });

    signupToggle.addEventListener("click", function () {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        signupToggle.style.backgroundColor = "#eee";
        loginToggle.style.backgroundColor = "transparent";
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        const loginData = {
            email: email,
            password: password
        };

        // Replace with your API endpoint for login
        fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg == "Sucessfully Login ") {
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("user", data.user)
                    localStorage.setItem("name", data.name)
                    console.log(data)
                    // swal("Login Successful", "", "success")
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'You have successfully logged in.',
                    });
                    // window.open("../index.html")
                    window.location.href = "../index.html"
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid credentials. Please try again.',
                    });
                    window.location.href = "signup.html";
                }
                console.log("Login API Response:", data);
                // Handle the response, such as redirecting the user or displaying an error message
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;

        const signupData = {
            name: fullName,
            email: email,
            password: password
        };

        // Replace with your API endpoint for signup
        fetch("http://localhost:3000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Signup API Response:", data);
                // Handle the response, such as redirecting the user or displaying an error message
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
});
