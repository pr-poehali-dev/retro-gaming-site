import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (squares: Player[]): Player | 'draw' | null => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) return 'draw';
    return null;
  };

  const botMove = (currentBoard: Player[]) => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null) as number[];
    
    if (emptyIndices.length === 0) return;
    
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(true);
    
    const result = checkWinner(newBoard);
    if (result) setWinner(result);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => botMove(board), 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner]);

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-arcade text-lg text-primary arcade-heading">
        Крестики-нолики
      </h2>
      
      {winner && (
        <Card className="p-4 bg-primary/20 neon-border animate-pulse-glow">
          <p className="font-arcade text-xs text-center">
            {winner === 'draw' ? 'НИЧЬЯ!' : `${winner === 'X' ? 'ВЫ' : 'БОТ'} ПОБЕДИЛ!`}
          </p>
        </Card>
      )}
      
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`
              aspect-square bg-card border-2 border-primary flex items-center justify-center
              font-arcade text-3xl transition-all duration-200 hover:bg-primary/20
              ${cell ? 'cursor-not-allowed' : 'cursor-pointer hover:neon-glow'}
              ${cell === 'X' ? 'text-secondary' : 'text-accent'}
            `}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <Button 
        onClick={reset}
        className="font-orbitron neon-border"
      >
        <Icon name="RotateCcw" size={16} className="mr-2" />
        Новая игра
      </Button>
    </div>
  );
}
