import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import AuthModal from '../components/AuthModal';
import SearchBar from '../components/SearchBar';
import TicTacToe from '../components/games/TicTacToe';
import Snake from '../components/games/Snake';
import Blackjack from '../components/games/Blackjack';
import Durak from '../components/games/Durak';
import Tetris from '../components/games/Tetris';
import Minesweeper from '../components/games/Minesweeper';
import Arkanoid from '../components/games/Arkanoid';
import Pacman from '../components/games/Pacman';
import SpaceInvaders from '../components/games/SpaceInvaders';
import Pong from '../components/games/Pong';
import FlappyBird from '../components/games/FlappyBird';
import Solitaire from '../components/games/Solitaire';
import Sudoku from '../components/games/Sudoku';
import Memory from '../components/games/Memory';
import Connect4 from '../components/games/Connect4';
import Reversi from '../components/games/Reversi';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Icon from '../components/ui/icon';

type Page = 'home' | 'games' | 'profile';
type GameType = 'tictactoe' | 'snake' | 'chess' | 'blackjack' | 'durak' | 'poker' | 'tetris' | 'minesweeper' | 'arkanoid' | 'pacman' | 'spaceinvaders' | 'pong' | 'flappybird' | 'solitaire' | 'sudoku' | 'memory' | 'connect4' | 'reversi' | null;

interface GameData {
  id: GameType;
  title: string;
  icon: string;
  mode: 'offline' | 'online';
  category: 'arcade' | 'cards';
  players?: string;
  keywords: string[];
}

