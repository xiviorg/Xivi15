
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export function Game2048() {
  const [board, setBoard] = useState<number[][]>([[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    addNumber();
    addNumber();
  }, []);

  const addNumber = () => {
    const newBoard = [...board];
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) empty.push([i, j]);
      }
    }
    if (empty.length) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
      setBoard(newBoard);
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newBoard = [...board.map(row => [...row])];
    let moved = false;
    let newScore = score;

    const merge = (arr: number[]) => {
      const filtered = arr.filter(n => n !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) filtered.push(0);
      return filtered;
    };

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i];
        const merged = direction === 'left' ? merge([...row]) : merge([...row].reverse()).reverse();
        if (JSON.stringify(row) !== JSON.stringify(merged)) moved = true;
        newBoard[i] = merged;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = newBoard.map(row => row[j]);
        const merged = direction === 'up' ? merge([...col]) : merge([...col].reverse()).reverse();
        if (JSON.stringify(col) !== JSON.stringify(merged)) moved = true;
        merged.forEach((val, i) => newBoard[i][j] = val);
      }
    }

    if (moved) {
      setBoard(newBoard);
      setScore(newScore);
      addNumber();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, gameOver]);

  return (
    <div className="p-4 select-none">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">2048</h2>
        <div className="text-xl">Score: {score}</div>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        {board.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className="w-16 h-16 flex items-center justify-center rounded bg-background font-bold text-lg"
                style={{
                  backgroundColor: cell ? `hsl(${Math.log2(cell) * 30}, 70%, 70%)` : undefined
                }}
              >
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Use arrow keys to play</p>
      </div>
    </div>
  );
}
