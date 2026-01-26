// Swiss Orbital - Animation Logic
// Theme: Smooth, precise, ease-out-expo

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll Reveal (Bezier Curve)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Target elements with .reveal class
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 2. Navigation Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
