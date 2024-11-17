import { GameLogic } from "./gameLogic";
import { Minimax } from "./AI1_src/minmax";

class AI1 {
    constructor(gameLogic) {
        this.currstate = new GameLogic(gameLogic.getBoard());
    }

    ai1Called(color) {
        const cornerplay = this.playOncorner(color);
        if (cornerplay) {
            const row = cornerplay[0];
            const col = cornerplay[1];
            return { row, col };
        }

        const blockplay = this.blocking(color);
        if (blockplay) {
            const row = blockplay[0];
            const col = blockplay[1];
            return { row, col };
        }

        const nextplay = Minimax.solve(this.currstate, color, 6);
        if (nextplay) {
            const row = nextplay[0];
            const col = nextplay[1];
            return { row, col };
        }
    }

    playOncorner(color) {
        const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
        const movable = this.currstate.getMovableCell(color);
        let bestmove = null;
        let bestscore = Number.MIN_SAFE_INTEGER;
        for (let move of movable) {
            for (let corner of corners) {
                if (move[0] === corner[0] && move[1] === corner[1]) {
                    let newstate = new GameLogic(this.currstate.getBoard());
                    newstate.move(move[0], move[1], color);
                    let mscore = Minimax.hueristic(newstate, color);
                    if (mscore > bestscore) {
                        bestscore = mscore;
                        bestmove = move;
                    }
                }
            }
        }
        return bestmove;
    }

    blocking(color) {
        const movable = this.currstate.getMovableCell(color);
        const opponent = color === 1 ? 2 : 1;
        let bestmove = null;
        let bestscore = Number.MIN_SAFE_INTEGER;
        for (let move of movable) {
            let newstate = new GameLogic(this.currstate.getBoard());
            newstate.move(move[0], move[1], color);
            if (newstate.getMovableCell(opponent).length === 0) {
                let mscore = Minimax.hueristic(newstate, color);
                if (mscore > bestscore) {
                    bestscore = mscore;
                    bestmove = move;
                }
            }
        }
        return bestmove;
    }
}

export { AI1 };
