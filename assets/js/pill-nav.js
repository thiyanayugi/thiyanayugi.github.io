/**
 * Pill Nav Implementation using GSAP
 * Ported from React to Vanilla JS
 */

/**
 * Pill Nav Implementation using GSAP
 * Ported from React to Vanilla JS
 */

class PillNav {
    constructor(selector, options = {}) {
        this.containerSelector = selector;
        this.config = {
            baseColor: options.baseColor || '#0a0a0a',
            pillColor: options.pillColor || '#ffffff',
            hoveredPillTextColor: options.hoveredPillTextColor || '#000000',
            pillTextColor: options.pillTextColor || '#ffffff',
            ease: options.ease || 'power3.easeOut',
            initialLoadAnimation: options.initialLoadAnimation !== false,
            activeHref: options.activeHref || null, // If null, will try to detect
            useHash: options.useHash !== false, // For main nav, use current URL hash
            clickCallback: options.clickCallback || null // Function to call on click
        };

        // Store timeline references
        this.tlRefs = [];
        this.activeTweenRefs = [];
        this.isMobileMenuOpen = false;

        // Elements
        this.navContainer = document.querySelector(this.containerSelector);

        // Bind methods
        this.layout = this.layout.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.setActive = this.setActive.bind(this);
    }

    init() {
        if (!this.navContainer) {
            console.warn(`PillNav: Container not found for selector "${this.containerSelector}"`);
            return;
        }

        // Set CSS Variables
        const nav = this.navContainer.querySelector('.pill-nav');
        if (nav) {
            nav.style.setProperty('--base', this.config.baseColor);
            nav.style.setProperty('--pill-bg', this.config.pillColor);
            nav.style.setProperty('--hover-text', this.config.hoveredPillTextColor);
            nav.style.setProperty('--pill-text', this.config.pillTextColor);
        }

        // Initialize References (Scoped to this container)
        this.circles = Array.from(this.navContainer.querySelectorAll('.hover-circle'));
        this.labels = Array.from(this.navContainer.querySelectorAll('.pill-label'));
        this.hoverLabels = Array.from(this.navContainer.querySelectorAll('.pill-label-hover'));
        this.mobileMenu = this.navContainer.querySelector('.mobile-menu-popover');
        this.hamburger = this.navContainer.querySelector('.mobile-menu-button');
        this.hamburgerLines = this.navContainer.querySelectorAll('.hamburger-line');
        this.navItems = this.navContainer.querySelector('.pill-nav-items');
        this.logo = this.navContainer.querySelector('.pill-logo');

        // Layout Calculation
        this.layout();

        // Event Listeners
        window.addEventListener('resize', this.handleResize);
        document.fonts.ready.then(this.layout);

        // Setup Hover Events
        // Note: Selector changed to be more generic for both nav and filters
        const pills = this.navContainer.querySelectorAll('.pill');
        pills.forEach((pillItems, index) => {
            // Find the clickable element (could be the li's child or the element itself if it has class pill)
            // The 'pill' class is on the <a> tag in standard setup
        });

        // Re-select strictly
        const pillElements = this.navContainer.querySelectorAll('.pill');
        pillElements.forEach((pill, index) => {
            pill.addEventListener('mouseenter', () => this.handleEnter(index));
            pill.addEventListener('mouseleave', () => this.handleLeave(index));
            pill.addEventListener('click', (e) => {
                // e.preventDefault(); // Let default happen (navigation or data-filter)

                let id;
                if (pill.getAttribute('href')) {
                    id = pill.getAttribute('href');
                } else if (pill.getAttribute('data-filter')) {
                    id = pill.getAttribute('data-filter');
                }

                this.setActive(id);

                if (this.config.clickCallback) {
                    this.config.clickCallback(id, pill);
                }
            });
        });

        // Mobile Menu Toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', this.toggleMobileMenu);
        }

