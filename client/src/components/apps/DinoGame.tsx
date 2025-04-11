
import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";

const GRAVITY = 1.5;
const JUMP_FORCE = -20;
const GROUND_Y = 250;
const OBSTACLE_SPEED = 6;

export function DinoGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoY, setDinoY] = useState(GROUND_Y);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<number[]>([]);
  
  const jump = useCallback(() => {
    if (dinoY === GROUND_Y) {
      setDinoVelocity(JUMP_FORCE);
    }
  }, [dinoY]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (!gameStarted) {
        setGameStarted(true);
      } else {
        jump();
      }
    }
  }, [gameStarted, jump]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setDinoY(y => {
        const newY = y + dinoVelocity;
        return Math.min(Math.max(newY, 0), GROUND_Y);
      });
      
      setDinoVelocity(v => {
        const newV = v + GRAVITY;
        return dinoY >= GROUND_Y ? 0 : newV;
      });

      setObstacles(prev => {
        let newObstacles = prev.map(x => x - OBSTACLE_SPEED);
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1] < 400) {
          newObstacles.push(800);
        }
        return newObstacles.filter(x => x > -50);
      });

      obstacles.forEach(obstacleX => {
        if (
          obstacleX > 50 && obstacleX < 100 &&
          dinoY > GROUND_Y - 50
        ) {
          setGameOver(true);
        }
      });

      setScore(s => s + 1);
    }, 1000/60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, dinoY, dinoVelocity, obstacles]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setDinoY(GROUND_Y);
    setDinoVelocity(0);
    setObstacles([]);
  };

  return (
    <div className="p-4 select-none" tabIndex={0}>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-xl font-bold">Score: {score}</div>
        <Button onClick={restartGame}>New Game</Button>
      </div>
      
      <div className="relative w-[800px] h-[300px] border-b-2 border-gray-400 bg-gradient-to-b from-sky-100 to-white">
        {/* Dino */}
        <div
          className="absolute"
          style={{ 
            bottom: `${300 - dinoY}px`,
            left: '50px',
            width: '40px',
            height: '50px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,80 L20,40 L40,20 L60,20 L80,40 L80,60 L60,80 Z' fill='%23535353'/%3E%3Ccircle cx='45' cy='35' r='5' fill='white'/%3E%3Cpath d='M20,80 L30,90 L40,80' fill='%23535353'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Obstacles */}
        {obstacles.map((x, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              bottom: '0px',
              left: `${x}px`,
              width: '20px',
              height: '40px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,20 L80,20 L80,80 L20,80 Z' fill='%23c43e3e'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            Press Space to Start
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-2xl font-bold">
            Game Over!
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Controls:<br />
        Space/Up Arrow - Jump
      </div>
    </div>
  );
}
