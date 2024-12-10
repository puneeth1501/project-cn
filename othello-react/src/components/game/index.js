import React, { useContext, useState, useEffect } from 'react';
import gameContext from '../../gameContext';
import {gameService, socketService} from '../../services/socketService';
import Label, { Piece } from '../../components/Label';
import { GameLogic } from './gameLogic';
import { AI1 } from './ai1';
import { AI2 } from './ai2';
import { AI3 } from './ai3';
import Chat from '../chat';
import '../../index.css'

export function Game() {
    const [boardState, setGameBoard] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    const [readyStatus, setReadyStatus] = useState(false);
    const [aiType, setAIType] = useState('human');
    
    const {
        playerColor, setPlayerColor,
        isPlayerTurn, setPlayerTurn,
        isGameStarted, setGameStarted,
        roomName,
        isGameFinished, setGameFinished,
        isSpectator,
        isCreator
    } = useContext(gameContext);

    const gameInstance = new GameLogic(boardState);

    const handleGameReset = () => {
        try {
            if (socketService.socket) {
                gameService.onGameReset(socketService.socket, () => {
                    resetGameToInitial();
                });
            }
        } catch (resetError) {
            console.error('Reset handler failed:', resetError);
        }
    };

    const handleAISelection = (eventObj) => {
        try {
            let selectedValue = eventObj.target.value;
            setAIType(selectedValue);
        } catch (selectionError) {
            console.error('AI selection failed:', selectionError);
        }
    };

    const processMove = async (rowPos, colPos) => {
        try {
            let isValidCell = boardState[rowPos][colPos] === 0;
            let canMove = isPlayerTurn && !isSpectator;
            
            if (!isValidCell || !canMove) return;

            const affectedPieces = gameInstance.getAffectedDisks(rowPos, colPos, playerColor);
            
            if (affectedPieces.length > 0) {
                setPlayerTurn(false);
                const updatedBoard = gameInstance.move(rowPos, colPos, playerColor).getBoard();
                setGameBoard(updatedBoard);
                
                if (socketService.socket) {
                    await gameService.updateGame(socketService.socket, updatedBoard);
                }
            }
        } catch (moveError) {
            console.error('Move processing failed:', moveError);
        }
    };

    const resetGameToInitial = () => {
        try {
            let initialBoard = [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ];
            
            setGameBoard(initialBoard);
            setGameFinished(false);
            setGameStarted(false);
            setPlayerTurn(false);
        } catch (resetError) {
            console.error('Game reset failed:', resetError);
        }
    };

    const resetGame = () => {
        resetGameToInitial();
        if (socketService.socket) {
            gameService.resetGame(socketService.socket);
        }
    };
    
    const initializeGame = () => {
        try {
            if (socketService.socket) {
                gameService.startGame(socketService.socket);
            }
        } catch (initError) {
            console.error('Game initialization failed:', initError);
        }
    };

    const handleRoomConnection = () => {
        try {
            if (socketService.socket) {
                gameService.onRoomJoined(socketService.socket, () => {
                    setReadyStatus(true);
                });
            }
        } catch (connectionError) {
            console.error('Room connection failed:', connectionError);
        }
    };

    const handleGameInitialization = () => {
        try {
            if (socketService.socket) {
                gameService.onGameStart(socketService.socket, (gameOptions) => {
                    setGameStarted(true);
                    setPlayerColor(gameOptions.color);
                    setPlayerTurn(gameOptions.start);
                });
            }
        } catch (initError) {
            console.error('Game initialization failed:', initError);
        }
    };

    const resetEntireGame = () => {
        try {
            resetGameToInitial();
            if (socketService.socket) {
                gameService.resetGame(socketService.socket);
            }
        } catch (resetError) {
            console.error('Game reset failed:', resetError);
        }
    };

    const handleBoardUpdate = () => {
        try {
            if (socketService.socket) {
                gameService.onGameUpdate(socketService.socket, (updatedBoard) => {
                    setGameBoard(updatedBoard);
                    setPlayerTurn(true);
                });
            }
        } catch (updateError) {
            console.error('Board update failed:', updateError);
        }
    };

    const handlePlayerDisconnect = () => {
        try {
            if (socketService.socket) {
                gameService.onDisconnect(socketService.socket, (disconnectMsg) => {
                    socketService.socket?.disconnect();
                    setPlayerTurn(false);
                    alert(disconnectMsg);
                });
            }
        } catch (disconnectError) {
            console.error('Disconnect handling failed:', disconnectError);
        }
    };

    useEffect(() => {
        try {
            handleRoomConnection();
            handleGameInitialization();
            handleBoardUpdate();
            handleGameReset();
            handlePlayerDisconnect();
        } catch (setupError) {
            console.error('Game setup failed:', setupError);
        }
    }, []);

    useEffect(() => {
        try {
            if (!isPlayerTurn) return;

            let validMoves = gameInstance.getMovableCell(playerColor);
            
            if (validMoves.length > 0) {
                if (aiType !== 'human') {
                    let aiInstance;
                    let movePosition;

                    switch(aiType) {
                        case 'ai1':
                            aiInstance = new AI1(gameInstance);
                            movePosition = aiInstance.ai1Called(playerColor);
                            break;
                        case 'ai2':
                            aiInstance = new AI2(gameInstance);
                            movePosition = aiInstance.ai2Called(playerColor);
                            break;
                        case 'ai3':
                            aiInstance = new AI3(gameInstance);
                            movePosition = aiInstance.ai3Called(playerColor);
                            break;
                    }

                    if (movePosition !== undefined) {
                        processMove(movePosition.row, movePosition.col);
                    }
                }
            } else {
                if (socketService.socket) {
                    console.log('No valid moves available');
                    let opponentMoves = gameInstance.getMovableCell(playerColor === 1 ? 2 : 1);
                    
                    if (opponentMoves.length > 0) {
                        gameService.updateGame(socketService.socket, boardState);
                        setPlayerTurn(false);
                    } else {
                        setGameFinished(true);
                    }
                }
            }
        } catch (turnError) {
            console.error('Turn processing failed:', turnError);
        }
    }, [isPlayerTurn]);

    useEffect(() => {
        try {
            if (!isGameFinished) return;

            if (socketService.socket) {
                gameService.updateGame(socketService.socket, boardState);
                
                let blackPieces = gameInstance.getScore(1);
                let whitePieces = gameInstance.getScore(2);
                
                let resultMessage = '';
                if (blackPieces > whitePieces) {
                    resultMessage = `Black Won!\nBlack score: ${blackPieces}\nWhite score: ${whitePieces}`;
                } else if (blackPieces < whitePieces) {
                    resultMessage = `White Won!\nWhite score: ${whitePieces}\nBlack score: ${blackPieces}`;
                } else {
                    resultMessage = 'Tie!';
                }
                
                alert(resultMessage);
            }
            setPlayerTurn(false);
        } catch (gameEndError) {
            console.error('Game end processing failed:', gameEndError);
        }
    }, [isGameFinished]);

    const renderGameControls = () => (
        <div className="game-controls">
            {!isSpectator && (
                <>
                    {roomName && (
                        <button 
                            className='button' 
                            disabled={isGameStarted || !readyStatus} 
                            onClick={initializeGame}
                            style={{ display: isCreator ? 'block' : 'none' }}
                        >
                            START
                        </button>
                    )}
                    // <button 
                    //     className='button' 
                    //     disabled={!isGameFinished} 
                    //     onClick={resetEntireGame}
                    // >
                    //     RESET
                    // </button>
                    <button 
                    className='button' onClick={resetGame}> RESET</button> 
                    <select 
                        className='dropdown' 
                        disabled={isGameStarted} 
                        onChange={handleAISelection}
                    >
                        <option value='human'>Human</option>
                        <option value='ai1'>AI 1</option>
                        <option value='ai2'>AI 2</option>
                        <option value='ai3'>AI 3</option>
                    </select>
                </>
            )}
            <button 
                className='button' 
                onClick={() => window.location.reload()}
            >
                LEAVE ROOM
            </button>
        </div>
    );

    const renderGameInfo = () => (
        <div className="game-info">
            <Label label={'Room: ' + roomName} />
            {isSpectator && (
                <div className="spectator-banner">
                    <Label label="Spectator Mode" />
                </div>
            )}
            {!isGameStarted && (!readyStatus ? 
                <Label label={'Waiting for other player to join...'} /> : 
                <Label label={'Player joined!'} />
            )}
            {isGameStarted && !isSpectator && (
                <Label label={`You are ${playerColor === 1 ? 'black' : 'white'}`} />
            )}
            {isGameStarted && (
                isPlayerTurn && !isSpectator ? 
                <Label label='Your turn' /> : 
                <Label label={isSpectator ? `${playerColor === 1 ? 'Black' : 'White'}'s turn` : "Enemy's turn"} />
            )}
            {isGameStarted && (
                <div className="score-info">
                    <Label label={`Black: ${gameInstance.getScore(1)}`} />
                    <Label label={`White: ${gameInstance.getScore(2)}`} />
                </div>
            )}
        </div>
    );

    const renderGameBoard = () => (
        <div className={`game-board ${isSpectator ? 'spectator-mode' : ''}`}>
            {boardState.map((rowData, rowIndex) => (
                <div style={{ display: 'flex' }} key={rowIndex}>
                    {rowData.map((cellValue, colIndex) => (
                        <div 
                            className='cell' 
                            key={colIndex} 
                            onClick={() => !isSpectator && processMove(rowIndex, colIndex)}
                        >
                            {cellValue !== 0 ? (
                                <Piece color={cellValue} />
                            ) : (
                                gameInstance.canClickSpot(rowIndex, colIndex, playerColor) && 
                                isPlayerTurn && 
                                !isSpectator ? (
                                    <Piece color={cellValue} />
                                ) : (
                                    ''
                                )
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="game-container">
            <div className="game-wrapper">
                {renderGameInfo()}
                {renderGameBoard()}
                {renderGameControls()}
            </div>
            <Chat 
                socket={socketService.socket} 
                roomName={roomName}
                isSpectator={isSpectator}
            />
        </div>
    );
}
