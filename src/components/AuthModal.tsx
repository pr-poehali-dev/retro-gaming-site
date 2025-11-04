import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, isLogin: boolean) => Promise<void>;
}

export default function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (isLogin: boolean) => {
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onAuth(email, password, isLogin);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md neon-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-arcade text-sm text-primary text-center">
            🕹️ ВХОД В СИСТЕМУ
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="font-orbitron text-xs">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="font-orbitron text-xs">
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="font-orbitron text-xs">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@arcade.com"
                className="font-orbitron"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="font-orbitron text-xs">
                Пароль
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="font-orbitron"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive font-orbitron">{error}</p>
            )}

            <Button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="w-full font-orbitron neon-border"
            >
              <Icon name="LogIn" size={16} className="mr-2" />
              {loading ? 'Загрузка...' : 'Войти'}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email" className="font-orbitron text-xs">
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@arcade.com"
                className="font-orbitron"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password" className="font-orbitron text-xs">
                Пароль
              </Label>
              <Input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="font-orbitron"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive font-orbitron">{error}</p>
            )}

            <Button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="w-full font-orbitron neon-border"
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
