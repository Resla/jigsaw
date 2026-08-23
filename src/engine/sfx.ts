/** Tiny Web Audio synthesized sound effects — no external audio assets needed, so they work offline too. */

const MUTE_KEY = 'jigsaw:pref:muted';
let audioCtx: AudioContext | null = null;
let muted = readStoredMute();

function readStoredMute(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

function getContext(): AudioContext | null {
  if (muted) return null;
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainPeak = 0.15,
  type: OscillatorType = 'sine',
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playSnap(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const duration = 0.055;
  const frames = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    const env = 1 - i / frames;
    data[i] = (Math.random() * 2 - 1) * env * env;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.Q.setValueAtTime(0.9, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);

  tone(ctx, 210, now, 0.07, 0.1, 'sine');
  tone(ctx, 620, now + 0.012, 0.045, 0.06, 'triangle');
}

export function playRotateClick(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 340, ctx.currentTime, 0.05, 0.06, 'square');
}

export function playSolveFanfare(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => tone(ctx, freq, now + i * 0.12, 0.35, 0.13, 'triangle'));
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // ignore storage errors
  }
}
