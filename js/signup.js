const signupForm = document.getElementById("signupForm");

const fullNameInput = document.getElementById("fullName");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirmPassword");

const fullNameError = document.getElementById("fullNameError");

const emailError = document.getElementById("emailError");

const passwordError = document.getElementById("passwordError");

const confirmPasswordError = document.getElementById("confirmPasswordError");

const formMessage = document.getElementById("formMessage");

const signupButton = document.getElementById("signupButton");

const buttonText = document.getElementById("buttonText");

const buttonArrow = document.getElementById("buttonArrow");

const loader = document.getElementById("loader");

const formView = document.getElementById("formView");

const successView = document.getElementById("successView");

const successMessage = document.getElementById("successMessage");


/* ================================
   SHOW / HIDE PASSWORD (shared helper for both fields)
================================ */

function wireToggle(toggleId, input, eyeOpenId, eyeClosedId) {

    const toggle = document.getElementById(toggleId);

    const eyeOpen = document.getElementById(eyeOpenId);

    const eyeClosed = document.getElementById(eyeClosedId);

    toggle.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";

            eyeOpen.classList.add("hidden");

            eyeClosed.classList.remove("hidden");

        } else {

            input.type = "password";

            eyeOpen.classList.remove("hidden");

            eyeClosed.classList.add("hidden");

        }

    });

}

wireToggle("passwordToggle", passwordInput, "eyeOpen", "eyeClosed");

wireToggle("confirmPasswordToggle", confirmPasswordInput, "confirmEyeOpen", "confirmEyeClosed");


/* ================================
   EMAIL VALIDATION
================================ */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* ================================
   SELECTED ROLE
================================ */

function getSelectedRole() {

    const checked = signupForm.querySelector('input[name="role"]:checked');

    return checked ? checked.value : "student";

}

const ROLE_LABELS = {

    student: "student",

    teacher: "teacher",

    admin: "Super Admin",

};


/* ================================
   CLEAR ERRORS
================================ */

function clearErrors() {

    fullNameError.textContent = "";

    emailError.textContent = "";

    passwordError.textContent = "";

    confirmPasswordError.textContent = "";

    fullNameInput.closest(".input-wrapper").classList.remove("has-error");

    emailInput.closest(".input-wrapper").classList.remove("has-error");

    passwordInput.closest(".input-wrapper").classList.remove("has-error");

    confirmPasswordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


/* ================================
   SIGNUP FORM
================================ */

signupForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const fullName = fullNameInput.value.trim();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    const confirmPassword = confirmPasswordInput.value;

    const role = getSelectedRole();

    let valid = true;


    /* FULL NAME */

    if (fullName === "") {

        fullNameError.textContent = "Please enter your full name.";

        fullNameInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* EMAIL */

    if (email === "") {

        emailError.textContent = "Please enter your email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (!isValidEmail(email)) {

        emailError.textContent = "Please enter a valid email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* PASSWORD */

    if (password === "") {

        passwordError.textContent = "Please create a password.";

        passwordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (password.length < 6) {

        passwordError.textContent = "Password must contain at least 6 characters.";

        passwordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* CONFIRM PASSWORD */

    if (confirmPassword === "") {

        confirmPasswordError.textContent = "Please confirm your password.";

        confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (valid && confirmPassword !== password) {

        confirmPasswordError.textContent = "Passwords do not match.";

        confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* STOP IF INVALID */

    if (!valid) {

        return;

    }


    /* LOADING */

    signupButton.disabled = true;

    buttonText.classList.add("hidden");

    buttonArrow.classList.add("hidden");

    loader.classList.remove("hidden");


    /* DEMO BACKEND DELAY — no real account is created here, so this just
       simulates the round trip and remembers the chosen role locally so
       the dashboard can open in the matching view. */

    setTimeout(function () {

        try {

            localStorage.setItem("heftinRole", role);

            localStorage.setItem("heftinName", fullName);

            localStorage.setItem("heftinLoggedIn", "true");

        } catch (e) {}

        successMessage.textContent = role === "admin"
            ? "Your Super Admin account is ready. Note: a dedicated admin panel isn't built yet, so you'll land on the student/teacher dashboard for now."
            : "Your account is ready. Taking you to your " + ROLE_LABELS[role] + " dashboard...";

        formView.classList.add("hidden");

        successView.classList.remove("hidden");

    }, 1200);

});


/* ================================
   REMOVE ERRORS WHILE TYPING
================================ */

[fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(function (input) {

    input.addEventListener("input", function () {

        input.closest(".form-group").querySelector(".error-message").textContent = "";

        input.closest(".input-wrapper").classList.remove("has-error");

        formMessage.textContent = "";

        formMessage.className = "form-message";

    });

});
