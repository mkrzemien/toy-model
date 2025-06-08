const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration object for easy parameter management
const config = {
    matrix: {
        size: 4, // 4x4 matrix
        padding: 100, // Increased padding to make matrix much smaller
        cellSpacing: 4, // Space between cells
    },
    animation: {
        speed: 0.05, // Base animation speed
        easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, // Smooth easing function
    }
};

// Set canvas size to match container
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// Initialize matrix (4x4)
let matrix = Array(config.matrix.size).fill().map(() => Array(config.matrix.size).fill(0));

// Animation state
let isAnimating = false;
let animationProgress = 0;
let animationDirection = 1; // 1 for forward, -1 for reverse

// Calculate cell size and position
function getCellSize() {
    const size = Math.min(
        (canvas.width - config.matrix.padding * 2) / config.matrix.size,
        (canvas.height - config.matrix.padding * 2) / config.matrix.size
    );
    return size;
}

// Draw the matrix
function drawMatrix() {
    const cellSize = getCellSize();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each cell
    for (let i = 0; i < config.matrix.size; i++) {
        for (let j = 0; j < config.matrix.size; j++) {
            let x = config.matrix.padding + j * (cellSize + config.matrix.cellSpacing);
            const y = config.matrix.padding + i * (cellSize + config.matrix.cellSpacing);
            
            // Apply animation offset for columns 2 and 3
            if (isAnimating && (j === 1 || j === 2)) {
                const easedProgress = config.animation.easing(animationProgress);
                const offset = cellSize * easedProgress * (j === 1 ? 1 : -1);
                x += offset;
            }
            
            // Draw cell
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);
            
            // Draw cell content (empty for now)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        }
    }
}

// Animation loop
function animate() {
    if (isAnimating) {
        animationProgress += config.animation.speed * animationDirection;
        
        if (animationProgress >= 1) {
            animationProgress = 1;
            isAnimating = false;
            // Actually swap the columns in the matrix
            for (let i = 0; i < config.matrix.size; i++) {
                [matrix[i][1], matrix[i][2]] = [matrix[i][2], matrix[i][1]];
            }
        } else if (animationProgress <= 0) {
            animationProgress = 0;
            isAnimating = false;
        }
        
        drawMatrix();
        requestAnimationFrame(animate);
    }
}

// Swap columns 2 and 3
function swapColumns() {
    if (!isAnimating) {
        isAnimating = true;
        animationProgress = 0;
        animationDirection = 1;
        animate();
    }
}

// Event listeners
window.addEventListener('resize', () => {
    resizeCanvas();
    drawMatrix();
});

document.getElementById('swap-columns').addEventListener('click', swapColumns);

// Initial setup
resizeCanvas();
drawMatrix(); 