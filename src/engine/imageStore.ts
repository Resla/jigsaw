const DB_NAME = 'jigsaw-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export interface StoredCustomImage {
  dataUrl: string;
  title: string;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCustomImage(id: string, image: Omit<StoredCustomImage, 'createdAt'>): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ ...image, createdAt: Date.now() }, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadCustomImage(id: string): Promise<StoredCustomImage | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve((req.result as StoredCustomImage) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export function generateCustomImageId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
