import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface CardItem {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export default function Memory() {
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🥝', '🍑'];

  const initGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = flippedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) =>
            idx === first || idx === second ? { ...card, matched: true } : card
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) =>
            idx === first || idx === second ? { ...card, flipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    
    setCards(prev => prev.map((card, idx) =>
      idx === index ? { ...card, flipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const startGame = () => {
    setGameStarted(true);
    initGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600 flex items-center justify-center p-4">
      <Card className="p-8 bg-purple-100 border-purple-800">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">ПАМЯТЬ</h2>
          <div className="flex gap-8 justify-center text-purple-800">
            <p>Ходов: {moves}</p>
            <p>Пар найдено: {matches}/8</p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="w-[600px] h-[500px] border-4 border-purple-800 bg-purple-200 mb-4 flex items-center justify-center">
              <div className="text-center text-purple-800">
                <Icon name="Brain" size={64} className="mx-auto mb-4" />
                <p className="text-xl">Игра на память</p>
                <p className="text-sm mt-2">Найдите все пары карточек</p>
              </div>
            </div>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
              <Icon name="Play" className="mr-2" />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`
                    w-32 h-32 rounded-lg flex items-center justify-center text-5xl cursor-pointer
                    transition-all duration-300 transform hover:scale-105
                    ${card.flipped || card.matched 
                      ? 'bg-white' 
                      : 'bg-purple-600 hover:bg-purple-700'}
                    ${card.matched ? 'opacity-50' : ''}
                  `}
                >
                  {card.flipped || card.matched ? card.emoji : '?'}
                </div>
              ))}
            </div>

            {matches === 8 && (
              <div className="mb-4 text-purple-800">
                <h3 className="text-2xl font-bold">Победа! 🎉</h3>
                <p>Ходов использовано: {moves}</p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={initGame} className="bg-purple-600 hover:bg-purple-700 text-white">
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
