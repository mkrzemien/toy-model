import { config } from '../config/config.js';
import { AnimationManager } from '../animations/AnimationManager.js';

export class MatrixView {
    constructor(model, container) {
        this.model = model;
        this.container = container;
        this.cells = [];
        this.setup();
    }

    setup() {
        this.app = new PIXI.Application({
            background: config.colors.background,
            width: this.container.clientWidth,
            height: this.container.clientHeight,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        this.container.appendChild(this.app.view);

        this.cellsContainer = new PIXI.Container();
        this.app.stage.addChild(this.cellsContainer);

        this.animationManager = new AnimationManager(this.app);
        this.createCells();
        this.centerCellsContainer();

        this.setupResizeObserver();
    }

    setupResizeObserver() {
        const resizeObserver = new ResizeObserver(() => {
            this.app.renderer.resize(this.container.clientWidth, this.container.clientHeight);
            this.centerCellsContainer();
        });
        resizeObserver.observe(this.container);
    }

    createCells() {
        this.cellsContainer.removeChildren();
        this.cells = [];

        for (let i = 0; i < this.model.getSize(); i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.model.getSize(); j++) {
                const cell = this.createCell(i, j);
                this.cellsContainer.addChild(cell);
                this.cells[i][j] = cell;
            }
        }
    }

    createCell(row, col) {
        const cell = new PIXI.Graphics();
        const value = this.model.getCellValue(row, col);
        
        cell.beginFill(value === 1 ? config.colors.cell.one : config.colors.cell.zero);
        cell.lineStyle(2, config.colors.cell.border);
        cell.drawRect(0, 0, config.matrix.cellSize, config.matrix.cellSize);
        cell.endFill();

        cell.x = col * (config.matrix.cellSize + config.matrix.spacing);
        cell.y = row * (config.matrix.cellSize + config.matrix.spacing);

        return cell;
    }

    centerCellsContainer() {
        const totalWidth = this.model.getSize() * (config.matrix.cellSize + config.matrix.spacing) - config.matrix.spacing;
        const totalHeight = this.model.getSize() * (config.matrix.cellSize + config.matrix.spacing) - config.matrix.spacing;
        
        this.cellsContainer.x = (this.app.screen.width - totalWidth) / 2;
        this.cellsContainer.y = (this.app.screen.height - totalHeight) / 2;
    }

    async animateCenterColumnSwaps() {
        const cellPairs = [[0, 1], [1, 1], [2, 1], [3, 1]];
        await this.animationManager.animateCellColumnSwaps(this.cells, cellPairs);
        this.model.swapCellsByColumns(cellPairs);
        this.createCells();
    }

    async animateCenterRowSwaps() {
        const cellPairs = [[1, 0], [1, 1], [1, 2], [1, 3]];
        await this.animationManager.animateCellRowSwaps(this.cells, cellPairs);
        this.model.swapCellsByRows(cellPairs);
        this.createCells();
    }

    async animateSideColumnSwaps() {
        const cellPairs = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 2], [1, 2], [2, 2], [3, 2]];
        await this.animationManager.animateCellColumnSwaps(this.cells, cellPairs);
        this.model.swapCellsByColumns(cellPairs);
        this.createCells();
    }

    async animateSideRowSwaps() {
        const cellPairs = [[0, 0], [0, 1], [0, 2], [0, 3], [2, 0], [2, 1], [2, 2], [2, 3]];
        await this.animationManager.animateCellRowSwaps(this.cells, cellPairs);
        this.model.swapCellsByRows(cellPairs);
        this.createCells();
    }

    async animatePartialColumnSwaps() {
        const cellPairs = [[0, 0], [1, 0], [0, 2], [1, 2]];
        await this.animationManager.animateCellColumnSwaps(this.cells, cellPairs);
        this.model.swapCellsByColumns(cellPairs);
        this.createCells();
    }

    async animatePartialRowSwaps() {
        const cellPairs = [[0, 2], [0, 3], [2, 2], [2, 3]];
        await this.animationManager.animateCellRowSwaps(this.cells, cellPairs);
        this.model.swapCellsByRows(cellPairs);
        this.createCells();
    }
} 