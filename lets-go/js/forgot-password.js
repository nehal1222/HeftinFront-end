const forgotForm = document.getElementById("forgotForm");

const emailInput = document.getElementById("email");

const emailError = document.getElementById("emailError");

const formMessage = document.getElementById("formMessage");

const submitButton = document.getElementById("submitButton");

const buttonText = document.getElementById("buttonText");

const buttonArrow = document.getElementById("buttonArrow");

const loader = document.getElementById("loader");

const formView = document.getElementById("formView");

const successView = document.getElementById("successView");

const sentToEmail = document.getElementById("sentToEmail");

const resendButton = document.getElementById("resendButton");


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

    emailInput.closest(".input-wrapper").classList.remove("has-error");

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


/* ================================
   FORGOT PASSWORD FORM
================================ */

forgotForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const email = emailInput.value.trim();

    if (email === "") {

        emailError.textContent = "Please enter your email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        return;

    }

    if (!isValidEmail(email)) {

        emailError.textContent = "Please enter a valid email address.";

        emailInput.closest(".input-wrapper").classList.add("has-error");

        return;

    }


    /* LOADING */

    submitButton.disabled = true;

    buttonText.classList.add("hidden");

    buttonArrow.classList.add("hidden");

    loader.classList.remove("hidden");


    /* DEMO BACKEND DELAY — no real email is sent here; this just
       simulates the round trip before revealing the success view. */

    setTimeout(function () {

        sentToEmail.textContent = email;

        formView.classList.add("hidden");

        successView.classList.remove("hidden");

        startResendCooldown();

    }, 1100);

});


/* ================================
   REMOVE ERROR WHILE TYPING
================================ */

emailInput.addEventListener("input", function () {

    clearErrors();

});


/* ================================
   RESEND COOLDOWN
================================ */

function startResendCooldown() {

    let seconds = 30;

    resendButton.disabled = true;

    resendButton.textContent = "Resend in " + seconds + "s";

    const interval = setInterval(function () {

        seconds -= 1;

        if (seconds <= 0) {

            clearInterval(interval);

            resendButton.disabled = false;

            resendButton.textContent = "Resend";

        } else {

            resendButton.textContent = "Resend in " + seconds + "s";

        }

    }, 1000);

}

resendButton.addEventListener("click", function () {

    if (resendButton.disabled) {

        return;

    }

    startResendCooldown();

});
