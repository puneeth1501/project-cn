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

