import { useEffect, useRef, useState } from 'react';
import {
  getPlayerId,
  getPlayerName,
  roomWebSocket,
  type PuzzleRoomState,
} from '../engine/roomClient';

export function usePuzzleRoom(code: string | null, name?: string) {
  const [room, setRoom] = useState<PuzzleRoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!code) return;
    const displayName = (name || getPlayerName() || 'Friend').slice(0, 24);
    let cancelled = false;
    let retry: number | undefined;
    let socket: WebSocket;

    const open = () => {
      socket = roomWebSocket(code, displayName);
      socketRef.current = socket;
      socket.onopen = () => {
        if (cancelled) return;
        setConnected(true);
        setError(null);
        socket.send(JSON.stringify({ type: 'hello', name: displayName, playerId: getPlayerId() }));
      };
      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as { type: string; room?: PuzzleRoomState };
          if (msg.type === 'state' && msg.room) setRoom(msg.room);
        } catch {
          // ignore
        }
      };
      socket.onclose = (event) => {
        if (cancelled) return;
        setConnected(false);
        if (event.code === 4000 || event.code === 4001) {
          setError('That room was not found.');
          return;
        }
        if (event.code === 4002) {
          setError('That room is full.');
          return;
        }
        retry = window.setTimeout(open, 1500);
      };
      socket.onerror = () => {
        setError('Could not reach the room.');
      };
    };

    open();
    return () => {
      cancelled = true;
      if (retry) window.clearTimeout(retry);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [code, name]);

  const send = (payload: Record<string, unknown>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  return { room, error, connected, send, playerId: getPlayerId() };
}
