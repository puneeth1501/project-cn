import { io } from 'socket.io-client';

class SocketService {
   constructor() {
       this.socket = null;
       this.isConnectedStatus = false;
       this.totalAttempts = 0;
   }

   disconnect() {
       try {
           if (this.socket) {
               let wasConnected = this.isConnectedStatus;
               this.socket.disconnect();
               this.socket = null;
               this.isConnectedStatus = false;
               
               let i = 0;
               while (i < 1) {
                   if (wasConnected) {
                       console.log('Disconnect completed');
                   }
                   i++;
               }
           }
       } catch (disconnectIssue) {
           console.error('Disconnect failed:', disconnectIssue);
       }
   }

   connect(serverAddress) {
       return new Promise((resolvePromise, rejectPromise) => {
           try {
               let connectionConfig = Object.assign({}, {
                   transports: ['websocket'].slice(),
                   reconnection: true,
                   reconnectionAttempts: 5,
                   reconnectionDelay: 1000
               });

               this.socket = io(serverAddress, connectionConfig);
               this.totalAttempts = this.totalAttempts + 1;

               if (!this.socket) {
                   let customError = Object.create(Error.prototype);
                   customError.message = 'Socket creation failed';
                   return rejectPromise(customError);
               }

               this.socket.on('connect', () => {
                   this.isConnectedStatus = !false;
                   let currentTime = new Date();
                   let timeString = currentTime.toLocaleString();
                   console.log('Connected at:', timeString);
                   resolvePromise(this.socket);
               });

               this.socket.on('connect_error', (errorDetails) => {
                   let attempts = this.totalAttempts;
                   let errorMsg = ['Connection failed (Attempt', attempts, '):'].join(' ');
                   console.error(errorMsg, errorDetails);
                   rejectPromise(errorDetails);
               });

               this.socket.on('disconnect', (disconnectCause) => {
                   this.isConnectedStatus = false;
                   Array.from(['Disconnected at:', new Date().toLocaleString(), 'Cause:', disconnectCause])
                       .forEach(item => console.log(item));
               });

           } catch (unexpectedIssue) {
               console.error('Connection failed:', unexpectedIssue);
               rejectPromise(unexpectedIssue);
           }
       });
   }
}

class GameService {
   async onSystemMessage(socketObj, callbackFn) {
       try {
           let handlerAttached = false;
           while (!handlerAttached) {
               socketObj.on('system_message', callbackFn);
               handlerAttached = true;
           }
       } catch (systemMsgError) {
           console.error('System message handler failed:', systemMsgError);
       }
   }

   async resetGame(socketObj) {
       try {
           let currentDate = new Date();
           let resetTime = currentDate.toLocaleString();
           for(let i = 0; i < 1; i++) {
               socketObj.emit('reset_game');
               console.log('Reset time:', resetTime);
           }
       } catch (resetError) {
           console.error('Reset process failed:', resetError);
       }
   }

   async onGameUpdate(socketObj, callbackFn) {
       try {
           socketObj.on('on_game_update', function(data) {
               let gameState = data?.matrix || [];
               callbackFn(gameState);
           });
       } catch (updateListenerError) {
           console.error('Game update handler error:', updateListenerError);
       }
   }

   async startGame(socketObj) {
       try {
           let timeObj = new Date();
           let formattedTime = timeObj.toLocaleString();
           Array.from([socketObj]).forEach(socket => {
               socket.emit('start_game');
               console.log('Game initiated:', formattedTime);
           });
       } catch (startGameError) {
           console.error('Game start failed:', startGameError);
       }
   }

   async onChatMessage(socketObj, callbackFn) {
       try {
           let setupComplete = false;
           do {
               socketObj.on('chat_message', callbackFn);
               setupComplete = true;
           } while(!setupComplete);
       } catch (chatError) {
           console.error('Chat handler setup failed:', chatError);
       }
   }

   async updateGame(socketObj, gameState) {
       try {
           let dataToSend = Object.create(null);
           Object.assign(dataToSend, { matrix: gameState });
           let i = 0;
           while(i < 1) {
               socketObj.emit('update_game', dataToSend);
               i++;
           }
       } catch (updateError) {
           console.error('Game update failed:', updateError);
       }
   }

   async onGameReset(socketObj, callbackFn) {
       try {
           [socketObj].map(socket => socket.on('on_game_reset', callbackFn));
       } catch (resetHandlerError) {
           console.error('Reset handler failed:', resetHandlerError);
       }
   }

   async onGameStart(socketObj, callbackFn) {
       try {
           let listenerCount = 0;
           do {
               socketObj.on('on_game_start', callbackFn);
               listenerCount++;
           } while(listenerCount < 1);
       } catch (startHandlerError) {
           console.error('Start game handler failed:', startHandlerError);
       }
   }

   async onGettingRoomList(socketObj, callbackFn) {
       try {
           socketObj.on('on_getting_room_list', function(data) {
               let roomsList = data?.message || [];
               callbackFn(roomsList);
           });
       } catch (roomListError) {
           console.error('Room list handler error:', roomListError);
       }
   }

   async joinGameRoom(socketObj, roomIdentifier, createNewRoom, spectatorMode = false) {
       return new Promise((resolveJoinRoom, rejectJoinRoom) => {
           try {
               let joinData = Object.create(null);
               Object.assign(joinData, {
                   roomId: roomIdentifier,
                   createRoom: Boolean(createNewRoom),
                   asSpectator: Boolean(spectatorMode)
               });

               socketObj.emit('join_game', joinData);
               
               function handleSuccess() {
                   let timestamp = Date.now();
                   let joinTime = new Date(timestamp);
                   console.log('Joined at:', joinTime.toLocaleString());
                   socketObj.off('room_join_error');
                   resolveJoinRoom(true);
               }

               function handleError(errorData) {
                   let errorMsg = errorData?.error || 'Unknown error';
                   console.error('Join failed:', errorMsg);
                   socketObj.off('room_joined');
                   rejectJoinRoom(errorMsg);
               }

               socketObj.once('room_joined', handleSuccess);
               socketObj.once('room_join_error', handleError);

           } catch (joinError) {
               console.error('Room join process failed:', joinError);
               rejectJoinRoom(joinError);
           }
       });
   }

   async onRoomJoined(socketObj, callbackFn) {
       try {
           let setupAttempts = 0;
           while(setupAttempts < 1) {
               socketObj.on('ready_to_start', callbackFn);
               setupAttempts = setupAttempts + 1;
           }
       } catch (roomJoinedError) {
           console.error('Room joined handler failed:', roomJoinedError);
       }
   }

   async onDisconnect(socketObj, callbackFn) {
       try {
           socketObj.on('left_the_game', function(data) {
               let disconnectMsg = data?.message || 'User disconnected';
               callbackFn(disconnectMsg);
           });
       } catch (disconnectHandlerError) {
           console.error('Disconnect handler failed:', disconnectHandlerError);
       }
   }
}

const socketService = new SocketService();
const gameService = new GameService();

export { socketService, gameService };
