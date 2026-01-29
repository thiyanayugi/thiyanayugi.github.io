document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('term-log-content');
    const cpuBar = document.getElementById('cpu-bar');
    const memBar = document.getElementById('mem-bar');

    if (!logContainer) return;

    // --- DATA ---
    const tasks = [
        "Optimizing PyTorch Tensor weights...",
        "Allocating GPU memory cluster...",
        "Connecting to ROS2 Node: /movement_controller...",
        "Fetching data from LLM API...",
        "Calibrating sensor fusion array...",
        "Updating local vector database...",
        "Compiling multi-agent swarm protocols...",
        "Garbage collecting unused neurons...",
        "Syncing git repository...",
        "Analyzing user interaction patterns..."
    ];

    const prefixes = [
        { text: "[INFO]", class: "log-info" },
        { text: "[SYS]", class: "log-sys" },
        { text: "[WARN]", class: "log-warn" },
        { text: "[AGENT]", class: "log-agent" }
    ];

    // --- LOGIC ---
    function addLog() {
        // Create line
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const task = tasks[Math.floor(Math.random() * tasks.length)];

        const line = document.createElement('div');
        line.className = 'log-entry';
        line.innerHTML = `<span class="log-time">${time}</span><span class="${prefix.class}">${prefix.text}</span> ${task}`;

        logContainer.appendChild(line);

        // Remove old logs if too many
        if (logContainer.children.length > 15) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    function updateStats() {
        if (cpuBar) {
            const cpuVal = 30 + Math.random() * 60; // 30-90%
            cpuBar.style.width = `${cpuVal}%`;
            // Color change based on load
            cpuBar.style.backgroundColor = cpuVal > 80 ? '#ff5f56' : 'var(--neon-cyan)';
        }

        if (memBar) {
            const memVal = 40 + Math.random() * 40; // 40-80%
            memBar.style.width = `${memVal}%`;
        }
    }

    // --- ANIMATION LOOPS ---

    // Add log every 800ms - 2500ms
    function loopLogs() {
        const delay = Math.random() * 1500 + 800;
        setTimeout(() => {
            addLog();
            loopLogs();
        }, delay);
    }

    // Update stats every 2s
    setInterval(updateStats, 2000);

    // Initial Logs
    addLog();
    addLog();
    addLog();
    loopLogs();
});
