
import React from 'react';

export default React.createContext({
    isInRoom: false,
    setInRoom: () => {},
    playerColor: 1,
    setPlayerColor: () => {},
    isPlayerTurn: false,
    setPlayerTurn: () => {},
    isGameStarted: false,
    setGameStarted: () => {},
    isGameFinished: false,
    setGameFinished: () => {},
    roomName: '',
    setRoomName: () => {},
    roomList: [],
    setRoomList: () => {},
    isSpectator: false,
    setIsSpectator: () => {},
    isCreator: false,
    setIsCreator: () => {},
});
