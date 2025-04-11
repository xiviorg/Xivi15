
import { useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' },
};

export function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][]; color: string } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
  }

  const spawnPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const pieceKey = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOS;
    const newPiece = TETROMINOS[pieceKey];
    setCurrentPiece(newPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  }, []);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused) return;
    
    if (isValidMove(currentPiece.shape, position.x, position.y + 1)) {
      setPosition(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      mergePiece();
      const newScore = checkLines();
      setScore(prev => prev + newScore * 100);
      spawnPiece();
    }
  }, [currentPiece, position, isPaused]);

  interface Position {
    x: number;
    y: number;
  }

  interface Tetromino {
    shape: number[][];
    color: string;
  }

  function isValidMove(shape: number[][], newX: number, newY: number): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function mergePiece() {
    if (!currentPiece) return;
    const newBoard = [...board];
    let isGameOver = false;
    
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value && position.y + y <= 0) {
          isGameOver = true;
        }
        if (value) {
          const boardY = position.y + y;
          if (boardY < 0) {
            setGameOver(true);
            return;
          }
          newBoard[boardY][position.x + x] = currentPiece.color;
        }
      });
    });
    setBoard(newBoard);
    if (isGameOver) {
      setGameOver(true);
    }
  }

  function checkLines() {
    let lines = 0;
    const newBoard = board.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) lines++;
      return !isFull;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    setBoard(newBoard);
    return lines;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!currentPiece || gameOver || isPaused) return;
    
    // Prevent scrolling with arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (isValidMove(currentPiece.shape, position.x - 1, position.y)) {
          setPosition(prev => ({ ...prev, x: prev.x - 1 }));
        }
        break;
      case 'ArrowRight':
        if (isValidMove(currentPiece.shape, position.x + 1, position.y)) {
          setPosition(prev => ({ ...prev, x: prev.x + 1 }));
        }
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        const rotated = currentPiece.shape[0].map((_, i) =>
          currentPiece.shape.map(row => row[i]).reverse()
        );
        if (isValidMove(rotated, position.x, position.y)) {
          setCurrentPiece({ ...currentPiece, shape: rotated });
        }
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
    }
  }

  const startNewGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    spawnPiece();
  };

  useEffect(() => {
    spawnPiece();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, position, gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(moveDown, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [currentPiece, position, board, gameOver, isPaused]);

  return (
    <div className="p-4 flex flex-col items-center" tabIndex={0}>
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <Button onClick={startNewGame}>New Game</Button>
          <Button onClick={() => setIsPaused(p => !p)}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
        <div className="text-lg">Score: {score}</div>
        <div className="text-sm text-muted-foreground">
          Controls:<br/>
          ↑ - Rotate<br/>
          ← → - Move left/right<br/>
          ↓ - Move down<br/>
          Space - Pause/Resume
        </div>
      </div>
      <div 
        className="grid gap-px bg-gray-800 p-2 rounded"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 20px)`,
        }}
      >
        {board.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="w-5 h-5"
              style={{
                backgroundColor: cell || (
                  currentPiece &&
                  y >= position.y &&
                  y < position.y + currentPiece.shape.length &&
                  x >= position.x &&
                  x < position.x + currentPiece.shape[0].length &&
                  currentPiece.shape[y - position.y]?.[x - position.x]
                    ? currentPiece.color
                    : '#1a1a1a'
                ),
              }}
            />
          ))
        )}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <div className="mb-2">Game Over!</div>
          <Button onClick={startNewGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
