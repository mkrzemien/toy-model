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

    animateSwap(col1, col2) {
        return new Promise(resolve => {
            const cells1 = this.cells.map(row => row[col1]);
            const cells2 = this.cells.map(row => row[col2]);
            const distance = config.matrix.cellSize + config.matrix.spacing;

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
                    resolve();
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
        });
    }

    animateRowSwap(row1, row2) {
        return new Promise(resolve => {
            const cells1 = this.cells[row1];
            const cells2 = this.cells[row2];
            const distance = config.matrix.cellSize + config.matrix.spacing;

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model
                    this.model.swapRows(row1, row2);
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    // Easing function for smooth animation
                    const eased = this.easeInOutQuad(progress);

                    cells1.forEach(cell => {
                        cell.y = row1 * (config.matrix.cellSize + config.matrix.spacing) + distance * eased;
                    });

                    cells2.forEach(cell => {
                        cell.y = row2 * (config.matrix.cellSize + config.matrix.spacing) - distance * eased;
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animateMultipleColumnSwaps(swaps) {
        return new Promise(resolve => {
            const cells = swaps.map(([col1, col2]) => ({
                col1: this.cells.map(row => row[col1]),
                col2: this.cells.map(row => row[col2]),
                distance: config.matrix.cellSize + config.matrix.spacing,
                col1Pos: col1 * (config.matrix.cellSize + config.matrix.spacing),
                col2Pos: col2 * (config.matrix.cellSize + config.matrix.spacing)
            }));

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model
                    swaps.forEach(([col1, col2]) => this.model.swapColumns(col1, col2));
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells.forEach(({ col1, col2, distance, col1Pos, col2Pos }) => {
                        col1.forEach(cell => {
                            cell.x = col1Pos + distance * eased;
                        });
                        col2.forEach(cell => {
                            cell.x = col2Pos - distance * eased;
                        });
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animateMultipleRowSwaps(swaps) {
        return new Promise(resolve => {
            const cells = swaps.map(([row1, row2]) => ({
                row1: this.cells[row1],
                row2: this.cells[row2],
                distance: config.matrix.cellSize + config.matrix.spacing,
                row1Pos: row1 * (config.matrix.cellSize + config.matrix.spacing),
                row2Pos: row2 * (config.matrix.cellSize + config.matrix.spacing)
            }));

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model
                    swaps.forEach(([row1, row2]) => this.model.swapRows(row1, row2));
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells.forEach(({ row1, row2, distance, row1Pos, row2Pos }) => {
                        row1.forEach(cell => {
                            cell.y = row1Pos + distance * eased;
                        });
                        row2.forEach(cell => {
                            cell.y = row2Pos - distance * eased;
                        });
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animatePartialColumnSwaps() {
        return new Promise(resolve => {
            // Get cells for the first two rows only
            const cells = [
                {
                    col1: [this.cells[0][0], this.cells[1][0]],
                    col2: [this.cells[0][1], this.cells[1][1]],
                    distance: config.matrix.cellSize + config.matrix.spacing,
                    col1Pos: 0 * (config.matrix.cellSize + config.matrix.spacing),
                    col2Pos: 1 * (config.matrix.cellSize + config.matrix.spacing)
                },
                {
                    col1: [this.cells[0][2], this.cells[1][2]],
                    col2: [this.cells[0][3], this.cells[1][3]],
                    distance: config.matrix.cellSize + config.matrix.spacing,
                    col1Pos: 2 * (config.matrix.cellSize + config.matrix.spacing),
                    col2Pos: 3 * (config.matrix.cellSize + config.matrix.spacing)
                }
            ];

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model for first two rows only
                    for (let i = 0; i < 2; i++) {
                        [this.model.data[i][0], this.model.data[i][1]] = [this.model.data[i][1], this.model.data[i][0]];
                        [this.model.data[i][2], this.model.data[i][3]] = [this.model.data[i][3], this.model.data[i][2]];
                    }
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells.forEach(({ col1, col2, distance, col1Pos, col2Pos }) => {
                        col1.forEach(cell => {
                            cell.x = col1Pos + distance * eased;
                        });
                        col2.forEach(cell => {
                            cell.x = col2Pos - distance * eased;
                        });
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animatePartialRowSwaps() {
        return new Promise(resolve => {
            // Get cells for the last two columns only
            const cells = [
                {
                    row1: [this.cells[0][2], this.cells[0][3]],
                    row2: [this.cells[1][2], this.cells[1][3]],
                    distance: config.matrix.cellSize + config.matrix.spacing,
                    row1Pos: 0 * (config.matrix.cellSize + config.matrix.spacing),
                    row2Pos: 1 * (config.matrix.cellSize + config.matrix.spacing)
                },
                {
                    row1: [this.cells[2][2], this.cells[2][3]],
                    row2: [this.cells[3][2], this.cells[3][3]],
                    distance: config.matrix.cellSize + config.matrix.spacing,
                    row1Pos: 2 * (config.matrix.cellSize + config.matrix.spacing),
                    row2Pos: 3 * (config.matrix.cellSize + config.matrix.spacing)
                }
            ];

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
                    
                    // Update the model for last two columns only
                    for (let j = 2; j < 4; j++) {
                        [this.model.data[0][j], this.model.data[1][j]] = [this.model.data[1][j], this.model.data[0][j]];
                        [this.model.data[2][j], this.model.data[3][j]] = [this.model.data[3][j], this.model.data[2][j]];
                    }
                    
                    // Redraw the entire matrix
                    this.createCells();
                    this.centerCellsContainer();
                    resolve();
                } else {
                    const eased = this.easeInOutQuad(progress);

                    cells.forEach(({ row1, row2, distance, row1Pos, row2Pos }) => {
                        row1.forEach(cell => {
                            cell.y = row1Pos + distance * eased;
                        });
                        row2.forEach(cell => {
                            cell.y = row2Pos - distance * eased;
                        });
                    });
                }
            };

            this.app.ticker.add(animate);
        });
    }

    animatePartialSequence() {
        return new Promise(resolve => {
            // First run the column swap and wait for it to complete
            this.animatePartialColumnSwaps().then(() => {
                // After column swap completes, run the row swap
                this.animatePartialRowSwaps().then(resolve);
            });
        });
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
    const buttons = [
        'swap-columns',
        'swap-rows',
        'swap-columns-pairs',
        'swap-rows-pairs',
        'swap-columns-partial',
        'swap-rows-partial',
        'swap-partial-sequence'
    ];
    buttons.forEach(id => {
        const button = document.getElementById(id);
        button.disabled = !enabled;
    });
}

// Event handling
document.getElementById('swap-columns').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateSwap(1, 2);
    setButtonsEnabled(true);
});

document.getElementById('swap-rows').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateRowSwap(1, 2);
    setButtonsEnabled(true);
});

document.getElementById('swap-columns-pairs').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateMultipleColumnSwaps([[0, 1], [2, 3]]);
    setButtonsEnabled(true);
});

document.getElementById('swap-rows-pairs').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateMultipleRowSwaps([[0, 1], [2, 3]]);
    setButtonsEnabled(true);
});

document.getElementById('swap-columns-partial').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animatePartialColumnSwaps();
    setButtonsEnabled(true);
});

document.getElementById('swap-rows-partial').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animatePartialRowSwaps();
    setButtonsEnabled(true);
});

document.getElementById('swap-partial-sequence').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animatePartialSequence();
    setButtonsEnabled(true);
});

// Composite action handlers
document.getElementById('composite-h').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateSwap(1, 2);
    await view.animateRowSwap(1, 2);
    setButtonsEnabled(true);
});

document.getElementById('composite-nx').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateSwap(1, 2);
    await view.animateMultipleColumnSwaps([[0, 1], [2, 3]]);
    await view.animateSwap(1, 2);
    setButtonsEnabled(true);
});

document.getElementById('composite-ny').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateRowSwap(1, 2);
    await view.animateMultipleRowSwaps([[0, 1], [2, 3]]);
    await view.animateRowSwap(1, 2);
    setButtonsEnabled(true);
});

document.getElementById('composite-cx').addEventListener('click', async () => {
    setButtonsEnabled(false);
    await view.animateSwap(1, 2);
    await view.animatePartialSequence();
    await view.animateSwap(1, 2);
    setButtonsEnabled(true);
}); 