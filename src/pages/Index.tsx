import { useState } from 'react';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import AuthModal from '../components/AuthModal';
import TicTacToe from '../components/games/TicTacToe';
import Snake from '../components/games/Snake';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Icon from '../components/ui/icon';

type Page = 'home' | 'games' | 'profile';
type GameType = 'tictactoe' | 'snake' | 'chess' | null;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GameCard
          title="КРЕСТИКИ НОЛИКИ"
          icon="❌"
          mode="offline"
          onClick={() => handleGameClick('tictactoe')}
        />
        
        <GameCard
          title="ЗМЕЙКА"
          icon="🐍"
          mode="offline"
          onClick={() => handleGameClick('snake')}
        />
        
        <GameCard
          title="ШАХМАТЫ"
          icon="♟️"
          mode="online"
          players="2 игрока"
          onClick={() => handleGameClick('chess')}
        />
      </div>

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
    if (currentGame === 'tictactoe') {
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
          <TicTacToe />
        </div>
      );
    }

    if (currentGame === 'snake') {
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
          <Snake />
        </div>
      );
    }

    if (currentGame === 'chess') {
      return (
        <div className="animate-slide-in text-center space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentGame(null)}
            className="font-orbitron"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к играм
          </Button>
          
          <Card className="p-12 neon-border">
            <div className="text-6xl mb-4">♟️</div>
            <h2 className="font-arcade text-lg text-primary mb-4">
              ОНЛАЙН ШАХМАТЫ
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
    }

    return (
      <div className="space-y-6 animate-slide-in">
        <h2 className="font-arcade text-xl text-primary text-center arcade-heading">
          ВЫБЕРИ ИГРУ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GameCard
            title="КРЕСТИКИ НОЛИКИ"
            icon="❌"
            mode="offline"
            onClick={() => setCurrentGame('tictactoe')}
          />
          
          <GameCard
            title="ЗМЕЙКА"
            icon="🐍"
            mode="offline"
            onClick={() => setCurrentGame('snake')}
          />
          
          <GameCard
            title="ШАХМАТЫ"
            icon="♟️"
            mode="online"
            players="2 игрока"
            onClick={() => setCurrentGame('chess')}
          />
        </div>
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
