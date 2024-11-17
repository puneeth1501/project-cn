
//very very impo...
// const { Server } = require('socket.io');

// class GameController {
//     getSocketGameRoom(socket) {
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
//         return socketRooms && socketRooms[0];
//     }

//     startGame(io, socket) {
//         const gameRoom = this.getSocketGameRoom(socket);
        
//         if(io.sockets.adapter.rooms.get(gameRoom).size === 2) { 
//             let rand = Math.floor(Math.random() * 2);
//             if(rand === 0) { 
//                 socket.emit('on_game_start', { start: true, color: 1 }); 
//                 socket.to(gameRoom).emit('on_game_start', { start: false, color: 2}); 
//             } else {
//                 socket.emit('on_game_start', { start: false, color: 2 });
//                 socket.to(gameRoom).emit('on_game_start', { start: true, color: 1});
//             }
//         }
//     }

//     async updateGame(socket, message) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         socket.to(gameRoom).emit('on_game_update', message);
//     }

//     async resetGame(socket) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         socket.to(gameRoom).emit('on_game_reset');
//     }
// }

// class RoomController {
//     getSocketGameRoom(socket) {
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
//         return socketRooms && socketRooms[0];
//     }

//     async isRoomExisted(io, message) {
//         var clients = Array.from(await io.sockets.allSockets());
//         var rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
//         return rooms.includes(message.roomId);
//     }

//     async roomJoined(socket, message, connectedSockets) {
//         await socket.join(message.roomId);
//         socket.emit("room_joined");

//         if (connectedSockets.size === 2) {
//             const gameRoom = this.getSocketGameRoom(socket);
//             socket.emit('ready_to_start');
//             socket.to(gameRoom).emit('ready_to_start');
//         }
//     }

//     async joinGame(io, socket, message) {
//         const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);                    

//         if (message.createRoom) {
//             if (await this.isRoomExisted(io, message)) {
//                 socket.emit('room_join_error', {
//                     error: "Room name already exists, please try other name :("
//                 });
//             } else {
//                 this.roomJoined(socket, message, connectedSockets);
//             }
//         } else {
//             if (await this.isRoomExisted(io, message)) {
//                 if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2) {
//                     socket.emit('room_join_error', {
//                         error: "Room is already full :("
//                     });
//                 } else {
//                     this.roomJoined(socket, message, connectedSockets);
//                 }
//             } else {
//                 socket.emit('room_join_error', {
//                     error: "Room doesn't exists :("
//                 });
//             }
//         }
//     }
// }

// module.exports = {
//     GameController,
//     RoomController
// };


// // src/controllers/controllers.js
// class GameController {
//     getSocketGameRoom(socket) {
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
//         return socketRooms && socketRooms[0];
//     }

//     startGame(io, socket) {
//         const gameRoom = this.getSocketGameRoom(socket);
        
//         if(io.sockets.adapter.rooms.get(gameRoom).size === 2) { 
//             let rand = Math.floor(Math.random() * 2);
//             if(rand === 0) { 
//                 socket.emit('on_game_start', { start: true, color: 1 }); 
//                 socket.to(gameRoom).emit('on_game_start', { start: false, color: 2}); 
//             } else {
//                 socket.emit('on_game_start', { start: false, color: 2 });
//                 socket.to(gameRoom).emit('on_game_start', { start: true, color: 1});
//             }
//         }
//     }

//     async updateGame(socket, message) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         socket.to(gameRoom).emit('on_game_update', message);
//     }

//     async resetGame(socket) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         socket.to(gameRoom).emit('on_game_reset');
//     }
// }

// class RoomController {
//     getSocketGameRoom(socket) {
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
//         return socketRooms && socketRooms[0];
//     }

//     async isRoomExisted(io, message) {
//         var clients = Array.from(await io.sockets.allSockets());
//         var rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
//         return rooms.includes(message.roomId);
//     }

//     async getRoomInfo(io, roomId) {
//         const room = io.sockets.adapter.rooms.get(roomId);
//         if (!room) return null;

