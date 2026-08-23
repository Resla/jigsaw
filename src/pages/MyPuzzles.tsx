import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryImages } from '../data/gallery';
import { loadCustomImage } from '../engine/imageStore';
import { loadPersistedState } from '../engine/persistence';
import { computeProgress, getPuzzleHistory, removeHistoryEntry, type PuzzleHistoryEntry } from '../engine/puzzleHistory';
import { formatRelativeTime } from '../engine/relativeTime';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';

function HistoryThumb({ entry }: { entry: PuzzleHistoryEntry }) {
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
    return <div className="history-thumb history-thumb-missing">🧩</div>;
  }
  return <img className="history-thumb" src={src} alt={entry.title} />;
}

interface RowState {
  entry: PuzzleHistoryEntry;
  percent: number;
  solved: boolean;
}

export function MyPuzzles() {
  useSeo({
    title: 'My Puzzles | Jigsaw',
    description: 'Resume your in-progress jigsaw puzzles or clear out old ones.',
    noindex: true,
  });

  const [rows, setRows] = useState<RowState[] | null>(null);

  useEffect(() => {
    const entries = getPuzzleHistory();
    setRows(
      entries.map((entry) => {
        const saved = loadPersistedState(entry.storageKey);
        const percent = saved ? computeProgress(saved.groupMap, entry.pieceCount) : 0;
        return { entry, percent, solved: saved?.solved ?? false };
      }),
    );
  }, []);

  const handleRemove = (storageKey: string) => {
    removeHistoryEntry(storageKey);
    setRows((prev) => prev?.filter((r) => r.entry.storageKey !== storageKey) ?? null);
  };

  return (
    <div className="home-page">
      <SiteHeader />

      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>My Puzzles</span>
      </nav>

      <header className="page-hero">
        <h1>My Puzzles</h1>
        <p className="page-hero-lead">Pick up where you left off, or clear out old ones.</p>
      </header>

      {rows === null ? null : rows.length === 0 ? (
        <div className="history-empty">
          <p>You haven't started any puzzles yet.</p>
          <Link to="/">Browse the gallery</Link>
        </div>
      ) : (
        <div className="history-grid">
          {rows.map(({ entry, percent, solved }) => (
            <div key={entry.storageKey} className="history-card">
              <button
                type="button"
                className="history-remove"
                aria-label="Remove from list"
                onClick={() => handleRemove(entry.storageKey)}
              >
                ✕
              </button>
              <Link to={entry.route} className="history-card-link">
                <HistoryThumb entry={entry} />
                <div className="history-card-body">
                  <span className="history-card-title">{entry.title}</span>
                  <span className="history-card-meta">
                    {entry.rows}×{entry.cols} pieces · {formatRelativeTime(entry.lastPlayedAt)}
                  </span>
                  {solved ? (
                    <span className="history-solved-badge">✓ Solved</span>
                  ) : (
                    <div className="history-progress-track">
                      <div className="history-progress-fill" style={{ width: `${percent}%` }} />
                      <span className="history-progress-label">{percent}%</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
