console.log("3D Card Script Loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Initializing 3D Cards");
    init3DProjectCards();
});

function init3DProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    console.log(`Found ${cards.length} project cards`);

    cards.forEach((card, index) => {
        // Force 3D styles
        card.style.transformStyle = 'preserve-3d';

        // Add a debug border temporarily if needed, but for now just log
        // card.style.border = "1px solid red"; 

        let bounds;

        const rotateElement = (e) => {
            // Always recalculate bounds on mousemove to handle scrolling/layout shifts
            // This is slightly more expensive but ensures accuracy
            bounds = card.getBoundingClientRect();

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const leftX = mouseX - bounds.left;
            const topY = mouseY - bounds.top;

            // Calculate center relative to the card
            const centerX = leftX - bounds.width / 2;
            const centerY = topY - bounds.height / 2;

            // Log coordinates for the first card only to avoid spam
            if (index === 0 && Math.random() < 0.01) {
                console.log('Mouse:', centerX, centerY);
            }

            // Rotation Logic
            // Use 25 as divider as per original React code
            // Horizontal position controls Y-axis rotation
            // Vertical position controls X-axis rotation (inverted for natural tilt)
            const xRotation = centerX / 20;
            const yRotation = -centerY / 20; // Inverted

            // Apply Transform
            // Using requestAnimationFrame would be better, but direct style set is usually fine
            card.style.transform = `perspective(1000px) scale3d(1.05, 1.05, 1.05) rotateX(${yRotation}deg) rotateY(${xRotation}deg)`;

            // --- Parallax for Children ---
            // We use simple selectors to find internal elements
            const children = {
                img: card.querySelector('.project-img-thumb'),
                content: card.querySelector('.p-content'),
                pills: card.querySelectorAll('.tech-pill'),
                head: card.querySelector('.card-head'),
                txt: card.querySelector('.card-txt'),
                actions: card.querySelector('.links, .link-btn'),
                stack: card.querySelector('.tech-stack')
            };

            if (children.img) children.img.style.transform = 'translateZ(60px)';
            if (children.head) children.head.style.transform = 'translateZ(50px)';
            if (children.txt) children.txt.style.transform = 'translateZ(40px)';
            if (children.stack) children.stack.style.transform = 'translateZ(45px)';
            if (children.actions) children.actions.style.transform = 'translateZ(55px)';

            if (children.pills) {
                children.pills.forEach((pill, i) => {
                    pill.style.transform = `translateZ(${40 + i * 5}px)`;
                });
            }
        };

        const stopRotate = () => {
            card.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;

            // Reset children
            const allChildren = card.querySelectorAll('*');
            allChildren.forEach(el => {
                if (el.style.transform) el.style.transform = 'translateZ(0) rotate(0)';
            });
        };

        // Events
        card.addEventListener('mouseenter', () => {
            // Remove CSS transition for instant interaction
            card.style.transition = 'none';
            // Also remove child transitions
            const allChildren = card.querySelectorAll('*');
            allChildren.forEach(el => el.style.transition = 'none');
        });

        card.addEventListener('mousemove', rotateElement);

        card.addEventListener('mouseleave', () => {
            // Restore smooth transition for reset
            card.style.transition = 'transform 0.5s ease-out';
            const allChildren = card.querySelectorAll('*');
            allChildren.forEach(el => el.style.transition = 'transform 0.5s ease-out');
            stopRotate();
        });
    });
}
