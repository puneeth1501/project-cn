import React, { useEffect, useState } from 'react';
import {gameService, socketService} from './services/socketService';
import { JoinRoom } from './components/JoinRoom';
import GameContext from './gameContext';
import { Game } from './components/game';
import './index.css'

function App() {
    // Group related states into objects
    const [gameState, setGameState] = useState({
        isActive: false,
        isFinished: false,
        currentTurn: false,
        playerColor: 1
    });

    const [roomState, setRoomState] = useState({
        isJoined: false,
        currentName: '',
        availableRooms: [],
        isCreator: false,
        isSpectator: false
    });

    // Utility functions
    const updateGameState = (updates) => {
        setGameState(prev => ({ ...prev, ...updates }));
    };

    const updateRoomState = (updates) => {
        setRoomState(prev => ({ ...prev, ...updates }));
    };

    // Socket connection management
    const initializeConnection = async () => {
        try {
            let retryCount = 0;
            let maxRetries = 3;
            let retryDelay = 1000;

            const attemptConnection = async () => {
                try {
                    await socketService.connect('http://localhost:9000');
                    console.log('Connection established successfully');
                    return true;
                } catch (error) {
                    console.warn(`Connection attempt ${retryCount + 1} failed:`, error);
                    return false;
                }
            };

            let connected = false;
            do {
                connected = await attemptConnection();
                if (!connected && retryCount < maxRetries - 1) {
                    await new Promise(r => setTimeout(r, retryDelay));
                    retryCount++;
                }
            } while (!connected && retryCount < maxRetries);

            if (!connected) {
                throw new Error('Failed to establish connection after multiple attempts');
            }
        } catch (error) {
            console.error('Connection initialization failed:', error);
        }
    };

    // Room list management
    const setupRoomListeners = () => {
        try {
            const socketInstance = socketService.socket;
            if (!socketInstance) return;

            const handleRoomUpdates = (roomData) => {
                try {
                    let validRooms = Array.isArray(roomData) ? roomData : [];
                    updateRoomState({ availableRooms: validRooms });
                } catch (error) {
                    console.error('Room update processing failed:', error);
                }
            };

            gameService.onGettingRoomList(socketInstance, handleRoomUpdates);
        } catch (error) {
            console.error('Room listener setup failed:', error);
        }
    };

    // Lifecycle management
    useEffect(() => {
        let isComponentMounted = true;

        const setupApplication = async () => {
            try {
                if (isComponentMounted) {
                    await initializeConnection();
                    setupRoomListeners();
                }
            } catch (error) {
                console.error('Application setup failed:', error);
            }
        };

        setupApplication();

        return () => {
            isComponentMounted = false;
            try {
                if (socketService.socket) {
                    socketService.disconnect();
                }
            } catch (error) {
                console.error('Cleanup failed:', error);
            }
        };
    }, []);

    // Context value construction
    const contextValue = {
        // Game-related values
        isGameStarted: gameState.isActive,
        setGameStarted: (value) => updateGameState({ isActive: value }),
        isGameFinished: gameState.isFinished,
        setGameFinished: (value) => updateGameState({ isFinished: value }),
        isPlayerTurn: gameState.currentTurn,
        setPlayerTurn: (value) => updateGameState({ currentTurn: value }),
        playerColor: gameState.playerColor,
        setPlayerColor: (value) => updateGameState({ playerColor: value }),

        // Room-related values
        isInRoom: roomState.isJoined,
        setInRoom: (value) => updateRoomState({ isJoined: value }),
        roomName: roomState.currentName,
        setRoomName: (value) => updateRoomState({ currentName: value }),
        roomList: roomState.availableRooms,
        setRoomList: (value) => updateRoomState({ availableRooms: value }),
        isCreator: roomState.isCreator,
        setIsCreator: (value) => updateRoomState({ isCreator: value }),
        isSpectator: roomState.isSpectator,
        setIsSpectator: (value) => updateRoomState({ isSpectator: value })
    };

    return (
        <GameContext.Provider value={contextValue}>
            <div className="app-container">
                <h1 className="game-title">Othello</h1>
                {roomState.isJoined ? <Game /> : <JoinRoom />}
            </div>
        </GameContext.Provider>
    );
}

export default App;
