from PIL import Image, ImageDraw, ImageFont
import math

# Create image with dark gradient background
width, height = 1200, 675
img = Image.new('RGB', (width, height), color='#0a0e27')

draw = ImageDraw.Draw(img)

# Create gradient background
for y in range(height):
    ratio = y / height
    r = int(10 + (44 - 10) * ratio)
    g = int(14 + (62 - 14) * ratio)
    b = int(39 + (80 - 39) * ratio)
    draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

# Draw knowledge graph nodes (circles)
nodes = [
    (300, 250, 40, '#00d4ff'),  # Cyan
    (450, 180, 35, '#9d4edd'),  # Purple
    (600, 220, 38, '#ff006e'),  # Pink
    (500, 350, 42, '#00f5ff'),  # Light cyan
    (700, 320, 36, '#c77dff'),  # Light purple
    (350, 400, 33, '#ff4d94'),  # Light pink
    (800, 200, 40, '#00d4ff'),  # Cyan
    (900, 350, 35, '#9d4edd'),  # Purple
]

# Draw connections (edges) between nodes
connections = [
    (0, 1), (1, 2), (2, 4), (3, 5), (0, 3), (1, 3), (2, 6), (4, 7), (6, 7)
]

# Draw edges with glow effect
for start_idx, end_idx in connections:
    x1, y1, _, color1 = nodes[start_idx]
    x2, y2, _, color2 = nodes[end_idx]
    
    # Draw glowing line
    for width_offset in range(3, 0, -1):
        alpha = int(100 / width_offset)
        draw.line([(x1, y1), (x2, y2)], fill=color1, width=width_offset)

# Draw nodes with glow effect
for x, y, radius, color in nodes:
    # Outer glow
    for i in range(3):
        glow_radius = radius + (3 - i) * 3
        draw.ellipse([x - glow_radius, y - glow_radius, x + glow_radius, y + glow_radius], 
                     fill=color + '40')
    
    # Main node
    draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)
    
    # Inner highlight
    highlight_radius = radius // 2
    draw.ellipse([x - highlight_radius, y - highlight_radius, 
                  x + highlight_radius, y + highlight_radius], 
                 fill='#ffffff80')

# Draw decorative elements on the right side
# Vector database representation
for i in range(15):
    x = 950 + (i % 5) * 30
    y = 450 + (i // 5) * 25
    size = 8
    draw.ellipse([x - size, y - size, x + size, y + size], fill='#00d4ff60')

# Add border accent
border_width = 4
draw.rectangle([0, 0, width - 1, height - 1], outline='#00d4ff', width=border_width)

# Add corner accents
accent_size = 50
draw.line([(0, 0), (accent_size, 0)], fill='#9d4edd', width=6)
draw.line([(0, 0), (0, accent_size)], fill='#9d4edd', width=6)
draw.line([(width, 0), (width - accent_size, 0)], fill='#ff006e', width=6)
draw.line([(width, 0), (width, accent_size)], fill='#ff006e', width=6)

# Save the image
img.save('assets/img/projects/project_graphrag_system.png', 'PNG', quality=95)
print('GraphRAG thumbnail created successfully!')
