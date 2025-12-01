import { create } from 'zustand';

export type Player = {
  uid: string;
  name: string;
};

export type GameStatus = 'home' | 'lobby' | 'modeSelect' | 'submodeSelect' | 'playing';

export type GameModeType = 
  | "palavraSecreta"
  | "palavras" 
  | "duasFaccoes"
  | "categoriaItem"
  | "perguntasDiferentes";

export type GameData = {
  word?: string;
  location?: string;
  roles?: Record<string, string>;
  factions?: { A: string; B: string };
  factionMap?: Record<string, string>;
  category?: string;
  item?: string;
  question?: string;
  impostorQuestion?: string;
  questionRevealed?: boolean;
};

export type Room = {
  code: string;
  hostId: string;
  status: string;
  gameMode: GameModeType | null;
  currentCategory: string | null;
  currentWord: string | null;
  impostorId: string | null;
  gameData: GameData | null;
  players: Player[];
  createdAt: string;
};

export type GameMode = {
  id: string;
  title: string;
  desc: string;
  impostorGoal: string;
};

export type GameState = {
  user: Player | null;
  room: Room | null;
  status: GameStatus;
  isLoading: boolean;
  ws: WebSocket | null;
  gameModes: GameMode[];
  selectedMode: GameModeType | null;
  submodeSelect: boolean;
  
  setUser: (name: string) => void;
  createRoom: () => Promise<void>;
  joinRoom: (code: string) => Promise<boolean>;
  selectMode: (mode: GameModeType) => void;
  startGame: () => Promise<void>;
  returnToLobby: () => Promise<void>;
  leaveGame: () => void;
  goToModeSelect: () => void;
  backToLobby: () => void;
  connectWebSocket: (code: string) => void;
  updateRoom: (room: Room) => void;
  fetchGameModes: () => Promise<void>;
  revealQuestion: () => Promise<void>;
};

function generateUID(): string {
  return 'user-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  room: null,
  status: 'home',
  isLoading: false,
  ws: null,
  gameModes: [],
  selectedMode: null,
  submodeSelect: false,

  setUser: (name: string) => {
    const uid = generateUID();
    set({ user: { uid, name } });
  },

  fetchGameModes: async () => {
    try {
      const response = await fetch('/api/game-modes');
      if (response.ok) {
        const modes = await response.json();
        set({ gameModes: modes });
      }
    } catch (error) {
      console.error('Error fetching game modes:', error);
    }
  },

  selectMode: (mode: GameModeType) => {
    set({ selectedMode: mode });
    
    // If Palavra Secreta, show submode selection first
    if (mode === 'palavraSecreta') {
      set({ status: 'submodeSelect' });
    } else {
      set({ status: 'playing' });
    }
  },

  goToModeSelect: () => {
    set({ status: 'modeSelect' });
    get().fetchGameModes();
  },

  backToLobby: () => {
    const { user, room, ws } = get();
    set({ status: 'lobby', selectedMode: null, submodeSelect: false });
    
    // If host, broadcast to all players
    if (room && user && room.hostId === user.uid && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'host-back-to-lobby',
        roomCode: room.code
      }));
    }
  },

  connectWebSocket: (code: string) => {
    const ws = get().ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const newWs = new WebSocket(`${protocol}//${window.location.host}/game-ws`);

    newWs.onopen = () => {
      newWs.send(JSON.stringify({ type: 'join-room', roomCode: code }));
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room-update' && data.room) {
          get().updateRoom(data.room);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    set({ ws: newWs });
  },

  updateRoom: (room: Room) => {
    const currentUser = get().user;
    if (!currentUser) return;

    let newStatus: GameStatus = 'lobby';
    if (room.status === 'playing') {
      newStatus = 'playing';
    }

    set({ 
      room,
      status: newStatus,
    });
  },

  createRoom: async () => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true });

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: user.uid,
          hostName: user.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to create room');

      const room: Room = await response.json();
      
      set({ 
        room,
        status: 'lobby',
        isLoading: false 
      });

      get().connectWebSocket(room.code);

    } catch (error) {
      console.error('Error creating room:', error);
      set({ isLoading: false });
    }
  },

  joinRoom: async (code: string) => {
    const { user } = get();
    if (!user) return false;

    set({ isLoading: true });

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          playerId: user.uid,
          playerName: user.name,
        }),
      });

      if (!response.ok) {
        set({ isLoading: false });
        return false;
      }

      const room: Room = await response.json();
      
      set({ 
        room,
        status: 'lobby',
        isLoading: false 
      });

      get().connectWebSocket(room.code);
      return true;

    } catch (error) {
      console.error('Error joining room:', error);
      set({ isLoading: false });
      return false;
    }
  },

  startGame: async () => {
    const { room, selectedMode } = get();
    if (!room || !selectedMode) return;

    try {
      const requestBody: any = { gameMode: selectedMode };
      
      // If Palavra Secreta, add the selected submode
      if (selectedMode === 'palavraSecreta') {
        const submode = localStorage.getItem('selectedSubmode');
        if (submode) {
          requestBody.selectedSubmode = submode;
        }
      }

      const response = await fetch(`/api/rooms/${room.code}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to start game');

    } catch (error) {
      console.error('Error starting game:', error);
    }
  },

  returnToLobby: async () => {
    const { room } = get();
    if (!room) return;

    try {
      const response = await fetch(`/api/rooms/${room.code}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to reset room');
      
      set({ selectedMode: null });

    } catch (error) {
      console.error('Error resetting room:', error);
    }
  },

  leaveGame: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
    }
    
    set({
      status: 'home',
      room: null,
      ws: null,
      selectedMode: null,
    });
  },

  revealQuestion: async () => {
    const { room } = get();
    if (!room) return;

    try {
      const response = await fetch(`/api/rooms/${room.code}/reveal-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to reveal question');

    } catch (error) {
      console.error('Error revealing question:', error);
    }
  }
}));
