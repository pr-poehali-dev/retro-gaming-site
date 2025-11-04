import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

export default function Sudoku() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [grid, setGrid] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );

  const generatePuzzle = () => {
    const newGrid = Array(9).fill(null).map(() => Array(9).fill(0));
    for (let i = 0; i < 20; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const num = Math.floor(Math.random() * 9) + 1;
      newGrid[row][col] = num;
    }
    setGrid(newGrid);
  };

  const startGame = () => {
    setGameStarted(true);
    generatePuzzle();
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const newGrid = [...grid];
    newGrid[selectedCell.row][selectedCell.col] = num;
    setGrid(newGrid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-blue-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">СУДОКУ</h2>
          <p className="text-gray-600">Японская головоломка</p>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[500px] h-[500px] border-4 border-blue-500 bg-white mb-4 flex items-center justify-center">
              <div className="text-center text-blue-600">
                <Icon name="Grid3x3" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Классическая игра Судоку</p>
                <p className="text-sm mt-2">Заполните сетку числами от 1 до 9</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block border-4 border-blue-600 bg-white mb-4">
              <div className="grid grid-cols-9">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer
                        ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-blue-200' : 'hover:bg-gray-100'}
                        ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-blue-600' : ''}
                        ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-blue-600' : ''}
                      `}
                    >
                      <span className="text-xl font-bold text-blue-800">
                        {cell !== 0 ? cell : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <Button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {num}
                </Button>
              ))}
              <Button
                onClick={() => handleNumberInput(0)}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white"
              >
                <Icon name="X" />
              </Button>
            </div>

            <Button onClick={() => setGameStarted(false)} className="bg-gray-500 hover:bg-gray-600 text-white">
              <Icon name="ArrowLeft" className="mr-2" />
              ВЕРНУТЬСЯ
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
