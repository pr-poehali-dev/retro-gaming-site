import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type CardSuit = '♠' | '♥' | '♦' | '♣';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface PlayingCard {
  suit: CardSuit;
  value: CardValue;
}

const suits: CardSuit[] = ['♠', '♥', '♦', '♣'];
const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function Blackjack() {
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'end'>('betting');
  const [result, setResult] = useState<string>('');
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);

  const createDeck = (): PlayingCard[] => {
    const deck: PlayingCard[] = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (card: PlayingCard): number => {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
  };

  const getHandValue = (hand: PlayingCard[]): number => {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  };

  const startGame = (betAmount: number) => {
    if (betAmount > balance) return;
    
    const deck = createDeck();
    const newPlayerHand = [deck[0], deck[2]];
    const newDealerHand = [deck[1], deck[3]];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setBet(betAmount);
    setBalance(balance - betAmount);
    setGameState('playing');
    setResult('');
  };

  const hit = () => {
    const deck = createDeck();
    const newCard = deck[0];
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    if (getHandValue(newHand) > 21) {
      setResult('ПЕРЕБОР! Дилер победил');
      setGameState('end');
    }
  };

  const stand = () => {
    setGameState('dealer');
    const newDealerHand = [...dealerHand];
    const deck = createDeck();
    let deckIndex = 0;
    
    while (getHandValue(newDealerHand) < 17) {
      newDealerHand.push(deck[deckIndex++]);
    }
    
    setDealerHand(newDealerHand);
    
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(newDealerHand);
    
    setTimeout(() => {
      if (dealerValue > 21) {
        setResult('Дилер перебрал! Ты победил!');
        setBalance(balance + bet * 2);
      } else if (dealerValue > playerValue) {
        setResult('Дилер победил!');
      } else if (playerValue > dealerValue) {
        setResult('Ты победил!');
        setBalance(balance + bet * 2);
      } else {
        setResult('Ничья!');
        setBalance(balance + bet);
      }
      setGameState('end');
    }, 1000);
  };

  const reset = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setResult('');
    setBet(0);
  };

  const renderCard = (card: PlayingCard, hidden = false) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-primary to-secondary rounded border-2 border-primary flex items-center justify-center">
          <span className="text-2xl">🂠</span>
        </div>
      );
    }
    
    return (
      <div className="w-16 h-24 bg-card rounded border-2 border-primary p-2 flex flex-col justify-between">
        <div className={`text-lg font-bold ${isRed ? 'text-red-500' : 'text-foreground'}`}>
          {card.value}
          <div className="text-xl">{card.suit}</div>
        </div>
        <div className={`text-lg font-bold text-right ${isRed ? 'text-red-500' : 'text-foreground'}`}>
          {card.suit}
          <div className="text-xl">{card.value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-arcade text-lg text-primary arcade-heading">
        БЛЭКДЖЕК
      </h2>

      <Card className="p-4 bg-primary/20 neon-border">
        <p className="font-arcade text-xs text-center">
          БАЛАНС: ${balance} | СТАВКА: ${bet}
        </p>
      </Card>

      {gameState === 'betting' ? (
        <div className="space-y-4 w-full max-w-md">
          <p className="font-orbitron text-sm text-center">Выбери ставку:</p>
          <div className="grid grid-cols-3 gap-3">
            {[10, 50, 100, 250, 500, 1000].map(amount => (
              <Button
                key={amount}
                onClick={() => startGame(amount)}
                disabled={amount > balance}
                className="font-orbitron neon-border"
                variant={amount > balance ? 'outline' : 'default'}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 w-full max-w-2xl">
            <div>
              <p className="font-arcade text-xs mb-2 text-center">
                ДИЛЕР ({gameState === 'playing' ? '?' : getHandValue(dealerHand)})
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {dealerHand.map((card, idx) => (
                  <div key={idx}>
                    {renderCard(card, gameState === 'playing' && idx === 1)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-arcade text-xs mb-2 text-center">
                ТЫ ({getHandValue(playerHand)})
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {playerHand.map((card, idx) => (
                  <div key={idx}>{renderCard(card)}</div>
                ))}
              </div>
            </div>
          </div>

          {result && (
            <Card className="p-4 bg-primary/20 neon-border animate-pulse-glow">
              <p className="font-arcade text-xs text-center">{result}</p>
            </Card>
          )}

          <div className="flex gap-3">
            {gameState === 'playing' && (
              <>
                <Button onClick={hit} className="font-orbitron neon-border">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Взять карту
                </Button>
                <Button onClick={stand} variant="secondary" className="font-orbitron">
                  <Icon name="Hand" size={16} className="mr-2" />
                  Хватит
                </Button>
              </>
            )}
            
            {gameState === 'end' && (
              <Button onClick={reset} className="font-orbitron neon-border">
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Новая игра
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
