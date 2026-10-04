const NAME_KEY = 'jigsaw:room-name';
const PLAYER_KEY = 'jigsaw:room-player';

export interface RoomPlayer {
  id: string;
  name: string;
  connected: boolean;
  percent: number;
  moves: number;
  solved: boolean;
  timeMs: number | null;
  isHost: boolean;
}

export interface PuzzleRoomState {
  code: string;
  imageId: string;
  pieces: number;
  title: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  players: Record<string, RoomPlayer>;
  createdAt: number;
  startedAt: number | null;
}

function randomId(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `p-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function getPlayerId(): string {
  try {
    const existing = localStorage.getItem(PLAYER_KEY);
    if (existing) return existing;
    const id = randomId();
    localStorage.setItem(PLAYER_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

export function getPlayerName(): string {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setPlayerName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name.slice(0, 24));
  } catch {
    // ignore
  }
}

export async function createPuzzleRoom(input: {
  imageId: string;
  pieces: number;
  title: string;
  name: string;
}): Promise<PuzzleRoomState> {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...input, playerId: getPlayerId() }),
  });
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Rooms are not available on this server yet.' : 'Could not create a room.');
  }
  return (await response.json()) as PuzzleRoomState;
}

export async function fetchPuzzleRoom(code: string): Promise<PuzzleRoomState> {
  const response = await fetch(`/api/rooms/${code.toUpperCase()}`);
  if (!response.ok) throw new Error('That room was not found.');
  return (await response.json()) as PuzzleRoomState;
}

export function roomWebSocket(code: string, name: string): WebSocket {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const params = new URLSearchParams({ playerId: getPlayerId(), name });
  return new WebSocket(`${proto}://${location.host}/api/rooms/${code.toUpperCase()}/ws?${params}`);
}

export function roomShareUrl(code: string): string {
  return `${location.origin}/play/${code.toUpperCase()}`;
}

export function playerList(room: PuzzleRoomState): RoomPlayer[] {
  return Object.values(room.players).sort((a, b) => {
    if (a.solved !== b.solved) return a.solved ? -1 : 1;
    if (a.solved && b.solved) return (a.timeMs ?? 0) - (b.timeMs ?? 0);
    return b.percent - a.percent;
  });
}
