import { useState, useEffect } from "react";
import { useGameStore, type GameModeType } from "@/lib/gameStore";
import { Link } from "wouter";
import PalavraSuperSecretaSubmodeScreen from "@/pages/PalavraSuperSecretaSubmodeScreen";
import { SpeakingOrderWheel } from "@/components/SpeakingOrderWheel";
import { NotificationCenter } from "@/components/NotificationCenter";
import { 
  User, 
  Zap, 
  Copy, 
  LogOut, 
  Play, 
  Crown,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Rocket,
  MapPin,
  Swords,
  Target,
  HelpCircle,
  FileText,
  Heart,
  X,
  Send,
  RotateCcw,
  Smartphone,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PIX_KEY = "48492456-23f1-4edc-b739-4e36547ef90e";

const DonationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast({ title: "Copiado!", description: "Chave PIX copiada para a área de transferência." });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1a1a2e] border border-gray-800 rounded-2xl w-full max-w-sm p-6 animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#ff0050]">
            <Heart className="w-5 h-5 fill-current" />
            <h2 className="text-xl font-bold">Apoie o Projeto</h2>
          </div>
          
          <p className="text-gray-400 text-sm">
            Se você está se divertindo, considere fazer uma doação! Isso ajuda a manter o projeto no ar. 💜
          </p>

          <div className="space-y-3">
            <p className="text-gray-300 text-sm font-medium flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">BR</span>
              <span className="font-bold">PIX</span>
            </p>

            <div className="bg-white rounded-xl p-3 mx-auto w-fit">
              <img 
                src="/pix-qrcode.png" 
                alt="QR Code PIX" 
                className="w-40 h-40 object-contain"
              />
            </div>

            <div className="bg-black/50 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs mb-2">Chave PIX:</p>
              <div className="flex items-center gap-2">
                <p className="text-[#00f2ea] text-xs font-mono flex-1 break-all">{PIX_KEY}</p>
                <Button
                  onClick={copyPixKey}
                  size="sm"
                  className="bg-[#ff0050] hover:bg-[#ff0050]/80 text-white text-xs px-3 py-1 h-8 rounded-lg"
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeButton = ({ inline = false }: { inline?: boolean } = {}) => {
  const { leaveGame } = useGameStore();
  
  const handleClick = () => {
    leaveGame();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-[#00f2ea]/20 border border-[#00f2ea]/50 rounded-full text-[#00f2ea] hover:bg-[#00f2ea]/30 transition-all",
        inline ? "w-full justify-center" : "fixed top-4 left-4 z-40"
      )}
      style={{ boxShadow: '0 0 15px rgba(0, 242, 234, 0.2)' }}
      title="Voltar à tela inicial"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Home</span>
    </button>
  );
};

const DonationButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-[#ff0050]/20 border border-[#ff0050]/50 rounded-full text-[#ff0050] hover:bg-[#ff0050]/30 transition-all"
    style={{ boxShadow: '0 0 15px rgba(255, 0, 80, 0.2)' }}
  >
    <Heart className="w-4 h-4 fill-current" />
    <span className="text-sm font-medium">Doar</span>
  </button>
);

const AdPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanClose(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
      <div className="relative bg-[#1a1a2e] border border-gray-800 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="absolute top-4 right-4">
          {canClose ? (
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1 bg-[#00f2ea] text-black text-sm font-bold rounded-lg hover:bg-[#00f2ea]/80 transition-all"
            >
              <X className="w-4 h-4" />
              Fechar
            </button>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-400 text-sm font-bold rounded-lg">
              Aguarde {countdown}s
            </span>
          )}
        </div>
        
        <div className="text-center space-y-4 pt-8">
          <p className="text-gray-400 text-xs uppercase tracking-widest">Patrocinado</p>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[250px] flex flex-col items-center justify-center">
            <div 
              className="w-full h-full flex items-center justify-center"
              id="ad-container-popup"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[#00f2ea]/20 to-[#ff0050]/20 flex items-center justify-center border border-gray-700">
                  <img src="/tikjogos-logo.png" alt="TikJogos" className="w-12 h-auto" />
                </div>
                <p className="text-gray-500 text-sm">Espaço para anúncio</p>
                <p className="text-gray-600 text-xs">Google AdSense</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-xs">
            Os anúncios ajudam a manter o TikJogos gratuito!
          </p>
        </div>
      </div>
    </div>
  );
};

const getModeEmoji = (modeId: string) => {
  switch (modeId) {
    case 'palavraSecreta': return '🔤';
    case 'palavras': return '📍';
    case 'duasFaccoes': return '⚔️';
    case 'categoriaItem': return '🎯';
    case 'perguntasDiferentes': return '🤔';
    default: return '🎮';
  }
};

const NeonLines = () => (
  <>
    <div className="absolute top-[15%] left-0 w-[40%] neon-line-cyan transform -skew-y-6"></div>
    <div className="absolute top-[15%] right-0 w-[40%] neon-line-pink transform skew-y-6"></div>
    <div className="absolute bottom-[15%] left-0 w-[40%] neon-line-pink transform skew-y-6"></div>
    <div className="absolute bottom-[15%] right-0 w-[40%] neon-line-cyan transform -skew-y-6"></div>
  </>
);

const HomeScreen = () => {
  const { setUser, createRoom, joinRoom, isLoading, loadSavedNickname, saveNickname, clearSavedNickname, savedNickname } = useGameStore();
  const [name, setNameInput] = useState("");
  const [code, setCodeInput] = useState("");
  const [saveNicknameChecked, setSaveNicknameChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = loadSavedNickname();
    if (saved) {
      setNameInput(saved);
      setSaveNicknameChecked(true);
    }
  }, [loadSavedNickname]);

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: "Nome necessário", description: "Por favor, digite seu nome.", variant: "destructive" });
      return;
    }
    if (saveNicknameChecked) {
      saveNickname(name);
    }
    setUser(name);
    createRoom();
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      toast({ title: "Nome necessário", description: "Por favor, digite seu nome.", variant: "destructive" });
      return;
    }
    if (!code.trim()) {
      toast({ title: "Código inválido", description: "Digite o código da sala.", variant: "destructive" });
      return;
    }
    
    if (saveNicknameChecked) {
      saveNickname(name);
    }
    setUser(name);
    const success = await joinRoom(code.toUpperCase());
    if (!success) {
      toast({ title: "Erro ao entrar", description: "Sala não encontrada ou código inválido.", variant: "destructive" });
    }
  };

  const handleClearNickname = () => {
    clearSavedNickname();
    setNameInput("");
    setSaveNicknameChecked(false);
    toast({ title: "Nickname removido", description: "Próxima vez você precisará digitar novamente." });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-8 animate-fade-in p-4 relative z-10">
      <div className="text-center mb-2">
        <div className="relative inline-block mb-0">
          <img 
            src="/tikjogos-logo.png" 
            alt="TikJogos" 
            className="w-[576px] h-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0, 242, 234, 0.3)) drop-shadow(0 0 40px rgba(255, 0, 80, 0.2))' }}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Seu apelido de tripulante"
            value={name}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full p-6 h-14 rounded-lg bg-black border-2 border-gray-800 text-white text-center text-lg placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-[#00f2ea] transition-all"
            style={{ boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)' }}
            data-testid="input-name"
          />
        </div>

        <div className="flex items-center justify-between px-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={saveNicknameChecked}
              onChange={(e) => setSaveNicknameChecked(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-800 border border-gray-700 cursor-pointer checked:bg-[#00f2ea] checked:border-[#00f2ea] transition-all"
              data-testid="checkbox-save-nickname"
            />
            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">Guardar nickname?</span>
          </label>
          {savedNickname && (
            <button
              onClick={handleClearNickname}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline"
              data-testid="button-clear-nickname"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

        <Button 
          onClick={handleCreate} 
          disabled={isLoading}
          className="w-full h-14 bg-transparent border-2 border-[#ff0050] text-[#ff0050] hover:bg-[#ff0050]/10 font-bold text-lg rounded-lg transition-all"
          style={{ boxShadow: '0 0 15px rgba(255, 0, 80, 0.3)' }}
          data-testid="button-create-room"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
          CRIAR SALA
        </Button>

        <div className="flex items-center gap-4 py-3">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <span className="text-gray-600 text-xs font-bold tracking-widest">OU</span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="CÓDIGO"
              value={code}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              maxLength={4}
              className="w-full h-14 p-6 rounded-lg bg-black border-2 border-gray-800 text-white text-center uppercase tracking-[0.3em] font-mono font-bold text-lg focus-visible:ring-0 focus-visible:border-[#00f2ea] transition-all"
              data-testid="input-room-code"
            />
          </div>
          <Button 
            onClick={handleJoin}
            disabled={isLoading}
            className="h-14 px-8 bg-transparent border-2 border-[#00f2ea] text-[#00f2ea] hover:bg-[#00f2ea]/10 font-bold rounded-lg transition-all"
            style={{ boxShadow: '0 0 15px rgba(0, 242, 234, 0.3)' }}
            data-testid="button-join-room"
          >
            ENTRAR
          </Button>
        </div>

        <div className="mt-8 pt-6 text-center space-y-3 border-t border-gray-800/50">
          <p className="text-gray-500 text-xs">
            Desenvolvido com <span className="text-purple-400">💜</span> por <span className="text-gray-400">Rodrigo Freitas</span>
          </p>
          <p className="text-gray-600 text-xs">
            Inspirado em jogos sociais
          </p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <Link href="/privacidade" className="text-gray-600 hover:text-gray-400 transition-colors">
              Política de Privacidade
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/termos" className="text-gray-600 hover:text-gray-400 transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
    </div>
  );
};

const LobbyScreen = () => {
  const { room, user, goToModeSelect, leaveGame, enteredDuringGame } = useGameStore();
  const { toast } = useToast();

  if (!room) return null;

  const isHost = room.hostId === user?.uid;
  const players = room.players || [];
  const isWaitingForNextRound = enteredDuringGame && room.status === 'waiting';

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/#" + room.code);
    toast({ title: "Copiado!", description: "Link da sala copiado para a área de transferência." });
  };

  return (
    <div className="flex flex-col w-full max-w-md h-full py-6 px-4 animate-fade-in relative z-10">
      <div className="w-full flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div onClick={copyLink} className="cursor-pointer group">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1 group-hover:text-[#00f2ea] transition-colors">Código da Sala</p>
          <h2 className="text-4xl font-black tracking-widest font-mono flex items-center gap-3">
            <span className="text-[#00f2ea]" style={{ textShadow: '0 0 10px #00f2ea' }} data-testid="text-room-code">{room.code}</span>
            <Copy className="w-4 h-4 text-gray-600 group-hover:text-[#00f2ea] transition-colors" />
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={leaveGame}
          className="w-10 h-10 rounded-lg border border-gray-800 hover:border-[#ff0050] hover:bg-[#ff0050]/10 text-gray-500 hover:text-[#ff0050] transition-all"
          data-testid="button-leave-room"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 w-full bg-black/50 rounded-xl p-4 mb-4 overflow-y-auto border border-gray-800 scrollbar-hide">
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-widest">
          Tripulantes ({players.length})
          <span className="flex-1 h-[1px] bg-gray-800"></span>
        </h3>
        <ul className="space-y-3 pb-4">
          {players.map((p) => {
            const isMe = p.uid === user?.uid;
            const isPlayerHost = p.uid === room.hostId;
            const initial = p.name.charAt(0).toUpperCase();
            
            return (
              <li 
                key={p.uid} 
                className={cn(
                  "p-3 rounded-lg flex items-center justify-between border transition-all duration-300",
                  isMe ? "border-[#00f2ea] bg-[#00f2ea]/5" : "border-gray-800 bg-black/30 hover:border-gray-700"
                )}
                data-testid={`player-${p.uid}`}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2",
                    isMe ? "border-[#00f2ea] text-[#00f2ea]" : "border-gray-700 text-gray-400"
                  )}>
                    {initial}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("font-medium", isMe ? "text-[#00f2ea]" : "text-white")}>
                      {p.name} {isMe && '(Você)'}
                    </span>
                    {isPlayerHost && (
                      <span className="text-[10px] text-[#ff0050] uppercase tracking-widest font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Capitão
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {isWaitingForNextRound ? (
        <div className="w-full text-center text-yellow-400 py-4 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', boxShadow: '0 0 10px #facc15' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', boxShadow: '0 0 10px #facc15' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', boxShadow: '0 0 10px #facc15' }}></div>
          </div>
          <p className="text-sm font-medium">Aguardando próxima rodada...</p>
          <p className="text-xs text-gray-400">Você entrará quando a rodada começar</p>
        </div>
      ) : isHost ? (
        <div className="w-full animate-fade-in">
          <Button 
            onClick={goToModeSelect}
            disabled={players.length < 3}
            className="w-full h-16 btn-neon-filled font-bold text-lg rounded-lg transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-start-game"
          >
            <Play className="mr-2 fill-current" /> ESCOLHER MODO
          </Button>
          {players.length < 3 && (
            <p className="text-center text-xs text-[#ff0050] mt-3">Mínimo de 3 tripulantes</p>
          )}
        </div>
      ) : (
        <div className="w-full text-center text-gray-500 py-4 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#00f2ea] rounded-full animate-bounce" style={{ animationDelay: '0ms', boxShadow: '0 0 10px #00f2ea' }}></div>
            <div className="w-2 h-2 bg-[#00f2ea] rounded-full animate-bounce" style={{ animationDelay: '150ms', boxShadow: '0 0 10px #00f2ea' }}></div>
            <div className="w-2 h-2 bg-[#00f2ea] rounded-full animate-bounce" style={{ animationDelay: '300ms', boxShadow: '0 0 10px #00f2ea' }}></div>
          </div>
          <p className="text-sm">Aguardando o capitão iniciar...</p>
        </div>
      )}
    </div>
  );
};

const ModeSelectScreen = () => {
  const { room, user, gameModes, selectedMode, selectMode, startGame, backToLobby, fetchGameModes, showSpeakingOrderWheel, speakingOrder, setSpeakingOrder, setShowSpeakingOrderWheel } = useGameStore();
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);

  const isHost = room && user && room.hostId === user.uid;

  useEffect(() => {
    fetchGameModes();
  }, [fetchGameModes]);

  const handleStartGameWithSorteio = async () => {
    if (!selectedMode || !room) return;
    
    setIsStarting(true);
    setShowSpeakingOrderWheel(true);
    
    // Esperar a animação completar antes de chamar startGame
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/rooms/${room.code}/speaking-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setSpeakingOrder(data.speakingOrder);
        }
      } catch (error) {
        console.error('Erro ao sortear ordem de fala:', error);
      }
      
      // Depois sortear, chamar startGame
      await startGame();
      setIsStarting(false);
    }, 100);
  };

  const handleBackClick = () => {
    backToLobby();
    if (isHost) {
      toast({ title: "Retornando ao lobby...", description: "Todos os jogadores foram levados de volta." });
    }
  };

  if (!room) return null;

  return (
    <div className="flex flex-col w-full max-w-md h-full py-6 px-4 animate-fade-in relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBackClick}
          className="w-10 h-10 rounded-lg border border-gray-800 hover:border-[#00f2ea] text-gray-400 hover:text-[#00f2ea] transition-all"
          data-testid="button-back-to-lobby"
          title={isHost ? "Voltar ao lobby (todos os jogadores serão levados)" : "Voltar ao lobby"}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">Escolha o Modo</h2>
          <p className="text-gray-500 text-sm">Selecione como jogar</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => selectMode(mode.id as GameModeType)}
            className={cn(
              "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
              selectedMode === mode.id 
                ? "border-[#00f2ea] bg-[#00f2ea]/5" 
                : "border-gray-800 bg-black/50 hover:border-gray-700"
            )}
            style={selectedMode === mode.id ? { boxShadow: '0 0 20px rgba(0, 242, 234, 0.2)' } : {}}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2",
                selectedMode === mode.id ? "border-[#00f2ea] bg-[#00f2ea]/10" : "border-gray-800 bg-black"
              )}>
                {getModeEmoji(mode.id)}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{mode.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{mode.desc}</p>
              </div>
              {selectedMode === mode.id && (
                <div className="w-6 h-6 rounded-full bg-[#00f2ea] flex items-center justify-center"
                     style={{ boxShadow: '0 0 10px #00f2ea' }}>
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button 
        onClick={handleStartGameWithSorteio}
        disabled={!selectedMode || isStarting}
        className="w-full h-16 btn-neon-filled font-bold text-lg rounded-lg transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Rocket className="mr-2" /> INICIAR PARTIDA
      </Button>
      
      {showSpeakingOrderWheel && room && (
        <SpeakingOrderWheel 
          players={room.players} 
          onComplete={(order) => {
            setSpeakingOrder(order);
            setShowSpeakingOrderWheel(false);
          }}
          isSpinning={true}
        />
      )}
    </div>
  );
};

type PerguntasDiferentesPhase = 'viewing' | 'answering' | 'showing' | 'revealed';

const QuestionRevealedOverlay = ({ 
  crewQuestion, 
  myQuestion,
  isImpostor, 
  isHost, 
  onNewRound,
  onClose 
}: { 
  crewQuestion: string;
  myQuestion: string;
  isImpostor: boolean;
  isHost: boolean;
  onNewRound: () => void;
  onClose: () => void;
}) => {
  const questionsDiffer = crewQuestion !== myQuestion;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="w-full bg-gradient-to-br from-[#ff0050]/10 to-[#ff0050]/5 rounded-2xl p-6 border border-[#ff0050]/30 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-xl border-2 border-[#ff0050] flex items-center justify-center mb-4"
                 style={{ boxShadow: '0 0 30px rgba(255, 0, 80, 0.3)' }}>
              <Eye className="w-8 h-8 text-[#ff0050]" />
            </div>
            <p className="text-[#ff0050] text-sm uppercase tracking-widest font-bold">Pergunta dos Tripulantes</p>
            <p className="text-2xl text-white font-bold leading-relaxed">"{crewQuestion}"</p>
          </div>
          
          {isImpostor && questionsDiffer && (
            <div className="text-center pt-4 border-t border-[#ff0050]/20 space-y-2">
              <p className="text-[#ff0050] text-lg font-bold animate-pulse">
                Sua pergunta era diferente!
              </p>
              <p className="text-gray-400 text-sm">
                Tente se justificar e convencer que voce nao e o impostor!
              </p>
            </div>
          )}
          
          {!isImpostor && (
            <div className="text-center pt-4 border-t border-[#00f2ea]/20">
              <p className="text-[#00f2ea] text-sm">
                Descubra quem recebeu uma pergunta diferente!
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={onClose}
          className="w-full h-12 border-2 border-gray-700 bg-transparent text-gray-400 hover:border-[#00f2ea] hover:text-[#00f2ea] hover:bg-transparent rounded-lg"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Voltar ao Jogo
        </Button>

        {isHost && (
          <Button 
            onClick={onNewRound}
            className="w-full border-2 border-[#00f2ea] bg-transparent text-[#00f2ea] hover:bg-[#00f2ea]/10 rounded-lg"
          >
            <RotateCcw className="mr-2 w-4 h-4" /> Nova Rodada
          </Button>
        )}
      </div>
    </div>
  );
};

const PerguntasDiferentesScreen = () => {
  const { user, room, returnToLobby, revealQuestion } = useGameStore();
  const [phase, setPhase] = useState<PerguntasDiferentesPhase>('viewing');
  const [isRevealed, setIsRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [savedAnswer, setSavedAnswer] = useState('');
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);

  if (!room || !room.gameData) return null;

  const isHost = room.hostId === user?.uid;
  const isImpostor = user?.uid === room.impostorId;
  const gameData = room.gameData;
  const questionRevealed = gameData.questionRevealed === true;
  
  const myQuestion = isImpostor ? gameData.impostorQuestion : gameData.question;
  const crewQuestion = gameData.question || '';

  const handleNewRound = () => {
    setShowAdPopup(true);
  };

  const handleCloseAd = () => {
    setShowAdPopup(false);
    returnToLobby();
  };

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      setSavedAnswer(answer.trim());
      setPhase('showing');
    }
  };

  const handleProceedToAnswer = () => {
    setPhase('answering');
  };

  const showOverlay = questionRevealed && !hideOverlay;

  if (phase === 'viewing') {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full max-w-md h-full p-6 animate-fade-in space-y-6 relative z-10">
          <HomeButton inline />
          <div 
            className={cn(
              "w-full aspect-[3/4] max-h-[500px] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative transition-all duration-500 cursor-pointer overflow-hidden",
              isRevealed 
                ? "innocent-card"
                : "bg-black border-2 border-gray-800"
            )}
            onClick={() => !isRevealed && setIsRevealed(true)}
            data-testid="card-reveal"
          >
            {!isRevealed ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Eye className="w-20 h-20 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400">TOQUE PARA REVELAR</h3>
                <p className="text-gray-600 text-sm">Veja sua pergunta</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <EyeOff className="w-5 h-5 text-white/60" />
                </button>
                
                <div className="w-24 h-24 rounded-xl border-2 border-[#00f2ea] flex items-center justify-center mb-2"
                     style={{ boxShadow: '0 0 30px rgba(0, 242, 234, 0.3)' }}>
                  <HelpCircle className="w-12 h-12 text-[#00f2ea]" />
                </div>
                
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Sua Pergunta</p>
                    <h2 className="text-xl text-white font-bold leading-relaxed px-2">"{myQuestion}"</h2>
                  </div>
                  <p className="text-gray-400 text-sm">Memorize sua pergunta!</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm text-center">
            {isRevealed ? "Toque no X para esconder" : "Toque para ver sua pergunta"}
          </p>

          {isRevealed && (
            <Button 
              onClick={handleProceedToAnswer}
              className="w-full h-14 btn-neon-filled font-bold text-lg rounded-lg transition-all active:scale-[0.98]"
            >
              <MessageSquare className="mr-2 w-5 h-5" /> Responder Pergunta
            </Button>
          )}
        </div>
        {showOverlay && (
          <QuestionRevealedOverlay 
            crewQuestion={crewQuestion}
            myQuestion={myQuestion || ''}
            isImpostor={isImpostor}
            isHost={isHost}
            onNewRound={handleNewRound}
            onClose={() => setHideOverlay(true)}
          />
        )}
        <AdPopup isOpen={showAdPopup} onClose={handleCloseAd} />
      </>
    );
  }

  if (phase === 'answering') {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full max-w-md h-full p-6 animate-fade-in space-y-6 relative z-10">
          <HomeButton inline />
          <div className="w-full bg-black/50 rounded-2xl p-6 border border-gray-800 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Sua Pergunta</p>
              <h2 className="text-lg text-white font-bold leading-relaxed">"{myQuestion}"</h2>
            </div>
            
            <div className="w-full h-[1px] bg-gray-800"></div>
            
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center">Digite sua resposta abaixo:</p>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Sua resposta..."
                className="w-full min-h-[120px] p-4 rounded-xl bg-black border-2 border-gray-800 text-white text-lg placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-[#00f2ea] transition-all resize-none"
              />
            </div>

            <Button 
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className="w-full h-14 btn-neon-filled font-bold text-lg rounded-lg transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="mr-2 w-5 h-5" /> Enviar Resposta
            </Button>
          </div>
        </div>
        {showOverlay && (
          <QuestionRevealedOverlay 
            crewQuestion={crewQuestion}
            myQuestion={myQuestion || ''}
            isImpostor={isImpostor}
            isHost={isHost}
            onNewRound={handleNewRound}
            onClose={() => setHideOverlay(true)}
          />
        )}
        <AdPopup isOpen={showAdPopup} onClose={handleCloseAd} />
      </>
    );
  }

  if (phase === 'showing') {
    return (
      <>
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-40">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4 text-[#00f2ea]">
                <Smartphone className="w-6 h-6 rotate-90" />
                <p className="text-sm uppercase tracking-widest font-bold">Vire o celular na horizontal</p>
              </div>
              <p className="text-gray-500 text-xs">Mostre sua resposta para todos</p>
            </div>
            
            <div 
              className="w-full max-w-4xl bg-gradient-to-br from-[#1a1a2e] to-[#0a0a15] rounded-3xl p-8 md:p-12 border-2 border-[#00f2ea]/30 shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(0, 242, 234, 0.15)' }}
            >
              <p className="text-4xl md:text-6xl lg:text-7xl text-white font-black text-center leading-tight break-words">
                {savedAnswer}
              </p>
            </div>

            <div className="mt-8 space-y-4 w-full max-w-md">
              <Button 
                onClick={() => setPhase('revealed')}
                className="w-full h-12 border-2 border-gray-700 bg-transparent text-gray-400 hover:border-[#00f2ea] hover:text-[#00f2ea] hover:bg-transparent rounded-lg"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
              </Button>
            </div>
          </div>
        </div>
        {showOverlay && (
          <QuestionRevealedOverlay 
            crewQuestion={crewQuestion}
            myQuestion={myQuestion || ''}
            isImpostor={isImpostor}
            isHost={isHost}
            onNewRound={handleNewRound}
            onClose={() => setHideOverlay(true)}
          />
        )}
        <AdPopup isOpen={showAdPopup} onClose={handleCloseAd} />
      </>
    );
  }

  if (phase === 'revealed') {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full max-w-md h-full p-6 animate-fade-in space-y-6 relative z-10">
          <HomeButton inline />
          <div className="w-full bg-black/50 rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-widest">Sua Resposta</p>
              <p className="text-xl text-white font-bold">"{savedAnswer}"</p>
            </div>
            
            <Button 
              onClick={() => setPhase('showing')}
              className="w-full h-12 border-2 border-[#00f2ea] bg-transparent text-[#00f2ea] hover:bg-[#00f2ea]/10 rounded-lg font-medium"
            >
              <Smartphone className="mr-2 w-4 h-4 rotate-90" /> Mostrar Resposta Ampliada
            </Button>
          </div>

          {questionRevealed && (
            <div className="w-full bg-gradient-to-br from-[#ff0050]/10 to-[#ff0050]/5 rounded-2xl p-6 border border-[#ff0050]/30 space-y-4 animate-fade-in">
              <div className="text-center space-y-2">
                <p className="text-[#ff0050] text-xs uppercase tracking-widest font-bold">Pergunta dos Tripulantes</p>
                <p className="text-xl text-white font-bold leading-relaxed">"{crewQuestion}"</p>
              </div>
              {isImpostor && (
                <div className="text-center pt-4 border-t border-[#ff0050]/20">
                  <p className="text-[#ff0050] text-sm font-medium">
                    Sua pergunta era diferente! Tente se justificar!
                  </p>
                </div>
              )}
            </div>
          )}

          {isHost && !questionRevealed && (
            <Button 
              onClick={() => revealQuestion()}
              className="w-full h-14 bg-[#ff0050] hover:bg-[#ff0050]/80 text-white font-bold text-lg rounded-lg transition-all"
              style={{ boxShadow: '0 0 20px rgba(255, 0, 80, 0.3)' }}
            >
              <Eye className="mr-2 w-5 h-5" /> Mostrar Pergunta
            </Button>
          )}

          {isHost && (
            <Button 
              onClick={handleNewRound}
              className="w-full border-2 border-gray-700 bg-transparent text-gray-400 hover:border-[#00f2ea] hover:text-[#00f2ea] hover:bg-transparent rounded-lg"
            >
              <RotateCcw className="mr-2 w-4 h-4" /> Nova Rodada
            </Button>
          )}
        </div>
        {showOverlay && (
          <QuestionRevealedOverlay 
            crewQuestion={crewQuestion}
            myQuestion={myQuestion || ''}
            isImpostor={isImpostor}
            isHost={isHost}
            onNewRound={handleNewRound}
            onClose={() => setHideOverlay(true)}
          />
        )}
        <AdPopup isOpen={showAdPopup} onClose={handleCloseAd} />
      </>
    );
  }

  return null;
};

