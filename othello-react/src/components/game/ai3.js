import { GameLogic } from "./gameLogic";

class AI3 {
    constructor(gameLogic) {
        this.gameLogic = new GameLogic(gameLogic.getBoard());
        this.positionWeights = [
            [120, -20, 20,  5,  5, 20, -20, 120],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [ 20,  -5, 15,  3,  3, 15,  -5,  20],
            [  5,  -5,  3,  3,  3,  3,  -5,   5],
            [  5,  -5,  3,  3,  3,  3,  -5,   5],
            [ 20,  -5, 15,  3,  3, 15,  -5,  20],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [120, -20, 20,  5,  5, 20, -20, 120]
        ];
    }

    ai3Called(color) {
        const movableCells = this.gameLogic.getMovableCell(color);
        if (movableCells.length === 0) return undefined;

        let bestScore = -Infinity;
        let bestMove = null;

        for (const [row, col] of movableCells) {
            const score = this.evaluateMove(row, col, color);
            if (score > bestScore) {
                bestScore = score;
                bestMove = { row, col };
            }
        }

        return bestMove;
    }

    evaluateMove(row, col, color) {
        // Get number of disks flipped by this move
        const flippedDisks = this.gameLogic.getAffectedDisks(row, col, color).length;
        
        // Get position value from weights matrix
        const positionValue = this.positionWeights[row][col];

        // Calculate base score from flipped disks
        let baseScore = flippedDisks * 10;  // Each flipped disk worth 10 points

        // Special cases for edge and corner moves
        if (this.isCorner(row, col)) {
            baseScore *= 3;  // Triple the score for corners
        } else if (this.isEdge(row, col)) {
            baseScore *= 1.5;  // 1.5x score for edges
        }

        // Add position value to modified base score
        return baseScore + positionValue;
    }

    isCorner(row, col) {
        return (row === 0 || row === 7) && (col === 0 || col === 7);
    }

    isEdge(row, col) {
        return row === 0 || row === 7 || col === 0 || col === 7;
    }
}

export { AI3 };