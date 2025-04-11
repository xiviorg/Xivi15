
import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';

export function WhackAMole() {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [activeMole, setActiveMole] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(30);

  const whackMole = (index: number) => {
    if (index === activeMole && gameActive) {
      setScore(score + 1);
      setActiveMole(-1);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
  };

  const moveMole = useCallback(() => {
    if (gameActive) {
      setActiveMole(Math.floor(Math.random() * 9));
    }
  }, [gameActive]);

  useEffect(() => {
    if (gameActive) {
      const moleInterval = setInterval(moveMole, 1000);
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameActive(false);
            clearInterval(moleInterval);
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(moleInterval);
        clearInterval(timerInterval);
      };
    }
  }, [gameActive, moveMole]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full">
        <h2 className="text-xl font-bold">Whack-a-Mole</h2>
        <div className="space-x-4">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-[300px] h-[300px]">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            onClick={() => whackMole(index)}
            className={`w-full h-[100px] rounded-lg shadow-inner ${
              activeMole === index
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 hover:bg-gray-400'
            } transition-colors`}
          />
        ))}
      </div>

      {!gameActive && (
        <Button onClick={startGame}>
          {timeLeft === 30 ? 'Start Game' : 'Play Again'}
        </Button>
      )}
    </div>
  );
}
