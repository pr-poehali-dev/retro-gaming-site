import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearFilters: () => void;
}

const filters = [
  { id: 'offline', label: 'Офлайн', icon: 'User' },
  { id: 'online', label: 'Онлайн', icon: 'Users' },
  { id: 'arcade', label: 'Аркады', icon: 'Gamepad2' },
  { id: 'cards', label: 'Карточные', icon: 'Spade' }
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterToggle,
  onClearFilters
}: SearchBarProps) {
  return (
    <div className="space-y-4 animate-slide-in">
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Поиск игр... (например: змейка, карты, блэкджек)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 font-orbitron neon-border"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-arcade text-[10px] text-muted-foreground">ФИЛЬТРЫ:</span>
        
        {filters.map(filter => (
          <Badge
            key={filter.id}
            variant={selectedFilters.includes(filter.id) ? 'default' : 'outline'}
            className="cursor-pointer font-orbitron text-xs hover:scale-105 transition-transform"
            onClick={() => onFilterToggle(filter.id)}
          >
            <Icon name={filter.icon as any} size={12} className="mr-1" />
            {filter.label}
          </Badge>
        ))}

        {selectedFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="font-orbitron text-xs"
          >
            <Icon name="X" size={14} className="mr-1" />
            Сбросить
          </Button>
        )}
      </div>

      {(searchQuery || selectedFilters.length > 0) && (
        <div className="flex items-center gap-2 text-xs font-orbitron text-muted-foreground">
          <Icon name="Filter" size={14} />
          <span>
            {searchQuery && `Поиск: "${searchQuery}"`}
            {searchQuery && selectedFilters.length > 0 && ' • '}
            {selectedFilters.length > 0 && `Фильтры: ${selectedFilters.length}`}
          </span>
        </div>
      )}
    </div>
  );
}
