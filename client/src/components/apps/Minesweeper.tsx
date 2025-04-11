
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export function Minesweeper() {
  const [boardSize] = useState({ rows: 9, cols: 9 });
  const [mineCount] = useState(10);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeBoard = () => {
    // Create empty board
    const newBoard: Cell[][] = Array(boardSize.rows).fill(null).map(() =>
      Array(boardSize.cols).fill(null).map(() => ({
        hasMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * boardSize.rows);
      const col = Math.floor(Math.random() * boardSize.cols);
      if (!newBoard[row][col].hasMine) {
        newBoard[row][col].hasMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < boardSize.rows; row++) {
      for (let col = 0; col < boardSize.cols; col++) {
        if (!newBoard[row][col].hasMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < boardSize.rows &&
                newCol >= 0 && newCol < boardSize.cols &&
                newBoard[newRow][newCol].hasMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board];
    if (board[row][col].hasMine) {
      // Game over if mine is clicked
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    // Reveal clicked cell and neighbors if empty
    const revealEmpty = (r: number, c: number) => {
      if (
        r < 0 || r >= boardSize.rows ||
        c < 0 || c >= boardSize.cols ||
        newBoard[r][c].isRevealed ||
        newBoard[r][c].isFlagged
      ) {
        return;
      }

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmpty(r + i, c + j);
          }
        }
      }
    };

    revealEmpty(row, col);
    setBoard(newBoard);

    // Check for win
    const unrevealedSafeCells = newBoard.flat().filter(
      cell => !cell.isRevealed && !cell.hasMine
    ).length;
    if (unrevealedSafeCells === 0) {
      setGameWon(true);
    }
  };

  const toggleFlag = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.hasMine) return '💣';
    return cell.neighborMines || '';
  };

  return (
    <div className="h-full flex flex-col items-center p-4 select-none">
      <div className="mb-4 space-x-2">
        <Button onClick={initializeBoard}>New Game</Button>
        <span className="text-lg ml-4">
          {gameOver ? '💥 Game Over!' : gameWon ? '🎉 You Win!' : '😊 Playing...'}
        </span>
      </div>
      <div className="grid gap-1 p-2 bg-secondary rounded-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 flex items-center justify-center font-bold
                  ${cell.isRevealed 
                    ? 'bg-background hover:bg-background'
                    : 'bg-accent hover:bg-accent/80'} 
                  ${cell.isRevealed && cell.neighborMines > 0 
                    ? `text-${cell.neighborMines}` 
                    : ''}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
