
class GameController {
    getSocketGameRoom(socket) {
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
        return socketRooms && socketRooms[0];
    }

    startGame(io, socket) {
        const gameRoom = this.getSocketGameRoom(socket);
        if (!gameRoom) return;

        // Get all sockets in the room that are not spectators
        const players = Array.from(io.sockets.adapter.rooms.get(gameRoom))
            .filter(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                return !socket.data.isSpectator;
            });

        console.log(`Players in room ${gameRoom}:`, players.length);

        if (players.length === 2) {
            const rand = Math.floor(Math.random() * 2);
            const [player1Id, player2Id] = players;

            // Send game start to first player
            io.to(player1Id).emit('on_game_start', {
                start: rand === 0,
                color: rand === 0 ? 1 : 2
            });

            // Send game start to second player
            io.to(player2Id).emit('on_game_start', {
                start: rand === 1,
                color: rand === 1 ? 1 : 2
            });

            // Notify everyone in room that game has started
            io.to(gameRoom).emit('system_message', {
                content: 'Game has started!',
                timestamp: new Date().toISOString()
            });
        } else {
            socket.emit('game_error', {
                error: 'Need two players to start the game'
            });
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

    // Helper function to count actual players (non-spectators) in a room
    getPlayerCount(io, room) {
        return Array.from(room).filter(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            return socket && !socket.data.isSpectator;
        }).length;
    }

    async roomJoined(socket, message, io) {
        // Set spectator status before joining
        socket.data.isSpectator = message.asSpectator;
        
        // Join the room
        await socket.join(message.roomId);
        const room = io.sockets.adapter.rooms.get(message.roomId);
        
        // Count actual players (excluding spectators)
        const playerCount = this.getPlayerCount(io, room);
        console.log(`Room ${message.roomId} - Players: ${playerCount}, Total: ${room.size}`);

        // Emit room joined event
        socket.emit("room_joined");

        // Notify room about new player/spectator
        const joinMessage = message.asSpectator ? 
            "A spectator has joined the room" : 
            "A player has joined the room";
        
        io.to(message.roomId).emit('system_message', {
            content: joinMessage,
            timestamp: new Date().toISOString()
        });

        // If we have exactly 2 players, notify room is ready
        if (playerCount === 2) {
            console.log(`Room ${message.roomId} is ready to start`);
            io.to(message.roomId).emit('ready_to_start');
        }
    }

    async joinGame(io, socket, message) {
        const room = io.sockets.adapter.rooms.get(message.roomId);
        let playerCount = 0;
        
        if (room) {
            playerCount = this.getPlayerCount(io, room);
        }

        if (message.createRoom) {
            if (await this.isRoomExisted(io, message)) {
                socket.emit('room_join_error', {
                    error: "Room already exists"
                });
            } else {
                await this.roomJoined(socket, message, io);
            }
        } else {
            if (await this.isRoomExisted(io, message)) {
                if (message.asSpectator) {
                    await this.roomJoined(socket, message, io);
                } else if (playerCount >= 2) {
                    socket.emit('room_join_error', {
                        error: "Room is full. You can join as a spectator."
                    });
                } else {
                    await this.roomJoined(socket, message, io);
                }
            } else {
                socket.emit('room_join_error', {
                    error: "Room doesn't exist"
                });
            }
        }
    }

    async handleChatMessage(io, socket, message) {
        const gameRoom = this.getSocketGameRoom(socket);
        if (gameRoom) {
            io.to(gameRoom).emit('chat_message', {
                ...message,
                isSpectator: socket.data.isSpectator,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = {
    GameController,
    RoomController
};
