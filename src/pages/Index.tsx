import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
};

type Chat = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  verified?: boolean;
};

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeView, setActiveView] = useState<'chats' | 'search' | 'contacts' | 'profile' | 'settings'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const [chats] = useState<Chat[]>([
    { id: '1', name: 'Алексей Смирнов', username: 'alex_dev', lastMessage: 'Привет! Как дела?', timestamp: '14:32', unread: 2, verified: true },
    { id: '2', name: 'Мария Петрова', username: 'maria_p', lastMessage: 'Созвон в 15:00', timestamp: '13:15', unread: 0 },
    { id: '3', name: 'Дмитрий', username: 'dmitry_k', lastMessage: 'Отправил файлы', timestamp: 'Вчера', unread: 1 },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Привет! Как дела?', sender: 'other', timestamp: new Date() },
    { id: '2', text: 'Отлично! Работаю над новым проектом', sender: 'me', timestamp: new Date() },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        sender: 'me',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handlePromoCode = () => {
    if (promoCode === 'super123q') {
      setIsVerified(true);
      setShowPromoDialog(false);
      setPromoCode('');
    }
  };

  const handleRegistration = () => {
    if (registrationStep === 1 && phoneNumber.length >= 10) {
      setRegistrationStep(2);
    } else if (registrationStep === 2 && displayName.trim() && username.trim()) {
      setIsRegistered(true);
    }
  };

  const NavButton = ({ view, icon, label }: { view: typeof activeView; icon: string; label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
        activeView === view 
          ? 'text-primary neon-glow' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon name={icon} size={24} />
      <span className="text-xs">{label}</span>
    </button>
  );

  if (!isRegistered) {
    return (
      <div className="dark">
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold neon-text mb-2">superGram</h1>
              <p className="text-muted-foreground">Мессенджер нового поколения</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border purple-glow">
              {registrationStep === 1 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Регистрация</h2>
                    <p className="text-sm text-muted-foreground">Введите ваш номер телефона</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <Button 
                    onClick={handleRegistration}
                    disabled={phoneNumber.length < 10}
                    className="w-full neon-glow"
                  >
                    Продолжить
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setRegistrationStep(1)}
                      className="mb-4"
                    >
                      <Icon name="ArrowLeft" size={16} className="mr-2" />
                      Назад
                    </Button>
                    <h2 className="text-2xl font-semibold mb-2">Создайте профиль</h2>
                    <p className="text-sm text-muted-foreground">Как вас будут называть?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                        <Input
                          id="username"
                          placeholder="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRegistration}
                    disabled={!displayName.trim() || !username.trim()}
                    className="w-full neon-glow"
                  >
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Начать общение
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Icon name="Shield" size={16} className="inline mr-1" />
              Защищено Cloudflare DDoS Protection
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="h-screen bg-background flex flex-col">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  {selectedChat.verified && (
                    <Badge variant="secondary" className="neon-glow px-1.5 py-0">
                      <Icon name="CheckCircle2" size={12} />
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">@{selectedChat.username}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Video" size={20} />
              </Button>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 animate-fade-in ${
                      msg.sender === 'me' 
                        ? 'bg-primary text-primary-foreground neon-glow' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="bg-card border-t border-border px-4 py-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Сообщение..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="neon-glow">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-card border-b border-border px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold neon-text">superGram</h1>
                {isVerified && (
                  <Badge className="neon-glow">
                    <Icon name="Zap" size={12} className="mr-1" />
                    Developer
                  </Badge>
                )}
              </div>
              {activeView === 'chats' && (
                <Input
                  placeholder="Поиск чатов..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              {activeView === 'chats' && (
                <ScrollArea className="h-full">
                  <div className="divide-y divide-border">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className="px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-all hover:purple-glow"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{chat.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{chat.name}</h3>
                              {chat.verified && (
                                <Icon name="CheckCircle2" size={14} className="text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                            {chat.unread > 0 && (
                              <Badge variant="default" className="neon-glow">{chat.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {activeView === 'search' && (
                <div className="p-4">
                  <Input
                    placeholder="Поиск по номеру или @username..."
                    className="mb-4"
                  />
                  <p className="text-center text-muted-foreground text-sm">Введите номер телефона или username для поиска</p>
                </div>
              )}

              {activeView === 'contacts' && (
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Контакты</h2>
                  <p className="text-center text-muted-foreground text-sm">Ваши контакты появятся здесь</p>
                </div>
              )}

              {activeView === 'profile' && (
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarFallback className="text-2xl">{displayName[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mb-4">
                      <Icon name="Camera" size={16} className="mr-2" />
                      Изменить фото
                    </Button>
                    {isVerified && (
                      <Badge className="neon-glow mb-2">
                        <Icon name="Zap" size={12} className="mr-1" />
                        Developer
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <div>
                      <Label>Имя</Label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!editingProfile}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {editingProfile ? (
                        <>
                          <Button onClick={() => setEditingProfile(false)} className="flex-1">
                            Сохранить
                          </Button>
                          <Button variant="outline" onClick={() => setEditingProfile(false)} className="flex-1">
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setEditingProfile(true)} className="w-full">
                          Редактировать профиль
                        </Button>
                      )}
                    </div>

                    {!isVerified && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPromoDialog(true)}
                        className="w-full purple-glow"
                      >
                        <Icon name="Gift" size={16} className="mr-2" />
                        Активировать промокод
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {activeView === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Настройки</h2>
                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme-mode">Тёмная тема</Label>
                        <p className="text-sm text-muted-foreground">Включить тёмный режим</p>
                      </div>
                      <Switch
                        id="theme-mode"
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Уведомления</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Push-уведомления</Label>
                        <Switch id="notifications" defaultChecked />
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Защита</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        <Icon name="Shield" size={16} className="inline mr-1" />
                        Cloudflare DDoS защита активна
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border-t border-border px-2 py-2">
              <div className="flex justify-around">
                <NavButton view="chats" icon="MessageSquare" label="Чаты" />
                <NavButton view="search" icon="Search" label="Поиск" />
                <NavButton view="contacts" icon="Users" label="Контакты" />
                <NavButton view="profile" icon="User" label="Профиль" />
                <NavButton view="settings" icon="Settings" label="Настройки" />
              </div>
            </div>
          </>
        )}

        <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Активация промокода</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Введите промокод..."
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                type="password"
              />
              <Button onClick={handlePromoCode} className="w-full neon-glow">
                Активировать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;