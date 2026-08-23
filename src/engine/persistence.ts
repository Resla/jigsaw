export interface PersistedPuzzleState {
  positions: Record<number, { x: number; y: number; rotation: number }>;
  groupMap: Record<number, number>;
  moves: number;
  elapsedMs: number;
  solved: boolean;
}

const STORAGE_PREFIX = 'jigsaw:puzzle:';

export function puzzleStorageKey(imageId: string, rows: number, cols: number, seed: number): string {
  return `${STORAGE_PREFIX}${imageId}:${rows}x${cols}:${seed}`;
}

export function loadPersistedState(key: string): PersistedPuzzleState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedPuzzleState;
  } catch {
    return null;
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveStateDebounced(key: string, state: PersistedPuzzleState, delayMs = 400): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full/unavailable — silently skip, this is a non-critical convenience feature.
    }
  }, delayMs);
}

export function clearPersistedState(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
