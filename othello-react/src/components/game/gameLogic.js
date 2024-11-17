class GameLogic {
    constructor(matrix) {
        this.matrix = matrix;
        this.blackPos = [];
        this.whitePos = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.matrix[row][col] === 1) this.blackPos.push([row, col]);
                if (this.matrix[row][col] === 2) this.whitePos.push([row, col]);
            }
        }
    }

    getBoard() {
        return this.matrix.map(arr => arr.slice());
    }

    getPos(color) {
        return color === 1 ? this.blackPos : this.whitePos;
    }

    getScore(color) {
        return color === 1 ? this.blackPos.length : this.whitePos.length;
    }

    canClickSpot(row, col, color) {
        if (this.matrix[row][col] !== 0) return false;
        const affectedDisks = this.getAffectedDisks(row, col, color);
        return affectedDisks.length > 0;
    }

    iterator(row, rd, col, cd, color, affectedDisks) {
        const couldBeAffected = [];
        let columnIterator = col;
        let rowIterator = row;

        while (
            ((rowIterator < 7 && rd === 1) || (rowIterator > 0 && rd === -1) || rd === 0) &&
            ((columnIterator < 7 && cd === 1) || (columnIterator > 0 && cd === -1) || cd === 0)
        ) {
            columnIterator += cd;
            rowIterator += rd;
            const valueAtSpot = this.matrix[rowIterator][columnIterator];

            if (valueAtSpot === 0 || valueAtSpot === color) {
                if (valueAtSpot === color) {
                    affectedDisks = affectedDisks.concat(couldBeAffected);
                }
                break;
            } else {
                const diskLocation = { row: rowIterator, col: columnIterator };
                couldBeAffected.push(diskLocation);
            }
        }

        return affectedDisks;
    }

    getAffectedDisks(row, col, color) {
        let affectedDisks = [];

        affectedDisks = this.iterator(row, 0, col, 1, color, affectedDisks);  // left to right
        affectedDisks = this.iterator(row, 0, col, -1, color, affectedDisks); // right to left
        affectedDisks = this.iterator(row, -1, col, 0, color, affectedDisks); // down to up
        affectedDisks = this.iterator(row, 1, col, 0, color, affectedDisks);  // up to down
        affectedDisks = this.iterator(row, 1, col, 1, color, affectedDisks);  // down right
        affectedDisks = this.iterator(row, 1, col, -1, color, affectedDisks); // down left
        affectedDisks = this.iterator(row, -1, col, -1, color, affectedDisks); // up left
        affectedDisks = this.iterator(row, -1, col, 1, color, affectedDisks);  // up right

        return affectedDisks;
    }

    flipDisks(affectedDisks) {
        affectedDisks.forEach(e => {
            this.matrix[e.row][e.col] = this.matrix[e.row][e.col] === 1 ? 2 : 1;
        });
    }

    canThisPlayerMove(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.canClickSpot(row, col, color)) {
                    return true;
                }
            }
        }
        return false;
    }

    getMovableCell(color) {
        const movable = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.canClickSpot(row, col, color)) movable.push([row, col]);
            }
        }
        return movable;
    }

    getStableDisc(color) {
        const stable = [];
        const redundant = Array(8).fill(0).map(() => Array(8).fill(false));

        let xlim = 7;
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= xlim; j++) {
                if (this.matrix[i][j] !== color) break;
                if (!redundant[i][j]) {
                    stable.push([i, j]);
                    redundant[i][j] = true;
                }
            }
            xlim = xlim - 1;
            if (xlim < 0) break;
        }

        xlim = 0;
        for (let i = 0; i <= 7; i++) {
            for (let j = 7; j >= xlim; j--) {
                if (this.matrix[i][j] !== color) break;
                if (!redundant[i][j]) {
                    stable.push([i, j]);
                    redundant[i][j] = true;
                }
            }
            xlim = xlim + 1;
            if (xlim > 8) break;
        }

        xlim = 7;
        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j <= xlim; j++) {
                if (this.matrix[i][j] !== color) break;
                if (!redundant[i][j]) {
                    stable.push([i, j]);
                    redundant[i][j] = true;
                }
            }
            xlim = xlim - 1;
            if (xlim < 0) break;
        }

        xlim = 0;
        for (let i = 7; i >= 0; i--) {
            for (let j = 7; j >= xlim; j--) {
                if (this.matrix[i][j] !== color) break;
                if (!redundant[i][j]) {
                    stable.push([i, j]);
                    redundant[i][j] = true;
                }
            }
            xlim = xlim + 1;
            if (xlim > 8) break;
        }

        return stable;
    }

    getFrontierDisc(color) {
        const owndisc = this.getPos(color);
        const frontier = [];
        for (const disc of owndisc) {
            if (disc.includes(0) || disc.includes(7)) continue;

            let isfound = false;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (this.matrix[disc[0] + i][disc[1] + j] === 0) {
                        frontier.push(disc);
                        isfound = true;
                        break;
                    }
                }
                if (isfound) break;
            }
        }

        return frontier;
    }

    isTerminal() {
        return this.blackPos.length === 0 || this.whitePos.length === 0 || this.blackPos.length + this.whitePos.length === 64;
    }

    move(row, col, color) {
        if (this.matrix[row][col] !== 0) return this;
        const captured = this.getAffectedDisks(row, col, color);
        if (captured.length !== 0) {
            this.flipDisks(captured);
            this.matrix[row][col] = color;
        }
        return this;
    }
}

export { GameLogic };