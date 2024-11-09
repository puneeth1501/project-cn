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

    io.on('connection', async (socket) => {
        console.log('+ New socket connected: ', socket.id);

        // Handle room list
        const clients = Array.from(await io.sockets.allSockets());
        const rooms = Array.from(io.sockets.adapter.rooms.keys()).filter((r) => !clients.includes(r));
        const availableRooms = rooms.filter(room => io.sockets.adapter.rooms.get(room).size === 1);
        socket.emit('on_getting_room_list', {message: availableRooms});

        // Set up event handlers
        socket.on('start_game', () => gameController.startGame(io, socket));
        socket.on('update_game', (message) => gameController.updateGame(socket, message));
        socket.on('reset_game', () => gameController.resetGame(socket));
        socket.on('join_game', (message) => roomController.joinGame(io, socket, message));

        socket.on('disconnecting', () => {
            console.log('- Socket disconnected: ', socket.id);
            let socketRoom = Array.from(socket.rooms).filter((r) => r !== socket.id)[0];
            if (socketRoom) {
                socket.to(socketRoom).emit('left_the_game', { 
                    message: 'Your opponent cry and left the game. :('
                });
            }
        });
    });

    return io;
}

module.exports = setupSocket;