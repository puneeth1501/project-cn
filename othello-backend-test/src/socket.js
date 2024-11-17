//very very io
// const { Server } = require('socket.io');
// const { GameController, RoomController } = require('./controllers/controllers');

// function setupSocket(httpServer) {
//     const io = new Server(httpServer, {
//         cors: {
//             origin: ['http://localhost:3000'],
//             methods: ["GET", "POST"],
//         },
//     });

//     const gameController = new GameController();
//     const roomController = new RoomController();

//     io.on('connection', async (socket) => {
//         console.log('+ New socket connected: ', socket.id);

//         // Handle room list
//         const clients = Array.from(await io.sockets.allSockets());
//         const rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
//         const availableRooms = rooms.filter(room => io.sockets.adapter.rooms.get(room).size === 1);
//         socket.emit('on_getting_room_list', {message: availableRooms});

//         // Set up event handlers
//         socket.on('start_game', () => gameController.startGame(io, socket));
//         socket.on('update_game', (message) => gameController.updateGame(socket, message));
//         socket.on('reset_game', () => gameController.resetGame(socket));
//         socket.on('join_game', (message) => roomController.joinGame(io, socket, message));

//         socket.on('disconnecting', () => {
//             console.log('- Socket disconnected: ', socket.id);
//             let socketRoom = Array.from(socket.rooms).filter((r) => r !== socket.id)[0];
//             if (socketRoom) {
//                 socket.to(socketRoom).emit('left_the_game', { 
//                     message: 'Your opponent cry and left the game. :('
//                 });
//             }
//         });
//     });

//     return io;
// }

// module.exports = setupSocket;



// // backend/src/socket.js
// const { Server } = require('socket.io');
// const { GameController, RoomController } = require('./controllers/controllers');

// function setupSocket(httpServer) {
//     const io = new Server(httpServer, {
//         cors: {
//             origin: ['http://localhost:3000'],
//             methods: ["GET", "POST"],
//         },
//     });

//     const gameController = new GameController();
//     const roomController = new RoomController();

//     // Helper function to broadcast room list
//     const broadcastRoomList = async () => {
//         const rooms = Array.from(io.sockets.adapter.rooms.keys())
//             .filter(room => !room.startsWith('/'))  // Filter out socket.io default rooms
//             .filter(room => {
//                 const roomData = io.sockets.adapter.rooms.get(room);
//                 return roomData; // Only include valid rooms
//             })
//             .map(room => ({
//                 name: room,
//                 playerCount: io.sockets.adapter.rooms.get(room).size || 0
//             }));

//         io.emit('on_getting_room_list', { message: rooms });
//     };

//     // Helper function to get room players count
//     const getRoomPlayersCount = (room) => {
//         const roomData = io.sockets.adapter.rooms.get(room);
//         if (!roomData) return 0;
        
//         // Count non-spectator sockets
//         let playerCount = 0;
//         roomData.forEach(socketId => {
//             const socket = io.sockets.sockets.get(socketId);
//             if (socket && !socket.data.isSpectator) {
//                 playerCount++;
//             }
//         });
//         return playerCount;
//     };

//     io.on('connection', async (socket) => {
//         console.log('+ New socket connected: ', socket.id);

//         // Initialize socket data
//         socket.data.isSpectator = false;

//         // Send initial room list
//         await broadcastRoomList();

//         // Handle room joining
//         socket.on('join_game', async (message) => {
//             try {
//                 const { roomId, createRoom, asSpectator } = message;
//                 const roomPlayersCount = getRoomPlayersCount(roomId);

//                 // Handle different join scenarios
//                 if (createRoom) {
//                     if (await roomController.isRoomExisted(io, message)) {
//                         socket.emit('room_join_error', {
//                             error: "Room name already exists, please try another name"
//                         });
//                         return;
//                     }
//                 } else {
//                     if (!await roomController.isRoomExisted(io, message)) {
//                         socket.emit('room_join_error', {
//                             error: "Room doesn't exist"
//                         });
//                         return;
//                     }

//                     if (!asSpectator && roomPlayersCount >= 2) {
//                         socket.emit('room_join_error', {
//                             error: "Room is full. You can join as a spectator"
//                         });
//                         return;
//                     }
//                 }

//                 // Set socket as spectator if joining as one
//                 socket.data.isSpectator = asSpectator;

//                 // Join the room
//                 await socket.join(roomId);
//                 socket.emit("room_joined");

//                 // Notify room about new player/spectator
//                 const joinMessage = asSpectator ? 
//                     "A spectator has joined the room" : 
//                     "A player has joined the room";
                
//                 io.to(roomId).emit('system_message', {
//                     content: joinMessage,
//                     timestamp: new Date().toISOString()
//                 });

//                 // If two players have joined, notify room is ready
//                 if (getRoomPlayersCount(roomId) === 2) {
//                     io.to(roomId).emit('ready_to_start');
//                 }

//                 // Update room list for all clients
//                 await broadcastRoomList();
//             } catch (error) {
//                 console.error('Error joining game:', error);
//                 socket.emit('room_join_error', {
//                     error: "Failed to join room"
//                 });
//             }
//         });

//         // Handle chat messages
//         socket.on('send_message', (data) => {
//             const room = data.roomName;
//             if (!room) return;

//             const messageData = {
//                 ...data.message,
//                 isSpectator: socket.data.isSpectator,
//                 timestamp: new Date().toISOString()
//             };

//             // Broadcast message to everyone in the room
//             io.to(room).emit('chat_message', messageData);
//         });

//         // Handle game events
//         socket.on('start_game', () => {
//             if (!socket.data.isSpectator) {
//                 gameController.startGame(io, socket);
//             }
//         });

//         socket.on('update_game', (message) => {
//             if (!socket.data.isSpectator) {
//                 gameController.updateGame(socket, message);
//             }
//         });

//         socket.on('reset_game', () => {
//             if (!socket.data.isSpectator) {
//                 gameController.resetGame(socket);
//             }
//         });

//         // Handle disconnection
//         socket.on('disconnecting', () => {
//             const rooms = Array.from(socket.rooms);
//             rooms.forEach(room => {
//                 if (room !== socket.id) {
//                     const message = socket.data.isSpectator ?
//                         'A spectator has left the room' :
//                         'A player has left the game';

//                     socket.to(room).emit('system_message', {
//                         content: message,
//                         timestamp: new Date().toISOString()
//                     });

//                     if (!socket.data.isSpectator) {
//                         socket.to(room).emit('left_the_game', { 
//                             message: 'Your opponent has left the game'
//                         });
//                     }
//                 }
//             });
//         });

//         socket.on('disconnect', async () => {
//             console.log('- Socket disconnected: ', socket.id);
//             // Update room list after disconnection
//             await broadcastRoomList();
//         });

//         // Error handling
//         socket.on('error', (error) => {
//             console.error('Socket error:', error);
//             socket.emit('error', {
//                 message: 'An error occurred'
//             });
//         });
//     });

//     return io;
// }

// module.exports = setupSocket;

// src/socket.js
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