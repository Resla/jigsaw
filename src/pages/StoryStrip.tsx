import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getStory, stories } from '../data/stories';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL } from '../data/siteConfig';
import { computeGridSize } from '../engine/gridSize';
import { computeGuide, computeTableSize } from '../engine/tableLayout';
import { getStoryUnlocked, isStoryFinished, markStoryPanelComplete } from '../engine/storyProgress';
import { usePuzzleStore } from '../state/usePuzzleStore';
import { PuzzleBoard } from '../components/PuzzleBoard';
import { ReferencePanel } from '../components/ReferencePanel';

type StoryMode = 'read' | 'play' | 'done';

function startingScene(slug: string, count: number): number {
  if (isStoryFinished(slug, count)) return count - 1;
  return Math.min(getStoryUnlocked(slug), count - 1);
}

export function StoryStrip() {
  const { slug } = useParams<{ slug: string }>();
  const story = getStory(slug);
  const [sceneIndex, setSceneIndex] = useState(() => (story ? startingScene(story.slug, story.beats.length) : 0));
  const [unlocked, setUnlocked] = useState(() => (story ? getStoryUnlocked(story.slug) : 0));
  const [mode, setMode] = useState<StoryMode>('read');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  const beat = story?.beats[sceneIndex];
  const finished = story ? isStoryFinished(story.slug, story.beats.length) : false;
  const sceneCleared = Boolean(story && unlocked > sceneIndex);

  const loadPuzzle = usePuzzleStore((s) => s.loadPuzzle);
  const reset = usePuzzleStore((s) => s.reset);
  const useHint = usePuzzleStore((s) => s.useHint);
  const hintsRemaining = usePuzzleStore((s) => s.hintsRemaining);
  const pieces = usePuzzleStore((s) => s.pieces);
  const solved = usePuzzleStore((s) => s.solved);
  const storeImageId = usePuzzleStore((s) => s.imageId);
  const tableWidth = usePuzzleStore((s) => s.tableWidth);
  const tableHeight = usePuzzleStore((s) => s.tableHeight);
  const puzzleId = story ? `story-${story.slug}-${sceneIndex}` : null;
  const sceneSolved = Boolean(puzzleId && solved && storeImageId === puzzleId);

  const guide = useMemo(
    () => (image ? computeGuide(image.naturalWidth, image.naturalHeight, tableWidth, tableHeight) : null),
    [image, tableWidth, tableHeight],
  );

  useSeo({
    title: story ? `${story.title} — Story Puzzle | Puzzle Harbour` : 'Story not found | Puzzle Harbour',
    description: story
      ? `${story.tagline} Read the scene, then assemble it to unlock the next act.`
      : 'That story could not be found.',
    path: story ? `/story/${story.slug}` : undefined,
    noindex: !story,
    jsonLd: story
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Story Puzzles', item: `${SITE_URL}/stories` },
            { '@type': 'ListItem', position: 3, name: story.title, item: `${SITE_URL}/story/${story.slug}` },
          ],
        }
      : undefined,
  });

  useEffect(() => {
    if (!story) return;
    const index = startingScene(story.slug, story.beats.length);
    const nextUnlocked = getStoryUnlocked(story.slug);
    setSceneIndex(index);
    setUnlocked(nextUnlocked);
    setMode(nextUnlocked > index ? 'done' : 'read');
  }, [story]);

  useEffect(() => {
    if (!beat) return;
    let cancelled = false;
    setImage(null);
    setLoadError(false);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.onerror = () => {
      if (!cancelled) setLoadError(true);
    };
    img.src = beat.src;
    return () => {
      cancelled = true;
    };
  }, [beat]);

  useEffect(() => {
    if (mode !== 'play' || !story || !beat || !image || !puzzleId) return;
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    const { rows, cols } = computeGridSize(beat.pieces, aspectRatio);
    const size = computeTableSize(image.naturalWidth, image.naturalHeight);
    loadPuzzle({
      imageId: puzzleId,
      imageSrc: beat.src,
      imageWidth: image.naturalWidth,
      imageHeight: image.naturalHeight,
      rows,
      cols,
      tableWidth: size.tableWidth,
      tableHeight: size.tableHeight,
      rotationEnabled: false,
    });
  }, [mode, story, beat, image, puzzleId, loadPuzzle]);

  useEffect(() => {
    if (!story || !sceneSolved) return;
    setUnlocked(markStoryPanelComplete(story.slug, sceneIndex, story.beats.length));
    setMode('done');
  }, [sceneSolved, story, sceneIndex]);

  if (!story || !beat) {
    return <Navigate to="/stories" replace />;
  }

  const isLast = sceneIndex >= story.beats.length - 1;
  const quote = beat.quotes[0];
  const canOpen = (index: number) => index <= unlocked || finished;

  const openScene = (index: number) => {
    if (!canOpen(index)) return;
    setSceneIndex(index);
    setMode(unlocked > index ? 'done' : 'read');
  };

  if (mode === 'play') {
    return (
      <div className="puzzle-page">
        <header className="puzzle-header">
          <button
            type="button"
            className="back-link"
            aria-label="Back to scene"
            onClick={() => setMode(sceneCleared || sceneSolved ? 'done' : 'read')}
          >
            <span className="back-link-full">← Scene</span>
            <span className="back-link-short" aria-hidden="true">
              ←
            </span>
          </button>
          <div className="puzzle-title-block">
            <h2>
              {beat.act} — {beat.title}
            </h2>
            <p className="puzzle-subtitle">{beat.pieces} pieces · {story.title}</p>
          </div>
          <div className="puzzle-header-actions">
            <button type="button" className="hint-button" onClick={useHint} disabled={hintsRemaining <= 0}>
              <span className="hint-label-full">💡 Hint ({hintsRemaining})</span>
              <span className="hint-label-short">💡 {hintsRemaining}</span>
            </button>
            <button type="button" className="reset-button" onClick={reset}>
              Reset
            </button>
          </div>
        </header>
        <div className="puzzle-table-viewport">
          {image && pieces.length > 0 && guide && storeImageId === puzzleId ? (
            <>
              <PuzzleBoard
                pieces={pieces}
                image={image}
                tableWidth={tableWidth}
                tableHeight={tableHeight}
                guide={guide}
                rotationEnabled={false}
              />
              <ReferencePanel src={beat.src} title={beat.title} />
            </>
          ) : (
            <div className="puzzle-loading">
              <span className="puzzle-loading-spinner" aria-hidden="true" />
              Cutting pieces…
            </div>
          )}
        </div>
        <nav className="puzzle-mobile-toolbar" aria-label="Puzzle actions">
          <button type="button" className="hint-button" onClick={useHint} disabled={hintsRemaining <= 0}>
            <span className="hint-label-full">💡 Hint ({hintsRemaining})</span>
            <span className="hint-label-short">💡 {hintsRemaining}</span>
          </button>
          <button type="button" className="reset-button" onClick={reset}>
            Reset
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="story-book">
      <header className="story-book-top">
        <Link to="/stories" className="back-link" aria-label="Back to Story Puzzles">
          <span className="back-link-full">← Story Puzzles</span>
          <span className="back-link-short" aria-hidden="true">
            ←
          </span>
        </Link>
        <p className="story-book-kicker">{story.title}</p>
        <ol className="story-book-progress" aria-label="Story acts">
          {story.beats.map((item, index) => {
            const locked = !canOpen(index);
            return (
              <li key={item.title}>
                <button
                  type="button"
                  className={`story-book-dot${index === sceneIndex ? ' current' : ''}${locked ? ' locked' : ''}`}
                  onClick={() => openScene(index)}
                  disabled={locked}
                  aria-label={locked ? `${item.act} locked` : `${item.act}: ${item.title}`}
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="story-book-body">
        <div className="story-book-stage">
          {loadError ? (
            <p>That scene failed to load.</p>
          ) : (
            <img src={beat.src} alt={`${beat.act}: ${beat.title}`} />
          )}
        </div>

        <section className="story-book-card">
          <p className="story-book-act">
            {beat.act} of {story.beats.length}
          </p>
          <h1>{beat.title}</h1>
          <p className="story-book-copy">{beat.narration}</p>
          {quote && (
            <blockquote className="story-quote">
              <strong>{quote.who}</strong>
              <span>“{quote.text}”</span>
            </blockquote>
          )}
          {mode === 'done' && isLast && <p className="story-ending-inline">{story.ending}</p>}
          <div className="story-book-actions">
            {mode === 'done' ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (isLast) {
                      openScene(0);
                      return;
                    }
                    openScene(sceneIndex + 1);
                  }}
                >
                  {isLast ? 'Start the story again' : 'Next scene'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setMode('play')}>
                  Play this scene again
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setMode('play')} disabled={!image}>
                Assemble this scene · {beat.pieces} pieces
              </button>
            )}
          </div>
          <nav className="puzzle-related" aria-label="More story puzzles">
            More stories:{' '}
            {stories
              .filter((item) => item.slug !== story.slug)
              .map((item, index, list) => (
                <span key={item.slug}>
                  <Link to={`/story/${item.slug}`}>{item.title}</Link>
                  {index < list.length - 1 ? ' · ' : ''}
                </span>
              ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
