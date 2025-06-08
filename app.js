class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetX = x;
        this.targetY = y;
    }

    draw(ctx) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
const square = new Square(canvas.width / 2, canvas.height / 2, 50);

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

// Add button event listeners
document.getElementById('up').addEventListener('click', () => square.move(0, -50));
document.getElementById('down').addEventListener('click', () => square.move(0, 50));
document.getElementById('left').addEventListener('click', () => square.move(-50, 0));
document.getElementById('right').addEventListener('click', () => square.move(50, 0));

// Initialize
resizeCanvas();
animate(); 