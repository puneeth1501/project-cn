//vert imp
// import { io } from 'socket.io-client';

// class SocketService {
//     constructor() {
//         this.socket = null;
//     }

//     connect(url) {
//         return new Promise((resolve, reject) => {
//             this.socket = io(url);

//             if (!this.socket) return reject();

//             this.socket.on('connect', () => {
//                 resolve(this.socket);
//             });

//             this.socket.on('connect_error', (err) => {
//                 console.log('Connection error: ', err);
//                 reject(err);
//             });
//         });
//     }
// }

// export default new SocketService();


// src/services/socketService/index.js
// import { io } from 'socket.io-client';

// class SocketService {
//     constructor() {
//         this.socket = null;
//     }

//     connect(url) {
//         return new Promise((resolve, reject) => {
//             this.socket = io(url, {
//                 transports: ['websocket'],
//                 reconnection: true,
//                 reconnectionAttempts: 5,
//                 reconnectionDelay: 1000
//             });

//             if (!this.socket) return reject();

//             this.socket.on('connect', () => {
//                 console.log('Socket connected successfully');
//                 resolve(this.socket);
//             });

//             this.socket.on('connect_error', (err) => {
//                 console.error('Socket connection error:', err);
//                 reject(err);
//             });

//             this.socket.on('disconnect', (reason) => {
//                 console.log('Socket disconnected:', reason);
//             });
//         });
//     }

//     disconnect() {
//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//         }
//     }
// }

// export default new SocketService();
//important..


import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(url) {
        return new Promise((resolve, reject) => {
            this.socket = io(url, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            if (!this.socket) return reject();

            this.socket.on('connect', () => {
                console.log('Socket connected successfully');
                resolve(this.socket);
            });

            this.socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                reject(err);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

class GameService {
    async joinGameRoom(socket, roomId, createRoom, asSpectator = false) {
        return new Promise((resolve, reject) => {
            socket.emit('join_game', { roomId, createRoom, asSpectator });
            
            const handleJoin = () => {
                socket.off('room_join_error');
                resolve(true);
            };

            const handleError = ({ error }) => {
                socket.off('room_joined');
                reject(error);
            };

            socket.once('room_joined', handleJoin);
            socket.once('room_join_error', handleError);
        });
    }

    async onRoomJoined(socket, listener) {
        socket.on('ready_to_start', listener);
    }

    async startGame(socket) {
        socket.emit('start_game');
    }

    async onGameStart(socket, listener) {
        socket.on('on_game_start', listener);
    }

    async updateGame(socket, gameMatrix) {
        socket.emit('update_game', { matrix: gameMatrix });
    }

    async onGameUpdate(socket, listener) {
        socket.on('on_game_update', ({ matrix }) => listener(matrix));
    }

    async resetGame(socket) {
        socket.emit('reset_game');
    }

    async onGameReset(socket, listener) {
        socket.on('on_game_reset', listener);
    }

    async onGettingRoomList(socket, listener) {
        socket.on('on_getting_room_list', ({ message }) => listener(message));
    }

    async onDisconnect(socket, listener) {
        socket.on('left_the_game', ({ message }) => listener(message));
    }

    async onChatMessage(socket, listener) {
        socket.on('chat_message', listener);
    }

    async onSystemMessage(socket, listener) {
        socket.on('system_message', listener);
    }
}

const socketService = new SocketService();
const gameService = new GameService();

export { socketService, gameService };

// import { io } from 'socket.io-client';

// class SocketService {
//     constructor() {
//         this.socket = null;
//     }

//     connect(url) {
//         return new Promise((resolve, reject) => {
//             this.socket = io(url, {
//                 transports: ['polling', 'websocket'], // Try polling first, then websocket
//                 reconnection: true,
//                 reconnectionAttempts: 5,
//                 reconnectionDelay: 1000,
//                 timeout: 10000,
//                 auth: {
//                     // Add any authentication if needed
//                 },
//                 extraHeaders: {
//                     "Access-Control-Allow-Origin": "*"
//                 }
//             });

//             if (!this.socket) return reject(new Error('Socket initialization failed'));

//             this.socket.on('connect', () => {
//                 console.log('Socket connected successfully to:', url);
//                 resolve(this.socket);
//             });

//             this.socket.on('connect_error', (err) => {
//                 console.error('Socket connection error:', err);
//                 reject(err);
//             });

//             this.socket.on('disconnect', (reason) => {
//                 console.log('Socket disconnected:', reason);
//                 // Attempt to reconnect if disconnected unexpectedly
//                 if (reason === 'io server disconnect') {
//                     this.socket.connect();
//                 }
//             });

//             // Add error handler
//             this.socket.on('error', (error) => {
//                 console.error('Socket error:', error);
//             });

//             // Add reconnecting handler
//             this.socket.on('reconnecting', (attemptNumber) => {
//                 console.log('Attempting to reconnect:', attemptNumber);
//             });

//             // Add reconnect handler
//             this.socket.on('reconnect', (attemptNumber) => {
//                 console.log('Successfully reconnected after', attemptNumber, 'attempts');
//             });
//         });
//     }

//     disconnect() {
//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//         }
//     }
// }

// class GameService {
//     async joinGameRoom(socket, roomId, createRoom, asSpectator = false) {
//         return new Promise((resolve, reject) => {
//             if (!socket.connected) {
//                 reject(new Error('Socket not connected'));
//                 return;
//             }

//             socket.emit('join_game', { roomId, createRoom, asSpectator });
            
//             const handleJoin = () => {
//                 socket.off('room_join_error');
//                 console.log('Successfully joined room:', roomId);
//                 resolve(true);
//             };

//             const handleError = ({ error }) => {
//                 socket.off('room_joined');
//                 console.error('Error joining room:', error);
//                 reject(error);
//             };

//             // Add timeouts to prevent hanging
//             const timeout = setTimeout(() => {
//                 socket.off('room_joined');
//                 socket.off('room_join_error');
//                 reject(new Error('Join room timeout'));
//             }, 5000);

//             socket.once('room_joined', () => {
//                 clearTimeout(timeout);
//                 handleJoin();
//             });

//             socket.once('room_join_error', (error) => {
//                 clearTimeout(timeout);
//                 handleError(error);
//             });
//         });
//     }

//     async onRoomJoined(socket, listener) {
//         socket.on('ready_to_start', listener);
//     }

//     async startGame(socket) {
//         if (socket.connected) {
//             socket.emit('start_game');
//         }
//     }

//     async onGameStart(socket, listener) {
//         socket.on('on_game_start', listener);
//     }

//     async updateGame(socket, gameMatrix) {
//         if (socket.connected) {
//             socket.emit('update_game', { matrix: gameMatrix });
//         }
//     }

//     async onGameUpdate(socket, listener) {
//         socket.on('on_game_update', ({ matrix }) => listener(matrix));
//     }

//     async resetGame(socket) {
//         if (socket.connected) {
//             socket.emit('reset_game');
//         }
//     }

//     async onGameReset(socket, listener) {
//         socket.on('on_game_reset', listener);
//     }

//     async onGettingRoomList(socket, listener) {
//         socket.on('on_getting_room_list', ({ message }) => {
//             console.log('Received room list:', message);
//             listener(message);
//         });
//     }

//     async onDisconnect(socket, listener) {
//         socket.on('left_the_game', ({ message }) => listener(message));
//     }

//     async onChatMessage(socket, listener) {
//         socket.on('chat_message', listener);
//     }

//     async onSystemMessage(socket, listener) {
//         socket.on('system_message', listener);
//     }
// }

// const socketService = new SocketService();
// const gameService = new GameService();

// export { socketService, gameService };