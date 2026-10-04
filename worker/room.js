const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_PLAYERS = 8;
const ROOM_TTL_MS = 1000 * 60 * 60 * 6;

export function randomRoomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function emptyRoom(code, config) {
  return {
    code,
    imageId: config.imageId,
    pieces: config.pieces,
    title: config.title,
    hostId: config.hostId,
    status: 'lobby',
    players: {},
    createdAt: Date.now(),
    startedAt: null,
  };
}

export class PuzzleRoom {
  constructor(state) {
    this.ctx = state;
    this.room = null;
  }

  async load() {
    if (this.room) return this.room;
    this.room = (await this.ctx.storage.get('room')) ?? null;
    return this.room;
  }

  async save() {
    if (this.room) await this.ctx.storage.put('room', this.room);
  }

  json(data, status = 200) {
    return Response.json(data, { status });
  }

  publicRoom() {
    return this.room;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1]);
      pair[1].serializeAttachment({
        playerId: url.searchParams.get('playerId') || '',
        name: (url.searchParams.get('name') || 'Friend').slice(0, 24),
      });
      this.ctx.waitUntil(this.addPlayerFromSocket(pair[1]));
      return new Response(null, { status: 101, webSocket: pair[0] });
    }

    const room = await this.load();

    if (url.pathname.endsWith('/create') && request.method === 'POST') {
      const body = await request.json();
      this.room = emptyRoom(body.code, body);
      this.addPlayer(body.hostId, body.name, true);
      await this.save();
      return this.json(this.publicRoom());
    }

    if (!room) return this.json({ error: 'Room not found' }, 404);
    if (Date.now() - room.createdAt > ROOM_TTL_MS) {
      await this.ctx.storage.deleteAll();
      this.room = null;
      return this.json({ error: 'Room expired' }, 410);
    }

    return this.json(this.publicRoom());
  }

  async addPlayerFromSocket(ws) {
    const room = await this.load();
    if (!room) {
      ws.close(4000, 'missing');
      return;
    }
    const meta = ws.deserializeAttachment() || {};
    if (!meta.playerId) {
      ws.close(4001, 'no player');
      return;
    }
    try {
      this.addPlayer(meta.playerId, meta.name, false);
    } catch (error) {
      ws.close(error instanceof Error && error.message === 'full' ? 4002 : 4000, 'join failed');
      return;
    }
    await this.save();
    this.broadcastState();
  }

  addPlayer(playerId, name, isHost) {
    if (!this.room) return;
    const existing = this.room.players[playerId];
    if (existing) {
      existing.connected = true;
      existing.name = name || existing.name;
      return;
    }
    if (Object.keys(this.room.players).length >= MAX_PLAYERS) {
      throw new Error('full');
    }
    this.room.players[playerId] = {
      id: playerId,
      name: name || 'Friend',
      connected: true,
      percent: 0,
      moves: 0,
      solved: false,
      timeMs: null,
      isHost: isHost || playerId === this.room.hostId,
    };
  }

  async webSocketMessage(ws, payload) {
    const room = await this.load();
    if (!room) return;
    let msg;
    try {
      msg = JSON.parse(typeof payload === 'string' ? payload : payload.toString());
    } catch {
      return;
    }

    const meta = ws.deserializeAttachment() || {};
    const player = room.players[meta.playerId];
    if (!player) return;

    if (msg.type === 'hello') {
      player.name = String(msg.name || player.name).slice(0, 24);
      player.connected = true;
      await this.save();
      this.broadcastState();
      return;
    }

    if (msg.type === 'start' && (player.isHost || meta.playerId === room.hostId) && room.status === 'lobby') {
      room.status = 'playing';
      room.startedAt = Date.now();
      await this.save();
      this.broadcastState();
      return;
    }

    if (msg.type === 'progress' && room.status !== 'lobby') {
      player.percent = Math.max(0, Math.min(100, Math.round(Number(msg.percent) || 0)));
      player.moves = Math.max(0, Math.round(Number(msg.moves) || 0));
      if (msg.solved) {
        player.solved = true;
        player.percent = 100;
        player.timeMs = Math.max(1, Math.round(Number(msg.timeMs) || Date.now() - (room.startedAt || Date.now())));
        const allDone = Object.values(room.players).every((item) => item.solved || !item.connected);
        if (allDone) room.status = 'finished';
      }
      await this.save();
      this.broadcastState();
    }
  }

  async webSocketClose(ws) {
    const room = await this.load();
    if (!room) return;
    const meta = ws.deserializeAttachment() || {};
    const player = room.players[meta.playerId];
    if (player) player.connected = false;
    await this.save();
    this.broadcastState();
  }

  broadcastState() {
    const message = JSON.stringify({ type: 'state', room: this.room });
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(message);
      } catch {
        // ignore dead sockets
      }
    }
  }
}
