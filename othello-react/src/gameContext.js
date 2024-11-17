// import React from 'react';

// const defaultState = {
//     isInRoom: false,
//     setInRoom: () => {},
//     playerColor: 1,
//     setPlayerColor: () => {},
//     isPlayerTurn: false,
//     setPlayerTurn: () => {},
//     isGameStarted: false,
//     setGameStarted: () => {},
//     isGameFinished: false,
//     setGameFinished: () => {},
//     roomName: '',
//     setRoomName: () => {},
//     roomList: [''],
//     setRoomList: () => {}
// };

// export default React.createContext(defaultState);
//bottom imp

// src/gameContext.js
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
