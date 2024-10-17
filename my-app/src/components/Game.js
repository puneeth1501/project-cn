import React, { useContext, useEffect, useState } from 'react';
import gameContext from '../gameContext';
import socketService from '../services/socketService';

const INITIAL_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

function Game() {
  const { roomName } = useContext(gameContext);
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [myColor, setMyColor] = useState(null);
  const [scores, setScores] = useState({ 1: 2, 2: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(1); // 1 for black, 2 for white

  useEffect(() => {
    console.log("Game component mounted");
    
    socketService.onReadyToStart(() => {
      console.log("Ready to start received");
      socketService.startGame();
    });

    socketService.onGameStart((options) => {
      console.log("Game started", options);
      setIsGameStarted(true);
      setIsMyTurn(options.start);
      setMyColor(options.color);
    });

    socketService.onGameUpdate((data) => {
      console.log("Game updated", data);
      if (Array.isArray(data.board)) {
        setBoard(data.board);
      } else if (typeof data.board === 'object' && data.board.board) {
        setBoard(data.board.board);
      } else {
        console.error("Received invalid board data:", data.board);
        return;
      }
      setCurrentTurn(data.currentTurn);
      if (!isSpectator) {
        setIsMyTurn(data.currentTurn === myColor);
      }
      updateScores(data.board);
      checkGameOver(data.board);
    });

    socketService.onOpponentLeft((message) => {
      alert(message.message);
      setGameOver(true);
    });

    socketService.onGameRestart(() => {
      resetGame();
    });

    socketService.onSpectatorJoined(() => {
      setIsSpectator(true);
      setIsGameStarted(true);
    });

    return () => {
      socketService.off('ready_to_start');
      socketService.off('on_game_start');
      socketService.off('on_game_update');
      socketService.off('left_the_game');
      socketService.off('on_game_restart');
      socketService.off('spectator_joined');
    };
  }, [myColor, isSpectator]);

  const handleCellClick = (row, col) => {
    if (!isSpectator && isMyTurn && isGameStarted && board[row][col] === 0) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = myColor;
      setBoard(newBoard);
      setIsMyTurn(false);
      socketService.updateGame({ board: newBoard, currentTurn: 3 - myColor });
      updateScores(newBoard);
      checkGameOver(newBoard);
    }
  };

  const updateScores = (currentBoard) => {
    const newScores = { 1: 0, 2: 0 };
    currentBoard.forEach(row => {
      row.forEach(cell => {
        if (cell !== 0) newScores[cell]++;
      });
    });
    setScores(newScores);
  };

  const checkGameOver = (currentBoard) => {
    if (currentBoard.every(row => row.every(cell => cell !== 0))) {
      setGameOver(true);
    }
  };

  const renderCell = (value, row, col) => {
    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${value === 1 ? 'black' : value === 2 ? 'white' : ''}`}
        onClick={() => handleCellClick(row, col)}
      />
    );
  };

  const renderBoard = () => {
    if (!Array.isArray(board)) {
      console.error("Board is not an array:", board);
      return <div>Error: Invalid board data</div>;
    }

    return (
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </div>
        ))}
      </div>
    );
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setIsGameStarted(true);
    setIsMyTurn(myColor === 1);
    setScores({ 1: 2, 2: 2 });
    setGameOver(false);
    setCurrentTurn(1);
  };

  const restartGame = () => {
    resetGame();
    socketService.restartGame();
  };

  return (
    <div className="game-container">
      <h2>Room: {roomName}</h2>
      {!isGameStarted ? (
        <p>Waiting for game to start...</p>
      ) : (
        <div>
          <p>Game has started!</p>
          {isSpectator ? (
            <p>You are spectating</p>
          ) : (
            <p>You are {myColor === 1 ? 'Black' : 'White'}</p>
          )}
          <p>{isSpectator ? `Current turn: ${currentTurn === 1 ? 'Black' : 'White'}` : (isMyTurn ? 'Your turn' : "Opponent's turn")}</p>
          <p>Black: {scores[1]} - White: {scores[2]}</p>
          {renderBoard()}
          {gameOver && (
            <div>
              <p>Game Over!</p>
              <p>{scores[1] > scores[2] ? 'Black' : 'White'} wins!</p>
              {!isSpectator && <button onClick={restartGame}>Play Again</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;