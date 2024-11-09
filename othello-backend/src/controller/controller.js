const { Server } = require('socket.io');

class GameController {
    getSocketGameRoom(socket) {
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
        return socketRooms && socketRooms[0];
    }

    startGame(io, socket) {
        const gameRoom = this.getSocketGameRoom(socket);
        
        if(io.sockets.adapter.rooms.get(gameRoom).size === 2) { 
            let rand = Math.floor(Math.random() * 2);
            if(rand === 0) { 
                socket.emit('on_game_start', { start: true, color: 1 }); 
                socket.to(gameRoom).emit('on_game_start', { start: false, color: 2}); 
            } else {
                socket.emit('on_game_start', { start: false, color: 2 });
                socket.to(gameRoom).emit('on_game_start', { start: true, color: 1});
            }
        }
    }

    async updateGame(socket, message) {
        const gameRoom = this.getSocketGameRoom(socket);
        socket.to(gameRoom).emit('on_game_update', message);
    }

    async resetGame(socket) {
        const gameRoom = this.getSocketGameRoom(socket);
        socket.to(gameRoom).emit('on_game_reset');
    }
}

class RoomController {
    getSocketGameRoom(socket) {
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
        return socketRooms && socketRooms[0];
    }

    async isRoomExisted(io, message) {
        var clients = Array.from(await io.sockets.allSockets());
        var rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
        return rooms.includes(message.roomId);
    }

    async roomJoined(socket, message, connectedSockets) {
        await socket.join(message.roomId);
        socket.emit("room_joined");

        if (connectedSockets.size === 2) {
            const gameRoom = this.getSocketGameRoom(socket);
            socket.emit('ready_to_start');
            socket.to(gameRoom).emit('ready_to_start');
        }
    }

    async joinGame(io, socket, message) {
        const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);                    

        if (message.createRoom) {
            if (await this.isRoomExisted(io, message)) {
                socket.emit('room_join_error', {
                    error: "Room name already exists, please try other name :("
                });
            } else {
                this.roomJoined(socket, message, connectedSockets);
            }
        } else {
            if (await this.isRoomExisted(io, message)) {
                if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2) {
                    socket.emit('room_join_error', {
                        error: "Room is already full :("
                    });
                } else {
                    this.roomJoined(socket, message, connectedSockets);
                }
            } else {
                socket.emit('room_join_error', {
                    error: "Room doesn't exists :("
                });
            }
        }
    }
}

module.exports = {
    GameController,
    RoomController
};