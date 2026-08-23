const KEY_PREFIX = 'jigsaw:';

interface BackupFile {
  app: 'jigsaw';
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

/** Collects every jigsaw:-prefixed localStorage key (puzzle saves, best times, streak, prefs) and downloads it as JSON. */
export function exportBackup(): void {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(KEY_PREFIX)) continue;
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  }

  const payload: BackupFile = {
    app: 'jigsaw',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jigsaw-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Restores keys from a previously exported backup file. Returns how many keys were written. */
export async function importBackup(file: File): Promise<number> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const payload = parsed as Partial<BackupFile>;
  if (payload?.app !== 'jigsaw' || typeof payload.data !== 'object' || payload.data === null) {
    throw new Error("That doesn't look like a Jigsaw backup file.");
  }

  let count = 0;
  for (const [key, value] of Object.entries(payload.data)) {
    if (!key.startsWith(KEY_PREFIX) || typeof value !== 'string') continue;
    try {
      localStorage.setItem(key, value);
      count++;
    } catch {
      // storage full/unavailable — skip this key and keep going
    }
  }
  return count;
}
