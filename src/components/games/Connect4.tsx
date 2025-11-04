import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

type Cell = 'empty' | 'red' | 'yellow';

export default function Connect4() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Cell[][]>(
    Array(6).fill(null).map(() => Array(7).fill('empty'))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
  const [winner, setWinner] = useState<'red' | 'yellow' | 'draw' | null>(null);
  const [moves, setMoves] = useState(0);

  const checkWinner = (board: Cell[][], row: number, col: number, player: Cell): boolean => {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
      let count = 1;
      
      for (let i = 1; i < 4; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++;
        } else break;
      }
      
      for (let i = 1; i < 4; i++) {
        const newRow = row - dr * i;
        const newCol = col - dc * i;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++;
        } else break;
      }
      
      if (count >= 4) return true;
    }
    
    return false;
  };

  const dropPiece = (col: number) => {
    if (winner) return;

    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === 'empty') {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setMoves(m => m + 1);

        if (checkWinner(newBoard, row, col, currentPlayer)) {
          setWinner(currentPlayer);
        } else if (moves + 1 === 42) {
          setWinner('draw');
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        return;
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setBoard(Array(6).fill(null).map(() => Array(7).fill('empty')));
    setCurrentPlayer('red');
    setWinner(null);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <Card className="p-8 bg-blue-900 border-yellow-500">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">4 В РЯД</h2>
          {!winner && (
            <p className="text-white text-xl">
              Ход: <span className={currentPlayer === 'red' ? 'text-red-400' : 'text-yellow-400'}>
                {currentPlayer === 'red' ? '🔴 КРАСНЫЙ' : '🟡 ЖЁЛТЫЙ'}
              </span>
            </p>
          )}
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[600px] h-[520px] border-4 border-yellow-500 bg-blue-800 mb-4 flex items-center justify-center">
              <div className="text-center text-yellow-400">
                <Icon name="Circle" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Классическая игра 4 в ряд</p>
                <p className="text-sm mt-2">Собери 4 фишки в ряд</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block bg-blue-600 p-4 rounded-lg border-4 border-yellow-500 mb-4">
              <div className="grid grid-cols-7 gap-2">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => !winner && dropPiece(colIndex)}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center cursor-pointer
                        transition-all duration-200
                        ${cell === 'empty' ? 'bg-white hover:bg-gray-200' : ''}
                        ${cell === 'red' ? 'bg-red-500' : ''}
                        ${cell === 'yellow' ? 'bg-yellow-400' : ''}
                      `}
                    >
                      {cell === 'red' && '🔴'}
                      {cell === 'yellow' && '🟡'}
                    </div>
                  ))
                )}
              </div>
            </div>

            {winner && (
              <div className="mb-4 text-yellow-400">
                <h3 className="text-2xl font-bold">
                  {winner === 'draw' ? 'НИЧЬЯ!' : `ПОБЕДА ${winner === 'red' ? '🔴 КРАСНЫХ' : '🟡 ЖЁЛТЫХ'}!`}
                </h3>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <Icon name="RotateCcw" className="mr-2" />
                НОВАЯ ИГРА
              </Button>
              <Button onClick={() => setGameStarted(false)} className="bg-gray-500 hover:bg-gray-600 text-white">
                <Icon name="ArrowLeft" className="mr-2" />
                ВЕРНУТЬСЯ
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
