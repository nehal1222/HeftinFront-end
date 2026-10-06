/* ==========================================================================
   HEFTIN ACADEMY — SIGNUP & ONBOARDING CONTROLLER
   Supports:
   1. Activate Invite / Role Signup (with 1-click test fill)
   2. B2B Request Organization Access (Super Admin review queue)
   3. Individual Learner Waitlist
   ========================================================================== */

const signupForm = document.getElementById("signupForm");
const inviteCodeInput = document.getElementById("inviteCode");
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

const inviteContainer = document.getElementById("inviteContainer");
const b2bContainer = document.getElementById("b2bContainer");
const individualContainer = document.getElementById("individualContainer");

const tabInvite = document.getElementById("tabInvite");
const tabB2B = document.getElementById("tabB2B");
const tabIndiv = document.getElementById("tabIndiv");

/* ============================================================
   MODE SWITCHER: INVITE vs B2B vs INDIVIDUAL
============================================================ */
function switchSignupMode(mode) {
    if (mode === "b2b") {
        if (tabInvite) { tabInvite.style.background = "#fff"; tabInvite.style.color = "var(--error)"; tabInvite.style.border = "1px solid var(--border)"; }
        if (tabB2B) { tabB2B.style.background = "var(--primary)"; tabB2B.style.color = "#fff"; tabB2B.style.border = "none"; }
        if (tabIndiv) { tabIndiv.style.background = "#fff"; tabIndiv.style.color = "var(--error)"; tabIndiv.style.border = "1px solid var(--border)"; }

        if (inviteContainer) inviteContainer.style.display = "none";
        if (b2bContainer) b2bContainer.style.display = "block";
        if (individualContainer) individualContainer.style.display = "none";
    } else if (mode === "indiv") {
        if (tabInvite) { tabInvite.style.background = "#fff"; tabInvite.style.color = "var(--error)"; tabInvite.style.border = "1px solid var(--border)"; }
        if (tabB2B) { tabB2B.style.background = "#fff"; tabB2B.style.color = "var(--error)"; tabB2B.style.border = "1px solid var(--border)"; }
        if (tabIndiv) { tabIndiv.style.background = "var(--primary)"; tabIndiv.style.color = "#fff"; tabIndiv.style.border = "none"; }

        if (inviteContainer) inviteContainer.style.display = "none";
        if (b2bContainer) b2bContainer.style.display = "none";
        if (individualContainer) individualContainer.style.display = "block";
    } else {
        if (tabInvite) { tabInvite.style.background = "var(--primary)"; tabInvite.style.color = "#fff"; tabInvite.style.border = "none"; }
        if (tabB2B) { tabB2B.style.background = "#fff"; tabB2B.style.color = "var(--error)"; tabB2B.style.border = "1px solid var(--border)"; }
        if (tabIndiv) { tabIndiv.style.background = "#fff"; tabIndiv.style.color = "var(--error)"; tabIndiv.style.border = "1px solid var(--border)"; }

        if (inviteContainer) inviteContainer.style.display = "block";
        if (b2bContainer) b2bContainer.style.display = "none";
        if (individualContainer) individualContainer.style.display = "none";
    }
}

/* ============================================================
   WORKSPACE WELCOME OVERLAY
============================================================ */
function showWorkspaceWelcome(role, name) {
    const labels = {
        student: ["Student", "Delhi Public Academy"],
        faculty: ["Teacher / Faculty", "Delhi Public Academy"],
        org_admin: ["Organization Admin", "Delhi Public Academy"],
        super_admin: ["Platform administrator", "Heftin Platform Central"],
    };
    const details = labels[role] || labels.student;
    const nameEl = document.getElementById("welcomeName");
    const roleEl = document.getElementById("welcomeRole");
    const orgEl = document.getElementById("welcomeOrganization");
    const modalEl = document.getElementById("workspaceWelcome");

    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = details[0];
    if (orgEl) orgEl.textContent = details[1];
    if (modalEl) modalEl.classList.remove("hidden");
}

/* ============================================================
   SHOW / HIDE PASSWORD HELPERS
============================================================ */
function wireToggle(toggleId, input, eyeOpenId, eyeClosedId) {
    const toggle = document.getElementById(toggleId);
    const eyeOpen = document.getElementById(eyeOpenId);
    const eyeClosed = document.getElementById(eyeClosedId);

    if (!toggle || !input || !eyeOpen || !eyeClosed) return;

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

/* ============================================================
   EMAIL & VALIDATION HELPERS
============================================================ */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSelectedRole() {
    const checked = signupForm ? signupForm.querySelector('input[name="role"]:checked') : null;
    return checked ? checked.value : "student";
}

function clearErrors() {
    if (fullNameError) fullNameError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (confirmPasswordError) confirmPasswordError.textContent = "";

    [fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
        if (input) {
            const wrapper = input.closest(".input-wrapper");
            if (wrapper) wrapper.classList.remove("has-error");
        }
    });

    if (formMessage) {
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }
}

/* ============================================================
   EVALUATOR 1-CLICK TEST FILL
============================================================ */
function fillSignupTestAccount(name, email, role) {
    switchSignupMode("invite");
    clearErrors();

    if (fullNameInput) fullNameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = "password123";
    if (confirmPasswordInput) confirmPasswordInput.value = "password123";

    if (signupForm) {
        const radio = signupForm.querySelector(`input[name="role"][value="${role}"]`);
        if (radio) radio.checked = true;
    }

    // Update dynamic tenant badge
    const tenantName = document.getElementById("inviteTenantName");
    const tenantScope = document.getElementById("inviteTenantScope");
    const tenantBadge = document.getElementById("inviteTenantBadge");

    if (tenantName && tenantScope && tenantBadge) {
        if (role === "super_admin") {
            tenantName.textContent = "Heftin Platform Central";
            tenantScope.textContent = "Platform Administrator · Global Scope";
            tenantBadge.textContent = "✓ Platform Root";
        } else {
            tenantName.textContent = "Delhi Public Academy";
            tenantScope.textContent = role === "student" ? "Tenant: org_001 · Student (Batch 101)" : role === "faculty" ? "Tenant: org_001 · Faculty Access" : "Tenant: org_001 · Organization Admin";
            tenantBadge.textContent = "✓ Verified Invite";
        }
    }
}

