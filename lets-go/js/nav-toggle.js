/* Mobile hamburger toggle for the site navbar — shared across pages. */
(function () {
    var toggle = document.getElementById('navToggle');
    var collapse = document.getElementById('navCollapse');
    if (!toggle || !collapse) return;

    function close() {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        collapse.classList.remove('open');
    }

    function open() {
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        collapse.classList.add('open');
    }

    toggle.addEventListener('click', function () {
        if (collapse.classList.contains('open')) {
            close();
        } else {
            open();
        }
    });

    collapse.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 860) close();
    });
})();
