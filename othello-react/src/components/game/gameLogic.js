class GameLogic {
    constructor(boardMatrix) {
        try {
            this.matrix = boardMatrix;
            this.blackPos = [];
            this.whitePos = [];

            let rowIndex = 0;
            while(rowIndex < 8) {
                let colIndex = 0;
                while(colIndex < 8) {
                    let currentCell = this.matrix[rowIndex][colIndex];
                    if (currentCell === 1) {
                        this.blackPos.push([rowIndex, colIndex]);
                    }
                    if (currentCell === 2) {
                        this.whitePos.push([rowIndex, colIndex]);
                    }
                    colIndex++;
                }
                rowIndex++;
            }
        } catch (initError) {
            console.error('Board initialization failed:', initError);
            throw initError;
        }
    }

    isTerminal() {
        try {
            let totalPieces = this.blackPos.length + this.whitePos.length;
            let noBlackPieces = this.blackPos.length === 0;
            let noWhitePieces = this.whitePos.length === 0;
            let boardFull = totalPieces === 64;
            
            return noBlackPieces || noWhitePieces || boardFull;
        } catch (terminalCheckError) {
            console.error('Terminal state check failed:', terminalCheckError);
            return false;
        }
    }

    getFrontierDisc(playerColor) {
        try {
            const playerDiscs = this.getPos(playerColor);
            let frontierDiscs = [];

            for (let disc of playerDiscs) {
                if (disc.includes(0) || disc.includes(7)) continue;

                let foundEmpty = false;
                let rowOffset = -1;

                while(rowOffset <= 1) {
                    let colOffset = -1;
                    while(colOffset <= 1) {
                        let adjacentCell = this.matrix[disc[0] + rowOffset][disc[1] + colOffset];
                        if (adjacentCell === 0) {
                            frontierDiscs.push(disc);
                            foundEmpty = true;
                            break;
                        }
                        colOffset++;
                    }
                    if (foundEmpty) break;
                    rowOffset++;
                }
            }
            return frontierDiscs;
        } catch (frontierError) {
            console.error('Frontier disc calculation failed:', frontierError);
            return [];
        }
    }

    getScore(playerColor) {
        try {
            let pieceCount = playerColor === 1 ? this.blackPos.length : this.whitePos.length;
            return pieceCount;
        } catch (scoreError) {
            console.error('Score calculation failed:', scoreError);
            return 0;
        }
    }

    canClickSpot(rowPos, colPos, playerColor) {
        try {
            let cellEmpty = this.matrix[rowPos][colPos] === 0;
            if (!cellEmpty) return false;

            let affectedPieces = this.getAffectedDisks(rowPos, colPos, playerColor);
            return affectedPieces.length > 0;
        } catch (clickCheckError) {
            console.error('Click check failed:', clickCheckError);
            return false;
        }
    }

    flipDisks(disksToFlip) {
        try {
            disksToFlip.forEach(diskPos => {
                let currentValue = this.matrix[diskPos.row][diskPos.col];
                this.matrix[diskPos.row][diskPos.col] = currentValue === 1 ? 2 : 1;
            });
        } catch (flipError) {
            console.error('Disk flip failed:', flipError);
        }
    }

    getBoard() {
        try {
            return this.matrix.map(row => row.slice());
        } catch (getBoardError) {
            console.error('Get board failed:', getBoardError);
            return [];
        }
    }

    getPos(playerColor) {
        try {
            return playerColor === 1 ? this.blackPos : this.whitePos;
        } catch (getPosError) {
            console.error('Get position failed:', getPosError);
            return [];
        }
    }

    getMovableCell(playerColor) {
        try {
            let movableCells = [];
            let rowIdx = 0;
            while(rowIdx < 8) {
                let colIdx = 0;
                while(colIdx < 8) {
                    if (this.canClickSpot(rowIdx, colIdx, playerColor)) {
                        movableCells.push([rowIdx, colIdx]);
                    }
                    colIdx++;
                }
                rowIdx++;
            }
            return movableCells;
        } catch (movableError) {
            console.error('Movable cell calculation failed:', movableError);
            return [];
        }
    }

    move(rowPos, colPos, playerColor) {
        try {
            let isValidMove = this.matrix[rowPos][colPos] === 0;
            if (!isValidMove) return this;

            let capturedDisks = this.getAffectedDisks(rowPos, colPos, playerColor);
            
            if (capturedDisks.length > 0) {
                this.flipDisks(capturedDisks);
                this.matrix[rowPos][colPos] = playerColor;
            }
            return this;
        } catch (moveError) {
            console.error('Move execution failed:', moveError);
            return this;
        }
    }

    iterator(rowStart, rowDir, colStart, colDir, playerColor, affectedDisks) {
        try {
            let potentialFlips = [];
            let currentCol = colStart;
            let currentRow = rowStart;

            while (
                ((currentRow < 7 && rowDir === 1) || (currentRow > 0 && rowDir === -1) || rowDir === 0) &&
                ((currentCol < 7 && colDir === 1) || (currentCol > 0 && colDir === -1) || colDir === 0)
            ) {
                currentCol += colDir;
                currentRow += rowDir;
                
                let cellValue = this.matrix[currentRow][currentCol];
                
                if (cellValue === 0 || cellValue === playerColor) {
                    if (cellValue === playerColor) {
                        affectedDisks = [...affectedDisks, ...potentialFlips];
                    }
                    break;
                } else {
                    let diskPos = { row: currentRow, col: currentCol };
                    potentialFlips.push(diskPos);
                }
            }
            return affectedDisks;
        } catch (iteratorError) {
            console.error('Iterator failed:', iteratorError);
            return affectedDisks;
        }
    }

    getAffectedDisks(rowPos, colPos, playerColor) {
        try {
            let affectedPieces = [];
            
            // Using array to store directions
            let directions = [
                [0, 1],   // right
                [0, -1],  // left
                [-1, 0],  // up
                [1, 0],   // down
                [1, 1],   // down right
                [1, -1],  // down left
                [-1, -1], // up left
                [-1, 1]   // up right
            ];

            directions.forEach(dir => {
                affectedPieces = this.iterator(
                    rowPos, dir[0], 
                    colPos, dir[1], 
                    playerColor, 
                    affectedPieces
                );
            });

            return affectedPieces;
        } catch (affectedError) {
            console.error('Affected disks calculation failed:', affectedError);
            return [];
        }
    }

    getStableDisc(playerColor) {
        try {
            let stableDiscs = [];
            let visitedCells = Array(8).fill(0).map(() => Array(8).fill(false));

            // Modified to use while loops
            let processQuadrant = (startRow, endRow, startCol, endCol, rowStep, colStep) => {
                let row = startRow;
                let limit = endCol;
                
                while((rowStep > 0 ? row <= endRow : row >= endRow)) {
                    let col = startCol;
                    while((colStep > 0 ? col <= limit : col >= limit)) {
                        if (this.matrix[row][col] !== playerColor) break;
                        if (!visitedCells[row][col]) {
                            stableDiscs.push([row, col]);
                            visitedCells[row][col] = true;
                        }
                        col += colStep;
                    }
                    limit += (colStep > 0 ? -1 : 1);
                    if (limit < 0 || limit > 7) break;
                    row += rowStep;
                }
            };

            // Process all quadrants
            processQuadrant(0, 7, 0, 7, 1, 1);    // top-left to bottom-right
            processQuadrant(0, 7, 7, 0, 1, -1);   // top-right to bottom-left
            processQuadrant(7, 0, 0, 7, -1, 1);   // bottom-left to top-right
            processQuadrant(7, 0, 7, 0, -1, -1);  // bottom-right to top-left

            return stableDiscs;
        } catch (stableError) {
            console.error('Stable disc calculation failed:', stableError);
            return [];
        }
    }
}

export { GameLogic };
