import { useEffect, useState } from 'react';
import { galleryImages } from '../data/gallery';
import { loadCustomImage } from '../engine/imageStore';
import type { PuzzleHistoryEntry } from '../engine/puzzleHistory';

export function HistoryThumb({ entry, className = 'history-thumb' }: { entry: PuzzleHistoryEntry; className?: string }) {
  const source = entry.source;
  const [src, setSrc] = useState<string | null>(
    source.kind === 'gallery' ? galleryImages.find((g) => g.id === source.imageId)?.src ?? null : null,
  );
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (source.kind !== 'custom') return;
    let cancelled = false;
    loadCustomImage(source.customId)
      .then((stored) => {
        if (cancelled) return;
        if (stored) setSrc(stored.dataUrl);
        else setMissing(true);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (missing || !src) {
    return <div className={`${className} history-thumb-missing`}>🧩</div>;
  }
  return <img className={className} src={src} alt={entry.title} />;
}
