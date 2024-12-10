

import { GameLogic } from "./gameLogic";

class AI2 {
    constructor(gameLogic) {
        this.gameLogic = new GameLogic(gameLogic.getBoard());
        this.positionWeights = [
            [100, -10, 10, 10, 10, 10, -10, 100],
            [-10, -20, -5, -5, -5, -5, -20, -10],
            [10, -5, 8, 4, 4, 8, -5, 10],
            [10, -5, 4, 2, 2, 4, -5, 10],
            [10, -5, 4, 2, 2, 4, -5, 10],
            [10, -5, 8, 4, 4, 8, -5, 10],
            [-10, -20, -5, -5, -5, -5, -20, -10],
            [100, -10, 10, 10, 10, 10, -10, 100],
        ];
    }

    ai2Called(color) {
        const movableCells = this.gameLogic.getMovableCell(color);
        if (movableCells.length === 0) return null; // No valid moves

        let bestMove = null;
        let bestScore = -Infinity;

        for (const [row, col] of movableCells) {
            const score = this.evaluateMove(row, col, color);

            // Determine the best move based on score and priorities
            if (score > bestScore) {
                bestScore = score;
                bestMove = { row, col };
            } else if (score === bestScore) {
                // Tie-breaking rules: prioritize corners and edges
                if (this.isCorner(row, col)) {
                    bestMove = { row, col };
                } else if (!bestMove || this.isEdge(row, col)) {
                    bestMove = { row, col };
                }
            }
        }

        return bestMove;
    }

    evaluateMove(row, col, color) {
        const opponent = color === 1 ? 2 : 1;

        // Get position weight
        const positionValue = this.positionWeights[row][col];

        // Count flipped discs
        const flippedDiscs = this.gameLogic.getAffectedDisks(row, col, color).length;

        // Evaluate opponent's mobility after this move
        const simulatedBoard = new GameLogic(this.gameLogic.getBoard());
        simulatedBoard.move(row, col, color);
        const opponentMoves = simulatedBoard.getMovableCell(opponent).length;

        // Calculate final score: Position value + Flipped discs - Opponent's mobility
        return positionValue + flippedDiscs * 10 - opponentMoves * 5;
    }

    isCorner(row, col) {
        return (row === 0 || row === 7) && (col === 0 || col === 7);
    }

    isEdge(row, col) {
        return row === 0 || row === 7 || col === 0 || col === 7;
    }
}

export { AI2 };
