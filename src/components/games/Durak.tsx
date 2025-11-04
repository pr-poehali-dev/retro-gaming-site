import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type CardSuit = '♠' | '♥' | '♦' | '♣';
type CardValue = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface PlayingCard {
  suit: CardSuit;
  value: CardValue;
  id: string;
}

const suits: CardSuit[] = ['♠', '♥', '♦', '♣'];
const values: CardValue[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function Durak() {
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [botHand, setBotHand] = useState<PlayingCard[]>([]);
  const [table, setTable] = useState<{ attack: PlayingCard; defend?: PlayingCard }[]>([]);
  const [trump, setTrump] = useState<PlayingCard | null>(null);
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAttacking, setIsAttacking] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'playerWin' | 'botWin'>('playing');

  const createDeck = (): PlayingCard[] => {
    const newDeck: PlayingCard[] = [];
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ suit, value, id: `${suit}-${value}-${Math.random()}` });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const getCardStrength = (card: PlayingCard): number => {
    const valueIndex = values.indexOf(card.value);
    return card.suit === trump?.suit ? valueIndex + 100 : valueIndex;
  };

  const canBeat = (attackCard: PlayingCard, defendCard: PlayingCard): boolean => {
    if (defendCard.suit === trump?.suit && attackCard.suit !== trump?.suit) return true;
    if (defendCard.suit !== attackCard.suit) return false;
    return getCardStrength(defendCard) > getCardStrength(attackCard);
  };

  const startGame = () => {
    const newDeck = createDeck();
    const trumpCard = newDeck[newDeck.length - 1];
    
    const playerCards = newDeck.splice(0, 6);
    const botCards = newDeck.splice(0, 6);
    
    setPlayerHand(playerCards);
    setBotHand(botCards);
    setTrump(trumpCard);
    setDeck(newDeck);
    setTable([]);
    setIsPlayerTurn(true);
    setIsAttacking(true);
    setGameState('playing');
    setSelectedCard(null);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handlePlayerAttack = (card: PlayingCard) => {
    if (!isPlayerTurn || !isAttacking) return;
    
    setTable([...table, { attack: card }]);
    setPlayerHand(playerHand.filter(c => c.id !== card.id));
    setIsPlayerTurn(false);
    setSelectedCard(null);
  };

  const handlePlayerDefend = (card: PlayingCard) => {
    if (isPlayerTurn || isAttacking) return;
    
    const undefendedCard = table.find(t => !t.defend);
    if (!undefendedCard || !canBeat(undefendedCard.attack, card)) return;
    
    const newTable = table.map(t => 
      t.attack.id === undefendedCard.attack.id ? { ...t, defend: card } : t
    );
    
    setTable(newTable);
    setPlayerHand(playerHand.filter(c => c.id !== card.id));
    
    if (newTable.every(t => t.defend)) {
      setTimeout(endRound, 1000);
    }
  };

  const takeCards = () => {
    const allCards = table.flatMap(t => [t.attack, t.defend].filter(Boolean) as PlayingCard[]);
    
    if (isPlayerTurn) {
      setBotHand([...botHand, ...allCards]);
    } else {
      setPlayerHand([...playerHand, ...allCards]);
    }
    
    setTable([]);
    setIsPlayerTurn(!isPlayerTurn);
    setIsAttacking(true);
  };

  const endRound = () => {
    setTable([]);
    setIsPlayerTurn(!isPlayerTurn);
    setIsAttacking(true);
    drawCards();
  };

  const drawCards = () => {
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand];
    const newBotHand = [...botHand];
    
    while (newPlayerHand.length < 6 && newDeck.length > 0) {
      newPlayerHand.push(newDeck.shift()!);
    }
    
    while (newBotHand.length < 6 && newDeck.length > 0) {
      newBotHand.push(newDeck.shift()!);
    }
    
    setPlayerHand(newPlayerHand);
    setBotHand(newBotHand);
    setDeck(newDeck);
    
    if (newDeck.length === 0) {
      if (newPlayerHand.length === 0) setGameState('playerWin');
      if (newBotHand.length === 0) setGameState('botWin');
    }
  };

  const renderCard = (card: PlayingCard, onClick?: () => void, isHidden = false) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    const isSelected = selectedCard === card.id;
    
    if (isHidden) {
      return (
        <div className="w-14 h-20 bg-gradient-to-br from-primary to-secondary rounded border-2 border-primary flex items-center justify-center">
          <span className="text-xl">🂠</span>
        </div>
      );
    }
    
    return (
      <button
        onClick={onClick}
        className={`w-14 h-20 bg-card rounded border-2 p-1 flex flex-col justify-between transition-all hover:scale-105
          ${isSelected ? 'border-accent shadow-lg shadow-accent' : 'border-primary'}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className={`text-sm font-bold ${isRed ? 'text-red-500' : 'text-foreground'}`}>
          {card.value}
          <div className="text-base">{card.suit}</div>
        </div>
      </button>
    );
  };

  if (gameState !== 'playing') {
    return (
      <div className="flex flex-col items-center gap-6 p-4">
        <h2 className="font-arcade text-lg text-primary arcade-heading">ДУРАК</h2>
        <Card className="p-12 neon-border text-center animate-pulse-glow">
          <div className="text-6xl mb-4">{gameState === 'playerWin' ? '🎉' : '😔'}</div>
          <p className="font-arcade text-sm mb-4">
            {gameState === 'playerWin' ? 'ТЫ ПОБЕДИЛ!' : 'БОТ ПОБЕДИЛ!'}
          </p>
          <Button onClick={startGame} className="font-orbitron neon-border">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Новая игра
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-arcade text-lg text-primary arcade-heading">ДУРАК</h2>

      <Card className="p-3 bg-primary/20 neon-border">
        <p className="font-arcade text-[10px] text-center">
          КОЗЫРЬ: {trump?.suit} | КОЛОДА: {deck.length}
        </p>
      </Card>

      <div className="w-full max-w-4xl space-y-4">
        <div>
          <p className="font-arcade text-xs mb-2 text-center">
            БОТ ({botHand.length} карт)
          </p>
          <div className="flex gap-1 justify-center flex-wrap">
            {botHand.map((_, idx) => (
              <div key={idx}>{renderCard({ suit: '♠', value: '6', id: `hidden-${idx}` }, undefined, true)}</div>
            ))}
          </div>
        </div>

        <div className="min-h-[100px] flex items-center justify-center">
          {table.length > 0 ? (
            <div className="flex gap-4 flex-wrap justify-center">
              {table.map((pair, idx) => (
                <div key={idx} className="relative">
                  {renderCard(pair.attack)}
                  {pair.defend && (
                    <div className="absolute -top-2 -right-2">
                      {renderCard(pair.defend)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-orbitron text-xs text-muted-foreground">Стол пуст</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-arcade text-xs">ТЫ ({playerHand.length} карт)</p>
            <div className="flex gap-2">
              {table.length > 0 && !isAttacking && (
                <Button size="sm" onClick={takeCards} variant="destructive" className="font-orbitron text-xs">
                  Беру
                </Button>
              )}
              {table.length > 0 && isAttacking && table.every(t => t.defend) && (
                <Button size="sm" onClick={endRound} className="font-orbitron text-xs">
                  Бито
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-1 justify-center flex-wrap">
            {playerHand.map(card => (
              <div key={card.id}>
                {renderCard(
                  card,
                  () => {
                    if (isPlayerTurn && isAttacking) handlePlayerAttack(card);
                    else if (!isPlayerTurn && !isAttacking) handlePlayerDefend(card);
                  }
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs font-orbitron text-muted-foreground text-center max-w-md">
        {isPlayerTurn 
          ? (isAttacking ? 'Твой ход - атакуй!' : 'Твой ход - защищайся!')
          : 'Ход бота...'}
      </p>
    </div>
  );
}