interface User {
  email: string;
  username: string;
  gamesPlayed: number;
  wins: number;
}

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const allGames: GameData[] = [
    {
      id: 'tetris',
      title: 'ТЕТРИС',
      icon: '🟦',
      mode: 'offline',
      category: 'arcade',
      keywords: ['тетрис', 'блоки', 'классика', 'пазл']
    },
    {
      id: 'pacman',
      title: 'ПАКМАН',
      icon: '👾',
      mode: 'offline',
      category: 'arcade',
      keywords: ['пакман', 'аркада', 'призраки', 'лабиринт']
    },
    {
      id: 'snake',
      title: 'ЗМЕЙКА',
      icon: '🐍',
      mode: 'offline',
      category: 'arcade',
      keywords: ['змейка', 'аркада', 'классика', 'ретро']
    },
    {
      id: 'arkanoid',
      title: 'АРКАНОИД',
      icon: '🏓',
      mode: 'offline',
      category: 'arcade',
      keywords: ['арканоид', 'мячик', 'блоки', 'классика']
    },
    {
      id: 'minesweeper',
      title: 'САПЁР',
      icon: '💣',
      mode: 'offline',
      category: 'arcade',
      keywords: ['сапёр', 'мины', 'логика', 'windows']
    },
    {
      id: 'spaceinvaders',
      title: 'КОСМИЧЕСКИЕ ЗАХВАТЧИКИ',
      icon: '🛸',
      mode: 'offline',
      category: 'arcade',
      keywords: ['космос', 'инопланетяне', 'шутер', 'ретро']
    },
    {
      id: 'pong',
      title: 'ПОНГ',
      icon: '🏓',
      mode: 'offline',
      category: 'arcade',
      keywords: ['понг', 'теннис', 'первая', 'классика']
    },
    {
      id: 'flappybird',
      title: 'FLAPPY BIRD',
      icon: '🐦',
      mode: 'offline',
      category: 'arcade',
      keywords: ['птица', 'прыжки', 'трубы', 'хардкор']
    },
    {
      id: 'tictactoe',
      title: 'КРЕСТИКИ-НОЛИКИ',
      icon: '❌',
      mode: 'offline',
      category: 'arcade',
      keywords: ['крестики', 'нолики', 'логика', 'простая']
    },
    {
      id: 'blackjack',
      title: 'БЛЭКДЖЕК',
      icon: '🃏',
      mode: 'offline',
      category: 'cards',
      keywords: ['блэкджек', 'карты', '21', 'казино']
    },
    {
      id: 'durak',
      title: 'ДУРАК',
      icon: '🂡',
      mode: 'offline',
      category: 'cards',
      keywords: ['дурак', 'карты', 'подкидной', 'русская']
    },
    {
      id: 'solitaire',
      title: 'ПАСЬЯНС',
      icon: '🃴',
      mode: 'offline',
      category: 'cards',
      keywords: ['пасьянс', 'клондайк', 'одиночная', 'windows']
    },
    {
      id: 'sudoku',
      title: 'СУДОКУ',
      icon: '🔢',
      mode: 'offline',
      category: 'arcade',
      keywords: ['судоку', 'цифры', 'логика', 'японская']
    },
    {
      id: 'memory',
      title: 'ПАМЯТЬ',
      icon: '🧠',
      mode: 'offline',
      category: 'arcade',
      keywords: ['память', 'карточки', 'пары', 'внимание']
    },
    {
      id: 'connect4',
      title: '4 В РЯД',
      icon: '🔴',
      mode: 'offline',
      category: 'arcade',
      keywords: ['четыре', 'ряд', 'логика', 'стратегия']
    },
    {
      id: 'reversi',
      title: 'РЕВЕРСИ',
      icon: '⚫',
      mode: 'offline',
      category: 'arcade',
      keywords: ['реверси', 'отелло', 'стратегия', 'доска']
    },
    {
      id: 'poker',
      title: 'ПОКЕР',
      icon: '♠️',
      mode: 'online',
      category: 'cards',
      players: '2-6 игроков',
      keywords: ['покер', 'карты', 'онлайн', 'техасский']
    },
    {
      id: 'chess',
      title: 'ШАХМАТЫ',
      icon: '♟️',
      mode: 'online',
      category: 'arcade',
      players: '2 игрока',
      keywords: ['шахматы', 'логика', 'онлайн', 'стратегия']
    }
  ];

  const filteredGames = useMemo(() => {
    return allGames.filter(game => {
      const matchesSearch = !searchQuery || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (selectedFilters.length === 0) return true;
      
      return selectedFilters.every(filter => {
        if (filter === 'offline') return game.mode === 'offline';
        if (filter === 'online') return game.mode === 'online';
        if (filter === 'arcade') return game.category === 'arcade';
        if (filter === 'cards') return game.category === 'cards';
        return true;
      });
    });
  }, [searchQuery, selectedFilters]);

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const handleAuth = async (email: string, password: string, isLogin: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      email,
      username: email.split('@')[0],
      gamesPlayed: Math.floor(Math.random() * 50),
      wins: Math.floor(Math.random() * 25)
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleGameClick = (game: GameType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCurrentGame(game);
    setCurrentPage('games');
  };

  const renderHome = () => (
    <div className="space-y-8 animate-slide-in">
      <div className="text-center space-y-4">
        <h1 className="font-arcade text-2xl md:text-4xl text-primary arcade-heading animate-neon-flicker">
          🎮 ДОБРО ПОЖАЛОВАТЬ
        </h1>
        <p className="font-orbitron text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Погрузись в атмосферу классических аркадных игр 90-х годов. 
          Играй офлайн против бота или соревнуйся с другими игроками онлайн!
        </p>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilters={selectedFilters}
        onFilterToggle={handleFilterToggle}
        onClearFilters={handleClearFilters}
      />

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <GameCard
              key={game.id}
              title={game.title}
              icon={game.icon}
              mode={game.mode}
              players={game.players}
              onClick={() => handleGameClick(game.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center neon-border">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-orbitron text-sm text-muted-foreground">
            Игры не найдены. Попробуй изменить поиск или фильтры.
          </p>
        </Card>
      )}

      {!user && (
        <Card className="p-6 text-center bg-primary/10 neon-border animate-pulse-glow">
          <p className="font-orbitron text-sm mb-4">
            Войди в систему, чтобы играть и сохранять свои результаты!
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="font-orbitron neon-border"
          >
            <Icon name="LogIn" size={16} className="mr-2" />
            Войти / Регистрация
          </Button>
        </Card>
      )}
    </div>
  );

  const renderGames = () => {
    const renderGameComponent = () => {
      switch (currentGame) {
        case 'tictactoe':
          return <TicTacToe />;
        case 'snake':
          return <Snake />;
        case 'blackjack':
          return <Blackjack />;
        case 'durak':
          return <Durak />;
        case 'tetris':
          return <Tetris />;
        case 'minesweeper':
          return <Minesweeper />;
        case 'arkanoid':
          return <Arkanoid />;
        case 'pacman':
          return <Pacman />;
        case 'spaceinvaders':
          return <SpaceInvaders />;
        case 'pong':
          return <Pong />;
        case 'flappybird':
          return <FlappyBird />;
        case 'solitaire':
          return <Solitaire />;
        case 'sudoku':
          return <Sudoku />;
        case 'memory':
          return <Memory />;
        case 'connect4':
          return <Connect4 />;
        case 'reversi':
          return <Reversi />;
        case 'poker':
        case 'chess':
          const gameData = allGames.find(g => g.id === currentGame);
          return (
            <div className="text-center space-y-6">
              <Card className="p-12 neon-border">
                <div className="text-6xl mb-4">{gameData?.icon}</div>
                <h2 className="font-arcade text-lg text-primary mb-4">
                  {gameData?.title}
                </h2>
                <p className="font-orbitron text-sm text-muted-foreground mb-6">
                  Функционал онлайн-игры будет добавлен в следующей версии!
                </p>
                <p className="font-orbitron text-xs text-muted-foreground">
                  Здесь будет поиск соперника и игра в реальном времени
                </p>
              </Card>
            </div>
          );
        default:
          return null;
      }
    };

    if (currentGame) {
      return (
        <div className="animate-slide-in">
          <Button 
            variant="outline" 
            onClick={() => setCurrentGame(null)}
            className="mb-6 font-orbitron"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к играм
          </Button>
          {renderGameComponent()}
        </div>
      );
    }

    if (false) {
      return null;
    }

    return (
      <div className="space-y-6 animate-slide-in">
        <h2 className="font-arcade text-xl text-primary text-center arcade-heading">
          ВЫБЕРИ ИГРУ
        </h2>
        
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
          onClearFilters={handleClearFilters}
        />
        
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                title={game.title}
                icon={game.icon}
                mode={game.mode}
                players={game.players}
                onClick={() => setCurrentGame(game.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center neon-border">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="font-orbitron text-sm text-muted-foreground">
              Игры не найдены. Попробуй изменить поиск или фильтры.
            </p>
          </Card>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    if (!user) {
      return (
        <Card className="p-12 text-center neon-border animate-slide-in">
          <Icon name="User" size={64} className="mx-auto mb-4 text-primary" />
          <p className="font-orbitron text-sm mb-4">
            Войди, чтобы увидеть свой профиль
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="font-orbitron neon-border"
          >
            <Icon name="LogIn" size={16} className="mr-2" />
            Войти
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-6 animate-slide-in">
        <Card className="p-8 neon-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center neon-glow">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h2 className="font-arcade text-lg text-primary">
                {user.username}
              </h2>
              <p className="font-orbitron text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-secondary/20 border-secondary">
              <div className="text-center">
                <Icon name="Gamepad2" size={32} className="mx-auto mb-2 text-secondary" />
                <p className="font-arcade text-xs text-muted-foreground mb-1">
                  ИГР СЫГРАНО
                </p>
                <p className="font-arcade text-2xl text-secondary">
                  {user.gamesPlayed}
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-accent/20 border-accent">
              <div className="text-center">
                <Icon name="Trophy" size={32} className="mx-auto mb-2 text-accent" />
                <p className="font-arcade text-xs text-muted-foreground mb-1">
                  ПОБЕД
                </p>
                <p className="font-arcade text-2xl text-accent">
                  {user.wins}
                </p>
              </div>
            </Card>
          </div>
        </Card>

        <Card className="p-6 bg-muted/20 neon-border">
          <h3 className="font-arcade text-sm text-primary mb-4">
            📊 СТАТИСТИКА
          </h3>
          <div className="space-y-2 font-orbitron text-sm">
            <div className="flex justify-between">
              <span>Процент побед:</span>
              <span className="text-primary">
                {user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Любимая игра:</span>
              <span className="text-primary">Крестики-нолики</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'games' && renderGames()}
        {currentPage === 'profile' && renderProfile()}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />

      <footer className="border-t-2 border-primary/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-arcade text-xs text-muted-foreground">
            🕹️ ARCADE 90s © 2024
          </p>
          <p className="font-orbitron text-xs text-muted-foreground mt-2">
            Made with ❤️ for retro gaming lovers
          </p>
        </div>
      </footer>
    </div>
  );
}