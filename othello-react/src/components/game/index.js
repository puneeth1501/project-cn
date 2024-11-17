//very very imp...
// import React, { useContext, useState, useEffect } from 'react';
// import gameContext from '../../gameContext';
// import gameService from '../../services/gameService';
// import socketService from '../../services/socketService';
// import Label from '../../components/Label';
// import Piece from '../../components/Piece';
// import { GameLogic } from './gameLogic';
// import { AI1 } from './ai1';
// import { AI2 } from './ai2';
// import { AI3 } from './ai3';

// export function Game() {
//     const [matrix, setMatrix] = useState([
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 2, 1, 0, 0, 0],
//         [0, 0, 0, 1, 2, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ]);
//     const [isReady, setReady] = useState(false);
//     const [selectedPlayer, setSelectedPlayer] = useState('human');

//     const {
//         playerColor, setPlayerColor,
//         isPlayerTurn, setPlayerTurn,
//         isGameStarted, setGameStarted,
//         roomName,
//         isGameFinished, setGameFinished,
//     } = useContext(gameContext);

//     const gameLogic = new GameLogic(matrix);

//     const handlePlayerChange = (e) => {
//         setSelectedPlayer(e.target.value);
//     };

//     const clickedSquare = async (row, col) => {
//         if (matrix[row][col] !== 0 || !isPlayerTurn) return;

//         const affectedDisks = gameLogic.getAffectedDisks(row, col, playerColor);
//         if (affectedDisks.length !== 0) {
//             console.log('PLAYED');
//             setPlayerTurn(false);
//             const newMatrix = gameLogic.move(row, col, playerColor).getBoard();
//             setMatrix(newMatrix);
//             if (socketService.socket) {
//                 gameService.updateGame(socketService.socket, newMatrix);
//             }
//         }
//     };

//     const handleRoomJoined = () => {
//         if (socketService.socket) {
//             gameService.onRoomJoined(socketService.socket, () => {
//                 setReady(true);
//             });
//         }
//     };

//     const startGame = () => {
//         if (socketService.socket) {
//             gameService.startGame(socketService.socket);
//         }
//     };

//     const handleGameStart = () => {
//         if (socketService.socket) {
//             gameService.onGameStart(socketService.socket, (options) => {
//                 setGameStarted(true);
//                 setPlayerColor(options.color);
//                 options.start ? setPlayerTurn(true) : setPlayerTurn(false);
//             });
//         }
//     };

//     const resetGameState = () => {
//         setMatrix([
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 2, 1, 0, 0, 0],
//             [0, 0, 0, 1, 2, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//         ]);
//         setGameFinished(false);
//         setGameStarted(false);
//         setPlayerTurn(false);
//     };

//     const resetGame = () => {
//         resetGameState();
//         if (socketService.socket) {
//             gameService.resetGame(socketService.socket);
//         }
//     };

//     const handleGameReset = () => {
//         if (socketService.socket) {
//             gameService.onGameReset(socketService.socket, () => {
//                 resetGameState();
//             });
//         }
//     };

//     const handleGameUpdate = () => {
//         if (socketService.socket) {
//             gameService.onGameUpdate(socketService.socket, (newMatrix) => {
//                 setMatrix(newMatrix);
//                 setPlayerTurn(true);
//             });
//         }
//     };

//     const handleDisconnect = () => {
//         if (socketService.socket) {
//             gameService.onDisconnect(socketService.socket, (message) => {
//                 socketService.socket?.disconnect();
//                 setPlayerTurn(false);
//                 alert(message);
//             });
//         }
//     };

//     useEffect(() => {
//         handleRoomJoined();
//         handleGameStart();
//         handleGameUpdate();
//         handleGameReset();
//         handleDisconnect();
//     }, []);