/* ============================================================
   SIGNUP FORM SUBMISSION
============================================================ */
if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        const fullName = fullNameInput ? fullNameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";
        const role = getSelectedRole();

        let valid = true;

        if (fullName === "") {
            if (fullNameError) fullNameError.textContent = "Please enter your full name.";
            if (fullNameInput) fullNameInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        }

        if (email === "") {
            if (emailError) emailError.textContent = "Please enter your email address.";
            if (emailInput) emailInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        } else if (!isValidEmail(email)) {
            if (emailError) emailError.textContent = "Please enter a valid email address.";
            if (emailInput) emailInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        }

        if (password === "") {
            if (passwordError) passwordError.textContent = "Please create a password.";
            if (passwordInput) passwordInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        } else if (password.length < 6) {
            if (passwordError) passwordError.textContent = "Password must contain at least 6 characters.";
            if (passwordInput) passwordInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        }

        if (confirmPassword === "") {
            if (confirmPasswordError) confirmPasswordError.textContent = "Please confirm your password.";
            if (confirmPasswordInput) confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        } else if (valid && confirmPassword !== password) {
            if (confirmPasswordError) confirmPasswordError.textContent = "Passwords do not match.";
            if (confirmPasswordInput) confirmPasswordInput.closest(".input-wrapper").classList.add("has-error");
            valid = false;
        }

        if (!valid) return;

        // UI Loading State
        if (signupButton) signupButton.disabled = true;
        if (buttonText) buttonText.classList.add("hidden");
        if (buttonArrow) buttonArrow.classList.add("hidden");
        if (loader) loader.classList.remove("hidden");

        const personaMap = {
            student: "student",
            faculty: "teacher",
            org_admin: "org_admin",
            super_admin: "platform_admin",
        };
        const mappedPersona = personaMap[role] || "student";

        setTimeout(function () {
            try {
                localStorage.setItem("heftin-phase1-persona", mappedPersona);
                localStorage.setItem("heftinRole", role);
                localStorage.setItem("heftinName", fullName);
            } catch (e) {
                console.warn("Storage write failed", e);
            }

            showWorkspaceWelcome(role, fullName);

            setTimeout(function () {
                window.location.href = "dashboard/index.html";
            }, 1200);
        }, 800);
    });
}

/* ============================================================
   CLEAR ERRORS ON TYPING
============================================================ */
[fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", function () {
        const group = input.closest(".form-group");
        if (group) {
            const err = group.querySelector(".error-message");
            if (err) err.textContent = "";
        }
        const wrapper = input.closest(".input-wrapper");
        if (wrapper) wrapper.classList.remove("has-error");

        if (formMessage) {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }
    });
});

/* ============================================================
   B2B ONBOARDING REQUEST HANDLER
============================================================ */
function handleB2BSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById("b2bSubmitBtn");
    const orgName = document.getElementById("b2bOrgName").value.trim() || "Your Organization";

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Logging request...</span>';
    }

    setTimeout(function () {
        const form = document.getElementById("b2bRequestForm");
        const success = document.getElementById("b2bSuccessView");
        if (form) form.style.display = "none";
        if (success) {
            success.style.display = "block";
            const heading = success.querySelector("h3");
            if (heading) heading.textContent = `Onboarding request for ${orgName} logged!`;
        }
    }, 700);
}

function quickLaunchOrgAdmin() {
    try {
        localStorage.setItem("heftin-phase1-persona", "org_admin");
        localStorage.setItem("heftinRole", "org_admin");
        localStorage.setItem("heftinName", "Rajesh Sharma (Admin)");
    } catch (e) {}
    showWorkspaceWelcome("org_admin", "Rajesh Sharma (Admin)");
    setTimeout(function () {
        window.location.href = "dashboard/index.html";
    }, 1100);
}

function quickLaunchSuperAdmin() {
    try {
        localStorage.setItem("heftin-phase1-persona", "platform_admin");
        localStorage.setItem("heftinRole", "super_admin");
        localStorage.setItem("heftinName", "Platform SuperAdmin");
    } catch (e) {}
    showWorkspaceWelcome("super_admin", "Platform SuperAdmin");
    setTimeout(function () {
        window.location.href = "dashboard/index.html";
    }, 1100);
}

/* ============================================================
   INDIVIDUAL WAITLIST HANDLER
============================================================ */
function joinWaitlist() {
    const input = document.getElementById("waitlistEmail");
    const msg = document.getElementById("waitlistMsg");
    if (!input || !msg) return;

    const email = input.value.trim();
    if (!isValidEmail(email)) {
        msg.textContent = "Please enter a valid email address.";
        msg.style.color = "#d9383a";
        return;
    }

    msg.textContent = "✓ You are on the waitlist! We will notify you at launch.";
    msg.style.color = "var(--primary)";
    input.value = "";
}

// Window exports for HTML onclick handlers
window.switchSignupMode = switchSignupMode;
window.fillSignupTestAccount = fillSignupTestAccount;
window.handleB2BSubmit = handleB2BSubmit;
window.quickLaunchOrgAdmin = quickLaunchOrgAdmin;
window.quickLaunchSuperAdmin = quickLaunchSuperAdmin;
window.joinWaitlist = joinWaitlist;
