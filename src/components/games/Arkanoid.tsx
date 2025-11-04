import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface Brick {
  x: number;
  y: number;
  active: boolean;
  color: string;
}

export default function Arkanoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const paddleRef = useRef({ x: 350, width: 100, height: 20 });
  const ballRef = useRef({ x: 400, y: 500, dx: 3, dy: -3, radius: 8 });
  const bricksRef = useRef<Brick[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initBricks = () => {
      const colors = ['#f00', '#f80', '#ff0', '#0f0', '#00f', '#80f', '#f0f'];
      bricksRef.current = [];
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 10; col++) {
          bricksRef.current.push({
            x: col * 80 + 5,
            y: row * 30 + 50,
            active: true,
            color: colors[row]
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddleRef.current.x = Math.max(0, Math.min(mouseX - paddleRef.current.width / 2, 800 - paddleRef.current.width));
    };

    const gameLoop = () => {
      if (!ctx || gameOver || gameWon) return;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.fillRect(paddleRef.current.x, 570, paddleRef.current.width, paddleRef.current.height);

      ballRef.current.x += ballRef.current.dx;
      ballRef.current.y += ballRef.current.dy;

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx.fill();

      if (ballRef.current.x <= ballRef.current.radius || ballRef.current.x >= 800 - ballRef.current.radius) {
        ballRef.current.dx *= -1;
      }
      if (ballRef.current.y <= ballRef.current.radius) {
        ballRef.current.dy *= -1;
      }

      if (
        ballRef.current.y + ballRef.current.radius >= 570 &&
        ballRef.current.x >= paddleRef.current.x &&
        ballRef.current.x <= paddleRef.current.x + paddleRef.current.width
      ) {
        ballRef.current.dy = -Math.abs(ballRef.current.dy);
        const hitPos = (ballRef.current.x - paddleRef.current.x) / paddleRef.current.width;
        ballRef.current.dx = (hitPos - 0.5) * 8;
      }

      if (ballRef.current.y > 600) {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameOver(true);
          } else {
            ballRef.current.x = 400;
            ballRef.current.y = 500;
            ballRef.current.dx = 3;
            ballRef.current.dy = -3;
          }
          return newLives;
        });
      }

      bricksRef.current.forEach(brick => {
        if (!brick.active) return;

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, 70, 25);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(brick.x, brick.y, 70, 25);

        if (
          ballRef.current.x + ballRef.current.radius > brick.x &&
          ballRef.current.x - ballRef.current.radius < brick.x + 70 &&
          ballRef.current.y + ballRef.current.radius > brick.y &&
          ballRef.current.y - ballRef.current.radius < brick.y + 25
        ) {
          brick.active = false;
          ballRef.current.dy *= -1;
          setScore(s => s + 10);
        }
      });

      const activeBricks = bricksRef.current.filter(b => b.active).length;
      if (activeBricks === 0) {
        setGameWon(true);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    initBricks();
    canvas.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWon]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
    paddleRef.current = { x: 350, width: 100, height: 20 };
    ballRef.current = { x: 400, y: 500, dx: 3, dy: -3, radius: 8 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="p-8 bg-black/80 border-cyan-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">АРКАНОИД</h2>
          <div className="flex justify-center gap-8 text-white">
            <p>СЧЁТ: {score}</p>
            <p>ЖИЗНИ: {'❤️'.repeat(lives)}</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-cyan-500 mb-4" />
            <Button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-cyan-400 mt-4">Управление мышью</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500 mb-4">GAME OVER</h3>
            <p className="text-white mb-4">Финальный счёт: {score}</p>
            <Button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : gameWon ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-green-500 mb-4">ПОБЕДА! 🎉</h3>
            <p className="text-white mb-4">Финальный счёт: {score}</p>
            <Button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              НОВАЯ ИГРА
            </Button>
          </div>
        ) : (
          <canvas ref={canvasRef} width={800} height={600} className="border-2 border-cyan-500" />
        )}
      </Card>
    </div>
  );
}
