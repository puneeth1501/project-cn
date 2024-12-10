const { Server } = require('socket.io');
const { GameController, RoomController } = require('./controllers/controllers');

function setupSocket(httpServer) {
    console.log('Initializing socket server...');
    
    try {
        const io = new Server(httpServer, {
            cors: {
                origin: ['http://localhost:3000'],
                methods: ["GET", "POST"],
            },
        });

        console.log('Socket server created');
        
        const gameController = new GameController();
        const roomController = new RoomController();
        
        const updateRoomsList = async () => {
            try {
                console.log('Updating rooms list...');
                const rooms = Array.from(io.sockets.adapter.rooms.keys())
                    .filter(room => !room.startsWith('/'))
                    .map(room => {
                        const roomData = io.sockets.adapter.rooms.get(room);
                        const playerCount = Array.from(roomData || []).filter(socketId => {
                            const socket = io.sockets.sockets.get(socketId);
                            return socket && !socket.data.isSpectator;
                        }).length;
                        
                        return {
                            name: room,
                            playerCount
                        };
                    });
                console.log(`Found ${rooms.length} active rooms`);
                io.emit('on_getting_room_list', { message: rooms });
            } catch (error) {
                console.error('Error updating rooms list:', error);
            }
        };

        io.on('connection', async (socket) => {
            try {
                console.log('New socket connected:', socket.id);
                socket.data.isSpectator = false;
                
                await updateRoomsList();

                socket.on('join_game', async (message) => {
                    try {
                        console.log(`Join game request from ${socket.id}`);
                        await roomController.joinGame(io, socket, message);
                        await updateRoomsList();
                    } catch (error) {
                        console.error('Join game error:', error);
                        socket.emit('room_join_error', { error: 'Failed to join room' });
                    }
                });

                socket.on('start_game', () => {
                    try {
                        console.log(`Start game request from ${socket.id}`);
                        if (!socket.data.isSpectator) {
                            gameController.initializeGame(io, socket);
                        }
                    } catch (error) {
                        console.error('Start game error:', error);
                    }
                });

                socket.on('update_game', (message) => {
                    try {
                        console.log(`Update game request from ${socket.id}`);
                        if (!socket.data.isSpectator) {
                            gameController.refreshGameState(socket, message);
                        }
                    } catch (error) {
                        console.error('Update game error:', error);
                    }
                });

                socket.on('reset_game', () => {
                    try {
                        console.log(`Reset game request from ${socket.id}`);
                        if (!socket.data.isSpectator) {
                            gameController.restartGame(socket);
                        }
                    } catch (error) {
                        console.error('Reset game error:', error);
                    }
                });

                socket.on('disconnecting', () => {
                    try {
                        console.log('User disconnecting:', socket.id);
                        const gameRoom = gameController.tryGetGameRoom(socket);
                        if (gameRoom) {
                            const message = socket.data.isSpectator ? 
                                'Spectator left the room' : 
                                'Player left the game';
                            
                            socket.to(gameRoom).emit('system_message', {
                                content: message,
                                timestamp: new Date().toISOString()
                            });

                            if (!socket.data.isSpectator) {
                                socket.to(gameRoom).emit('left_the_game', {
                                    message: 'Your opponent left the game'
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error handling disconnection:', error);
                    }
                });

                socket.on('disconnect', async () => {
                    try {
                        console.log('Socket disconnected:', socket.id);
                        await updateRoomsList();
                    } catch (error) {
                        console.error('Error handling disconnect:', error);
                    }
                });

                socket.on('send_message', (data) => {
                    try {
                        console.log('New chat message received');
                        const room = data.roomName;
                        if (!room) {
                            console.log('No room specified for message');
                            return;
                        }
                        
                        const messageData = {
                            ...data.message,
                            isSpectator: socket.data.isSpectator,
                            timestamp: new Date().toISOString(),
                            senderId: socket.id
                        };
                        
                        io.in(room).emit('chat_message', messageData);
                        console.log('Chat message broadcasted to room:', room);
                    } catch (error) {
                        console.error('Error handling chat message:', error);
                    }
                });
            } catch (error) {
                console.error('Error in socket connection:', error);
            }
        });

        console.log('Socket setup complete');
        return io;
    } catch (error) {
        console.error('Fatal error setting up socket:', error);
        throw error;
    }
}

module.exports = setupSocket;
