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
        student: ["Student", "Delhi Public Academy"],
        org_admin: ["Organization Admin", "Delhi Public Academy"],
        teacher: ["Teacher", "Delhi Public Academy"],
        platform_admin: ["Platform administrator", "Heftin platform"],
    };
    const details = labels[role] || labels.org_admin;
    document.getElementById("welcomeName").textContent = name;
    document.getElementById("welcomeRole").textContent = details[0];
    document.getElementById("welcomeOrganization").textContent = details[1];
    document.getElementById("workspaceWelcome").classList.remove("hidden");
}

function switchLoginMode(mode) {
    const tabOrg = document.getElementById("tabOrg");
    const tabInd = document.getElementById("tabInd");
    const orgForm = document.getElementById("loginForm");
    const indContainer = document.getElementById("individualContainer");
    const bottomText = document.querySelector(".bottom-text");
    const testDeck = document.getElementById("reviewerTestDeck");

    if (mode === "ind") {
        if (tabOrg) {
            tabOrg.style.background = "#ffffff";
            tabOrg.style.color = "var(--error)";
            tabOrg.style.border = "1px solid var(--border)";
        }
        if (tabInd) {
            tabInd.style.background = "var(--primary)";
            tabInd.style.color = "#ffffff";
            tabInd.style.border = "none";
        }
        if (orgForm) orgForm.style.display = "none";
        if (testDeck) testDeck.style.display = "none";
        if (bottomText) bottomText.style.display = "none";
        if (indContainer) indContainer.style.display = "block";
    } else {
        if (tabOrg) {
            tabOrg.style.background = "var(--primary)";
            tabOrg.style.color = "#ffffff";
            tabOrg.style.border = "none";
        }
        if (tabInd) {
            tabInd.style.background = "#ffffff";
            tabInd.style.color = "var(--error)";
            tabInd.style.border = "1px solid var(--border)";
        }
        if (orgForm) orgForm.style.display = "block";
        if (testDeck) testDeck.style.display = "block";
        if (bottomText) bottomText.style.display = "block";
        if (indContainer) indContainer.style.display = "none";
    }
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
    formMessage.dataset.state = "idle";

}

let currentPersona = "org_admin";

function fillTestAccount(email, password, persona) {
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
    currentPersona = persona;
    clearErrors();
    const tenantEl = document.getElementById("tenantIndicator");
    if (tenantEl) {
        if (persona === "platform_admin") {
            tenantEl.innerHTML = '<div><strong style="display: block; color: var(--error);">Heftin Platform Central</strong><span style="color: var(--primary); font-size: 10px; font-weight: 600;">Platform Administrator · Full Scope</span></div><span style="color: var(--primary); font-weight: 700; font-size: 10px;">✓ Platform</span>';
        } else if (persona === "student") {
            tenantEl.innerHTML = '<div><strong style="display: block; color: var(--error);">Delhi Public Academy</strong><span style="color: var(--primary); font-size: 10px; font-weight: 600;">Tenant: org_001 · Student (Batch 101)</span></div><span style="color: var(--primary); font-weight: 700; font-size: 10px;">✓ Verified</span>';
        } else {
            tenantEl.innerHTML = '<div><strong style="display: block; color: var(--error);">Delhi Public Academy</strong><span style="color: var(--primary); font-size: 10px; font-weight: 600;">Tenant: org_001 · ' + (persona === "teacher" ? "Faculty (Batch 101 Scoped)" : "Org Admin (Institution-wide)") + '</span></div><span style="color: var(--primary); font-weight: 700; font-size: 10px;">✓ Verified</span>';
        }
    }
}

/* ================================
   LOGIN FORM
================================ */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    let selectedPersona = currentPersona;
    if (email.includes("student") || email.includes("sana")) {
        selectedPersona = "student";
    } else if (email.includes("teacher") || email.includes("rohit")) {
        selectedPersona = "teacher";
    } else if (email.includes("admin") || email.includes("platform")) {
        selectedPersona = "platform_admin";
    } else {
        selectedPersona = "org_admin";
    }

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
    loginForm.setAttribute("aria-busy", "true");
    formMessage.textContent = "Signing you in...";
    formMessage.dataset.state = "loading";
    formMessage.setAttribute("role", "status");

    buttonText.classList.add("hidden");

    buttonArrow.classList.add("hidden");

    loader.classList.remove("hidden");


    /* DEMO BACKEND DELAY */

    setTimeout(function () {

        formMessage.textContent =
            "Demo access ready — opening the Phase 1 workspace...";

        formMessage.classList.add("success");
        formMessage.dataset.state = "success";
        formMessage.setAttribute("role", "status");


        /* No real backend here — this demos a successful login by
           sending the user into the dashboard app after a short pause
           so the success message is actually visible first. */

        setTimeout(function () {

            try {
                localStorage.setItem("heftin-phase1-persona", selectedPersona);
                localStorage.removeItem("heftinRole");
                const displayName = email.split("@")[0];
                localStorage.setItem("heftinName", displayName);
                showWorkspaceWelcome(selectedPersona, displayName);
                loginForm.removeAttribute("aria-busy");

                setTimeout(function () {
                    window.location.href = "dashboard/index.html";
                }, 10000);
            } catch (error) {
                try {
                    localStorage.removeItem("heftinRole");
                    localStorage.removeItem("heftinName");
                    localStorage.removeItem("heftin-phase1-persona");
                } catch (storageError) {}
                loginButton.disabled = false;
                loginForm.removeAttribute("aria-busy");
                buttonText.classList.remove("hidden");
                buttonArrow.classList.remove("hidden");
                loader.classList.add("hidden");
                formMessage.textContent = "Unable to start your session. Check browser storage settings and try again.";
                formMessage.className = "form-message error";
                formMessage.dataset.state = "error";
                formMessage.setAttribute("role", "alert");
            }

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
