import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD: Position = { x: 15, y: 15 };

export default function Snake() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore(s => s + 10);
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-arcade text-lg text-primary arcade-heading">
        Змейка
      </h2>

      <Card className="p-4 bg-primary/20 neon-border">
        <p className="font-arcade text-xs text-center">
          ОЧКИ: {score}
        </p>
      </Card>

      {gameOver && (
        <Card className="p-4 bg-destructive/20 neon-border animate-pulse-glow">
          <p className="font-arcade text-xs text-center">
            GAME OVER!
          </p>
        </Card>
      )}

      <div 
        className="relative bg-card border-4 border-primary neon-border"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {snake.map((segment, idx) => (
          <div
            key={idx}
            className="absolute bg-secondary"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              boxShadow: '0 0 10px hsl(var(--secondary))'
            }}
          />
        ))}
        
        <div
          className="absolute bg-accent animate-pulse-glow"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            boxShadow: '0 0 15px hsl(var(--accent))'
          }}
        />
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button 
          onClick={resetGame}
          className="font-orbitron neon-border"
        >
          <Icon name="Play" size={16} className="mr-2" />
          {isPlaying ? 'Рестарт' : 'Начать'}
        </Button>
        
        <div className="grid grid-cols-3 gap-1 w-32">
          <div />
          <Button size="sm" onClick={() => direction !== 'DOWN' && setDirection('UP')}>
            <Icon name="ArrowUp" size={16} />
          </Button>
          <div />
          
          <Button size="sm" onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}>
            <Icon name="ArrowLeft" size={16} />
          </Button>
          <div />
          <Button size="sm" onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}>
            <Icon name="ArrowRight" size={16} />
          </Button>
          
          <div />
          <Button size="sm" onClick={() => direction !== 'UP' && setDirection('DOWN')}>
            <Icon name="ArrowDown" size={16} />
          </Button>
          <div />
        </div>
      </div>
      
      <p className="text-xs font-orbitron text-muted-foreground text-center">
        Используй стрелки на клавиатуре для управления
      </p>
    </div>
  );
}
