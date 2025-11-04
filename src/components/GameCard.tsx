import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface GameCardProps {
  title: string;
  icon: string;
  mode: 'offline' | 'online';
  players?: string;
  onClick: () => void;
}

export default function GameCard({ title, icon, mode, players, onClick }: GameCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 neon-border hover:neon-glow animate-slide-in"
    >
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center text-5xl pixel-perfect group-hover:animate-pulse-glow">
          {icon}
        </div>
        
        <h3 className="font-arcade text-xs text-primary text-center leading-relaxed">
          {title}
        </h3>
        
        <div className="flex gap-2">
          <Badge 
            variant={mode === 'offline' ? 'secondary' : 'default'}
            className="text-[10px] font-orbitron"
          >
            <Icon name={mode === 'offline' ? 'User' : 'Users'} size={12} className="mr-1" />
            {mode === 'offline' ? 'VS BOT' : 'ONLINE'}
          </Badge>
          
          {players && (
            <Badge variant="outline" className="text-[10px] font-orbitron">
              {players}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      </div>
    </Card>
  );
}
