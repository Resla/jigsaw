import { galleryImages, type GalleryImage } from '../data/gallery';
import { hashSeed } from './random';

export const DAILY_PIECE_COUNT = 100;
export const DAILY_PATH = '/daily-jigsaw-puzzle';
/** Day 1 of the challenge — used only to produce a friendly "#N" counter. */
const EPOCH_DATE = '2026-08-23';
const EPOCH = new Date(`${EPOCH_DATE}T00:00:00Z`).getTime();
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

function shiftDate(date: string, days: number): string {
  return new Date(dateStringToUtcMs(date) + days * DAY_MS).toISOString().slice(0, 10);
}

/** murmur3 fmix32 — FNV alone mixes trailing characters poorly into the high bits. */
function mix32(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

const NO_REPEAT_DAYS = 30;
const pickCache = new Map<string, GalleryImage>();

/** Highest-random-weight pick, so adding gallery images rarely changes an existing day's picture. */
function bestImage(date: string, exclude: Set<string>): GalleryImage {
  let best = galleryImages[0];
  let bestScore = -1;
  for (const image of galleryImages) {
    if (exclude.has(image.id)) continue;
    const score = mix32(hashSeed(`daily-image:${date}:${image.id}`));
    if (score > bestScore) {
      best = image;
      bestScore = score;
    }
  }
  return best;
}

/** Walks forward from day 1 so no picture repeats within NO_REPEAT_DAYS. */
function pickDailyImage(date: string): GalleryImage {
  if (date < EPOCH_DATE) return bestImage(date, new Set());
  const window = Math.min(NO_REPEAT_DAYS, galleryImages.length - 1);
  const history: string[] = [];
  let pick = galleryImages[0];
  for (let day = EPOCH_DATE; day <= date; day = shiftDate(day, 1)) {
    pick = pickCache.get(day) ?? bestImage(day, new Set(history.slice(-window)));
    pickCache.set(day, pick);
    history.push(pick.id);
  }
  return pick;
}

/** A playable daily date: well-formed, on or after day 1, and not in the future. */
export function isPlayableDailyDate(date: string | null): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const ms = dateStringToUtcMs(date);
  return Number.isFinite(ms) && ms >= EPOCH && date <= todayDateString();
}

export function dailyPlayUrl(info: DailyChallengeInfo): string {
  return `/puzzle/${info.image.id}?pieces=${info.pieceCount}&rotate=0&daily=${info.date}`;
}

/** Previous daily puzzles, newest first, never earlier than day 1. */
export function getRecentDailies(count: number, from: string = todayDateString()): DailyChallengeInfo[] {
  const list: DailyChallengeInfo[] = [];
  for (let i = 1; i <= count; i++) {
    const date = shiftDate(from, -i);
    if (dateStringToUtcMs(date) < EPOCH) break;
    list.push(getDailyChallengeInfo(date));
  }
  return list;
}

export function getDailyChallengeInfo(date: string = todayDateString()): DailyChallengeInfo {
  const dayNumber = Math.max(1, Math.floor((dateStringToUtcMs(date) - EPOCH) / DAY_MS) + 1);
  const image = pickDailyImage(date);
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

/**
 * Records today's completion and returns the updated streak. Safe to call more than once per day.
 * Past puzzles from the archive don't count toward the streak.
 */
export function recordDailyCompletion(date: string = todayDateString()): number {
  if (date !== todayDateString()) return getStreak();
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
  isToday: boolean;
}): string {
  const origin = typeof location !== 'undefined' ? location.origin : '';
  return [
    `🧩 Puzzle Harbour Daily #${info.dayNumber}`,
    `⏱️ ${info.timeText} · ${info.moves} moves`,
    info.isToday && info.streak > 0 ? `🔥 ${info.streak}-day streak` : '',
    origin ? `Play: ${origin}${DAILY_PATH}` : '',
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
