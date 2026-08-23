export type HistorySource = { kind: 'gallery'; imageId: string } | { kind: 'custom'; customId: string };

export interface PuzzleHistoryEntry {
  storageKey: string;
  route: string;
  title: string;
  rows: number;
  cols: number;
  pieceCount: number;
  lastPlayedAt: number;
  source: HistorySource;
  daily?: { date: string; dayNumber: number };
}

const HISTORY_KEY = 'jigsaw:history';
const MAX_ENTRIES = 40;

function readAll(): PuzzleHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PuzzleHistoryEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: PuzzleHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors — history is a non-critical convenience feature
  }
}

/** Upserts a "visited this puzzle" record, most-recent first. Safe to call every time a puzzle loads. */
export function recordPuzzleVisit(entry: Omit<PuzzleHistoryEntry, 'lastPlayedAt'>): void {
  const rest = readAll().filter((e) => e.storageKey !== entry.storageKey);
  const next = [{ ...entry, lastPlayedAt: Date.now() }, ...rest].slice(0, MAX_ENTRIES);
  writeAll(next);
}

export function getPuzzleHistory(): PuzzleHistoryEntry[] {
  return readAll().sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
}

export function removeHistoryEntry(storageKey: string): void {
  writeAll(readAll().filter((e) => e.storageKey !== storageKey));
}

/** Reads how far along a saved puzzle is, from its own persisted state (source of truth). */
export function computeProgress(groupMap: Record<number, number>, totalPieces: number): number {
  if (totalPieces <= 0) return 0;
  const counts = new Map<number, number>();
  for (const root of Object.values(groupMap)) {
    counts.set(root, (counts.get(root) ?? 0) + 1);
  }
  let largest = 0;
  for (const count of counts.values()) largest = Math.max(largest, count);
  return Math.round((largest / totalPieces) * 100);
}
