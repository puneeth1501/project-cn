import { GameLogic } from "./gameLogic";

class AI2 {
    constructor(gameLogic) {
        this.gameLogic = new GameLogic(gameLogic.getBoard());
        this.scorePos = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.h = 6;
        this.makeScorePos(this.scorePos);
    }

    // First function will be called here
    ai2Called(color) {
        let bestscore = -Infinity;
        let bestrow = 0;
        let bestcol = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.gameLogic.canClickSpot(row, col, color)) {
                    let score = this.scoring(this.gameLogic, row, col, color) + this.minimax(this.gameLogic, 0, false, color, 0);
                    if (bestscore < score) {
                        bestscore = score;
                        bestrow = row;
                        bestcol = col;
                    }
                }
            }
        }
        
        let pos = { 'row': bestrow, 'col': bestcol };
        if (this.gameLogic.getMovableCell(color).length !== 0) {
            return pos;
        }
    }

    makeScorePos(scorePos) {
        this.scorePos = scorePos;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.scorePos[row][col] = 1; // score normal tile
                if (row === 1 || row === 6 || col === 1 || col === 6) {
                    this.scorePos[row][col] = -100; // score almost edge
                }
                if (row === 0 || row === 7 || col === 0 || col === 7) {
                    this.scorePos[row][col] = 100; // score edge
                    if (row === col || (row === 0 && col === 7) || (row === 7 && col === 0)) {
                        this.scorePos[row][col] = 1000; // score corner
                    }
                    if (row === 1 || row === 6 || col === 1 || col === 6) {
                        this.scorePos[row][col] = -1000; // score noob tile
                    }
                }
                if ((row === 1 && col === 1) || (row === 1 && col === 6) || (row === 6 && col === 1) || (row === 6 && col === 6)) {
                    this.scorePos[row][col] = -1000; // score noob tile
                }
            }
        }
    }

    minimax(board, depth, isMax, color, result) {
        const opponent = color === 1 ? 2 : 1;
        if (depth >= this.h || board.isTerminal()) {
            return result;
        }
        if ((isMax && board.getMovableCell(color).length === 0) || (!isMax && board.getMovableCell(opponent).length === 0)) {
            return result;
        }

        let bestmove = [0, 0];
        if (isMax) {
            let bestscore = -100000;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (board.canClickSpot(row, col, color)) {
                        let score = this.scoring(board, row, col, color);
                        if (bestscore < score) {
                            bestscore = score;
                            bestmove = [row, col];
                        }
                    }
                }
            }
            let newBoard = new GameLogic(board.getBoard());
            newBoard.move(bestmove[0], bestmove[1], color);
            bestscore = bestscore + this.minimax(newBoard, depth + 1, false, opponent, bestscore);
            return result + bestscore;
        } else {
            let bestscore = 100000;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (board.canClickSpot(row, col, color)) {
                        let score = this.scoring(board, row, col, color);
                        if (bestscore > score) {
                            bestscore = score;
                            bestmove = [row, col];
                        }
                    }
                }
            }
            let newBoard = new GameLogic(board.getBoard());
            newBoard.move(bestmove[0], bestmove[1], color);
            bestscore = bestscore + this.minimax(newBoard, depth + 1, true, opponent, bestscore);
            return result - bestscore;
        }
    }

    scoring(board, x, y, color) {
        let stable = this.gameLogic.getStableDisc(color).length;
        let frontier = this.gameLogic.getFrontierDisc(color).length;
        let pos = this.scorePos[x][y];
        let flip = this.gameLogic.getAffectedDisks(x, y, color).length;
        let score = pos + (stable - frontier) * 4 + flip;
        return score;
    }
}

export { AI2 };
