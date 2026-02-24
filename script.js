// ================= SMOOTH SECTION REVEAL =================

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15
});

sections.forEach(section => {
    observer.observe(section);
});


// ================= ACTIVE NAVIGATION HIGHLIGHT =================

const navLinks = document.querySelectorAll("nav a");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector(`nav a[href="#${id}"]`);

            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    sectionObserver.observe(section);
});


// ================= OPTIONAL: SCROLL PROGRESS BAR =================

const progressBar = document.createElement("div");
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.background = "linear-gradient(90deg, #3b82f6, #60a5fa)";
progressBar.style.zIndex = "9999";
progressBar.style.width = "0%";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
});