import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getFoundErrors, getSpotPuzzle, saveFoundErrors, spotPuzzles } from '../data/spotIt';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL } from '../data/siteConfig';

function formatSpotTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function trackGaEvent(name: string, params: Record<string, string | number>): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', name, params);
}

export function SpotItPlay() {
  const { slug } = useParams<{ slug: string }>();
  const puzzle = getSpotPuzzle(slug);
  const [found, setFound] = useState(() => (puzzle ? getFoundErrors(puzzle.slug) : []));
  const [miss, setMiss] = useState(false);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completionSeconds, setCompletionSeconds] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle');
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useSeo({
    title: puzzle ? (puzzle.seoTitle ?? `${puzzle.title} — Spot it | Puzzle Harbour`) : 'Spot it | Puzzle Harbour',
    description: puzzle ? puzzle.tagline : 'Find what is wrong in the picture.',
    path: puzzle ? `/spot-it/${puzzle.slug}` : undefined,
    noindex: !puzzle,
    jsonLd: puzzle
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Spot it', item: `${SITE_URL}/spot-it` },
            { '@type': 'ListItem', position: 3, name: puzzle.title, item: `${SITE_URL}/spot-it/${puzzle.slug}` },
          ],
        }
      : undefined,
  });

  const remaining = puzzle ? puzzle.errors.length - found.length : 0;
  const done = Boolean(puzzle && remaining === 0);
  const foundSet = useMemo(() => new Set(found), [found]);

  useEffect(() => {
    startedRef.current = false;
    completedRef.current = false;
    setStartedAt(null);
    setCompletionSeconds(null);
    setElapsedSeconds(0);
    setShareStatus('idle');
    setLastFound(null);
    setFound(puzzle ? getFoundErrors(puzzle.slug) : []);
  }, [puzzle?.slug]);

  useEffect(() => {
    if (startedAt == null || completionSeconds != null) return;
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, completionSeconds]);

  if (!puzzle) {
    return <Navigate to="/spot-it" replace />;
  }

  const puzzleUrl = `${SITE_URL}/spot-it/${puzzle.slug}`;

  const beginRun = (): number => {
    if (startedRef.current) return startedAt ?? Date.now();
    const start = Date.now();
    startedRef.current = true;
    setStartedAt(start);
    trackGaEvent('spot_it_start', { puzzle_id: puzzle.slug });
    return start;
  };

  const playAgain = () => {
    startedRef.current = false;
    completedRef.current = false;
    setFound([]);
    setStartedAt(null);
    setCompletionSeconds(null);
    setElapsedSeconds(0);
    setLastFound(null);
    setShareStatus('idle');
    saveFoundErrors(puzzle.slug, []);
  };

  const shareChallenge = async () => {
    const timeBit = completionSeconds != null ? ` in ${formatSpotTime(completionSeconds)}` : '';
    const text = `🔎 I found ${puzzle.errors.length}/${puzzle.errors.length} mistakes${timeBit}\nCan you beat me?\n${puzzleUrl}`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text });
        trackGaEvent('share_clicked', {
          content_type: 'spot_it',
          puzzle_id: puzzle.slug,
          share_method: 'web_share',
        });
        setShareStatus('shared');
        window.setTimeout(() => setShareStatus('idle'), 2000);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      trackGaEvent('share_clicked', {
        content_type: 'spot_it',
        puzzle_id: puzzle.slug,
        share_method: 'clipboard',
      });
      setShareStatus('copied');
    } catch {
      setShareStatus('failed');
    }
    window.setTimeout(() => setShareStatus('idle'), 2000);
  };

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const hit = puzzle.errors.find((error) => {
      const dx = ((x - error.x) / 100) * rect.width;
      const dy = ((y - error.y) / 100) * rect.height;
      const radius = (error.r / 100) * Math.min(rect.width, rect.height);
      return Math.hypot(dx, dy) <= radius;
    });

    const runStartedAt = done ? startedAt : beginRun();

    if (!hit || foundSet.has(hit.id)) {
      setMiss(true);
      window.setTimeout(() => setMiss(false), 280);
      return;
    }

    const next = [...found, hit.id];
    setFound(next);
    setLastFound(hit.id);
    saveFoundErrors(puzzle.slug, next);

    if (next.length === puzzle.errors.length && !completedRef.current) {
      completedRef.current = true;
      const seconds = Math.max(1, Math.round((Date.now() - (runStartedAt ?? Date.now())) / 1000));
      setCompletionSeconds(seconds);
      setElapsedSeconds(seconds);
      trackGaEvent('spot_it_complete', { puzzle_id: puzzle.slug, completion_seconds: seconds });
    }
  };

  return (
    <div className="spot-play">
      <header className="spot-play-bar">
        <Link to="/spot-it" className="back-link" aria-label="Back to Spot it">
          <span className="back-link-full">← Spot it</span>
          <span className="back-link-short" aria-hidden="true">
            ←
          </span>
        </Link>
        <div className="spot-play-copy">
          <h1>
            {puzzle.emoji} {puzzle.title}
          </h1>
          <p>
            {done
              ? completionSeconds != null
                ? `You found ${puzzle.errors.length}/${puzzle.errors.length} in ${formatSpotTime(completionSeconds)}`
                : `You found ${puzzle.errors.length}/${puzzle.errors.length}`
              : (puzzle.playLead ??
                `Find ${remaining} more thing${remaining === 1 ? '' : 's'} that should not be there.`)}
          </p>
        </div>
      </header>

      <div className="spot-play-body">
        <div className={`spot-stage${miss ? ' miss' : ''}`}>
          <button type="button" className="spot-stage-hit" onClick={onClick} aria-label="Tap something that looks wrong">
            <img src={puzzle.src} alt={puzzle.title} draggable={false} />
            {puzzle.errors
              .filter((error) => foundSet.has(error.id))
              .map((error) => (
                <span
                  key={error.id}
                  className="spot-mark"
                  style={{ left: `${error.x}%`, top: `${error.y}%` }}
                >
                  ✓
                </span>
              ))}
          </button>
        </div>

        <aside className="spot-list">
          <div className="spot-progress">
            <p className="story-book-act">
              {found.length} of {puzzle.errors.length} found
            </p>
            <p className="spot-timer" role="timer">
              Time {formatSpotTime(completionSeconds ?? elapsedSeconds)}
            </p>
          </div>
          <ol>
            {puzzle.errors.map((error, index) => {
              const isFound = foundSet.has(error.id);
              return (
                <li key={error.id} className={isFound ? 'found' : ''}>
                  <strong>{isFound ? error.title : `Mystery ${index + 1}`}</strong>
                  <span>{isFound ? error.foundText : 'Tap the picture to uncover this one.'}</span>
                </li>
              );
            })}
          </ol>
          {done && (
            <div className="spot-result">
              <p className="spot-done">
                {completionSeconds != null
                  ? `You found ${puzzle.errors.length}/${puzzle.errors.length} in ${formatSpotTime(completionSeconds)}`
                  : `You found ${puzzle.errors.length}/${puzzle.errors.length}`}
              </p>
              <div className="spot-result-actions">
                <button type="button" className="btn btn-primary" onClick={() => void shareChallenge()}>
                  {shareStatus === 'copied'
                    ? 'Copied!'
                    : shareStatus === 'shared'
                      ? 'Shared!'
                      : shareStatus === 'failed'
                        ? 'Couldn’t share'
                        : 'Share Challenge'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={playAgain}>
                  Play again
                </button>
              </div>
            </div>
          )}
          {lastFound && !done && (
            <p className="spot-toast">{puzzle.errors.find((error) => error.id === lastFound)?.foundText}</p>
          )}
          <nav className="puzzle-related" aria-label="More Spot it pictures">
            More Spot it:{' '}
            {spotPuzzles
              .filter((item) => item.slug !== puzzle.slug)
              .map((item, index, list) => (
                <span key={item.slug}>
                  <Link to={`/spot-it/${item.slug}`}>{item.title}</Link>
                  {index < list.length - 1 ? ' · ' : ''}
                </span>
              ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
