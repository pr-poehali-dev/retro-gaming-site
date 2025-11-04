import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface Pipe {
  x: number;
  gap: number;
  gapY: number;
  passed: boolean;
}

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const birdRef = useRef({ y: 250, velocity: 0, radius: 20 });
  const pipesRef = useRef<Pipe[]>([]);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleClick = () => {
      if (!gameOver) {
        birdRef.current.velocity = -8;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !gameOver) {
        e.preventDefault();
        birdRef.current.velocity = -8;
      }
    };

    const gameLoop = () => {
      if (!ctx || gameOver) return;

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCountRef.current++;
      
      if (frameCountRef.current % 90 === 0) {
        pipesRef.current.push({
          x: 400,
          gap: 150,
          gapY: Math.random() * 250 + 100,
          passed: false
        });
      }

      birdRef.current.velocity += 0.5;
      birdRef.current.y += birdRef.current.velocity;

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(80, birdRef.current.y, birdRef.current.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(90, birdRef.current.y - 5, 5, 0, Math.PI * 2);
      ctx.fill();

      if (birdRef.current.y + birdRef.current.radius > 600 || birdRef.current.y - birdRef.current.radius < 0) {
        setGameOver(true);
      }

      pipesRef.current = pipesRef.current.filter(pipe => {
        pipe.x -= 3;

        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, 60, pipe.gapY);
        ctx.fillRect(pipe.x, pipe.gapY + pipe.gap, 60, 600 - pipe.gapY - pipe.gap);

        if (
          80 + birdRef.current.radius > pipe.x &&
          80 - birdRef.current.radius < pipe.x + 60 &&
          (birdRef.current.y - birdRef.current.radius < pipe.gapY ||
           birdRef.current.y + birdRef.current.radius > pipe.gapY + pipe.gap)
        ) {
          setGameOver(true);
        }

        if (pipe.x + 60 < 80 && !pipe.passed) {
          pipe.passed = true;
          setScore(s => s + 1);
        }

        return pipe.x > -60;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    birdRef.current = { y: 250, velocity: 0, radius: 20 };
    pipesRef.current = [];
    frameCountRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="p-8 bg-blue-100 border-yellow-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-600 mb-2">FLAPPY BIRD</h2>
          <p className="text-2xl font-bold text-blue-800">СЧЁТ: {score}</p>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={400} height={600} className="border-4 border-yellow-500 mb-4" />
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="Bird" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-blue-800 mt-4">Клик или ПРОБЕЛ для прыжка</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={400} height={600} className="border-4 border-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-600 mb-4">GAME OVER</h3>
            <p className="text-blue-800 mb-4">Финальный счёт: {score}</p>
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : (
          <canvas ref={canvasRef} width={400} height={600} className="border-4 border-yellow-500" />
        )}
      </Card>
    </div>
  );
}
