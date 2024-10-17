import io from 'socket.io-client';

class SocketService {
  socket = null;

  connect(url) {
    return new Promise((resolve, reject) => {
      console.log('Attempting to connect to server:', url);
      this.socket = io(url);

      this.socket.on('connect', () => {
        console.log('Successfully connected to server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      // Log all incoming events
      this.socket.onAny((eventName, ...args) => {
        console.log(`Received event: ${eventName}`, args);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting from server');
      this.socket.disconnect();
    }
  }

  createGame(roomId) {
    if (this.socket) {
      console.log('Emitting create_game event for room:', roomId);
      this.socket.emit('create_game', { roomId });
    } else {
      console.error('Socket not connected. Unable to create game.');
    }
  }

  joinGame(roomId) {
    if (this.socket) {
      console.log('Emitting join_game event for room:', roomId);
      this.socket.emit('join_game', { roomId });
    } else {
      console.error('Socket not connected. Unable to join game.');
    }
  }

  getRoomList() {
    if (this.socket) {
      console.log('Requesting room list');
      this.socket.emit('get_room_list');
    } else {
      console.error('Socket not connected. Unable to get room list.');
    }
  }

  onRoomCreated(callback) {
    if (this.socket) {
      this.socket.on('room_created', (data) => {
        console.log('Room created:', data);
        callback(data);
      });
    }
  }

  onRoomJoined(callback) {
    if (this.socket) {
      this.socket.on('room_joined', (data) => {
        console.log('Room joined:', data);
        callback(data);
      });
    }
  }

  onRoomJoinError(callback) {
    if (this.socket) {
      this.socket.on('room_join_error', (error) => {
        console.error('Room join error:', error);
        callback(error);
      });
    }
  }

  onRoomListUpdate(callback) {
    if (this.socket) {
      this.socket.on('room_list_update', (roomList) => {
        console.log('Room list updated:', roomList);
        callback(roomList);
      });
    }
  }

  onReadyToStart(callback) {
    if (this.socket) {
      this.socket.on('ready_to_start', (data) => {
        console.log('Ready to start game:', data);
        callback(data);
      });
    }
  }

  startGame() {
    if (this.socket) {
      console.log('Emitting start_game event');
      this.socket.emit('start_game');
    } else {
      console.error('Socket not connected. Unable to start game.');
    }
  }

  onGameStart(callback) {
    if (this.socket) {
      this.socket.on('on_game_start', (data) => {
        console.log('Game started:', data);
        callback(data);
      });
    }
  }

  updateGame(board) {
    if (this.socket) {
      console.log('Emitting update_game event', board);
      this.socket.emit('update_game', { board });
    } else {
      console.error('Socket not connected. Unable to update game.');
    }
  }

  onGameUpdate(callback) {
    if (this.socket) {
      this.socket.on('on_game_update', (data) => {
        console.log('Game updated:', data);
        callback(data);
      });
    }
  }

  onOpponentLeft(callback) {
    if (this.socket) {
      this.socket.on('left_the_game', (data) => {
        console.log('Opponent left the game:', data);
        callback(data);
      });
    }
  }

  restartGame() {
    if (this.socket) {
      console.log('Emitting restart_game event');
      this.socket.emit('restart_game');
    } else {
      console.error('Socket not connected. Unable to restart game.');
    }
  }

  onGameRestart(callback) {
    if (this.socket) {
      this.socket.on('on_game_restart', (data) => {
        console.log('Game restarted:', data);
        callback(data);
      });
    }
  }
  joinAsSpectator(roomId) {
    if (this.socket) {
      console.log('Joining as spectator for room:', roomId);
      this.socket.emit('join_as_spectator', { roomId });
    } else {
      console.error('Socket not connected. Unable to join as spectator.');
    }
  }

  onSpectatorJoined(callback) {
    if (this.socket) {
      this.socket.on('spectator_joined', callback);
    }
  }

  off(eventName) {
    if (this.socket) {
      console.log(`Removing listener for event: ${eventName}`);
      this.socket.off(eventName);
    }
  }
}

export default new SocketService();