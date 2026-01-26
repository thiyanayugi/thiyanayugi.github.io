/* 
   NEURAL HOLOGRAM APP SCRIPT v4.2
   - Neural Background
   - Typed.js
   - Carousel with FILTERING Logic
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

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
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
            let count = (width * height) / 10000;
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
            strings: ['AI Engineer', 'Robotics Specialist', 'Computer Vision Expert', 'System Architect'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }

    // ---------------------------------------------------------
    // 3. CAROUSEL & FILTER LOGIC (NEW)
    // ---------------------------------------------------------
    const track = document.querySelector('.project-carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Filter Click Handling
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter Projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Optional: Add fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Reset Carousel Scroll
            if (track) {
                track.scrollLeft = 0;
            }
        });
    });

    // Navigation Buttons
    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -370, behavior: 'smooth' }); // Card width + gap
        });
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 370, behavior: 'smooth' });
        });
    }
});