//         return {
//             id: roomId,
//             players: room.size,
//             spectators: Array.from(room).filter(socketId => {
//                 const socket = io.sockets.sockets.get(socketId);
//                 return socket.data.isSpectator;
//             }).length
//         };
//     }

//     async roomJoined(socket, message, io) {
//         const room = io.sockets.adapter.rooms.get(message.roomId);
        
//         // Mark socket as spectator if joining as one
//         socket.data.isSpectator = message.asSpectator;
        
//         await socket.join(message.roomId);
//         socket.emit("room_joined");

//         // Emit room info to all clients
//         const roomInfo = await this.getRoomInfo(io, message.roomId);
//         io.to(message.roomId).emit('room_info_update', roomInfo);

//         // Handle spectator joining
//         if (message.asSpectator) {
//             io.to(message.roomId).emit('system_message', {
//                 content: 'A spectator has joined the room'
//             });
//             return;
//         }

//         // Handle player joining
//         if (room && room.size === 2) {
//             socket.emit('ready_to_start');
//             socket.to(message.roomId).emit('ready_to_start');
//         }
//     }

//     async joinGame(io, socket, message) {
//         const room = io.sockets.adapter.rooms.get(message.roomId);
//         const playerCount = room ? room.size : 0;
//         const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);

//         if (message.createRoom) {
//             if (await this.isRoomExisted(io, message)) {
//                 socket.emit('room_join_error', {
//                     error: "Room name already exists, please try other name :("
//                 });
//             } else {
//                 await this.roomJoined(socket, message, io);
//             }
//         } else {
//             if (await this.isRoomExisted(io, message)) {
//                 if (message.asSpectator) {
//                     // Allow spectators to join if room exists
//                     await this.roomJoined(socket, message, io);
//                 } else if (socketRooms.length > 0 || playerCount >= 2) {
//                     socket.emit('room_join_error', {
//                         error: "Room is full. You can join as a spectator."
//                     });
//                 } else {
//                     await this.roomJoined(socket, message, io);
//                 }
//             } else {
//                 socket.emit('room_join_error', {
//                     error: "Room doesn't exist :("
//                 });
//             }
//         }
//     }

//     async handleChatMessage(io, socket, messageData) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         if (!gameRoom) return;

//         const message = {
//             ...messageData.message,
//             isSpectator: socket.data.isSpectator,
//             timestamp: new Date().toISOString()
//         };

//         // Broadcast message to all in room
//         io.to(gameRoom).emit('chat_message', message);

//         // If it's a system message, also emit it as system_message
//         if (message.isSystem) {
//             io.to(gameRoom).emit('system_message', message);
//         }
//     }

//     async handleDisconnect(io, socket) {
//         const gameRoom = this.getSocketGameRoom(socket);
//         if (!gameRoom) return;

//         const message = socket.data.isSpectator
//             ? 'A spectator has left the room'
//             : 'A player has left the game';

//         // Emit appropriate messages
//         io.to(gameRoom).emit('system_message', { content: message });
        
//         if (!socket.data.isSpectator) {
//             io.to(gameRoom).emit('left_the_game', { message });
//         }

//         // Update room info after disconnect
//         const roomInfo = await this.getRoomInfo(io, gameRoom);
//         if (roomInfo) {
//             io.to(gameRoom).emit('room_info_update', roomInfo);
//         }
//     }

//     async getRoomList(io) {
//         const clients = Array.from(await io.sockets.allSockets());
//         const rooms = Array.from(io.sockets.adapter.rooms.keys())
//             .filter(r => !clients.includes(r))
//             .map(async roomId => {
//                 const roomInfo = await this.getRoomInfo(io, roomId);
//                 return {
//                     id: roomId,
//                     name: roomId,
//                     players: roomInfo.players,
//                     spectators: roomInfo.spectators,
//                     isFull: roomInfo.players >= 2
//                 };
//             });

//         return Promise.all(rooms);
//     }
// }

// module.exports = {
//     GameController,
//     RoomController
// };

/// src/controllers/controllers.js
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