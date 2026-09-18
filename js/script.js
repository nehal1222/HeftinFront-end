const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");

const passwordError = document.getElementById("passwordError");

const formMessage = document.getElementById("formMessage");

const passwordToggle = document.getElementById("passwordToggle");

const eyeOpen = document.getElementById("eyeOpen");

const eyeClosed = document.getElementById("eyeClosed");

const loginButton = document.getElementById("loginButton");

const buttonText = document.getElementById("buttonText");

const buttonArrow = document.getElementById("buttonArrow");

const loader = document.getElementById("loader");

function showWorkspaceWelcome(role, name) {
    const labels = {
        student: ["Student", "Personal workspace"],
        individual: ["Individual learner", "Personal workspace"],
        faculty: ["Faculty", "Heftin UPSC Institute"],
        org_admin: ["Organization Admin", "Heftin UPSC Institute"],
        super_admin: ["Heftin Super Admin", "Heftin platform"],
    };
    const details = labels[role] || labels.student;
    document.getElementById("welcomeName").textContent = name;
    document.getElementById("welcomeRole").textContent = details[0];
    document.getElementById("welcomeOrganization").textContent = details[1];
    document.getElementById("workspaceWelcome").classList.remove("hidden");
}


/* ================================
   SHOW / HIDE PASSWORD
================================ */

passwordToggle.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        eyeOpen.classList.add("hidden");

        eyeClosed.classList.remove("hidden");

    } else {

        passwordInput.type = "password";

        eyeOpen.classList.remove("hidden");

        eyeClosed.classList.add("hidden");

    }

});


/* ================================
   EMAIL VALIDATION
================================ */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* ================================
   CLEAR ERRORS
================================ */

function clearErrors() {

    emailError.textContent = "";

    passwordError.textContent = "";

    emailInput.closest(".input-wrapper").classList.remove("has-error");

    passwordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


/* ================================
   LOGIN FORM
================================ */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    const selectedRole = loginForm.querySelector('input[name="role"]:checked')?.value || "student";

    let valid = true;


    /* EMAIL */

    if (email === "") {

        emailError.textContent =
            "Please enter your email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (!isValidEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* PASSWORD */

    if (password === "") {

        passwordError.textContent =
            "Please enter your password.";

        passwordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        passwordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* STOP IF INVALID */

    if (!valid) {

        return;

    }


    /* LOADING */

    loginButton.disabled = true;

    buttonText.classList.add("hidden");

    buttonArrow.classList.add("hidden");

    loader.classList.remove("hidden");


    /* DEMO BACKEND DELAY */

    setTimeout(function () {

        formMessage.textContent =
            "Signed in — redirecting to your dashboard...";

        formMessage.classList.add("success");


        /* No real backend here — this demos a successful login by
           sending the user into the dashboard app after a short pause
           so the success message is actually visible first. */

        setTimeout(function () {

            localStorage.setItem("heftinRole", selectedRole);
            const displayName = email.split("@")[0];
            localStorage.setItem("heftinName", displayName);
            showWorkspaceWelcome(selectedRole, displayName);

            setTimeout(function () {
                window.location.href = "dashboard/index.html";
            }, 10000);

        }, 700);


    }, 1200);

});


/* ================================
   REMOVE EMAIL ERROR WHILE TYPING
================================ */

emailInput.addEventListener("input", function () {

    emailError.textContent = "";

    emailInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

});


/* ================================
   REMOVE PASSWORD ERROR WHILE TYPING
================================ */

passwordInput.addEventListener("input", function () {

    passwordError.textContent = "";

    passwordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

});
