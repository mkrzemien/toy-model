// Configuration
const config = {
    matrix: {
        size: 4,
        cellSize: 50,
        spacing: 0,
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
        duration: 0.3 // seconds
    }
};

// Model
class MatrixModel {
    constructor(size) {
        this.size = size;
        this.data = Array(size).fill().map(() => Array(size).fill(0));
        // Initialize
        this.data[2][0] = 1;
        this.data[2][1] = 1;
        this.data[3][0] = 1;
        this.data[3][1] = 1;
    }

    swapColumns(col1, col2) {
        for (let i = 0; i < this.size; i++) {
            [this.data[i][col1], this.data[i][col2]] = [this.data[i][col2], this.data[i][col1]];
        }
    }

    swapRows(row1, row2) {
        [this.data[row1], this.data[row2]] = [this.data[row2], this.data[row1]];
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

    animateCellColumnSwaps(cellPairs) {
        return new Promise(resolve => {
            const cells1 = [];
            const cells2 = [];
            const distances = [];
            const startPositions = [];

            // Process each pair to get the cells and their positions
            cellPairs.forEach(([row, col]) => {
                if (col < this.model.size - 1) {  // Ensure we don't go out of bounds
                    cells1.push(this.cells[row][col]);
                    cells2.push(this.cells[row][col + 1]);
                    distances.push(config.matrix.cellSize + config.matrix.spacing);
                    startPositions.push({
                        x1: col * (config.matrix.cellSize + config.matrix.spacing),
                        x2: (col + 1) * (config.matrix.cellSize + config.matrix.spacing)
                    });
                }
            });

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model
                    cellPairs.forEach(([row, col]) => {
                        if (col < this.model.size - 1) {
                            [this.model.data[row][col], this.model.data[row][col + 1]] = 
                            [this.model.data[row][col + 1], this.model.data[row][col]];
                        }
                    });
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells1.forEach((cell, index) => {
                        cell.x = startPositions[index].x1 + distances[index] * eased;
                    });

                    cells2.forEach((cell, index) => {
                        cell.x = startPositions[index].x2 - distances[index] * eased;
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animateCellRowSwaps(cellPairs) {
        return new Promise(resolve => {
            const cells1 = [];
            const cells2 = [];
            const distances = [];
            const startPositions = [];

            // Process each pair to get the cells and their positions
            cellPairs.forEach(([row, col]) => {
                if (row < this.model.size - 1) {  // Ensure we don't go out of bounds
                    cells1.push(this.cells[row][col]);
                    cells2.push(this.cells[row + 1][col]);
                    distances.push(config.matrix.cellSize + config.matrix.spacing);
                    startPositions.push({
                        y1: row * (config.matrix.cellSize + config.matrix.spacing),
                        y2: (row + 1) * (config.matrix.cellSize + config.matrix.spacing)
                    });
                }
            });

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model
                    cellPairs.forEach(([row, col]) => {
                        if (row < this.model.size - 1) {
                            [this.model.data[row][col], this.model.data[row + 1][col]] = 
                            [this.model.data[row + 1][col], this.model.data[row][col]];
                        }
                    });
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells1.forEach((cell, index) => {
                        cell.y = startPositions[index].y1 + distances[index] * eased;
                    });

                    cells2.forEach((cell, index) => {
                        cell.y = startPositions[index].y2 - distances[index] * eased;
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animateCenterColumnSwaps() {
        return this.animateCellColumnSwaps([[0, 1], [1, 1], [2, 1], [3, 1]]);
    }

    animateCenterRowSwaps() {
        return this.animateCellRowSwaps([[1, 0], [1, 1], [1, 2], [1, 3]]);
    }

    animateSideColumnSwaps() {
        return this.animateCellColumnSwaps([[0, 0], [1, 0], [2, 0], [3, 0], [0, 2], [1, 2], [2, 2], [3, 2]]);
     }

    animateSideRowSwaps() {
        return this.animateCellRowSwaps([[0, 0], [0, 1], [0, 2], [0, 3], [2, 0], [2, 1], [2, 2], [2, 3]]);
    }

    animatePartialColumnSwaps() {
        return this.animateCellColumnSwaps([[0, 0], [1, 0], [0, 2], [1, 2]]);
    }

    animatePartialRowSwaps() {
        return this.animateCellRowSwaps([[0, 2], [0, 3], [2, 2], [2, 3]]);
    }

    // Easing function for smooth animation
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
}

// Initialize
const model = new MatrixModel(config.matrix.size);
const view = new MatrixView(model, document.getElementById('pixi-container'));

// Button state management
function setButtonsEnabled(enabled) {
    const sidePanel = document.querySelector('.side-panel');
    sidePanel.style.pointerEvents = enabled ? 'auto' : 'none';
    sidePanel.style.cursor = enabled ? 'auto' : 'wait';
}

// Utility function for chaining animations with pauses
async function chainAnimations(animations, pauseDuration = 0.05) {
    try {
        setButtonsEnabled(false);
        for (const animation of animations) {
            await animation();
            await new Promise(resolve => setTimeout(resolve, pauseDuration * 1000));
        }
    } finally {
        setButtonsEnabled(true);
    }
}

// Event handling
document.getElementById('swap-columns-h').addEventListener('click', () => {
    chainAnimations([() => view.animateCenterColumnSwaps()]);
});

document.getElementById('swap-rows-h').addEventListener('click', () => {
    chainAnimations([() => view.animateCenterRowSwaps()]);
});

document.getElementById('swap-columns-z').addEventListener('click', () => {
    chainAnimations([() => view.animateSideColumnSwaps()]);
});

document.getElementById('swap-rows-z').addEventListener('click', () => {
    chainAnimations([() => view.animateSideRowSwaps()]);
});

document.getElementById('swap-columns-p').addEventListener('click', () => {
    chainAnimations([() => view.animatePartialColumnSwaps()]);
});

document.getElementById('swap-rows-p').addEventListener('click', () => {
    chainAnimations([() => view.animatePartialRowSwaps()]);
});

// Composite action handlers
document.getElementById('composite-cz').addEventListener('click', () => {
    chainAnimations([
        () => view.animatePartialColumnSwaps(),
        () => view.animatePartialRowSwaps()
    ]);
});

document.getElementById('composite-h').addEventListener('click', () => {
    chainAnimations([
        () => view.animateCenterColumnSwaps(),
        () => view.animateCenterRowSwaps()
    ]);
});

document.getElementById('composite-nx').addEventListener('click', () => {
    chainAnimations([
        () => view.animateCenterColumnSwaps(),
        () => view.animateSideColumnSwaps(),
        () => view.animateCenterColumnSwaps()
    ]);
});

document.getElementById('composite-ny').addEventListener('click', () => {
    chainAnimations([
        () => view.animateCenterRowSwaps(),
        () => view.animateSideRowSwaps(),
        () => view.animateCenterRowSwaps()
    ]);
});

document.getElementById('composite-cx').addEventListener('click', () => {
    chainAnimations([
        () => view.animateCenterColumnSwaps(),
        () => view.animatePartialColumnSwaps(),
        () => view.animatePartialRowSwaps(),
        () => view.animateCenterColumnSwaps()
    ]);
}); 