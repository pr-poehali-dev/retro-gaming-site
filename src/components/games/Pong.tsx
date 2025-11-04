import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const ballRef = useRef({ x: 400, y: 300, dx: 4, dy: 4, radius: 10 });
  const playerRef = useRef({ x: 20, y: 250, width: 10, height: 100 });
  const aiRef = useRef({ x: 770, y: 250, width: 10, height: 100 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const resetBall = () => {
      ballRef.current.x = 400;
      ballRef.current.y = 300;
      ballRef.current.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
      ballRef.current.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
    };

    const gameLoop = () => {
      if (!ctx || gameOver) return;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(400, 0);
      ctx.lineTo(400, 600);
      ctx.stroke();
      ctx.setLineDash([]);

      if (keysRef.current['ArrowUp'] && playerRef.current.y > 0) {
        playerRef.current.y -= 6;
      }
      if (keysRef.current['ArrowDown'] && playerRef.current.y < 500) {
        playerRef.current.y += 6;
      }

      const aiCenter = aiRef.current.y + 50;
      const ballY = ballRef.current.y;
      if (aiCenter < ballY - 30 && aiRef.current.y < 500) {
        aiRef.current.y += 4;
      } else if (aiCenter > ballY + 30 && aiRef.current.y > 0) {
        aiRef.current.y -= 4;
      }

      ctx.fillStyle = '#fff';
      ctx.fillRect(playerRef.current.x, playerRef.current.y, 10, 100);
      ctx.fillRect(aiRef.current.x, aiRef.current.y, 10, 100);

      ballRef.current.x += ballRef.current.dx;
      ballRef.current.y += ballRef.current.dy;

      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx.fill();

      if (ballRef.current.y <= 10 || ballRef.current.y >= 590) {
        ballRef.current.dy *= -1;
      }

      if (
        ballRef.current.x - ballRef.current.radius <= playerRef.current.x + 10 &&
        ballRef.current.y >= playerRef.current.y &&
        ballRef.current.y <= playerRef.current.y + 100
      ) {
        ballRef.current.dx *= -1.1;
        ballRef.current.x = playerRef.current.x + 10 + ballRef.current.radius;
      }

      if (
        ballRef.current.x + ballRef.current.radius >= aiRef.current.x &&
        ballRef.current.y >= aiRef.current.y &&
        ballRef.current.y <= aiRef.current.y + 100
      ) {
        ballRef.current.dx *= -1.1;
        ballRef.current.x = aiRef.current.x - ballRef.current.radius;
      }

      if (ballRef.current.x < 0) {
        setScore(s => {
          const newScore = { ...s, ai: s.ai + 1 };
          if (newScore.ai >= 10) setGameOver(true);
          return newScore;
        });
        resetBall();
      }

      if (ballRef.current.x > 800) {
        setScore(s => {
          const newScore = { ...s, player: s.player + 1 };
          if (newScore.player >= 10) setGameOver(true);
          return newScore;
        });
        resetBall();
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

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
    setScore({ player: 0, ai: 0 });
    ballRef.current = { x: 400, y: 300, dx: 4, dy: 4, radius: 10 };
    playerRef.current = { x: 20, y: 250, width: 10, height: 100 };
    aiRef.current = { x: 770, y: 250, width: 10, height: 100 };
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="p-8 bg-gray-900 border-white">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">ПОНГ</h2>
          <div className="flex justify-center gap-16 text-white text-2xl font-mono">
            <p>ИГРОК: {score.player}</p>
            <p>AI: {score.ai}</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-white mb-4" />
            <Button onClick={startGame} className="bg-white text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-white mt-4">↑ ↓ для движения</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-white mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              {score.player >= 10 ? 'ВЫ ПОБЕДИЛИ!' : 'AI ПОБЕДИЛ!'}
            </h3>
            <p className="text-white mb-4">Счёт: {score.player} - {score.ai}</p>
            <Button onClick={startGame} className="bg-white text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : (
          <canvas ref={canvasRef} width={800} height={600} className="border-2 border-white" />
        )}
      </Card>
    </div>
  );
}
