const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


document.addEventListener(
    "mousemove",
    function (event) {

        cursorDot.style.left =
            event.clientX + "px";

        cursorDot.style.top =
            event.clientY + "px";


        cursorRing.style.left =
            event.clientX + "px";

        cursorRing.style.top =
            event.clientY + "px";

    }
);



/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal-section"
    );


const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    function (element) {

        revealObserver.observe(element);

    }
);



/* ==========================================
   BILLING
========================================== */

const monthlyBtn =
    document.getElementById(
        "monthlyBtn"
    );

const yearlyBtn =
    document.getElementById(
        "yearlyBtn"
    );

const price =
    document.getElementById(
        "price"
    );

const period =
    document.getElementById(
        "period"
    );

const priceNote =
    document.getElementById(
        "priceNote"
    );


function changePrice(
    newPrice,
    newPeriod,
    newNote
) {

    price.style.opacity = "0";

    price.style.transform =
        "translateY(15px)";


    setTimeout(
        function () {

            price.textContent =
                newPrice;

            period.textContent =
                newPeriod;

            priceNote.textContent =
                newNote;


            price.style.opacity =
                "1";

            price.style.transform =
                "translateY(0)";

        },
        180
    );

}


monthlyBtn.addEventListener(
    "click",
    function () {

        monthlyBtn.classList.add(
            "active"
        );

        yearlyBtn.classList.remove(
            "active"
        );


        changePrice(
            "499",
            "/ MONTH",
            "Flexible monthly billing."
        );

    }
);


yearlyBtn.addEventListener(
    "click",
    function () {

        yearlyBtn.classList.add(
            "active"
        );

        monthlyBtn.classList.remove(
            "active"
        );


        changePrice(
            "4190",
            "/ YEAR",
            "That's only ₹349/month · Save 30%."
        );

    }
);



/* ==========================================
   UPGRADE MODAL
========================================== */

const successModal =
    document.getElementById(
        "successModal"
    );


const productButton =
    document.getElementById(
        "productButton"
    );


const productButtonText =
    document.getElementById(
        "productButtonText"
    );


const productLoader =
    document.getElementById(
        "productLoader"
    );


const upgradeButtons = [

    document.getElementById(
        "navUpgrade"
    ),

    document.getElementById(
        "heroUpgrade"
    ),

    document.getElementById(
        "finalUpgrade"
    ),

    productButton

];


function startUpgrade() {

    productButton.disabled =
        true;

    productButtonText.classList.add(
        "hidden"
    );

    productLoader.classList.remove(
        "hidden"
    );


    setTimeout(
        function () {

            productButton.disabled =
                false;

            productButtonText.classList.remove(
                "hidden"
            );

            productLoader.classList.add(
                "hidden"
            );


            successModal.classList.add(
                "show"
            );

        },
        1200
    );

}


upgradeButtons.forEach(
    function (button) {

        if (button) {

            button.addEventListener(
                "click",
                startUpgrade
            );

        }

    }
);



/* ==========================================
   CLOSE MODAL
========================================== */

const closeModal =
    document.getElementById(
        "closeModal"
    );


const modalOk =
    document.getElementById(
        "modalOk"
    );


function closeSuccessModal() {

    successModal.classList.remove(
        "show"
    );

}


closeModal.addEventListener(
    "click",
    closeSuccessModal
);


modalOk.addEventListener(
    "click",
    closeSuccessModal
);



/* ==========================================
   FAQ ACCORDION
========================================== */

const faqItems =
    document.querySelectorAll(
        ".faq-item"
    );


faqItems.forEach(
    function (item) {

        const question =
            item.querySelector(
                ".faq-question"
            );


        question.addEventListener(
            "click",
            function () {

                item.classList.toggle(
                    "active"
                );

            }
        );

    }
);
