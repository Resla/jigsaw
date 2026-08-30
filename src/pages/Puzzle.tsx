import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { computeGridSize } from '../engine/gridSize';
import { usePuzzleStore } from '../state/usePuzzleStore';
import { PuzzleBoard } from '../components/PuzzleBoard';
import { Timer } from '../components/Timer';
import { ReferencePanel } from '../components/ReferencePanel';
import { usePuzzleImageSource } from '../hooks/usePuzzleImageSource';
import { formatDuration, getBestTime, saveBestTimeIfBetter } from '../engine/bestTimes';
import { buildShareText, getDailyChallengeInfo, recordDailyCompletion, shareOrCopy } from '../engine/dailyChallenge';
import { isMuted, setMuted } from '../engine/sfx';
import { recordPuzzleVisit } from '../engine/puzzleHistory';
import { buildRaceShareText, buildRaceUrl, parseRaceChallenge } from '../engine/race';
import { useSeo } from '../hooks/useSeo';
import { getCategory } from '../data/categories';
import { SITE_URL } from '../data/siteConfig';
import { computeGuide, computeTableSize } from '../engine/tableLayout';

export function Puzzle() {
  const { imageId, customId } = useParams<{ imageId?: string; customId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dailyDate = searchParams.get('daily');
  const dailyInfo = dailyDate ? getDailyChallengeInfo(dailyDate) : null;
  const pieceCount = dailyInfo ? dailyInfo.pieceCount : Number(searchParams.get('pieces') ?? 48);
  const rotationEnabled = !dailyInfo && searchParams.get('rotate') === '1';
  const raceChallenge = !dailyInfo && !customId ? parseRaceChallenge(searchParams) : null;
  const [muted, setMutedState] = useState(isMuted);
  const [raceStatus, setRaceStatus] = useState<'idle' | 'copied' | 'shared' | 'failed'>('idle');

  const { status, image: source } = usePuzzleImageSource(dailyInfo ? dailyInfo.image.id : imageId, customId);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [bestTime, setBestTime] = useState<{ timeMs: number; moves: number } | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [dailyStreak, setDailyStreak] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared' | 'failed'>('idle');
  const [raceOutcome, setRaceOutcome] = useState<{ won: boolean; diffMs: number } | null>(null);
  const wasSolved = useRef(false);

  const loadPuzzle = usePuzzleStore((s) => s.loadPuzzle);
  const reset = usePuzzleStore((s) => s.reset);
  const useHint = usePuzzleStore((s) => s.useHint);
  const hintsRemaining = usePuzzleStore((s) => s.hintsRemaining);
  const pieces = usePuzzleStore((s) => s.pieces);
  const moves = usePuzzleStore((s) => s.moves);
  const solved = usePuzzleStore((s) => s.solved);
  const startedAt = usePuzzleStore((s) => s.startedAt);
  const tableWidth = usePuzzleStore((s) => s.tableWidth);
  const tableHeight = usePuzzleStore((s) => s.tableHeight);
  const rows = usePuzzleStore((s) => s.rows);
  const cols = usePuzzleStore((s) => s.cols);

  const puzzleId = dailyInfo ? dailyInfo.puzzleId : source?.id ?? null;

  const breadcrumbCategory = source && source.categories.length > 0 ? getCategory(source.categories[0]) : undefined;
  useSeo({
    title: source ? `${source.title} Jigsaw Puzzle — Play Free Online | Jigsaw` : 'Jigsaw Puzzle | Jigsaw',
    description:
      source?.seoDescription ?? 'Play a free jigsaw puzzle online in your browser — no download or sign-up required.',
    path: !customId && source ? `/puzzle/${source.id}` : undefined,
    image: !customId ? source?.src : undefined,
    noindex: Boolean(customId),
    jsonLd:
      source && !customId
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                ...(breadcrumbCategory
                  ? [
                      {
                        '@type': 'ListItem',
                        position: 2,
                        name: breadcrumbCategory.name,
                        item: `${SITE_URL}/category/${breadcrumbCategory.slug}`,
                      },
                    ]
                  : []),
                {
                  '@type': 'ListItem',
                  position: breadcrumbCategory ? 3 : 2,
                  name: source.title,
                  item: `${SITE_URL}/puzzle/${source.id}`,
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              contentUrl: `${SITE_URL}${source.src}`,
              name: source.title,
              description: source.seoDescription ?? undefined,
            },
          ]
        : undefined,
  });

  useEffect(() => {
    if (!source) return;
    setImage(null);
    setLoadError(false);
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setLoadError(true);
    img.src = source.src;
  }, [source]);

  useEffect(() => {
    if (!image || !source || !puzzleId) return;
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    const { rows, cols } = computeGridSize(pieceCount, aspectRatio);
    const { tableWidth: tableWidthCalc, tableHeight: tableHeightCalc } = computeTableSize(
      image.naturalWidth,
      image.naturalHeight,
    );

    loadPuzzle({
      imageId: puzzleId,
      imageSrc: source.src,
      imageWidth: image.naturalWidth,
      imageHeight: image.naturalHeight,
      rows,
      cols,
      tableWidth: tableWidthCalc,
      tableHeight: tableHeightCalc,
      rotationEnabled,
    });

    const storageKey = usePuzzleStore.getState().storageKey;
    if (storageKey) {
      recordPuzzleVisit({
        storageKey,
        route: `${location.pathname}${location.search}`,
        title: dailyInfo ? `Daily #${dailyInfo.dayNumber} — ${source.title}` : source.title,
        rows,
        cols,
        pieceCount: rows * cols,
        source: customId ? { kind: 'custom', customId } : { kind: 'gallery', imageId: source.id },
        daily: dailyInfo ? { date: dailyInfo.date, dayNumber: dailyInfo.dayNumber } : undefined,
      });
    }

    wasSolved.current = false;
    setIsNewBest(false);
    setDailyStreak(null);
    setShareStatus('idle');
    setRaceStatus('idle');
    setRaceOutcome(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, source, puzzleId, pieceCount, rotationEnabled]);

  useEffect(() => {
    if (!puzzleId || rows === 0 || cols === 0) return;
    setBestTime(getBestTime(puzzleId, rows, cols));
  }, [puzzleId, rows, cols]);

  useEffect(() => {
    if (solved && !wasSolved.current && puzzleId && rows > 0 && cols > 0) {
      wasSolved.current = true;
      const elapsedMs = Date.now() - startedAt;
      const gotNewBest = saveBestTimeIfBetter(puzzleId, rows, cols, elapsedMs, moves);
      setIsNewBest(gotNewBest);
      setBestTime(getBestTime(puzzleId, rows, cols));
      if (dailyInfo) setDailyStreak(recordDailyCompletion(dailyInfo.date));
      if (raceChallenge) {
        setRaceOutcome({
          won: elapsedMs <= raceChallenge.timeMs,
          diffMs: Math.abs(elapsedMs - raceChallenge.timeMs),
        });
      }
    }
    if (!solved) wasSolved.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, puzzleId, rows, cols, startedAt, moves]);

  const toggleMuted = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  const handleShare = async () => {
    if (!dailyInfo) return;
    const text = buildShareText({
      dayNumber: dailyInfo.dayNumber,
      timeText: formatDuration(Date.now() - startedAt),
      moves,
      streak: dailyStreak ?? 1,
    });
    const result = await shareOrCopy(text);
    setShareStatus(result);
    setTimeout(() => setShareStatus('idle'), 2500);
  };

  const handleRaceChallenge = async () => {
    if (!source || dailyInfo || customId) return;
    const elapsedMs = Date.now() - startedAt;
    const url = buildRaceUrl(`${location.pathname}${location.search}`, { timeMs: elapsedMs, moves });
    const text = buildRaceShareText({ title: source.title, timeText: formatDuration(elapsedMs), moves, url });
    const result = await shareOrCopy(text);
    setRaceStatus(result);
    setTimeout(() => setRaceStatus('idle'), 2500);
  };

  if (status === 'not-found') {
    return (
      <div className="puzzle-page-empty">
        <p>We couldn't find that puzzle.</p>
        <Link to="/">Back to gallery</Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="puzzle-page-empty">
        <p>That image failed to load.</p>
        <Link to="/">Back to gallery</Link>
      </div>
    );
  }

  const guide = image
    ? computeGuide(image.naturalWidth, image.naturalHeight, tableWidth, tableHeight)
    : { x: 0, y: 0, width: 0, height: 0 };

  const renderActionButtons = () => (
    <>
      <button
        type="button"
        className="hint-button"
        onClick={useHint}
        disabled={hintsRemaining <= 0 || solved}
        title="Highlight a piece and its correct spot"
      >
        <span className="hint-label-full">💡 Hint ({hintsRemaining})</span>
        <span className="hint-label-short">💡 {hintsRemaining}</span>
      </button>
      <button
        type="button"
        className="mute-button"
        onClick={toggleMuted}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button type="button" className="reset-button" onClick={reset}>
        Reset
      </button>
    </>
  );

  return (
    <div className="puzzle-page">
      <header className="puzzle-header">
        <Link to="/" className="back-link" aria-label="Back to gallery">
          <span className="back-link-full">← Gallery</span>
          <span className="back-link-short" aria-hidden="true">
            ←
          </span>
        </Link>
        <div className="puzzle-title-block">
          <h2>
            {dailyInfo && <span className="daily-badge">Daily #{dailyInfo.dayNumber}</span>}
            {raceChallenge && <span className="race-badge">🏁 Beat {formatDuration(raceChallenge.timeMs)}</span>}
            {source?.title ?? 'Loading…'}
          </h2>
          {source?.seoDescription && <p className="puzzle-subtitle">{source.seoDescription}</p>}
        </div>
        <div className="puzzle-stats">
          <div className="puzzle-scoreboard">
            <div className="stat">
              <span className="stat-label">Time</span>
              <Timer startedAt={startedAt} running={!solved} />
            </div>
            <div className="stat">
              <span className="stat-label">Moves</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat stat-pieces">
              <span className="stat-label">Pieces</span>
              <span className="stat-value">{pieces.length}</span>
            </div>
            {bestTime && (
              <div className="stat stat-best">
                <span className="stat-label">Best</span>
                <span className="stat-value">{formatDuration(bestTime.timeMs)}</span>
              </div>
            )}
          </div>
          <div className="puzzle-header-actions">{renderActionButtons()}</div>
        </div>
      </header>

      <div className="puzzle-table-viewport">
        {image && source && pieces.length > 0 ? (
          <>
            <PuzzleBoard
              pieces={pieces}
              image={image}
              tableWidth={tableWidth}
              tableHeight={tableHeight}
              guide={guide}
              rotationEnabled={rotationEnabled}
            />
            <ReferencePanel src={source.src} title={source.title} />
          </>
        ) : (
          <div className="puzzle-loading">
            <span className="puzzle-loading-spinner" aria-hidden="true" />
            Cutting pieces…
          </div>
        )}
      </div>

      <nav className="puzzle-mobile-toolbar" aria-label="Puzzle actions">
        {renderActionButtons()}
      </nav>

      {solved && (
        <div className="solved-overlay">
          <div className="solved-card">
            <h2>🎉 Solved!</h2>
            {isNewBest && <p className="new-best-badge">🏆 New personal best!</p>}
            <p>
              You finished <strong>{dailyInfo ? `Daily #${dailyInfo.dayNumber}` : source?.title}</strong> in{' '}
              <strong>
                <Timer startedAt={startedAt} running={false} />
              </strong>{' '}
              with <strong>{moves}</strong> moves.
            </p>
            {bestTime && !isNewBest && (
              <p className="best-time-line">
                Your best: {formatDuration(bestTime.timeMs)} ({bestTime.moves} moves)
              </p>
            )}
            {dailyInfo && dailyStreak !== null && (
              <p className="streak-line">🔥 {dailyStreak}-day streak</p>
            )}
            {raceOutcome && (
              <p className={`race-outcome-line ${raceOutcome.won ? 'won' : 'lost'}`}>
                {raceOutcome.won
                  ? `🏆 You beat the challenge by ${formatDuration(raceOutcome.diffMs)}!`
                  : `😅 So close — you missed the target by ${formatDuration(raceOutcome.diffMs)}.`}
              </p>
            )}
            <div className="solved-actions">
              {dailyInfo ? (
                <button type="button" onClick={handleShare}>
                  {shareStatus === 'copied' ? 'Copied!' : shareStatus === 'shared' ? 'Shared!' : 'Share Result'}
                </button>
              ) : (
                <>
                  <button type="button" onClick={reset}>
                    Play Again
                  </button>
                  {!customId && (
                    <button type="button" className="race-button" onClick={handleRaceChallenge}>
                      {raceStatus === 'copied' ? 'Link Copied!' : raceStatus === 'shared' ? 'Sent!' : '🏁 Challenge a Friend'}
                    </button>
                  )}
                </>
              )}
              <Link to="/">Choose New Puzzle</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
