function init3DProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Ensure card has necessary styles for 3D
        // The container needs perspective. We can apply it to the card using transform property.

        let bounds;

        const rotateElement = (e) => {
            if (!bounds) bounds = card.getBoundingClientRect();

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;

            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            }

            // Logic from user's React code:
            // const x = (e.clientX - left - width / 2) / 25;
            // const y = (e.clientY - top - height / 2) / 25;
            const xRotation = center.x / 25;
            const yRotation = center.y / 25;

            // Apply rotation to the card
            // User code: transform = `rotateY(${x}deg) rotateX(${y}deg)`
            card.style.transform = `
                perspective(1000px)
                scale3d(1.02, 1.02, 1.02)
                rotateX(${yRotation}deg)
                rotateY(${xRotation}deg)
            `;

            // Parallax effects for children (Simulating CardItem)
            const imgThumb = card.querySelector('.project-img-thumb');
            const content = card.querySelector('.p-content');
            const techPills = card.querySelectorAll('.tech-pill');
            const title = card.querySelector('.card-head');
            const desc = card.querySelector('.card-txt');
            const links = card.querySelector('.links, .link-btn');

            // Apply different Z depths for parallax
            if (imgThumb) {
                // Image pops out most
                imgThumb.style.transform = `translateZ(50px)`;
            }

            if (content) {
                // Content container
                content.style.transform = `translateZ(30px)`;
            }

            if (title) {
                title.style.transform = `translateZ(40px)`;
            }

            if (desc) {
                desc.style.transform = `translateZ(30px)`;
            }

            if (links) {
                links.style.transform = `translateZ(45px)`;
            }

            techPills.forEach((pill, index) => {
                pill.style.transform = `translateZ(${35 + index * 2}px)`;
            });
        };

        const stopRotate = () => {
            bounds = null;
            card.style.transform = `
                perspective(1000px)
                scale3d(1, 1, 1)
                rotateX(0deg)
                rotateY(0deg)
            `;

            // Reset children
            const children = card.querySelectorAll('.project-img-thumb, .p-content, .tech-pill, .card-head, .card-txt, .links, .link-btn');
            children.forEach(child => {
                child.style.transform = 'translateZ(0)';
            });
        };

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            // Remove transition for instant follow
            card.style.transition = 'none';

            // Children transitions
            const children = card.querySelectorAll('.project-img-thumb, .p-content, .tech-pill, .card-head, .card-txt, .links, .link-btn');
            children.forEach(c => c.style.transition = 'none');
        });

        card.addEventListener('mousemove', rotateElement);

        card.addEventListener('mouseleave', () => {
            // Add transition back for smooth reset
            card.style.transition = 'all 0.5s ease-out';
            const children = card.querySelectorAll('.project-img-thumb, .p-content, .tech-pill, .card-head, .card-txt, .links, .link-btn');
            children.forEach(c => c.style.transition = 'all 0.5s ease-out');

            stopRotate();
        });
    });
}

document.addEventListener('DOMContentLoaded', init3DProjectCards);
