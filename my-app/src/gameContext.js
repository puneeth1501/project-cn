import React from 'react';

const gameContext = React.createContext({
  isInRoom: false,
  setInRoom: () => {},
  roomName: "",
  setRoomName: () => {},
  playerColor: null,
  setPlayerColor: () => {},
});

export default gameContext;