        // Mobile Links
        const mobileLinks = this.navContainer.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(); // Close menu
                this.setActive(link.getAttribute('href') || link.getAttribute('data-filter'));
            });
        });

        // Initial Load Animation
        if (this.config.initialLoadAnimation) {
            if (this.logo) {
                gsap.set(this.logo, { scale: 0 });
                gsap.to(this.logo, { scale: 1, duration: 0.6, ease: this.config.ease });
            }
            if (this.navItems) {
                gsap.set(this.navItems, { width: 0, overflow: 'hidden' });
                gsap.to(this.navItems, { width: 'auto', duration: 0.6, ease: this.config.ease });
            }
        }

        // Handle hash changes only if useHash is true
        if (this.config.useHash) {
            window.addEventListener('hashchange', () => {
                this.setActive(window.location.hash);
            });
            // Initial Active State
            this.setActive(this.config.activeHref || window.location.hash || '#home');
        } else {
            // Use default if provided
            if (this.config.activeHref) {
                this.setActive(this.config.activeHref);
            }
        }
    }

    layout() {
        this.circles.forEach((circle, index) => {
            if (!circle.parentElement) return;

            const pill = circle.parentElement;
            const rect = pill.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            if (w === 0 || h === 0) return;

            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            // Apply styles
            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;

            gsap.set(circle, {
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

            const label = this.labels[index];
            const white = this.hoverLabels[index];

            if (label) gsap.set(label, { y: 0 });
            if (white) gsap.set(white, { y: h + 12, opacity: 0 });

            // Build Timeline
            this.tlRefs[index]?.kill();
            const tl = gsap.timeline({ paused: true });

            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.4, ease: this.config.ease, overwrite: 'auto' }, 0);

            if (label) {
                tl.to(label, { y: -(h + 8), duration: 0.4, ease: this.config.ease, overwrite: 'auto' }, 0);
            }

            if (white) {
                // Adjust dynamic offset
                gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
                tl.to(white, { y: 0, opacity: 1, duration: 0.4, ease: this.config.ease, overwrite: 'auto' }, 0);
            }

            this.tlRefs[index] = tl;
        });

        if (this.mobileMenu) {
            if (!this.isMobileMenuOpen) {
                gsap.set(this.mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
            }
        }
    }

    handleResize() {
        this.layout();
    }

    handleEnter(i) {
        const tl = this.tlRefs[i];
        if (!tl) return;
        this.activeTweenRefs[i]?.kill();
        this.activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease: this.config.ease,
            overwrite: 'auto'
        });
    }

    handleLeave(i) {
        const tl = this.tlRefs[i];
        if (!tl) return;
        this.activeTweenRefs[i]?.kill();
        this.activeTweenRefs[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease: this.config.ease,
            overwrite: 'auto'
        });
    }

    setActive(id) {
        // Remove is-active from all IN THIS CONTAINER
        this.navContainer.querySelectorAll('.pill, .mobile-menu-link').forEach(el => el.classList.remove('is-active'));

        if (!id) return;

        // Attempt multiple strategies to find the element
        let selector = `.pill[href="${id}"], .pill[data-filter="${id}"]`;
        this.navContainer.querySelectorAll(selector).forEach(el => el.classList.add('is-active'));
    }

    toggleMobileMenu() {
        const newState = !this.isMobileMenuOpen;
        this.isMobileMenuOpen = newState;

        const hamburger = this.hamburger;
        const menu = this.mobileMenu;
        const lines = this.hamburgerLines;

        if (lines && lines.length >= 2) {
            if (newState) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: this.config.ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: this.config.ease });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: this.config.ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: this.config.ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease: this.config.ease,
                        transformOrigin: 'top center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease: this.config.ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        // 1. Initialize Main Nav
        const mainNav = new PillNav('.pill-nav-container', {
            useHash: true
        });
        mainNav.init();

        // 2. Initialize Project Filter Nav
        // We will assume the filters container has class 'project-filters-pill'
        const filterNav = new PillNav('.project-filters-pill', {
            useHash: false,
            activeHref: 'all', // Default active filter
            clickCallback: (id, el) => {
                // This can hook into app.js logic if needed, 
                // but app.js already listens to 'click' on .filter-btn
                // We just need to ensure the element has that class.
            }
        });
        filterNav.init();

        // Give global access if debugging needed
        window.mainPillNav = mainNav;
        window.filterPillNav = filterNav;

    } else {
        console.error('GSAP not found. PillNav requires GSAP.');
    }
});
