class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetX = x;
        this.targetY = y;
        this.color = '#2196F3'; // Material Blue
        this.shadowColor = 'rgba(33, 150, 243, 0.3)';
    }

    draw(ctx) {
        // Draw shadow
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        
        // Draw square
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }

    move(dx, dy) {
        this.targetX += dx;
        this.targetY += dy;
    }

    update() {
        const speed = 5;
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        
        if (Math.abs(dx) > 0.1) {
            this.x += dx * speed / 100;
        }
        if (Math.abs(dy) > 0.1) {
            this.y += dy * speed / 100;
        }
    }
}

// Initialize canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const mainArea = canvas.parentElement;
    canvas.width = mainArea.clientWidth;
    canvas.height = mainArea.clientHeight;
}

// Create square
const square = new Square(canvas.width / 2, canvas.height / 2, 60);

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    square.update();
    square.draw(ctx);
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    // Update square position to stay centered
    square.x = canvas.width / 2;
    square.y = canvas.height / 2;
    square.targetX = square.x;
    square.targetY = square.y;
});

// Add button event listeners with visual feedback
const buttons = {
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right')
};

Object.entries(buttons).forEach(([direction, button]) => {
    button.addEventListener('click', () => {
        const moveAmount = 50;
        switch(direction) {
            case 'up': square.move(0, -moveAmount); break;
            case 'down': square.move(0, moveAmount); break;
            case 'left': square.move(-moveAmount, 0); break;
            case 'right': square.move(moveAmount, 0); break;
        }
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    });
});

// Initialize
resizeCanvas();
animate(); 