import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

const ROWS = 10;
const COLS = 10;
const MINES = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES);

  const createGrid = (): Cell[][] => {
    const newGrid: Cell[][] = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (newGrid[newRow][newCol].isMine) count++;
              }
            }
          }
          newGrid[row][col].neighborMines = count;
        }
      }
    }

    return newGrid;
  };

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon) return;
    if (grid[row][col].isRevealed || grid[row][col].isFlagged) return;

    const newGrid = [...grid.map(r => [...r])];
    
    if (newGrid[row][col].isMine) {
      newGrid[row][col].isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      if (newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) return;
      
      newGrid[r][c].isRevealed = true;
      
      if (newGrid[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setGrid(newGrid);

    const revealedCount = newGrid.flat().filter(c => c.isRevealed).length;
    if (revealedCount === ROWS * COLS - MINES) {
      setGameWon(true);
    }
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[row][col].isRevealed) return;

    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
    setFlagsLeft(prev => newGrid[row][col].isFlagged ? prev - 1 : prev + 1);
  };

  const startGame = () => {
    const newGrid = createGrid();
    setGrid(newGrid);
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setFlagsLeft(MINES);
  };

  const getCellColor = (cell: Cell): string => {
    if (!cell.isRevealed) return 'bg-gray-400';
    if (cell.isMine) return 'bg-red-600';
    return 'bg-gray-200';
  };

  const getCellText = (cell: Cell): string => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  const getNumberColor = (num: number): string => {
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600', 'text-yellow-600', 'text-pink-600', 'text-black', 'text-gray-600'];
    return colors[num] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-400 to-gray-600 flex items-center justify-center p-4">
      <Card className="p-8 bg-gray-300 border-gray-700">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">САПЁР</h2>
          <div className="flex justify-center gap-8 text-gray-800">
            <p>💣 МИН: {MINES}</p>
            <p>🚩 ФЛАГОВ: {flagsLeft}</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[500px] h-[500px] border-4 border-gray-700 bg-gray-400 mb-4 flex items-center justify-center">
              <div className="text-center text-gray-800">
                <Icon name="Bomb" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Классический Сапёр</p>
                <p className="text-sm mt-2">Как в Windows 95</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-gray-700 hover:bg-gray-800 text-white font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
            <p className="text-gray-800 mt-4 text-sm">ЛКМ - открыть, ПКМ - флаг</p>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <div className="inline-block border-4 border-red-700 p-2 mb-4">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 border-2 border-gray-600 flex items-center justify-center cursor-not-allowed ${getCellColor(cell)}`}
                    >
                      <span className="font-bold">{getCellText(cell)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">ВЗРЫВ! 💥</h3>
            <Button onClick={startGame} className="bg-gray-700 hover:bg-gray-800 text-white font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              ИГРАТЬ СНОВА
            </Button>
          </div>
        ) : gameWon ? (
          <div className="text-center">
            <div className="inline-block border-4 border-green-700 p-2 mb-4">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 border-2 border-gray-600 flex items-center justify-center ${getCellColor(cell)}`}
                    >
                      <span className={`font-bold ${getNumberColor(cell.neighborMines)}`}>
                        {getCellText(cell)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-4">ПОБЕДА! 🎉</h3>
            <Button onClick={startGame} className="bg-gray-700 hover:bg-gray-800 text-white font-bold">
              <Icon name="RotateCcw" className="mr-2" />
              НОВАЯ ИГРА
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block border-4 border-gray-700 p-2 mb-4">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => revealCell(rowIndex, colIndex)}
                      onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                      className={`w-12 h-12 border-2 border-gray-600 flex items-center justify-center cursor-pointer hover:brightness-110 ${getCellColor(cell)}`}
                    >
                      <span className={`font-bold ${getNumberColor(cell.neighborMines)}`}>
                        {getCellText(cell)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
