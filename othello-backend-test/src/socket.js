
// // src/socket.js
const { Server } = require('socket.io');
const { GameController, RoomController } = require('./controllers/controllers');

function setupSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000'],
            methods: ["GET", "POST"],
        },
    });

    const gameController = new GameController();
    const roomController = new RoomController();

    // Helper function to broadcast room list
    const broadcastRoomList = async () => {
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

        io.emit('on_getting_room_list', { message: rooms });
    };

    io.on('connection', async (socket) => {
        console.log('New socket connected:', socket.id);
        socket.data.isSpectator = false;

        // Send initial room list
        await broadcastRoomList();

        // Handle room joining
        socket.on('join_game', async (message) => {
            try {
                await roomController.joinGame(io, socket, message);
                await broadcastRoomList();
            } catch (error) {
                console.error('Join game error:', error);
            }
        });

        // Handle game start
        socket.on('start_game', () => {
            if (!socket.data.isSpectator) {
                gameController.startGame(io, socket);
            }
        });

        // Handle game updates
        socket.on('update_game', (message) => {
            if (!socket.data.isSpectator) {
                gameController.updateGame(socket, message);
            }
        });

        // Handle game reset
        socket.on('reset_game', () => {
            if (!socket.data.isSpectator) {
                gameController.resetGame(socket);
            }
        });

        // Handle disconnection
        socket.on('disconnecting', () => {
            const gameRoom = gameController.getSocketGameRoom(socket);
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
        });

        socket.on('disconnect', async () => {
            console.log('Socket disconnected:', socket.id);
            await broadcastRoomList();
        });

        socket.on('send_message', (data) => {
            const room = data.roomName;
            if (!room) return;
        
            // Add sender information and spectator status
            const messageData = {
                ...data.message,
                isSpectator: socket.data.isSpectator,
                timestamp: new Date().toISOString(),
                senderId: socket.id
            };
            
            // Broadcast to EVERYONE in the room (including sender)
            io.in(room).emit('chat_message', messageData);
        });
    });

    return io;
}

module.exports = setupSocket;
