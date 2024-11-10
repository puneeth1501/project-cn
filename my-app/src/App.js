// import { useEffect, useState } from 'react';
// import socketService from './services/socketService';
// import { JoinRoom } from './components/JoinRoom';
// import GameContext from './gameContext';
// import { Game } from './components/game';
// import gameService from './services/gameService';

// function App() {
//   const [isInRoom, setInRoom] = useState(false);
//   const [playerColor, setPlayerColor] = useState(1);
//   const [isPlayerTurn, setPlayerTurn] = useState(false);
//   const [isGameStarted, setGameStarted] = useState(false);
//   const [isGameFinished, setGameFinished] = useState(false);
//   const [roomName, setRoomName] = useState(''); 
//   const [roomList, setRoomList] = useState(['']);

//   const connectSocket = async () => {
//     await socketService
//       .connect('http://localhost:9000')
//       .connect('https://othello-server-fr9m.onrender.com/')
//       .catch((err) => {
//         console.log("Error: ", err);
//       });
//   };

//   const handleRoomList = () => {
//     if (socketService.socket) {
//       gameService.onGettingRoomList(socketService.socket, (message) => {
//         setRoomList(message);
//       });
//     }
//   };

//   useEffect(() => {
//     connectSocket();
//     handleRoomList();
//   }, []);

//   const gameContextValue = {
//     isInRoom,
//     setInRoom,
//     playerColor,
//     setPlayerColor,
//     isPlayerTurn,
//     setPlayerTurn,
//     isGameStarted,
//     setGameStarted,
//     isGameFinished,
//     setGameFinished,
//     roomName,
//     setRoomName,
//     roomList,
//     setRoomList,
//   };

//   return (
//     <GameContext.Provider value={gameContextValue}>
//       <h1><span>Othello</span></h1>
//       {!isInRoom && <JoinRoom />}
//       {isInRoom && <Game />}
//     </GameContext.Provider>
//   );
// }

// export default App;


import { useEffect, useState } from 'react';
import socketService from './services/socketService';
import { JoinRoom } from './components/JoinRoom';
import GameContext from './gameContext';
import { Game } from './components/game';
import gameService from './services/gameService';

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerColor, setPlayerColor] = useState(1);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [isGameFinished, setGameFinished] = useState(false);
  const [roomName, setRoomName] = useState(''); 
  const [roomList, setRoomList] = useState([]);

  const connectSocket = async () => {
    try {
      await socketService.connect('https://othello-server-fr9m.onrender.com/');
      console.log("Connected to the socket server successfully.");
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleRoomList = () => {
    if (socketService.socket) {
      gameService.onGettingRoomList(socketService.socket, (message) => {
        setRoomList(message);
      });
    }
  };

  useEffect(() => {
    connectSocket();
    handleRoomList();
  }, []);

  const gameContextValue = {
    isInRoom,
    setInRoom,
    playerColor,
    setPlayerColor,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    isGameFinished,
    setGameFinished,
    roomName,
    setRoomName,
    roomList,
    setRoomList,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <h1><span>Othello</span></h1>
      {!isInRoom && <JoinRoom />}
      {isInRoom && <Game />}
    </GameContext.Provider>
  );
}

export default App;
