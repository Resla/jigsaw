const keyFor = (slug: string) => `jigsaw:story:${slug}`;

/** Highest panel index the player may open. 0 at the start. */
export function getStoryUnlocked(slug: string): number {
  try {
    const raw = localStorage.getItem(keyFor(slug));
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { unlocked?: number };
    return typeof parsed.unlocked === 'number' ? Math.max(0, parsed.unlocked) : 0;
  } catch {
    return 0;
  }
}

export function markStoryPanelComplete(slug: string, panelIndex: number, panelCount: number): number {
  const unlocked = Math.max(getStoryUnlocked(slug), Math.min(panelIndex + 1, panelCount));
  try {
    localStorage.setItem(keyFor(slug), JSON.stringify({ unlocked }));
  } catch {
    // ignore
  }
  return unlocked;
}

export function isStoryFinished(slug: string, panelCount: number): boolean {
  return getStoryUnlocked(slug) >= panelCount;
}
