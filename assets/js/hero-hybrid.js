document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const container = document.getElementById('hero-hybrid-container');
    const image = document.getElementById('hero-main-img');
    const canvas = document.getElementById('neural-overlay');

    if (!container || !canvas || !image) return;

    const ctx = canvas.getContext('2d');

    // Settings
    const tiltStrength = 15; // Max rotation in degrees
    const glowColor = 'rgba(0, 240, 255, 0.8)'; // Neon Cyan
    const lineColor = 'rgba(112, 0, 255, 0.3)'; // Neon Purple

    // State
    let width, height;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    // --- 1. TILT EFFECT LOGIC ---
    function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();

        // Mouse relative to container center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Percent from center (-1 to 1)
        const percentX = deltaX / (rect.width / 2);
        const percentY = deltaY / (rect.height / 2);

        // Target rotation
        targetRotateY = percentX * tiltStrength;
        targetRotateX = -percentY * tiltStrength;

        // Update mouse needed for particles
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function resetTilt() {
        targetRotateX = 0;
        targetRotateY = 0;
    }

    document.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', resetTilt);

    // --- 2. PARTICLE SYSTEM (NEURAL DATA) ---
    // We want particles to flow from the "Brain" out to the void

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start around the center (Brain location approx)
            this.x = width / 2 + (Math.random() - 0.5) * 100;
            this.y = height / 2 + (Math.random() - 0.5) * 100;

            // Velocity (Explode outwards)
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.005;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;

            // Mouse interaction: Line to cursor
            if (this.life > 0) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // If close to cursor, accelerate towards it slightly
                if (dist < 150) {
                    this.vx += dx * 0.001;
                    this.vy += dy * 0.001;
                }
            }

            if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw connection to cursor if close
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }
    }

    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }

    // --- ANIMATION LOOP ---
    function animate() {
        // A. Update Tilt (Smooth Interpolation)
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;

        // Apply transform to image only (canvas stays flat or matches?) 
        // Let's tilt the whole container in CSS, but here we just update a variable? 
        // Actually, best to apply inline style
        image.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1.05)`;

        // B. Canvas Animation
        ctx.clearRect(0, 0, width, height);

        // Draw Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // --- RESIZE ---
    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
});
