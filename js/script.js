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

/* ==========================================================================
   HEFTIN BACKEND AUTH CLIENT (POST /login, POST /refresh, GET /me)
   Supports live backend endpoints with automatic fallback to local session.
   ========================================================================== */
const HEFTIN_AUTH_API = {
    getBaseUrl() {
        return window.HEFTIN_API_BASE || localStorage.getItem("heftin_api_base") || "http://localhost:8001/api/v1";
    },

    async login(email, password) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${this.getBaseUrl()}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    localStorage.setItem("heftin_access_token", data.access_token);
                }
                if (data.refresh_token) {
                    localStorage.setItem("heftin_refresh_token", data.refresh_token);
                }
                localStorage.setItem("heftin_auth_mode", "live");

                // Attempt fetching live /auth/me when BE-10 is available
                await this.fetchMe(data.access_token);
                return { success: true, live: true, data };
            }
        } catch (e) {
            // Backend offline or timeout -> proceed with fallback
        }
        return { success: false, live: false };
    },

    async refresh() {
        const token = localStorage.getItem("heftin_refresh_token");
        if (!token) return null;
        try {
            const res = await fetch(`${this.getBaseUrl()}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: token })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    localStorage.setItem("heftin_access_token", data.access_token);
                    return data.access_token;
                }
            }
        } catch (e) {}
        return null;
    },

    async fetchMe(token) {
        if (!token) return null;
        try {
            const res = await fetch(`${this.getBaseUrl()}/auth/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const profile = await res.json();
                localStorage.setItem("heftin_user_profile", JSON.stringify(profile));
                return profile;
            }
        } catch (e) {}
        return null;
    },

    logout() {
        localStorage.removeItem("heftin_access_token");
        localStorage.removeItem("heftin_refresh_token");
        localStorage.removeItem("heftin_user_profile");
        localStorage.removeItem("heftin_auth_mode");
    }
};

window.HEFTIN_AUTH_API = HEFTIN_AUTH_API;

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


    /* BACKEND LOGIN OR SEAMLESS LOCAL FALLBACK */
    HEFTIN_AUTH_API.login(email, password).then(function (result) {
        if (result.live) {
            formMessage.textContent = "Live backend authenticated — opening workspace...";
        } else {
            formMessage.textContent = "Demo access ready — opening the workspace...";
        }

        formMessage.classList.add("success");
        formMessage.dataset.state = "success";
        formMessage.setAttribute("role", "status");

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
                }, 1200);
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
    });

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
