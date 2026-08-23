export interface BestTime {
  timeMs: number;
  moves: number;
  achievedAt: number;
}

function bestTimeKey(puzzleId: string, rows: number, cols: number): string {
  return `jigsaw:best:${puzzleId}:${rows}x${cols}`;
}

export function getBestTime(puzzleId: string, rows: number, cols: number): BestTime | null {
  try {
    const raw = localStorage.getItem(bestTimeKey(puzzleId, rows, cols));
    if (!raw) return null;
    return JSON.parse(raw) as BestTime;
  } catch {
    return null;
  }
}

/** Saves the result if it beats (or is the first) best time for this puzzle+size. Returns true if it's a new best. */
export function saveBestTimeIfBetter(
  puzzleId: string,
  rows: number,
  cols: number,
  timeMs: number,
  moves: number,
): boolean {
  const key = bestTimeKey(puzzleId, rows, cols);
  const current = getBestTime(puzzleId, rows, cols);
  if (current && current.timeMs <= timeMs) return false;
  try {
    const record: BestTime = { timeMs, moves, achievedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // ignore storage errors
  }
  return true;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mm = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, '0');
  const ss = (totalSec % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}
