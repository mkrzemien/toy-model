import { config } from '../config/config.js';

export class AnimationManager {
    constructor(app) {
        this.app = app;
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    async animateCellColumnSwaps(cells, cellPairs) {
        return new Promise(resolve => {
            const cells1 = [];
            const cells2 = [];
            const distances = [];
            const startPositions = [];

            cellPairs.forEach(([row, col]) => {
                cells1.push(cells[row][col]);
                cells2.push(cells[row][col + 1]);
                distances.push(config.matrix.cellSize + config.matrix.spacing);
                startPositions.push({
                    x1: col * (config.matrix.cellSize + config.matrix.spacing),
                    x2: (col + 1) * (config.matrix.cellSize + config.matrix.spacing)
                });
            });

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
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

    async animateCellRowSwaps(cells, cellPairs) {
        return new Promise(resolve => {
            const cells1 = [];
            const cells2 = [];
            const distances = [];
            const startPositions = [];

            cellPairs.forEach(([row, col]) => {
                cells1.push(cells[row][col]);
                cells2.push(cells[row + 1][col]);
                distances.push(config.matrix.cellSize + config.matrix.spacing);
                startPositions.push({
                    y1: row * (config.matrix.cellSize + config.matrix.spacing),
                    y2: (row + 1) * (config.matrix.cellSize + config.matrix.spacing)
                });
            });

            let progress = 0;
            const animate = (delta) => {
                progress += delta / 60 / config.animation.duration;
                
                if (progress >= 1) {
                    progress = 1;
                    this.app.ticker.remove(animate);
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
} 