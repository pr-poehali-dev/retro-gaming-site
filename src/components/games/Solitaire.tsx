import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface CardType {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  faceUp: boolean;
  color: 'red' | 'black';
}

export default function Solitaire() {
  const [gameStarted, setGameStarted] = useState(false);
  const [piles] = useState<CardType[][]>([]);
  const [moves, setMoves] = useState(0);

  const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = (): CardType[] => {
    const deck: CardType[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        deck.push({
          suit,
          value,
          faceUp: false,
          color: suit === '♥' || suit === '♦' ? 'red' : 'black'
        });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameStarted(true);
    setMoves(0);
    createDeck();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-900 flex items-center justify-center p-4">
      <Card className="p-8 bg-green-800/90 border-yellow-600">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">ПАСЬЯНС КОСЫНКА</h2>
          <p className="text-white">Ходов: {moves}</p>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[800px] h-[600px] border-4 border-yellow-600 bg-green-900 mb-4 flex items-center justify-center">
              <div className="text-center text-yellow-400">
                <Icon name="Spade" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Классический пасьянс Косынка</p>
                <p className="text-sm mt-2">Как в Windows 95</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-[800px] h-[600px] border-4 border-yellow-600 bg-green-900 mb-4 flex items-center justify-center">
              <div className="text-yellow-400">
                <Icon name="Construction" size={48} className="mx-auto mb-4" />
                <p className="text-xl">Пасьянс в разработке</p>
                <p className="text-sm mt-2">Полная версия скоро появится</p>
              </div>
            </div>
            <Button onClick={() => setGameStarted(false)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Icon name="ArrowLeft" className="mr-2" />
              ВЕРНУТЬСЯ
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
