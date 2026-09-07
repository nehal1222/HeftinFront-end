/* Gates every "Get Started" button: signed-in visitors go straight to
   the dashboard (default href), everyone else is sent to log in first. */
(function () {
    function isLoggedIn() {
        try {
            return localStorage.getItem("heftinLoggedIn") === "true";
        } catch (e) {
            return false;
        }
    }

    document.querySelectorAll(".start-button").forEach(function (button) {
        button.addEventListener("click", function (event) {
            if (!isLoggedIn()) {
                event.preventDefault();
                window.location.href = "login.html";
            }
        });
    });
})();
