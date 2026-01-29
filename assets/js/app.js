/* 
   NEURAL HOLOGRAM APP SCRIPT v4.4
   - Mobile Logic Added
*/

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 0. PAGE LOAD ANIMATION
    // ---------------------------------------------------------
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <div class="loader-text">INITIALIZING_NEURAL_NETWORK</div>
        </div>
    `;
    document.body.appendChild(loader);

    // Add loader styles
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #050510;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .page-loader.fade-out {
            opacity: 0;
            visibility: hidden;
        }

        .loader-content {
            position: relative;
            width: 150px;
            height: 150px;
        }

        .loader-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top-color: #00F0FF;
            border-radius: 50%;
            animation: loaderSpin 1.5s linear infinite;
            transform: translate(-50%, -50%);
        }

        .loader-ring:nth-child(2) {
            width: 80%;
            height: 80%;
            border-top-color: #7000FF;
            animation-duration: 1s;
            animation-direction: reverse;
        }

        .loader-ring:nth-child(3) {
            width: 60%;
            height: 60%;
            border-top-color: #00F0FF;
            animation-duration: 0.7s;
        }

        .loader-text {
            position: absolute;
            top: 110%;
            left: 50%;
            transform: translateX(-50%);
            color: #00F0FF;
            font-family: 'Outfit', monospace;
            font-size: 0.8rem;
            white-space: nowrap;
            animation: textBlink 1s step-end infinite;
        }

        @keyframes loaderSpin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes textBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(loaderStyle);

    // Remove loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });

    // ---------------------------------------------------------
    // 0. SCROLL-TRIGGERED ANIMATIONS
    // ---------------------------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .glass-card, .project-card, .exp-card, .edu-card, .skill-category').forEach(el => {
        el.classList.add('scroll-fade');
        scrollObserver.observe(el);
    });

    // ---------------------------------------------------------
    // 0.5. CUSTOM CYBERPUNK CURSOR
    // ---------------------------------------------------------
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'custom-cursor-trail';
    document.body.appendChild(cursorTrail);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        cursorTrail.style.left = trailX - 4 + 'px';
        cursorTrail.style.top = trailY - 4 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .orbit-item, .filter-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ---------------------------------------------------------
    // 0.6. 3D TILT EFFECTS FOR INTERACTIVE CARDS
    // ---------------------------------------------------------
    const tiltElements = document.querySelectorAll('.glass-card, .project-card, .skill-pill');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ---------------------------------------------------------
    // 0.7. PARALLAX SCROLLING EFFECT
    // ---------------------------------------------------------
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Parallax for hero elements
        const heroHolo = document.querySelector('.holo-container');
        if (heroHolo) {
            heroHolo.style.transform = `translateY(${scrolled * 0.3}px) rotateY(-10deg) rotateX(10deg)`;
        }

        // Parallax for orbit rings
        const ring1 = document.querySelector('.ring-1');
        const ring2 = document.querySelector('.ring-2');
        if (ring1) ring1.style.transform = `rotate(${scrolled * 0.1}deg)`;
        if (ring2) ring2.style.transform = `rotate(${-scrolled * 0.15}deg)`;
    });

    // ---------------------------------------------------------
    // 0.8. ENHANCED SKILL PILLS INTERACTION
    // ---------------------------------------------------------
    const skillPills = document.querySelectorAll('.skill-pill');

    skillPills.forEach((pill, index) => {
        // Staggered entrance animation
        pill.style.animationDelay = `${index * 0.05}s`;

        // Random floating animation timing
        const floatDuration = 3 + Math.random() * 2;
        pill.style.animation = `float ${floatDuration}s ease-in-out infinite`;
        pill.style.animationDelay = `${Math.random() * 2}s`;

        // Ripple effect on click
        pill.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 240, 255, 0.5);
                width: 10px;
                height: 10px;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                pointer-events: none;
                transform: translate(-50%, -50%);
                animation: rippleEffect 0.6s ease-out;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Ripple effect keyframes (add via style tag)
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ---------------------------------------------------------
    // 1. NEURAL CANVAS SYSTEM
    // ---------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const mouseDistance = 200;
        const connectionDistance = 150;

        let mouse = { x: null, y: null };

        // Handle Touch for Mobile
        window.addEventListener('touchmove', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#00F0FF' : '#7000FF'; // Mix of cyan and purple
                this.opacity = Math.random() * 0.5 + 0.5; // Random opacity
                this.pulse = Math.random() * Math.PI * 2; // For pulsing effect
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += 0.05; // Pulsing animation

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseDistance) {
                        const forceDirectionX = dx / dist;
                        const forceDirectionY = dy / dist;
                        const force = (mouseDistance - dist) / mouseDistance;
                        if (dist > 50) {
                            this.vx += forceDirectionX * force * 0.05;
                            this.vy += forceDirectionY * force * 0.05;
                        }
                    }
                }
            }
            draw() {
                // Pulsing size effect
                const pulseSize = this.size + Math.sin(this.pulse) * 0.5;

                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);

                // Gradient fill for more depth
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, this.color + '00');

                ctx.fillStyle = gradient;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const initParticles = () => {
            particles = [];
            // Reduce count on mobile for performance
            let divider = (width < 768) ? 20000 : 10000; // Fewer particles on mobile
            let count = (width * height) / divider;
            if (count > 150) count = 150;
            for (let i = 0; i < count; i++) particles.push(new Particle());
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        let opacity = 1 - (dist / connectionDistance);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
                if (mouse.x != null) {
                    let dx = particles[a].x - mouse.x;
                    let dy = particles[a].y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseDistance) {
                        let opacity = 1 - (dist / mouseDistance);
                        ctx.strokeStyle = `rgba(112, 0, 255, ${opacity})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            connect();
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // ---------------------------------------------------------
    // 2. TYPED.JS
    // ---------------------------------------------------------
    if (document.getElementById('typed-output')) {
        new Typed('#typed-output', {
            strings: ['Autonomous Systems Engineer', 'AI Engineer', 'Robotics Specialist', 'Computer Vision Expert', 'System Architect'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }

    // ---------------------------------------------------------
    // 3. CAROUSEL & FILTER LOGIC
    // ---------------------------------------------------------
    const track = document.querySelector('.project-carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // SPOTLIGHT HOVER EFFECT
    const updateSpotlight = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    projectCards.forEach(card => {
        card.addEventListener('mousemove', updateSpotlight);
    });

    // FILTER LOGIC
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });

            // Reset scroll on filter change
            if (track) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });

    // CAROUSEL SCROLL LOGIC
    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth; // Get current card width
            const gap = 32; // 2rem gap
            const scrollAmount = (cardWidth + gap);
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth;
            const gap = 32;
            const scrollAmount = (cardWidth + gap);
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // Initialize Filter (Trigger click on the default active button)
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        activeBtn.click();
    }

    // ---------------------------------------------------------
    // 4. MOBILE MENU LOGIC
    // ---------------------------------------------------------
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item, .nav-btn-mobile');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            // Clean up any potential conflicting styles
            navLinks.style.right = '';
            navLinks.style.left = '';

            // Icon Toggle
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close on Link Click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }


    // ---------------------------------------------------------
    // 5. SCROLL PROGRESS BAR
    // ---------------------------------------------------------
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
    });

    // ---------------------------------------------------------
    // 6. SYSTEM CLOCK
    // ---------------------------------------------------------
    const timeDisplay = document.getElementById('status-time');
    function updateClock() {
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    // Run immediately then interval
    updateClock();
    setInterval(updateClock, 1000);

    // ---------------------------------------------------------
    // 7. EMAILJS CONTACT FORM
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const statusMsg = document.getElementById('contact-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // UI Feedback: Sending
            submitBtn.innerHTML = '[ TRANSMITTING... ]';
            submitBtn.disabled = true;
            statusMsg.style.display = 'none';

            // ---------------------------------------------------------
            // 8. HOLOGRAPHIC MODAL LOGIC
            // ---------------------------------------------------------
            const modal = document.getElementById('project-modal');
            const modalImg = document.getElementById('modal-img');
            const modalTitle = document.getElementById('modal-title');
            const modalDesc = document.getElementById('modal-desc');
            const modalTechs = document.getElementById('modal-techs');
            const modalLink = document.getElementById('modal-link');
            const closeModal = document.querySelector('.modal-close');

            // Select project images and titles for modal trigger
            const viewTriggers = document.querySelectorAll('.project-card .project-img-thumb, .project-card .card-head');

            viewTriggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); // Stop default link behavior

                    // Find parent card
                    const card = btn.closest('.project-card');

                    // Extract Data
                    const title = card.querySelector('h3').textContent;
                    const desc = card.querySelector('p').textContent;
                    const imgSrc = card.querySelector('img') ? card.querySelector('img').src : '';
                    const techStackHTML = card.querySelector('.tech-stack').innerHTML;
                    const projectUrl = btn.getAttribute('href');

                    // Populate Modal
                    modalTitle.textContent = title;
                    modalDesc.textContent = desc;
                    modalImg.src = imgSrc;
                    modalTechs.innerHTML = techStackHTML;
                    modalLink.href = projectUrl;

                    // Show Modal
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock scroll
                });
            });

            // Close Logic
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto'; // Unlock scroll
                });
            }

            // Close on backdrop click
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }

            // Send Email
            // Service ID: service_uore6zr
            // Template ID: template_qzn9hoa
            emailjs.sendForm('service_uore6zr', 'template_qzn9hoa', this)
                .then(function () {
                    console.log('SUCCESS!');
                    submitBtn.innerHTML = '[ TRANSMISSION COMPLETE ]';
                    submitBtn.style.borderColor = '#00ff00';
                    submitBtn.style.color = '#00ff00';

                    statusMsg.textContent = "> Packet delivery successful. Connection terminated.";
                    statusMsg.style.display = 'block';
                    statusMsg.style.color = '#00ff00';

                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '[ SEND_DATA_PACKET ]';
                        submitBtn.style.borderColor = '';
                        submitBtn.style.color = '';
                    }, 5000);
                }, function (error) {
                    console.log('FAILED...', error);
                    submitBtn.innerHTML = '[ TRANSMISSION FAILED ]';
                    submitBtn.style.borderColor = 'red';

                    statusMsg.textContent = "> Critical Error: " + JSON.stringify(error);
                    statusMsg.style.display = 'block';
                    statusMsg.style.color = 'red';

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '[ RETRY_TRANSMISSION ]';
                        submitBtn.style.borderColor = '';
                    }, 3000);
                });
        });
    }

    // ---------------------------------------------------------
    // 8. HOLOGRAPHIC MODAL LOGIC (MOVED OUTSIDE FORM)
    // ---------------------------------------------------------
    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTechs = document.getElementById('modal-techs');
    const modalLink = document.getElementById('modal-link');
    const closeModal = document.querySelector('.modal-close');

    // Select project images and titles for modal trigger
    const viewTriggers = document.querySelectorAll('.project-card .project-img-thumb, .project-card .card-head');

    viewTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default link behavior

            // Find parent card
            const card = btn.closest('.project-card');

            // Extract Data
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const imgSrc = card.querySelector('img') ? card.querySelector('img').src : '';
            const techStackHTML = card.querySelector('.tech-stack').innerHTML;
            const projectUrl = card.querySelector('.link-btn') ? card.querySelector('.link-btn').getAttribute('href') : '#';

            // Populate Modal
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalImg.src = imgSrc;
            modalTechs.innerHTML = techStackHTML;
            modalLink.href = projectUrl;

            // Show Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        });
    });

    // Close Logic
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scroll
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ---------------------------------------------------------
    // 9. COPY CITATION LOGIC
    // ---------------------------------------------------------
    const copyButtons = document.querySelectorAll('.btn-copy-citation');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const citationText = btn.getAttribute('data-citation');
            navigator.clipboard.writeText(citationText).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // ---------------------------------------------------------
    // 10. HERO HOLOGRAPHIC TILT
    // ---------------------------------------------------------
    const holoSection = document.querySelector('.hero-holo');
    const holoContainer = document.querySelector('.holo-container');

    if (holoSection && holoContainer) {
        holoSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            // Smoothly animate the rotation
            holoContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset on leave
        holoSection.addEventListener('mouseleave', () => {
            holoContainer.style.transition = 'transform 0.5s ease';
            holoContainer.style.transform = `rotateY(-10deg) rotateX(10deg)`;
            setTimeout(() => {
                holoContainer.style.transition = 'none'; // Remove transition for mousemove
            }, 500);
        });

        // Add transition for mouse enter so it doesn't snap
        holoSection.addEventListener('mouseenter', () => {
            holoContainer.style.transition = 'none';

            // ---------------------------------------------------------
            // 11. MAGNETIC BUTTONS (HERO)
            // ---------------------------------------------------------
            const heroBtns = document.querySelectorAll('.btn-primary-holo, .btn-secondary-holo');

            heroBtns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Calculate distance from center
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const deltaX = (x - centerX) * 0.3; // Scale factor
                    const deltaY = (y - centerY) * 0.3;

                    btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0px, 0px)';
                });
            });

        });
    }

});