//     useEffect(() => {
//         if (!isPlayerTurn) return;
//         if (gameLogic.getMovableCell(playerColor).length !== 0) {
//             if (selectedPlayer !== 'human') {
//                 if (selectedPlayer === 'ai1') {
//                     const ai1 = new AI1(gameLogic);
//                     const pos = ai1.ai1Called(playerColor);
//                     if (pos !== undefined) {
//                         clickedSquare(pos.row, pos.col);
//                     }
//                 } else if (selectedPlayer === 'ai2') {
//                     const ai2 = new AI2(gameLogic);
//                     const pos = ai2.ai2Called(playerColor);
//                     if (pos !== undefined) {
//                         clickedSquare(pos.row, pos.col);
//                     }
//                 } else if (selectedPlayer === 'ai3') {    // Add here
//                     const ai3 = new AI3(gameLogic);
//                     const pos = ai3.ai3Called(playerColor);
//                     if (pos !== undefined) {
//                         clickedSquare(pos.row, pos.col);
//                     }
//                 }
//             }
//         } else {
//             if (socketService.socket) {
//                 console.log('NO CELL');
//                 if (gameLogic.getMovableCell(playerColor === 1 ? 2 : 1).length !== 0) {
//                     gameService.updateGame(socketService.socket, matrix);
//                     setPlayerTurn(false);
//                 } else {
//                     setGameFinished(true);
//                 }
//             }
//         }
//     }, [isPlayerTurn]);

//     useEffect(() => {
//         if (!isGameFinished) return;
//         if (socketService.socket) {
//             gameService.updateGame(socketService.socket, matrix);
//             const blackScore = gameLogic.getScore(1);
//             const whiteScore = gameLogic.getScore(2);
//             if (blackScore > whiteScore) {
//                 alert('Black Won!\nBlack score: ' + blackScore + '\nWhite score: ' + whiteScore);
//             } else if (blackScore < whiteScore) {
//                 alert('White Won!\nWhite score: ' + whiteScore + '\nBlack score: ' + blackScore);
//             } else {
//                 alert('Tie!');
//             }
//         }
//         setPlayerTurn(false);
//     }, [isGameFinished]);

//     return (
//         <div className='game-div'>
//             <Label label={'Room name : ' + roomName} />
//             {!isGameStarted && (!isReady ? <Label label={'Waiting for other player to join...'} /> : <Label label={'Player joined!'} />)}
//             {isGameStarted && (<Label label={'You are ' + (playerColor === 1 ? 'black' : 'white')} />)}
//             {isGameStarted && (isPlayerTurn ? <Label label='Your turn' /> : <Label label="Enemy's turn" />)}
//             {(!isGameStarted || !isPlayerTurn) && <div className='overlay'></div>}
//             {matrix.map((row, rowIdx) => (
//                 <div style={{ display: 'flex' }} key={rowIdx}>
//                     {row.map((column, columnIdx) => (
//                         <div className='cell' key={columnIdx} onClick={() => clickedSquare(rowIdx, columnIdx)}>
//                             {column !== 0 ? (
//                                 <Piece color={column} />
//                             ) : (
//                                 gameLogic.canClickSpot(rowIdx, columnIdx, playerColor) && isPlayerTurn ? (
//                                     <Piece color={column} />
//                                 ) : (
//                                     ''
//                                 )
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             ))}
//             <button className='button' disabled={isGameStarted || !isReady} onClick={startGame}>START</button>
//             <button className='button' disabled={!isGameFinished} onClick={resetGame}>RESET</button>
//             <select className='dropdown' disabled={isGameStarted} onChange={handlePlayerChange}>
//                 <option value='human'>Human</option>
//                 <option value='ai1'>AI 1</option>
//                 <option value='ai2'>AI 2</option>
//                 <option value='ai3'>AI 3</option>
//             </select>
//             <button className='button' onClick={() => window.location.reload()}>GO BACK</button>
//         </div>
//     );
// }



// src/components/Game/index.js
import React, { useContext, useState, useEffect } from 'react';
import gameContext from '../../gameContext';
// import gameService from '../../services/gameService';
import {gameService,socketService} from '../../services/socketService';
import Label from '../../components/Label';
import Piece from '../../components/Piece';
import { GameLogic } from './gameLogic';
import { AI1 } from './ai1';
import { AI2 } from './ai2';
import { AI3 } from './ai3';
import Chat from '../chat';
// import './Game.css';
import '../../index.css'

