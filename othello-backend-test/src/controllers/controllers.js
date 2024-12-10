class GameController {
    async refreshGameState(socket, message) {
        try {
            console.log('Refreshing game state...');
            const gameRoom = this.tryGetGameRoom(socket);
            if (gameRoom) {
                console.log(`Updating game in room: ${gameRoom}`);
                socket.to(gameRoom).emit('on_game_update', message);
                console.log('Game state refreshed successfully');
            }
        } catch (error) {
            console.error('Error refreshing game state:', error);
            throw new Error('Game state refresh failed');
        }
    }

    tryGetGameRoom(socket) {
        try {
            console.log('Finding game room for socket:', socket.id);
            const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
            const room = socketRooms && socketRooms[0];
            console.log(`Found room: ${room || 'No room found'}`);
            return room;
        } catch (error) {
            console.error('Error getting game room:', error);
            return null;
        }
    }

    async restartGame(socket) {
        try {
            console.log('Restarting game...');
            const gameRoom = this.tryGetGameRoom(socket);
            if (gameRoom) {
                console.log(`Resetting game in room: ${gameRoom}`);
                socket.to(gameRoom).emit('on_game_reset');
                console.log('Game restart signal sent');
            }
        } catch (error) {
            console.error('Error restarting game:', error);
            throw new Error('Game restart failed');
        }
    }

    initializeGame(io, socket) {
        try {
            console.log('Initializing new game...');
            const gameRoom = this.tryGetGameRoom(socket);
            if (!gameRoom) {
                console.log('No game room found');
                return;
            }

            const players = Array.from(io.sockets.adapter.rooms.get(gameRoom))
                .filter(socketId => {
                    const socket = io.sockets.sockets.get(socketId);
                    return !socket.data.isSpectator;
                });

            console.log(`Players in room ${gameRoom}:`, players.length);

            if (players.length === 2) {
                const rand = Math.floor(Math.random() * 2);
                const [player1Id, player2Id] = players;

                try {
                    console.log('Assigning player roles...');
                    io.to(player1Id).emit('on_game_start', {
                        start: rand === 0,
                        color: rand === 0 ? 1 : 2
                    });
                    io.to(player2Id).emit('on_game_start', {
                        start: rand === 1,
                        color: rand === 1 ? 1 : 2
                    });

                    io.to(gameRoom).emit('system_message', {
                        content: 'Game has started!',
                        timestamp: new Date().toISOString()
                    });
                    console.log('Game initialized successfully');
                } catch (error) {
                    console.error('Error sending game start messages:', error);
                    throw error;
                }
            } else {
                console.log('Not enough players');
                socket.emit('game_error', {
                    error: 'Need two players to start the game'
                });
            }
        } catch (error) {
            console.error('Error initializing game:', error);
            throw new Error('Game initialization failed');
        }
    }
}

class RoomController {
    async handleChatMessage(io, socket, message) {
        try {
            console.log('Processing chat message...');
            const gameRoom = this.tryGetGameRoom(socket);
            if (gameRoom) {
                console.log(`Broadcasting message to room: ${gameRoom}`);
                io.to(gameRoom).emit('chat_message', {
                    ...message,
                    isSpectator: socket.data.isSpectator,
                    timestamp: new Date().toISOString()
                });
                console.log('Message sent successfully');
            }
        } catch (error) {
            console.error('Error handling chat message:', error);
            throw new Error('Chat message handling failed');
        }
    }

    countActivePlayers(io, room) {
        try {
            console.log('Counting active players...');
            const count = Array.from(room).filter(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                return socket && !socket.data.isSpectator;
            }).length;
            console.log(`Active players count: ${count}`);
            return count;
        } catch (error) {
            console.error('Error counting players:', error);
            return 0;
        }
    }

    async checkRoomExists(io, message) {
        try {
            console.log(`Checking if room exists: ${message.roomId}`);
            var clients = Array.from(await io.sockets.allSockets());
            var rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
            const exists = rooms.includes(message.roomId);
            console.log(`Room ${message.roomId} ${exists ? 'exists' : 'does not exist'}`);
            return exists;
        } catch (error) {
            console.error('Error checking room:', error);
            return false;
        }
    }

    async joinGame(io, socket, message) {
        try {
            console.log('Processing join game request...');
            const room = io.sockets.adapter.rooms.get(message.roomId);
            let playerCount = 0;
            
            if (room) {
                playerCount = this.countActivePlayers(io, room);
                console.log(`Current player count: ${playerCount}`);
            }

            if (message.createRoom) {
                if (await this.checkRoomExists(io, message)) {
                    console.log('Room already exists');
                    socket.emit('room_join_error', {
                        error: "Room already exists"
                    });
                } else {
                    console.log('Creating new room');
                    await this.roomJoined(socket, message, io);
                }
            } else {
                if (await this.checkRoomExists(io, message)) {
                    if (message.asSpectator) {
                        console.log('Joining as spectator');
                        await this.roomJoined(socket, message, io);
                    } else if (playerCount >= 2) {
                        console.log('Room is full');
                        socket.emit('room_join_error', {
                            error: "Room is full. You can join as a spectator."
                        });
                    } else {
                        console.log('Joining existing room');
                        await this.roomJoined(socket, message, io);
                    }
                } else {
                    console.log('Room does not exist');
                    socket.emit('room_join_error', {
                        error: "Room doesn't exist"
                    });
                }
            }
        } catch (error) {
            console.error('Error in join game:', error);
            socket.emit('room_join_error', {
                error: "Failed to join game"
            });
        }
    }

    async roomJoined(socket, message, io) {
        try {
            console.log('Processing room join...');
            socket.data.isSpectator = message.asSpectator;
            
            await socket.join(message.roomId);
            const room = io.sockets.adapter.rooms.get(message.roomId);
            
            const playerCount = this.countActivePlayers(io, room);
            console.log(`Room ${message.roomId} - Players: ${playerCount}, Total: ${room.size}`);

            socket.emit("room_joined");

            const joinMessage = message.asSpectator ? 
                "A spectator has joined the room" : 
                "A player has joined the room";
            
            io.to(message.roomId).emit('system_message', {
                content: joinMessage,
                timestamp: new Date().toISOString()
            });

            if (playerCount === 2) {
                console.log(`Room ${message.roomId} is ready to start`);
                io.to(message.roomId).emit('ready_to_start');
            }
        } catch (error) {
            console.error('Error in room joined:', error);
            throw new Error('Failed to process room join');
        }
    }
}

module.exports = {
    GameController,
    RoomController
};
