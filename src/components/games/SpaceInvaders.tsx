import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface Position {
  x: number;
  y: number;
}

interface Alien extends Position {
  alive: boolean;
}

interface Bullet extends Position {
  active: boolean;
}

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lives, setLives] = useState(3);
  
  const playerRef = useRef({ x: 375, y: 550, width: 50, height: 30 });
  const aliensRef = useRef<Alien[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const alienBulletsRef = useRef<Bullet[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const alienDirectionRef = useRef(1);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initAliens = () => {
      aliensRef.current = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 11; col++) {
          aliensRef.current.push({
            x: col * 60 + 50,
            y: row * 50 + 50,
            alive: true
          });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ' && gameStarted && !gameOver) {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const shoot = () => {
      const existingBullet = bulletsRef.current.find(b => b.active);
      if (!existingBullet) {
        bulletsRef.current.push({
          x: playerRef.current.x + 25,
          y: playerRef.current.y,
          active: true
        });
      }
    };

    const alienShoot = () => {
      const aliveAliens = aliensRef.current.filter(a => a.alive);
      if (aliveAliens.length > 0 && Math.random() < 0.02) {
        const alien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBulletsRef.current.push({
          x: alien.x + 15,
          y: alien.y + 20,
          active: true
        });
      }
    };

    const gameLoop = () => {
      if (!ctx || gameOver) return;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (keysRef.current['ArrowLeft'] && playerRef.current.x > 0) {
        playerRef.current.x -= 5;
      }
      if (keysRef.current['ArrowRight'] && playerRef.current.x < canvas.width - 50) {
        playerRef.current.x += 5;
      }

      ctx.fillStyle = '#0f0';
      ctx.fillRect(playerRef.current.x, playerRef.current.y, 50, 30);

      let moveDown = false;
      let minX = Infinity, maxX = -Infinity;
      
      aliensRef.current.forEach(alien => {
        if (!alien.alive) return;
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(alien.x, alien.y, 40, 30);
        
        minX = Math.min(minX, alien.x);
        maxX = Math.max(maxX, alien.x);
      });

      if (maxX >= canvas.width - 40 || minX <= 0) {
        alienDirectionRef.current *= -1;
        moveDown = true;
      }

      aliensRef.current.forEach(alien => {
        if (!alien.alive) return;
        alien.x += alienDirectionRef.current * 2;
        if (moveDown) alien.y += 20;
        
        if (alien.y > 520) {
          setGameOver(true);
        }
      });

      bulletsRef.current.forEach(bullet => {
        if (!bullet.active) return;
        
        bullet.y -= 7;
        ctx.fillStyle = '#ff0';
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
        
        if (bullet.y < 0) bullet.active = false;
        
        aliensRef.current.forEach(alien => {
          if (alien.alive && bullet.active &&
              bullet.x > alien.x && bullet.x < alien.x + 40 &&
              bullet.y > alien.y && bullet.y < alien.y + 30) {
            alien.alive = false;
            bullet.active = false;
            setScore(s => s + 10);
          }
        });
      });

      alienShoot();
      
      alienBulletsRef.current.forEach(bullet => {
        if (!bullet.active) return;
        
        bullet.y += 5;
        ctx.fillStyle = '#f00';
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
        
        if (bullet.y > canvas.height) bullet.active = false;
        
        if (bullet.active &&
            bullet.x > playerRef.current.x && 
            bullet.x < playerRef.current.x + 50 &&
            bullet.y > playerRef.current.y && 
            bullet.y < playerRef.current.y + 30) {
          bullet.active = false;
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) setGameOver(true);
            return newLives;
          });
        }
      });

      const aliveAliens = aliensRef.current.filter(a => a.alive);
      if (aliveAliens.length === 0) {
        setScore(s => s + 100);
        initAliens();
        alienDirectionRef.current = 1;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    initAliens();
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
    playerRef.current = { x: 375, y: 550, width: 50, height: 30 };
    bulletsRef.current = [];
    alienBulletsRef.current = [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="p-8 bg-black/80 border-green-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-green-400 mb-2">КОСМИЧЕСКИЕ ЗАХВАТЧИКИ</h2>
          <div className="flex justify-center gap-8 text-white">
            <p>СЧЁТ: {score}</p>
            <p>ЖИЗНИ: {'❤️'.repeat(lives)}</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-green-500 mb-4" />
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-black font-bold">
              <Icon name="Rocket" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-green-400 mt-4">← → для движения, ПРОБЕЛ для стрельбы</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={800} height={600} className="border-2 border-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500 mb-4">GAME OVER</h3>
            <p className="text-white mb-4">Финальный счёт: {score}</p>
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-black font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : (
          <canvas ref={canvasRef} width={800} height={600} className="border-2 border-green-500" />
        )}
      </Card>
    </div>
  );
}
