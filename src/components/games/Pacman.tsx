import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

const CELL_SIZE = 30;
const ROWS = 15;
const COLS = 20;

interface Ghost {
  x: number;
  y: number;
  color: string;
}

export default function Pacman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const pacmanRef = useRef({ x: 1, y: 1, direction: 'right', mouthOpen: true });
  const ghostsRef = useRef<Ghost[]>([
    { x: 9, y: 7, color: '#f00' },
    { x: 10, y: 7, color: '#f0f' },
    { x: 9, y: 8, color: '#0ff' },
    { x: 10, y: 8, color: '#f80' }
  ]);
  const mazeRef = useRef<number[][]>([]);
  const dotsRef = useRef<boolean[][]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initMaze = () => {
      const maze = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
      const dots = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (y === 0 || y === ROWS - 1 || x === 0 || x === COLS - 1) {
            maze[y][x] = 1;
          } else if ((x % 4 === 0 || y % 4 === 0) && Math.random() > 0.3) {
            maze[y][x] = 1;
          } else {
            dots[y][x] = true;
          }
        }
      }

      dots[1][1] = false;
      dots[9][7] = false;
      dots[10][7] = false;
      dots[9][8] = false;
      dots[10][8] = false;

      mazeRef.current = maze;
      dotsRef.current = dots;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const canMove = (x: number, y: number): boolean => {
      if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return false;
      return mazeRef.current[y][x] === 0;
    };

    const gameLoop = () => {
      if (!ctx || gameOver) return;

      frameCountRef.current++;

      if (frameCountRef.current % 10 === 0) {
        pacmanRef.current.mouthOpen = !pacmanRef.current.mouthOpen;
      }

      if (frameCountRef.current % 5 === 0) {
        let newX = pacmanRef.current.x;
        let newY = pacmanRef.current.y;

        if (keysRef.current['ArrowUp'] && canMove(pacmanRef.current.x, pacmanRef.current.y - 1)) {
          newY--;
          pacmanRef.current.direction = 'up';
        } else if (keysRef.current['ArrowDown'] && canMove(pacmanRef.current.x, pacmanRef.current.y + 1)) {
          newY++;
          pacmanRef.current.direction = 'down';
        } else if (keysRef.current['ArrowLeft'] && canMove(pacmanRef.current.x - 1, pacmanRef.current.y)) {
          newX--;
          pacmanRef.current.direction = 'left';
        } else if (keysRef.current['ArrowRight'] && canMove(pacmanRef.current.x + 1, pacmanRef.current.y)) {
          newX++;
          pacmanRef.current.direction = 'right';
        }

        pacmanRef.current.x = newX;
        pacmanRef.current.y = newY;

        if (dotsRef.current[newY][newX]) {
          dotsRef.current[newY][newX] = false;
          setScore(s => s + 10);
        }
      }

      if (frameCountRef.current % 10 === 0) {
        ghostsRef.current.forEach(ghost => {
          const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
          ].filter(d => canMove(ghost.x + d.dx, ghost.y + d.dy));

          if (directions.length > 0) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            ghost.x += dir.dx;
            ghost.y += dir.dy;
          }

          if (ghost.x === pacmanRef.current.x && ghost.y === pacmanRef.current.y) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameOver(true);
              } else {
                pacmanRef.current.x = 1;
                pacmanRef.current.y = 1;
              }
              return newLives;
            });
          }
        });
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (mazeRef.current[y][x] === 1) {
            ctx.fillStyle = '#00f';
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
          
          if (dotsRef.current[y][x]) {
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      const px = pacmanRef.current.x * CELL_SIZE + CELL_SIZE / 2;
      const py = pacmanRef.current.y * CELL_SIZE + CELL_SIZE / 2;
      const radius = CELL_SIZE / 2 - 2;
      
      if (pacmanRef.current.mouthOpen) {
        const angle = pacmanRef.current.direction === 'right' ? 0 :
                      pacmanRef.current.direction === 'left' ? Math.PI :
                      pacmanRef.current.direction === 'up' ? -Math.PI / 2 : Math.PI / 2;
        ctx.arc(px, py, radius, angle + 0.2, angle - 0.2);
        ctx.lineTo(px, py);
      } else {
        ctx.arc(px, py, radius, 0, Math.PI * 2);
      }
      ctx.fill();

      ghostsRef.current.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        const gx = ghost.x * CELL_SIZE + CELL_SIZE / 2;
        const gy = ghost.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.beginPath();
        ctx.arc(gx, gy, CELL_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(gx + CELL_SIZE / 2 - 2, gy + CELL_SIZE / 2);
        ctx.lineTo(gx + CELL_SIZE / 4, gy);
        ctx.lineTo(gx, gy + CELL_SIZE / 2);
        ctx.lineTo(gx - CELL_SIZE / 4, gy);
        ctx.lineTo(gx - CELL_SIZE / 2 + 2, gy + CELL_SIZE / 2);
        ctx.closePath();
        ctx.fill();
      });

      const dotsLeft = dotsRef.current.flat().filter(d => d).length;
      if (dotsLeft === 0) {
        setGameOver(true);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    initMaze();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    pacmanRef.current = { x: 1, y: 1, direction: 'right', mouthOpen: true };
    ghostsRef.current = [
      { x: 9, y: 7, color: '#f00' },
      { x: 10, y: 7, color: '#f0f' },
      { x: 9, y: 8, color: '#0ff' },
      { x: 10, y: 8, color: '#f80' }
    ];
    frameCountRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="p-8 bg-gray-900 border-yellow-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">ПАКМАН</h2>
          <div className="flex justify-center gap-8 text-white">
            <p>СЧЁТ: {score}</p>
            <p>ЖИЗНИ: {'❤️'.repeat(lives)}</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={COLS * CELL_SIZE} height={ROWS * CELL_SIZE} className="border-2 border-yellow-500 mb-4" />
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-yellow-400 mt-4">Стрелки для движения</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={COLS * CELL_SIZE} height={ROWS * CELL_SIZE} className="border-2 border-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              {lives === 0 ? 'GAME OVER' : 'ПОБЕДА! 🎉'}
            </h3>
            <p className="text-white mb-4">Финальный счёт: {score}</p>
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : (
          <canvas ref={canvasRef} width={COLS * CELL_SIZE} height={ROWS * CELL_SIZE} className="border-2 border-yellow-500" />
        )}
      </Card>
    </div>
  );
}