const GameScreen = () => {
  const { user, room, returnToLobby } = useGameStore();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);

  const handleNewRound = () => {
    setShowAdPopup(true);
  };

  const handleCloseAd = () => {
    setShowAdPopup(false);
    returnToLobby();
  };

  if (!room) return null;

  const isHost = room.hostId === user?.uid;
  const isImpostor = user?.uid === room.impostorId;
  const gameData = room.gameData;
  const gameMode = room.gameMode;

  if (gameMode === 'perguntasDiferentes') {
    return <PerguntasDiferentesScreen />;
  }

  const renderInnocentContent = () => {
    if (!gameData) return null;

    switch (gameMode) {
      case 'palavraSecreta':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Palavra Secreta</p>
              <h2 className="text-4xl text-white font-black tracking-wide">{gameData.word}</h2>
            </div>
            <p className="text-gray-400 text-sm">Dê dicas sutis sobre a palavra!</p>
          </div>
        );
      
      case 'palavras':
        const myRole = user?.uid ? gameData.roles?.[user.uid] : null;
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Local</p>
              <h2 className="text-3xl text-white font-black">{gameData.location}</h2>
            </div>
            <div className="w-full h-[1px] bg-[#00f2ea]/30"></div>
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Sua Função</p>
              <h3 className="text-2xl text-white font-bold">{myRole}</h3>
            </div>
            <p className="text-gray-400 text-sm">Descreva o local de acordo com sua função!</p>
          </div>
        );
      
      case 'duasFaccoes':
        const myFaction = user?.uid ? gameData.factionMap?.[user.uid] : null;
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Sua Palavra</p>
              <h2 className="text-4xl text-white font-black">{myFaction}</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Existem duas palavras no jogo!<br/>
              Descubra quem é do seu time.
            </p>
          </div>
        );
      
      case 'categoriaItem':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Categoria</p>
              <h3 className="text-2xl text-white font-bold">{gameData.category}</h3>
            </div>
            <div className="w-full h-[1px] bg-[#00f2ea]/30"></div>
            <div className="space-y-2">
              <p className="text-[#00f2ea] text-sm uppercase tracking-widest font-bold">Item</p>
              <h2 className="text-4xl text-white font-black">{gameData.item}</h2>
            </div>
            <p className="text-gray-400 text-sm">Descreva o item de forma indireta!</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderImpostorContent = () => {
    if (!gameData) return null;

    switch (gameMode) {
      case 'palavraSecreta':
        return (
          <div className="space-y-4 text-center">
            <p className="text-gray-300 text-lg font-medium">
              Finja que você sabe a palavra!<br/>
              Engane a todos.
            </p>
          </div>
        );
      
      case 'palavras':
        return (
          <div className="space-y-4 text-center">
            <p className="text-gray-300 text-lg font-medium">
              Você não sabe o local!<br/>
              Tente descobrir através das dicas.
            </p>
          </div>
        );
      
      case 'duasFaccoes':
        return (
          <div className="space-y-4 text-center">
            <p className="text-gray-300 text-lg font-medium">
              Existem duas palavras no jogo!<br/>
              Você não sabe nenhuma delas.
            </p>
          </div>
        );
      
      case 'categoriaItem':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-[#ff0050] text-sm uppercase tracking-widest font-bold">Categoria</p>
              <h3 className="text-2xl text-white font-bold">{gameData.category}</h3>
            </div>
            <p className="text-gray-300 text-lg font-medium">
              Você só sabe a categoria!<br/>
              Descubra o item específico.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md h-full p-6 animate-fade-in space-y-6 relative z-10">
      <HomeButton inline />
      <div 
        className={cn(
          "w-full aspect-[3/4] max-h-[500px] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative transition-all duration-500 cursor-pointer overflow-hidden",
          isRevealed 
            ? (isImpostor ? "impostor-card" : "innocent-card")
            : "bg-black border-2 border-gray-800"
        )}
        onClick={() => setIsRevealed(!isRevealed)}
        data-testid="card-reveal"
      >
        {!isRevealed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Eye className="w-20 h-20 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">TOQUE PARA REVELAR</h3>
            <p className="text-gray-600 text-sm">Veja sua função secreta</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <EyeOff className="w-5 h-5 text-white/60" />
            </button>
             
            {isImpostor ? (
              <>
                <div className="w-24 h-24 rounded-xl border-2 border-[#ff0050] flex items-center justify-center mb-2"
                     style={{ boxShadow: '0 0 30px rgba(255, 0, 80, 0.3)' }}>
                  <User className="w-12 h-12 text-[#ff0050]" />
                </div>
                <h2 className="text-4xl font-black tracking-widest uppercase" 
                    style={{ color: '#ff0050', textShadow: '0 0 20px #ff0050' }}
                    data-testid="text-role-impostor">IMPOSTOR</h2>
                {renderImpostorContent()}
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-xl border-2 border-[#00f2ea] flex items-center justify-center mb-2"
                     style={{ boxShadow: '0 0 30px rgba(0, 242, 234, 0.3)' }}>
                  <Rocket className="w-12 h-12 text-[#00f2ea]" />
                </div>
                <h2 className="text-3xl font-black tracking-widest uppercase"
                    style={{ color: '#00f2ea', textShadow: '0 0 20px #00f2ea' }}
                    data-testid="text-role-crew">TRIPULANTE</h2>
                {renderInnocentContent()}
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm text-center">
        {isRevealed ? "Toque para esconder" : "Toque para ver sua função"}
      </p>

      {isHost && (
        <Button 
          onClick={handleNewRound}
          className="mt-4 border-2 border-gray-700 bg-transparent text-gray-400 hover:border-[#00f2ea] hover:text-[#00f2ea] hover:bg-transparent w-full rounded-lg"
          data-testid="button-return-lobby"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Nova Rodada
        </Button>
      )}

      <AdPopup isOpen={showAdPopup} onClose={handleCloseAd} />
    </div>
  );
};


export default function ImpostorGame() {
  const { status } = useGameStore();
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center font-poppins text-white overflow-hidden relative grid-bg">
      <NeonLines />
      <NotificationCenter />
      
      <DonationButton onClick={() => setIsDonationOpen(true)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />

      {status === 'home' && <HomeScreen />}
      {status === 'lobby' && <LobbyScreen />}
      {status === 'modeSelect' && <ModeSelectScreen />}
      {status === 'submodeSelect' && <PalavraSuperSecretaSubmodeScreen />}
      {status === 'playing' && <GameScreen />}
    </div>
  );
}
