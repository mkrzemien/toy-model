export class MatrixModel {
    constructor(size) {
        this.size = size;
        this.data = Array(size).fill().map(() => Array(size).fill(0));
        this.initialize();
    }

    initialize() {
        // Initialize with a specific pattern
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

    swapCellsByColumns(cellPairs) {
        for (const [row, col] of cellPairs) {
            [this.data[row][col], this.data[row][col + 1]] = [this.data[row][col + 1], this.data[row][col]];
        }
    }

    swapRows(row1, row2) {
        [this.data[row1], this.data[row2]] = [this.data[row2], this.data[row1]];
    }

    swapCellsByRows(cellPairs) {
        for (const [row, col] of cellPairs) {
            [this.data[row][col], this.data[row + 1][col]] = [this.data[row + 1][col], this.data[row][col]];
        }
    }

    getCellValue(row, col) {
        return this.data[row][col];
    }

    getSize() {
        return this.size;
    }
} 