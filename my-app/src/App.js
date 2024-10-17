import React, { useState, useEffect } from 'react';
import gameContext from './gameContext';
import Game from './components/Game';
import JoinRoom from './components/JoinRoom';
import socketService from './services/socketService';
import './index.css';

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [playerColor, setPlayerColor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.connect('http://localhost:9000')
      .then(() => {
        console.log('Connected to server');
        setIsConnected(true);
      })
      .catch((err) => {
        console.error('Error:', err);
        setIsConnected(false);
      });

    return () => {
      socketService.disconnect();
    };
  }, []);

  if (!isConnected) {
    return <div>Connecting to server...</div>;
  }

  return (
    <gameContext.Provider value={{
      isInRoom,
      setInRoom,
      roomName,
      setRoomName,
      playerColor,
      setPlayerColor,
    }}>
      <div className="app-container">
        <h1>Othello Game</h1>
        {isInRoom ? <Game /> : <JoinRoom />}
      </div>
    </gameContext.Provider>
  );
}

export default App;