import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
];

const COLORS = ['#00f', '#ff0', '#f0f', '#0ff', '#f80', '#0f0', '#f00'];

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const boardRef = useRef<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const currentPieceRef = useRef<Piece | null>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropIntervalRef = useRef<number>(800);

  const createPiece = useCallback((): Piece => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      x: Math.floor(COLS / 2) - 1,
      y: 0,
      color: COLORS[shapeIndex]
    };
  }, []);

  const checkCollision = useCallback((piece: Piece, offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && boardRef.current[newY][newX]) return true;
        }
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback((piece: Piece) => {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            boardRef.current[boardY][boardX] = piece.color;
          }
        }
      });
    });
  }, []);

  const clearLines = useCallback(() => {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (boardRef.current[y].every(cell => cell !== '')) {
        boardRef.current.splice(y, 1);
        boardRef.current.unshift(Array(COLS).fill(''));
        linesCleared++;
        y++;
      }
    }
    
    if (linesCleared > 0) {
      setLines(l => l + linesCleared);
      setScore(s => s + linesCleared * 100 * linesCleared);
      dropIntervalRef.current = Math.max(100, 800 - Math.floor(lines / 10) * 50);
    }
  }, [lines]);

  const rotatePiece = useCallback(() => {
    if (!currentPieceRef.current || isPaused) return;
    
    const rotated = currentPieceRef.current.shape[0].map((_, i) =>
      currentPieceRef.current!.shape.map(row => row[i]).reverse()
    );
    
    const rotatedPiece = { ...currentPieceRef.current, shape: rotated };
    
    if (!checkCollision(rotatedPiece)) {
      currentPieceRef.current.shape = rotated;
    }
  }, [checkCollision, isPaused]);

  const movePiece = useCallback((dx: number) => {
    if (!currentPieceRef.current || isPaused) return;
    
    if (!checkCollision(currentPieceRef.current, dx, 0)) {
      currentPieceRef.current.x += dx;
    }
  }, [checkCollision, isPaused]);

  const dropPiece = useCallback(() => {
    if (!currentPieceRef.current || isPaused) return;
    
    if (!checkCollision(currentPieceRef.current, 0, 1)) {
      currentPieceRef.current.y += 1;
    } else {
      mergePiece(currentPieceRef.current);
      clearLines();
      currentPieceRef.current = createPiece();
      
      if (checkCollision(currentPieceRef.current)) {
        setGameOver(true);
      }
    }
  }, [checkCollision, mergePiece, clearLines, createPiece, isPaused]);

  const hardDrop = useCallback(() => {
    if (!currentPieceRef.current || isPaused) return;
    
    while (!checkCollision(currentPieceRef.current, 0, 1)) {
      currentPieceRef.current.y += 1;
    }
    dropPiece();
  }, [checkCollision, dropPiece, isPaused]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(p => !p);
        return;
      }
      
      if (isPaused) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, isPaused, movePiece, dropPiece, rotatePiece, hardDrop]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime > dropIntervalRef.current) {
        dropPiece();
        lastTimeRef.current = currentTime;
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#333';
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }

      boardRef.current.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        });
      });

      if (currentPieceRef.current) {
        ctx.fillStyle = currentPieceRef.current.color;
        currentPieceRef.current.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              const drawX = (currentPieceRef.current!.x + x) * BLOCK_SIZE;
              const drawY = (currentPieceRef.current!.y + y) * BLOCK_SIZE;
              ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
              ctx.strokeStyle = '#000';
              ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, dropPiece]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setIsPaused(false);
    boardRef.current = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
    currentPieceRef.current = createPiece();
    lastTimeRef.current = 0;
    dropIntervalRef.current = 800;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center p-4">
      <Card className="p-8 bg-black/80 border-purple-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-purple-400 mb-2">ТЕТРИС</h2>
          <div className="flex justify-center gap-8 text-white">
            <p>СЧЁТ: {score}</p>
            <p>ЛИНИЙ: {lines}</p>
            <p>УРОВЕНЬ: {Math.floor(lines / 10) + 1}</p>
          </div>
          {isPaused && <p className="text-yellow-400 mt-2">ПАУЗА</p>}
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="border-2 border-purple-500 mb-4" />
            <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <div className="text-purple-400 text-sm mt-4 space-y-1">
              <p>← → для движения</p>
              <p>↑ для вращения</p>
              <p>↓ быстрое падение</p>
              <p>ПРОБЕЛ мгновенный сброс</p>
              <p>P для паузы</p>
            </div>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="border-2 border-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500 mb-4">GAME OVER</h3>
            <p className="text-white mb-2">Финальный счёт: {score}</p>
            <p className="text-white mb-4">Линий: {lines}</p>
            <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="border-2 border-purple-500 mb-4" />
            <Button 
              onClick={() => setIsPaused(p => !p)} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              <Icon name={isPaused ? "Play" : "Pause"} className="mr-2" />
              {isPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
