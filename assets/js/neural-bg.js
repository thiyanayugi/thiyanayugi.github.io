/* 
   NEURAL NETWORK BACKGROUND SYSTEM
   - Interactive Canvas Particle System
   - Simulates Nodes & Connections (SLAM/Graph Theory)
*/

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 100; // Adjust for density
const connectionDistance = 150;
const mouseDistance = 200;

// Mouse State
let mouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Resize Handling
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5; // Velocity X
        this.vy = (Math.random() - 0.5) * 1.5; // Velocity Y
        this.size = Math.random() * 2 + 1;
        this.color = '#00F0FF'; // Neon Cyan
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse Interaction (Attraction/Disturbance)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                // Gentle push away or pull towards? Let's do gentle pull (Connection)
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;

                // Slight attraction
                if (distance > 50) {
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

function initParticles() {
    particles = [];
    // Adjust count based on screen size
    let count = (width * height) / 10000;
    if (count > 150) count = 150;

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    let opacity = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = 'rgba(0, 240, 255, ' + opacity * 0.5 + ')'; // Cyan lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null) {
            let dx = particles[a].x - mouse.x;
            let dy = particles[a].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                opacity = 1 - (distance / mouseDistance);
                ctx.strokeStyle = 'rgba(112, 0, 255, ' + opacity + ')'; // Electric Purple mouse lines
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connect();
}

window.addEventListener('resize', resize);

// Init
resize();
animate();
