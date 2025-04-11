
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

type Position = { x: number; y: number };

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'up': head.y -= 1; break;
      case 'down': head.y += 1; break;
      case 'left': head.x -= 1; break;
      case 'right': head.x += 1; break;
    }

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isPlaying) return;
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp': if (direction !== 'down') setDirection('up'); break;
      case 'ArrowDown': if (direction !== 'up') setDirection('down'); break;
      case 'ArrowLeft': if (direction !== 'right') setDirection('left'); break;
      case 'ArrowRight': if (direction !== 'left') setDirection('right'); break;
    }
  };

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = 'lime';
    snake.forEach(({ x, y }) => {
      ctx.fillRect(x * 20, y * 20, 18, 18);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
  }, [snake, food]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const interval = setInterval(moveSnake, speed);
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        clearInterval(interval);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [snake, direction, gameOver, speed, isPlaying]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full">
        <h2 className="text-xl font-bold">Snake Game</h2>
        <span className="text-xl">Score: {score}</span>
      </div>
      <div className="flex items-center gap-4 w-full max-w-md">
        <span>Speed:</span>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(200 - value[0])}
          min={20}
          max={180}
          step={10}
          className="flex-1"
          disabled={isPlaying}
        />
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-400"
      />
      {(!isPlaying || gameOver) && (
        <div className="text-center">
          {gameOver && <h3 className="text-xl text-red-500 mb-2">Game Over!</h3>}
          <Button onClick={startGame}>
            {gameOver ? 'Play Again' : 'Start Game'}
          </Button>
        </div>
      )}
    </div>
  );
}
