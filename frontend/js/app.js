/* =====================================
   AMOUR HOTEL - APP.JS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Amour Hotel Loaded Successfully");

    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initBackToTop();
    initRoomEffects();

});


/* =====================================
   NAVBAR SCROLL EFFECT
===================================== */

function initNavbar() {

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    });

}


/* =====================================
   SMOOTH SCROLL
===================================== */

function initSmoothScroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function(e) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {

                e.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

}


/* =====================================
   SCROLL REVEAL ANIMATION
===================================== */

function initScrollAnimations() {

    const revealElements = document.querySelectorAll(
        ".section, .room-card, .amenity-card, .testimonial-card"
    );

    revealElements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";
        element.style.transition =
            "all 0.8s ease";

    });

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0px)";

                }

            });

        },

        {
            threshold: 0.15
        }

    );

    revealElements.forEach(element => {
        observer.observe(element);
    });

}


/* =====================================
   BACK TO TOP BUTTON
===================================== */

function initBackToTop() {

    const button = document.createElement("button");

    button.innerHTML = "↑";

    button.id = "backToTop";

    document.body.appendChild(button);

    Object.assign(button.style, {

        position: "fixed",
        bottom: "25px",
        right: "25px",
        width: "50px",
        height: "50px",
        border: "none",
        borderRadius: "50%",
        background: "#d4af37",
        color: "#fff",
        fontSize: "22px",
        cursor: "pointer",
        display: "none",
        zIndex: "999",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)"

    });

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =====================================
   ROOM CARD EFFECTS
===================================== */

function initRoomEffects() {

    const roomCards =
        document.querySelectorAll(".room-card");

    roomCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.boxShadow =
                "0 15px 35px rgba(0,0,0,0.18)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.boxShadow =
                "0 5px 25px rgba(0,0,0,0.08)";

        });

    });

}


/* =====================================
   HERO BUTTON ANIMATION
===================================== */

const heroButton =
    document.querySelector(".hero-btn");

if (heroButton) {

    setInterval(() => {

        heroButton.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.05)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 2000
            }
        );

    }, 3000);

}


/* =====================================
   SIMPLE LOADER SUPPORT
===================================== */

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }

});


/* =====================================
   CURRENT YEAR AUTO UPDATE
===================================== */

const yearElement =
    document.getElementById("currentYear");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =====================================
   WELCOME MESSAGE
===================================== */

setTimeout(() => {

    console.log(
        "Welcome to Amour Hotel Luxury Experience"
    );

}, 1500);


/* =====================================
   END OF FILE
===================================== */