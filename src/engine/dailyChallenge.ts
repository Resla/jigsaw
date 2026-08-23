import { galleryImages, type GalleryImage } from '../data/gallery';
import { hashSeed } from './random';

export const DAILY_PIECE_COUNT = 100;
/** Day 1 of the challenge — used only to produce a friendly "#N" counter. */
const EPOCH = new Date('2026-08-23T00:00:00Z').getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

const STREAK_KEY = 'jigsaw:daily:streak';
const LAST_COMPLETED_KEY = 'jigsaw:daily:lastCompletedDate';

export interface DailyChallengeInfo {
  date: string;
  dayNumber: number;
  image: GalleryImage;
  pieceCount: number;
  puzzleId: string;
}

/** Today's UTC date as YYYY-MM-DD, so everyone gets the same challenge regardless of local timezone. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateStringToUtcMs(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getTime();
}

export function getDailyChallengeInfo(date: string = todayDateString()): DailyChallengeInfo {
  const dayNumber = Math.max(1, Math.floor((dateStringToUtcMs(date) - EPOCH) / DAY_MS) + 1);
  const index = hashSeed(`daily-image:${date}`) % galleryImages.length;
  const image = galleryImages[index];
  return {
    date,
    dayNumber,
    image,
    pieceCount: DAILY_PIECE_COUNT,
    puzzleId: `daily-${date}`,
  };
}

export function getStreak(): number {
  try {
    const last = localStorage.getItem(LAST_COMPLETED_KEY);
    const streak = Number(localStorage.getItem(STREAK_KEY) ?? 0);
    if (!last) return 0;
    const today = todayDateString();
    const yesterday = new Date(dateStringToUtcMs(today) - DAY_MS).toISOString().slice(0, 10);
    // If the player skipped a day, the streak is effectively broken until they play again.
    if (last !== today && last !== yesterday) return 0;
    return streak;
  } catch {
    return 0;
  }
}

export function hasCompletedToday(): boolean {
  try {
    return localStorage.getItem(LAST_COMPLETED_KEY) === todayDateString();
  } catch {
    return false;
  }
}

/** Records today's completion and returns the updated streak. Safe to call more than once per day. */
export function recordDailyCompletion(date: string = todayDateString()): number {
  try {
    const last = localStorage.getItem(LAST_COMPLETED_KEY);
    if (last === date) return Number(localStorage.getItem(STREAK_KEY) ?? 1);
    const yesterday = new Date(dateStringToUtcMs(date) - DAY_MS).toISOString().slice(0, 10);
    const prevStreak = Number(localStorage.getItem(STREAK_KEY) ?? 0);
    const nextStreak = last === yesterday ? prevStreak + 1 : 1;
    localStorage.setItem(LAST_COMPLETED_KEY, date);
    localStorage.setItem(STREAK_KEY, String(nextStreak));
    return nextStreak;
  } catch {
    return 1;
  }
}

export function buildShareText(info: {
  dayNumber: number;
  timeText: string;
  moves: number;
  streak: number;
}): string {
  const origin = typeof location !== 'undefined' ? location.origin : '';
  return [
    `🧩 Jigsaw Daily #${info.dayNumber}`,
    `⏱️ ${info.timeText} · ${info.moves} moves`,
    `🔥 ${info.streak}-day streak`,
    origin ? `Play: ${origin}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return 'shared';
    }
  } catch {
    // fall through to clipboard copy (user may have simply cancelled the share sheet)
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
