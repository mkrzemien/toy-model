// Configuration
const config = {
    matrix: {
        size: 4,
        cellSize: 50,
        spacing: 5,
        padding: 100
    },
    colors: {
        background: 0xFAFAFA,
        cell: {
            zero: 0xFFFFFF,  // Light color for 0
            one: 0x1976D2,   // Dark color for 1
            border: 0x2196F3
        }
    },
    animation: {
        duration: 0.5 // seconds
    }
};

// Model
class MatrixModel {
    constructor(size) {
        this.size = size;
        this.data = Array(size).fill().map(() => Array(size).fill(0));
        // Initialize a single cell in the second column to 1
        this.data[1][1] = 1; // Set the middle cell in the second column to 1
    }

    swapColumns(col1, col2) {
        for (let i = 0; i < this.size; i++) {
            [this.data[i][col1], this.data[i][col2]] = [this.data[i][col2], this.data[i][col1]];
        }
    }
}

// View
class MatrixView {
    constructor(model, container) {
        this.model = model;
        this.container = container;
        this.cells = [];
        this.setup();
    }

    setup() {
        // Create PIXI Application with explicit size
        this.app = new PIXI.Application({
            background: config.colors.background,
            width: this.container.clientWidth,
            height: this.container.clientHeight,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        this.container.appendChild(this.app.view);

        // Create container for cells
        this.cellsContainer = new PIXI.Container();
        this.app.stage.addChild(this.cellsContainer);

        this.createCells();
        this.centerCellsContainer();

        // Handle window resize
        const resizeObserver = new ResizeObserver(() => {
            this.app.renderer.resize(this.container.clientWidth, this.container.clientHeight);
            this.centerCellsContainer();
        });
        resizeObserver.observe(this.container);
    }

    createCells() {
        // Clear existing cells
        this.cellsContainer.removeChildren();
        this.cells = [];

        // Create new cells
        for (let i = 0; i < this.model.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.model.size; j++) {
                const cell = this.createCell(i, j);
                this.cellsContainer.addChild(cell);
                this.cells[i][j] = cell;
            }
        }
    }

    createCell(row, col) {
        const cell = new PIXI.Graphics();
        const value = this.model.data[row][col];
        
        // Draw cell background based on value
        cell.beginFill(value === 1 ? config.colors.cell.one : config.colors.cell.zero);
        cell.lineStyle(2, config.colors.cell.border);
        cell.drawRect(0, 0, config.matrix.cellSize, config.matrix.cellSize);
        cell.endFill();

        // Position cell
        cell.x = col * (config.matrix.cellSize + config.matrix.spacing);
        cell.y = row * (config.matrix.cellSize + config.matrix.spacing);

        return cell;
    }

    centerCellsContainer() {
        const totalWidth = this.model.size * (config.matrix.cellSize + config.matrix.spacing) - config.matrix.spacing;
        const totalHeight = this.model.size * (config.matrix.cellSize + config.matrix.spacing) - config.matrix.spacing;
        
        this.cellsContainer.x = (this.app.screen.width - totalWidth) / 2;
        this.cellsContainer.y = (this.app.screen.height - totalHeight) / 2;
    }

    animateSwap(col1, col2) {
        const cells1 = this.cells.map(row => row[col1]);
        const cells2 = this.cells.map(row => row[col2]);
        const distance = config.matrix.cellSize + config.matrix.spacing;

        // Animate using PIXI's ticker
        let progress = 0;
        const animate = (delta) => {
            progress += delta / 60 / config.animation.duration;
            
            if (progress >= 1) {
                progress = 1;
                this.app.ticker.remove(animate);
                
                // Update the model
                this.model.swapColumns(col1, col2);
                
                // Redraw the entire matrix
                this.createCells();
                this.centerCellsContainer();
            } else {
                // Easing function for smooth animation
                const eased = this.easeInOutQuad(progress);

                cells1.forEach(cell => {
                    cell.x = col1 * (config.matrix.cellSize + config.matrix.spacing) + distance * eased;
                });

                cells2.forEach(cell => {
                    cell.x = col2 * (config.matrix.cellSize + config.matrix.spacing) - distance * eased;
                });
            }
        };

        this.app.ticker.add(animate);
    }

    // Easing function for smooth animation
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
}

// Initialize
const model = new MatrixModel(config.matrix.size);
const view = new MatrixView(model, document.getElementById('pixi-container'));

// Event handling
document.getElementById('swap-columns').addEventListener('click', () => {
    view.animateSwap(1, 2);
}); 