class GameService {
    async joinGameRoom(socket, roomName, createRoom) {
        return new Promise((resolve, reject) => {
            socket.emit("join_game", { roomName, createRoom });
            socket.on("room_joined", () => resolve(true));
            socket.on("room_join_error", ({ error }) => reject(error));
        });
    }

    async updateGame(socket, board) {
        socket.emit("update_game", { board });
    }

    async startGame(socket) {
        socket.emit("start_game");
    }

    async resetGame(socket) {
        socket.emit("reset_game");
    }

    onRoomJoined(socket, listener) {
        socket.on("room_joined", listener);
    }

    onGameStart(socket, listener) {
        socket.on("game_start", listener);
    }

    onGameUpdate(socket, listener) {
        socket.on("on_game_update", listener);
    }

    onGameReset(socket, listener) {
        socket.on("game_reset", listener);
    }

    onDisconnect(socket, listener) {
        socket.on("disconnect", listener);
    }
}

export default new GameService();