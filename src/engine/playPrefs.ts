const PIECES_PREF_KEY = 'jigsaw:pref:pieces';
export const ROTATION_PREF_KEY = 'jigsaw:pref:rotationEnabled';

export const MIN_PIECES = 6;
export const MAX_PIECES = 500;
export const DEFAULT_PIECES = 48;

export const DIFFICULTY_PRESETS = [
  { label: 'Easy', pieces: 24 },
  { label: 'Medium', pieces: 48 },
  { label: 'Hard', pieces: 100 },
  { label: 'Extreme', pieces: 300 },
];

export function getStoredPieceCount(): number {
  try {
    const value = Number(localStorage.getItem(PIECES_PREF_KEY));
    if (Number.isFinite(value) && value >= MIN_PIECES && value <= MAX_PIECES) return value;
  } catch {
    // ignore
  }
  return DEFAULT_PIECES;
}

export function setStoredPieceCount(value: number): void {
  try {
    localStorage.setItem(PIECES_PREF_KEY, String(value));
  } catch {
    // ignore
  }
}

export function getStoredBoolPref(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === '1';
  } catch {
    return fallback;
  }
}

export function setStoredBoolPref(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // ignore
  }
}
