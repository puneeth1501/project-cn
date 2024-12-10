


import React, { useEffect, useState } from 'react';
import {gameService,socketService} from './services/socketService';
import { JoinRoom } from './components/JoinRoom';
import GameContext from './gameContext';
import { Game } from './components/game';
import './index.css'
// import gameService from './services/gameService';

function App() {
    const [isInRoom, setInRoom] = useState(false);
    const [playerColor, setPlayerColor] = useState(1);
    const [isPlayerTurn, setPlayerTurn] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameFinished, setGameFinished] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [isSpectator, setIsSpectator] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    const connectSocket = async () => {
        try {
            await socketService.connect('http://localhost:9000');
        } catch (err) {
            console.log('Error: ', err);
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
        isSpectator,
        setIsSpectator,
        isCreator,
        setIsCreator,
    };

    return (
        <GameContext.Provider value={gameContextValue}>
            <div className="app-container">
                <h1>Othello</h1>
                {!isInRoom && <JoinRoom />}
                {isInRoom && <Game />}
            </div>
        </GameContext.Provider>
    );
}

export default App;
