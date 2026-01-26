/* 
   NEURAL HOLOGRAM APP SCRIPT v4.4
   - Mobile Logic Added
*/

document.addEventListener('DOMContentLoaded', () => {

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
                this.color = '#00F0FF';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
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
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Reduce count on mobile for performance
            let divider = (width < 768) ? 15000 : 10000;
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

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });

            if (track) {
                track.scrollLeft = 0;
            }
        });
    });

    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -370, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 370, behavior: 'smooth' });
        });
    }

    // ---------------------------------------------------------
    // 4. MOBILE MENU LOGIC
    // ---------------------------------------------------------
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item, .nav-btn-mobile');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Icon Toggle
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
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
                navLinks.classList.remove('active');
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
});
