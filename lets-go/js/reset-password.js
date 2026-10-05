const resetForm = document.getElementById("resetForm");

const newPasswordInput = document.getElementById("newPassword");

const confirmPasswordInput = document.getElementById("confirmPassword");

const newPasswordError = document.getElementById("newPasswordError");

const confirmPasswordError = document.getElementById("confirmPasswordError");

const formMessage = document.getElementById("formMessage");

const submitButton = document.getElementById("submitButton");

const buttonText = document.getElementById("buttonText");

const buttonArrow = document.getElementById("buttonArrow");

const loader = document.getElementById("loader");

const formView = document.getElementById("formView");

const successView = document.getElementById("successView");


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

wireToggle("newPasswordToggle", newPasswordInput, "newEyeOpen", "newEyeClosed");

wireToggle("confirmPasswordToggle", confirmPasswordInput, "confirmEyeOpen", "confirmEyeClosed");


/* ================================
   CLEAR ERRORS
================================ */

function clearErrors() {

    newPasswordError.textContent = "";

    confirmPasswordError.textContent = "";

    newPasswordInput.closest(".input-wrapper").classList.remove("has-error");

    confirmPasswordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


/* ================================
   RESET PASSWORD FORM
================================ */

resetForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const newPassword = newPasswordInput.value;

    const confirmPassword = confirmPasswordInput.value;

    let valid = true;


    /* NEW PASSWORD */

    if (newPassword === "") {

        newPasswordError.textContent = "Please enter a new password.";

        newPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (newPassword.length < 6) {

        newPasswordError.textContent = "Password must contain at least 6 characters.";

        newPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    /* CONFIRM PASSWORD */

    if (confirmPassword === "") {

        confirmPasswordError.textContent = "Please confirm your new password.";

        confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    } else if (valid && confirmPassword !== newPassword) {

        confirmPasswordError.textContent = "Passwords do not match.";

        confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");

        valid = false;

    }


    if (!valid) {

        return;

    }


    /* LOADING */

    submitButton.disabled = true;

    buttonText.classList.add("hidden");

    buttonArrow.classList.add("hidden");

    loader.classList.remove("hidden");


    /* DEMO BACKEND DELAY — no real account exists here, so this just
       simulates the round trip before revealing the success view. */

    setTimeout(function () {

        formView.classList.add("hidden");

        successView.classList.remove("hidden");

    }, 1100);

});


/* ================================
   REMOVE ERRORS WHILE TYPING
================================ */

newPasswordInput.addEventListener("input", function () {

    newPasswordError.textContent = "";

    newPasswordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

});

confirmPasswordInput.addEventListener("input", function () {

    confirmPasswordError.textContent = "";

    confirmPasswordInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

});
