import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  currentPage: 'home' | 'games' | 'profile';
  onNavigate: (page: 'home' | 'games' | 'profile') => void;
  user: { email: string } | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, user, onLogout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b-2 border-primary neon-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-arcade text-sm md:text-base text-primary animate-neon-flicker cursor-pointer" onClick={() => onNavigate('home')}>
          🕹️ ARCADE 90s
        </h1>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('home')}
            className="font-orbitron text-xs"
          >
            <Icon name="Home" size={16} className="md:mr-2" />
            <span className="hidden md:inline">Главная</span>
          </Button>
          
          <Button
            variant={currentPage === 'games' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('games')}
            className="font-orbitron text-xs"
          >
            <Icon name="Gamepad2" size={16} className="md:mr-2" />
            <span className="hidden md:inline">Игры</span>
          </Button>
          
          {user && (
            <>
              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('profile')}
                className="font-orbitron text-xs"
              >
                <Icon name="User" size={16} className="md:mr-2" />
                <span className="hidden md:inline">Профиль</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="font-orbitron text-xs"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
