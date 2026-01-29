document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d-scene');
    if (!container) return;

    // --- CONFIGURATION ---
    const particleCount = 200; // Neurons
    const connectionDistance = 2;
    const mouseInfluenceRadius = 4;
    const returnForce = 0.05;
    const mouseForce = 0.1;

    // Colors
    const neonCyan = new THREE.Color(0x00f0ff);
    const neonPurple = new THREE.Color(0x7000ff);
    const nerveWhite = new THREE.Color(0xffffff);

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- PARTICLES (NEURONS) ---
    // We'll use a physics-based approach where each particle has a target (home) position
    // forming a cloud/brain shape.

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const homes = new Float32Array(particleCount * 3); // Target positions
    const velocities = new Float32Array(particleCount * 3); // For smooth movement
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Generate Brain/Cloud Shape
    for (let i = 0; i < particleCount; i++) {
        // Random spherical cloud for now (cerebral sphere)
        // A rough brain shape is two ovals. Let's do a noisy sphere first.
        const r = 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);

        // Add some noise/organic irregularity
        x += (Math.random() - 0.5) * 2;
        y += (Math.random() - 0.5) * 2;
        z += (Math.random() - 0.5) * 2;

        // Set Home
        homes[i * 3] = x;
        homes[i * 3 + 1] = y;
        homes[i * 3 + 2] = z;

        // Start at home
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Colors (Mix of Cyan/Purple)
        const color = Math.random() > 0.5 ? neonCyan : neonPurple;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Varied sizes
        sizes[i] = Math.random() * 0.2 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Shader Material for glowing dots
    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        map: createCircleTexture() // Function defined below
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- CONNECTIONS (SYNAPSES) ---
    // We'll use a line segments geometry that updates every frame
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    // Max interactions
    const maxConnections = particleCount * 2; // Optimization limit
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 6); // 2 points * 3 coords
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);


    // --- MOUSE INTERACTION ---
    const mouse = new THREE.Vector3(0, 0, 0); // Normalized device coords (-1 to +1)
    const targetMouse = new THREE.Vector3(0, 0, 10); // World space target
    let isMouseActive = false;

    // We need to unproject mouse 2D to 3D world plane Z=0 roughly
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();

    document.addEventListener('mousemove', (event) => {
        isMouseActive = true;

        // Rect for container to handle offsets if not full screen
        const rect = container.getBoundingClientRect();

        // Normalized Coordinates
        mouse2D.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2D.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycast to find point in 3D space
        raycaster.setFromCamera(mouse2D, camera);
        raycaster.ray.intersectPlane(planeZ, targetMouse);
    });

    document.addEventListener('mouseleave', () => {
        isMouseActive = false;
    });

    // --- HELPER: CIRCLE TEXTURE ---
    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const posAttr = particles.geometry.attributes.position;
        const colorAttr = particles.geometry.attributes.color;

        let lineIndex = 0;

        // 1. UPDATE PARTICLES
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;

            // Current pos
            let px = posAttr.array[idx];
            let py = posAttr.array[idx + 1];
            let pz = posAttr.array[idx + 2];

            // Home pos
            const hx = homes[idx];
            const hy = homes[idx + 1];
            const hz = homes[idx + 2];

            // Velocity vars
            let vx = velocities[idx];
            let vy = velocities[idx + 1];
            let vz = velocities[idx + 2];

            // A. Base Float (Organic Swarming)
            // Add sine wave motion relative to home
            const noiseX = Math.sin(time + i) * 0.02;
            const noiseY = Math.cos(time + i * 0.5) * 0.02;
            const noiseZ = Math.sin(time * 0.5 + i) * 0.02;

            // B. Mouse Interaction (Attraction/Repulsion)
            // If active, pull towards mouse heavily (Firing neuron)
            if (isMouseActive) {
                const dx = targetMouse.x - px;
                const dy = targetMouse.y - py;
                const dz = targetMouse.z - pz;

                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < mouseInfluenceRadius * mouseInfluenceRadius) {
                    // Pull TOWARDS cursor (Synaptic connection)
                    const force = (1 - distSq / (mouseInfluenceRadius * mouseInfluenceRadius)) * mouseForce;
                    vx += dx * force;
                    vy += dy * force;
                    vz += dz * force;

                    // Light up!
                    colorAttr.array[idx] = 1; // R (White)
                    colorAttr.array[idx + 1] = 1; // G
                    colorAttr.array[idx + 2] = 1; // B
                } else {
                    // Fade back to original color
                    // Needs memory of original color is tricky here optimization-wise.
                    // Just drift back to cyan/purple default approximation
                    // Simple lerp back
                    if (colorAttr.array[idx] > 0.5) colorAttr.array[idx] -= 0.02;
                }
            } else {
                if (colorAttr.array[idx] > 0.5) colorAttr.array[idx] -= 0.02;
            }

            // C. Return Home (Elasticity)
            // Pull back to home position
            vx += (hx - px) * returnForce;
            vy += (hy - py) * returnForce;
            vz += (hz - pz) * returnForce;

            // D. Damping (Friction)
            vx *= 0.92;
            vy *= 0.92;
            vz *= 0.92;

            velocities[idx] = vx;
            velocities[idx + 1] = vy;
            velocities[idx + 2] = vz;

            // Update Position
            posAttr.array[idx] += vx + noiseX;
            posAttr.array[idx + 1] += vy + noiseY;
            posAttr.array[idx + 2] += vz + noiseZ;

            // 2. CHECK CONNECTIONS (PLEXUS)
            // Connect to neighbors
            // Simple N^2 loop is bad, but for 200 particles it's 40,000 checks (fine for JS).

            for (let j = i + 1; j < particleCount; j++) {
                const jdx = j * 3;
                const dx = posAttr.array[idx] - posAttr.array[jdx];
                const dy = posAttr.array[idx + 1] - posAttr.array[jdx + 1];
                const dz = posAttr.array[idx + 2] - posAttr.array[jdx + 2];

                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < connectionDistance * connectionDistance) {
                    // Add line
                    if (lineIndex < maxConnections * 6) {
                        linePositions[lineIndex++] = posAttr.array[idx];
                        linePositions[lineIndex++] = posAttr.array[idx + 1];
                        linePositions[lineIndex++] = posAttr.array[idx + 2];

                        linePositions[lineIndex++] = posAttr.array[jdx];
                        linePositions[lineIndex++] = posAttr.array[jdx + 1];
                        linePositions[lineIndex++] = posAttr.array[jdx + 2];
                    }
                }
            }
        }

        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;

        // Zero out remaining lines
        for (let k = lineIndex; k < maxConnections * 6; k++) {
            linePositions[k] = 0;
        }
        lines.geometry.attributes.position.needsUpdate = true;

        // Rotate entire cloud slowly
        particles.rotation.y += 0.001;
        lines.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // --- RESIZE ---
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