export function Game() {
    const [matrix, setMatrix] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    const [isReady, setReady] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState('human');
    // const [isCreator, setIsCreator] = useState(false);

    const {
        playerColor, setPlayerColor,
        isPlayerTurn, setPlayerTurn,
        isGameStarted, setGameStarted,
        roomName,
        isGameFinished, setGameFinished,
        isSpectator,
        isCreator
    } = useContext(gameContext);

    const gameLogic = new GameLogic(matrix);

    const handlePlayerChange = (e) => {
        setSelectedPlayer(e.target.value);
    };

    const clickedSquare = async (row, col) => {
        if (matrix[row][col] !== 0 || !isPlayerTurn || isSpectator) return;

        const affectedDisks = gameLogic.getAffectedDisks(row, col, playerColor);
        if (affectedDisks.length !== 0) {
            setPlayerTurn(false);
            const newMatrix = gameLogic.move(row, col, playerColor).getBoard();
            setMatrix(newMatrix);
            if (socketService.socket) {
                gameService.updateGame(socketService.socket, newMatrix);
            }
        }
    };

    const handleRoomJoined = () => {
        if (socketService.socket) {
            gameService.onRoomJoined(socketService.socket, () => {
                setReady(true);
            });
        }
    };

    const startGame = () => {
        if (socketService.socket) {
            gameService.startGame(socketService.socket);
        }
    };

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onGameStart(socketService.socket, (options) => {
                setGameStarted(true);
                setPlayerColor(options.color);
                options.start ? setPlayerTurn(true) : setPlayerTurn(false);
            });
        }
    };

    const resetGameState = () => {
        setMatrix([
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]);
        setGameFinished(false);
        setGameStarted(false);
        setPlayerTurn(false);
    };

    const resetGame = () => {
        resetGameState();
        if (socketService.socket) {
            gameService.resetGame(socketService.socket);
        }
    };

    const handleGameReset = () => {
        if (socketService.socket) {
            gameService.onGameReset(socketService.socket, () => {
                resetGameState();
            });
        }
    };

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (newMatrix) => {
                setMatrix(newMatrix);
                setPlayerTurn(true);
            });
        }
    };

    const handleDisconnect = () => {
        if (socketService.socket) {
            gameService.onDisconnect(socketService.socket, (message) => {
                socketService.socket?.disconnect();
                setPlayerTurn(false);
                alert(message);
            });
        }
    };

    useEffect(() => {
        handleRoomJoined();
        handleGameStart();
        handleGameUpdate();
        handleGameReset();
        handleDisconnect();
    }, []);

    useEffect(() => {
        if (!isPlayerTurn) return;
        if (gameLogic.getMovableCell(playerColor).length !== 0) {
            if (selectedPlayer !== 'human') {
                if (selectedPlayer === 'ai1') {
                    const ai1 = new AI1(gameLogic);
                    const pos = ai1.ai1Called(playerColor);
                    if (pos !== undefined) {
                        clickedSquare(pos.row, pos.col);
                    }
                } else if (selectedPlayer === 'ai2') {
                    const ai2 = new AI2(gameLogic);
                    const pos = ai2.ai2Called(playerColor);
                    if (pos !== undefined) {
                        clickedSquare(pos.row, pos.col);
                    }
                } else if (selectedPlayer === 'ai3') {
                    const ai3 = new AI3(gameLogic);
                    const pos = ai3.ai3Called(playerColor);
                    if (pos !== undefined) {
                        clickedSquare(pos.row, pos.col);
                    }
                }
            }
        } else {
            if (socketService.socket) {
                console.log('NO CELL');
                if (gameLogic.getMovableCell(playerColor === 1 ? 2 : 1).length !== 0) {
                    gameService.updateGame(socketService.socket, matrix);
                    setPlayerTurn(false);
                } else {
                    setGameFinished(true);
                }
            }
        }
    }, [isPlayerTurn]);

    useEffect(() => {
        if (!isGameFinished) return;
        if (socketService.socket) {
            gameService.updateGame(socketService.socket, matrix);
            const blackScore = gameLogic.getScore(1);
            const whiteScore = gameLogic.getScore(2);
            if (blackScore > whiteScore) {
                alert('Black Won!\nBlack score: ' + blackScore + '\nWhite score: ' + whiteScore);
            } else if (blackScore < whiteScore) {
                alert('White Won!\nWhite score: ' + whiteScore + '\nBlack score: ' + blackScore);
            } else {
                alert('Tie!');
            }
        }
        setPlayerTurn(false);
    }, [isGameFinished]);

    const renderGameBoard = () => (
        <div className={`game-board ${isSpectator ? 'spectator-mode' : ''}`}>
            {matrix.map((row, rowIdx) => (
                <div style={{ display: 'flex' }} key={rowIdx}>
                    {row.map((column, columnIdx) => (
                        <div 
                            className='cell' 
                            key={columnIdx} 
                            onClick={() => !isSpectator && clickedSquare(rowIdx, columnIdx)}
                        >
                            {column !== 0 ? (
                                <Piece color={column} />
                            ) : (
                                gameLogic.canClickSpot(rowIdx, columnIdx, playerColor) && 
                                isPlayerTurn && 
                                !isSpectator ? (
                                    <Piece color={column} />
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

    const renderGameInfo = () => (
        <div className="game-info">
            <Label label={'Room: ' + roomName} />
            {isSpectator && (
                <div className="spectator-banner">
                    <Label label="Spectator Mode" />
                </div>
            )}
            {!isGameStarted && (!isReady ? 
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
                    <Label label={`Black: ${gameLogic.getScore(1)}`} />
                    <Label label={`White: ${gameLogic.getScore(2)}`} />
                </div>
            )}
        </div>
    );

    // const renderControls = () => (
    //     <div className="game-controls">
    //         {!isSpectator && (
    //             <>
    //                 <button 
    //                     className='button' 
    //                     disabled={isGameStarted || !isReady} 
    //                     onClick={startGame}
    //                 >
    //                     START
    //                 </button>
    //                 <button 
    //                     className='button' 
    //                     disabled={!isGameFinished} 
    //                     onClick={resetGame}
    //                 >
    //                     RESET
    //                 </button>
    //                 <select 
    //                     className='dropdown' 
    //                     disabled={isGameStarted} 
    //                     onChange={handlePlayerChange}
    //                 >
    //                     <option value='human'>Human</option>
    //                     <option value='ai1'>AI 1</option>
    //                     <option value='ai2'>AI 2</option>
    //                     <option value='ai3'>AI 3</option>
    //                 </select>
    //             </>
    //         )}
    //         <button className='button' onClick={() => window.location.reload()}>
    //             LEAVE ROOM
    //         </button>
    //     </div>
    // );


    const renderControls = () => (
        <div className="game-controls">
            {!isSpectator && (
                <>
                    {roomName && ( // Only show START button to room creator
                        <button 
                            className='button' 
                            disabled={isGameStarted || !isReady} 
                            onClick={startGame}
                            style={{ display: isCreator ? 'block' : 'none' }} // Add this
                        >
                            START
                        </button>
                    )}
                    <button 
                        className='button' 
                        disabled={!isGameFinished} 
                        onClick={resetGame}
                    >
                        RESET
                    </button>
                    <select 
                        className='dropdown' 
                        disabled={isGameStarted} 
                        onChange={handlePlayerChange}
                    >
                        <option value='human'>Human</option>
                        <option value='ai1'>AI 1</option>
                        <option value='ai2'>AI 2</option>
                        <option value='ai3'>AI 3</option>
                    </select>
                </>
            )}
            <button className='button' onClick={() => window.location.reload()}>
                LEAVE ROOM
            </button>
        </div>
    );

    // In your Game component
// src/components/Game/index.js

// ... keep other code the same ...

return (
    <div className="game-container">
        <div className="game-wrapper">
            {renderGameInfo()}
            {renderGameBoard()}
            {renderControls()}
        </div>
        <Chat 
            socket={socketService.socket} 
            roomName={roomName}
            isSpectator={isSpectator}
        />
    </div>
);
}
