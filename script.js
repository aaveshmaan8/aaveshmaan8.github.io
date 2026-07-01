"use strict";

/* ===========================================================
   ELEMENTS
=========================================================== */

const header = document.querySelector(".header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a, .mobile-nav a");
const progressBar = document.querySelector(".progress-bar");
const loader = document.getElementById("loader");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("backToTop");

/* ===========================================================
   PRELOADER
=========================================================== */

window.addEventListener("load", () => {
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 500);
});

/* ===========================================================
   THEME TOGGLE (persists for the session)
=========================================================== */

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
}

let currentTheme = "dark";
applyTheme(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(currentTheme);
    });
}

/* ===========================================================
   STICKY HEADER + SCROLL PROGRESS
=========================================================== */

function onScroll() {
    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";

    if (backToTop) {
        backToTop.classList.toggle("show", window.scrollY > 500);
    }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===========================================================
   MOBILE NAV
=========================================================== */

if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        mobileNav.classList.toggle("open");
    });
}

/* ===========================================================
   ACTIVE NAVIGATION (scroll spy)
=========================================================== */

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.remove("active"));
                document
                    .querySelectorAll(`.navbar a[href="#${entry.target.id}"]`)
                    .forEach((link) => link.classList.add("active"));
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach((section) => navObserver.observe(section));

/* ===========================================================
   SMOOTH SCROLL + CLOSE MOBILE NAV
=========================================================== */

navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        if (hamburger && mobileNav) {
            hamburger.classList.remove("open");
            mobileNav.classList.remove("open");
        }

        window.scrollTo({
            top: target.offsetTop - 70,
            behavior: "smooth"
        });
    });
});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ===========================================================
   TYPING ANIMATION (role line under hero heading)
=========================================================== */

const typingText = document.getElementById("typing-text");

const roles = [
    "Backend Developer — Python & Flask",
    "Building & Deploying Production Apps",
    "Learning Data Structures & Algorithms",
    "Open to SDE Internships"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typingAnimation() {
    if (!typingText) return;

    const currentRole = roles[roleIndex];

    if (!deleting) {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            deleting = true;
            setTimeout(typingAnimation, 2000);
            return;
        }
    } else {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typingAnimation, deleting ? 30 : 55);
}

typingAnimation();

/* ===========================================================
   SECTION / ELEMENT REVEAL ON SCROLL
=========================================================== */

const revealTargets = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

/* ===========================================================
   COUNTER ANIMATION
=========================================================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = parseFloat(counter.dataset.target);
            const isDecimal = target % 1 !== 0;
            let current = 0;
            const increment = target / 60;

            function update() {
                current += increment;
                if (current >= target) {
                    counter.textContent = isDecimal ? target.toFixed(1) : target;
                    return;
                }
                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                requestAnimationFrame(update);
            }

            update();
            counterObserver.unobserve(counter);
        });
    },
    { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* ===========================================================
   COPY EMAIL ON CLICK
=========================================================== */

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", (e) => {
        if (!navigator.clipboard) return;
        e.preventDefault();

        const email = "maanaavesh1444@gmail.com";
        navigator.clipboard.writeText(email);

        const original = link.textContent;
        link.textContent = "Copied!";

        setTimeout(() => {
            link.textContent = original;
            window.location.href = "mailto:" + email;
        }, 900);
    });
});

/* ===========================================================
   CONTACT FORM (Flask Backend)
=========================================================== */

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submitBtn");

const API_URL = "http://127.0.0.1:5000/contact";

if (contactForm && submitBtn) {

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const formData = {
            name: document.getElementById("name")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            subject: document.getElementById("subject")?.value.trim(),
            message: document.getElementById("message")?.value.trim()
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all fields.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
            return;
        }

        try {

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {

                alert("✅ Thank you for contacting me!");

                contactForm.reset();

            } else {

                alert(result.message || "Failed to send message.");

            }

        } catch (error) {

            console.error("Fetch Error:", error);

            alert("Unable to connect to the backend.\n\nMake sure Flask is running on http://127.0.0.1:5000");

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";

        }

    });

}

/* ===========================================================
   MISC
=========================================================== */

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
});