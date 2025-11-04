import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

type Cell = 'empty' | 'black' | 'white';

export default function Reversi() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Cell[][]>(() => {
    const initial = Array(8).fill(null).map(() => Array(8).fill('empty')) as Cell[][];
    initial[3][3] = 'white';
    initial[3][4] = 'black';
    initial[4][3] = 'black';
    initial[4][4] = 'white';
    return initial;
  });
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [score, setScore] = useState({ black: 2, white: 2 });

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  const isValidMove = (board: Cell[][], row: number, col: number, player: Cell): boolean => {
    if (board[row][col] !== 'empty') return false;
    
    const opponent = player === 'black' ? 'white' : 'black';
    
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let foundOpponent = false;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === 'empty') break;
        if (board[r][c] === opponent) {
          foundOpponent = true;
        } else if (board[r][c] === player && foundOpponent) {
          return true;
        } else {
          break;
        }
        r += dr;
        c += dc;
      }
    }
    
    return false;
  };

  const makeMove = (row: number, col: number) => {
    if (!isValidMove(board, row, col, currentPlayer)) return;
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    
    for (const [dr, dc] of directions) {
      const toFlip: [number, number][] = [];
      let r = row + dr;
      let c = col + dc;
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (newBoard[r][c] === 'empty') break;
        if (newBoard[r][c] === opponent) {
          toFlip.push([r, c]);
        } else if (newBoard[r][c] === currentPlayer) {
          toFlip.forEach(([fr, fc]) => {
            newBoard[fr][fc] = currentPlayer;
          });
          break;
        } else {
          break;
        }
        r += dr;
        c += dc;
      }
    }
    
    setBoard(newBoard);
    
    const blackCount = newBoard.flat().filter(c => c === 'black').length;
    const whiteCount = newBoard.flat().filter(c => c === 'white').length;
    setScore({ black: blackCount, white: whiteCount });
    
    setCurrentPlayer(opponent);
  };

  const startGame = () => {
    const initial = Array(8).fill(null).map(() => Array(8).fill('empty')) as Cell[][];
    initial[3][3] = 'white';
    initial[3][4] = 'black';
    initial[4][3] = 'black';
    initial[4][4] = 'white';
    setBoard(initial);
    setCurrentPlayer('black');
    setScore({ black: 2, white: 2 });
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 flex items-center justify-center p-4">
      <Card className="p-8 bg-green-900 border-yellow-600">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">РЕВЕРСИ (ОТЕЛЛО)</h2>
          <div className="flex gap-8 justify-center text-white text-xl">
            <p>⚫ Чёрные: {score.black}</p>
            <p>⚪ Белые: {score.white}</p>
          </div>
          <p className="text-yellow-300 mt-2">
            Ход: {currentPlayer === 'black' ? '⚫ Чёрных' : '⚪ Белых'}
          </p>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[600px] h-[600px] border-4 border-yellow-600 bg-green-700 mb-4 flex items-center justify-center">
              <div className="text-center text-yellow-400">
                <Icon name="Circle" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Классическая игра Реверси</p>
                <p className="text-sm mt-2">Переворачивайте фишки противника</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block bg-green-700 p-2 rounded-lg border-4 border-yellow-600 mb-4">
              <div className="grid grid-cols-8 gap-1">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isValid = isValidMove(board, rowIndex, colIndex, currentPlayer);
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => makeMove(rowIndex, colIndex)}
                        className={`
                          w-16 h-16 bg-green-600 border-2 border-green-800 flex items-center justify-center
                          cursor-pointer transition-all duration-200
                          ${isValid ? 'hover:bg-green-500 hover:border-yellow-400' : ''}
                        `}
                      >
                        {cell === 'black' && <div className="w-12 h-12 rounded-full bg-black" />}
                        {cell === 'white' && <div className="w-12 h-12 rounded-full bg-white" />}
                        {cell === 'empty' && isValid && (
                          <div className="w-8 h-8 rounded-full bg-yellow-400/30" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

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
