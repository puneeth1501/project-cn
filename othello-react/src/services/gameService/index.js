// class GameService {
//     // Uncomment if needed
//     // async getRoomList(socket) {
//     //     socket.emit('get_room_list');
//     // }

//     async onGettingRoomList(socket, listener) {
//         socket.on('on_getting_room_list', ({ message }) => listener(message));
//     }

//     async joinGameRoom(socket, roomId, createRoom) {
//         return new Promise((resolve, reject) => {
//             socket.emit('join_game', { roomId, createRoom });
//             socket.on('room_joined', () => resolve(true));
//             socket.on('room_join_error', ({ error }) => reject(error));
//         });
//     }

//     async onRoomJoined(socket, listener) {
//         socket.on('ready_to_start', listener);
//     }

//     async startGame(socket) {
//         socket.emit('start_game');
//     }

//     async onGameStart(socket, listener) {
//         socket.on('on_game_start', listener);
//     }

//     async updateGame(socket, gameMatrix) {
//         socket.emit('update_game', { matrix: gameMatrix });
//     }

//     async onGameUpdate(socket, listener) {
//         socket.on('on_game_update', ({ matrix }) => listener(matrix));
//     }

//     async resetGame(socket) {
//         socket.emit('reset_game');
//     }

//     async onGameReset(socket, listener) {
//         socket.on('on_game_reset', listener);
//     }

//     async onDisconnect(socket, listener) {
//         socket.on('left_the_game', ({ message }) => listener(message));
//     }
// }

// export default new GameService();



// // src/services/gameService/index.js
// class GameService {
//     async joinGameRoom(socket, roomId, createRoom, asSpectator = false) {
//         return new Promise((resolve, reject) => {
//             socket.emit('join_game', { roomId, createRoom, asSpectator });
            
//             const handleJoin = () => {
//                 socket.off('room_join_error');
//                 resolve(true);
//             };

//             const handleError = ({ error }) => {
//                 socket.off('room_joined');
//                 reject(error);
//             };

//             socket.once('room_joined', handleJoin);
//             socket.once('room_join_error', handleError);
//         });
//     }

//     async onRoomJoined(socket, listener) {
//         socket.on('ready_to_start', listener);
//     }

//     async startGame(socket) {
//         socket.emit('start_game');
//     }

//     async onGameStart(socket, listener) {
//         socket.on('on_game_start', listener);
//     }

//     async updateGame(socket, gameMatrix) {
//         socket.emit('update_game', { matrix: gameMatrix });
//     }

//     async onGameUpdate(socket, listener) {
//         socket.on('on_game_update', ({ matrix }) => listener(matrix));
//     }

//     async resetGame(socket) {
//         socket.emit('reset_game');
//     }

//     async onGameReset(socket, listener) {
//         socket.on('on_game_reset', listener);
//     }

//     async onGettingRoomList(socket, listener) {
//         socket.on('on_getting_room_list', ({ message }) => listener(message));
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

// export default new GameService();
//imp bottom.
