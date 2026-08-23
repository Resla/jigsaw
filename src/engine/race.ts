export interface RaceChallenge {
  timeMs: number;
  moves: number;
}

/** Builds a shareable URL that reproduces the same puzzle, tagged with a time/moves target to beat. */
export function buildRaceUrl(pathAndSearch: string, challenge: RaceChallenge): string {
  const url = new URL(pathAndSearch, location.origin);
  url.searchParams.delete('raceTime');
  url.searchParams.delete('raceMoves');
  url.searchParams.set('raceTime', String(Math.round(challenge.timeMs)));
  url.searchParams.set('raceMoves', String(Math.round(challenge.moves)));
  return url.toString();
}

export function parseRaceChallenge(searchParams: URLSearchParams): RaceChallenge | null {
  const timeMs = Number(searchParams.get('raceTime'));
  if (!Number.isFinite(timeMs) || timeMs <= 0) return null;
  const moves = Number(searchParams.get('raceMoves'));
  return { timeMs, moves: Number.isFinite(moves) ? moves : 0 };
}

export function buildRaceShareText(params: { title: string; timeText: string; moves: number; url: string }): string {
  return [
    '🏁 Race me at Jigsaw!',
    `I solved "${params.title}" in ${params.timeText} (${params.moves} moves). Think you can beat it?`,
    params.url,
  ].join('\n');
}
