import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { galleryImages } from '../data/gallery';
import { categories } from '../data/categories';
import { readAndDownscaleImage } from '../engine/imageUtils';
import { generateCustomImageId, saveCustomImage } from '../engine/imageStore';
import { getDailyChallengeInfo, getStreak, hasCompletedToday } from '../engine/dailyChallenge';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, SITE_NAME } from '../data/siteConfig';
import { SiteHeader } from '../components/SiteHeader';
import { FeedbackSection } from '../components/FeedbackSection';

const MIN_PIECES = 6;
const MAX_PIECES = 500;
const DEFAULT_PIECES = 48;
const ROTATION_PREF_KEY = 'jigsaw:pref:rotationEnabled';

const DIFFICULTY_PRESETS = [
  { label: 'Easy', pieces: 24 },
  { label: 'Medium', pieces: 48 },
  { label: 'Hard', pieces: 100 },
  { label: 'Extreme', pieces: 300 },
];

function getStoredBoolPref(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === '1';
  } catch {
    return fallback;
  }
}

function setStoredBoolPref(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // ignore storage errors
  }
}

export function Home() {
  const navigate = useNavigate();
  const [daily] = useState(getDailyChallengeInfo);
  const [streak] = useState(getStreak);
  const [completedToday] = useState(hasCompletedToday);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pieceCount, setPieceCount] = useState(DEFAULT_PIECES);
  const [rotationEnabled, setRotationEnabled] = useState(() => getStoredBoolPref(ROTATION_PREF_KEY, false));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImage = galleryImages.find((image) => image.id === selectedId) ?? null;

  useSeo({
    title: `${SITE_NAME} — Free Online Jigsaw Puzzles`,
    description:
      'Play free online jigsaw puzzles in your browser — animals, nature, classic art, and easy or hard piece counts. No download, no sign-up, works offline as a PWA.',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: 'Game',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'A free, browser-based jigsaw puzzle game with a curated image gallery, custom photo uploads, and offline play.',
    },
  });

  const toggleRotation = () => {
    setRotationEnabled((prev) => {
      const next = !prev;
      setStoredBoolPref(ROTATION_PREF_KEY, next);
      return next;
    });
  };

  const optionsQuery = () => `rotate=${rotationEnabled ? 1 : 0}`;

  const startPuzzle = () => {
    if (!selectedId) return;
    navigate(`/puzzle/${selectedId}?pieces=${pieceCount}&${optionsQuery()}`);
  };

  const handleFileChosen = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      const dataUrl = await readAndDownscaleImage(file);
      const id = generateCustomImageId();
      await saveCustomImage(id, { dataUrl, title: file.name.replace(/\.[^/.]+$/, '') });
      navigate(`/puzzle/custom/${id}?pieces=${pieceCount}&${optionsQuery()}`);
    } catch {
      setUploadError("Couldn't read that image. Try a different file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-page">
      <SiteHeader />

      <header className="home-hero">
        <h1>Free jigsaw puzzles, right in your browser</h1>
        <p>Choose a picture below — the play bar stays with you, so you can set the difficulty and start from anywhere.</p>
      </header>

      <button
        type="button"
        className="daily-card"
        onClick={() =>
          navigate(`/puzzle/${daily.image.id}?pieces=${daily.pieceCount}&rotate=0&daily=${daily.date}`)
        }
      >
        <img src={daily.image.src} alt={daily.image.title} />
        <div className="daily-card-body">
          <span className="daily-card-eyebrow">Today's Challenge — Daily #{daily.dayNumber}</span>
          <span className="daily-card-title">{completedToday ? "Solved today — play again?" : 'Play today’s puzzle'}</span>
          {streak > 0 && <span className="daily-card-streak">🔥 {streak}-day streak</span>}
        </div>
        <span className="daily-card-arrow">→</span>
      </button>

      <nav className="category-chip-row" aria-label="Puzzle categories">
        {categories.map((category) => (
          <Link key={category.slug} to={`/category/${category.slug}`} className="category-chip">
            <span className="category-chip-emoji">{category.emoji}</span>
            {category.name}
          </Link>
        ))}
      </nav>

      <p className="gallery-heading">Choose a picture</p>
      <div className="gallery-grid">
        <button
          type="button"
          className="gallery-card upload-card"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <span className="upload-icon">{isUploading ? '⏳' : '📷'}</span>
          <span className="gallery-card-title">{isUploading ? 'Processing…' : 'Upload your own photo'}</span>
        </button>
        {galleryImages.map((image) => (
          <button
            key={image.id}
            type="button"
            className={`gallery-card ${selectedId === image.id ? 'selected' : ''}`}
            onClick={() => setSelectedId(image.id)}
          >
            <span className="gallery-card-image">
              <img src={image.src} alt={image.title} loading="lazy" />
            </span>
            <span className="gallery-card-title">{image.title}</span>
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(e) => {
          void handleFileChosen(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {uploadError && <p className="upload-error">{uploadError}</p>}

      <FeedbackSection />

      <div className={`play-dock ${selectedImage ? 'ready' : ''}`}>
        <div className="play-dock-inner">
          {selectedImage ? (
            <div className="play-dock-pick">
              <img src={selectedImage.src} alt="" />
              <div className="play-dock-copy">
                <strong>{selectedImage.title}</strong>
                <span>{pieceCount} pieces{rotationEnabled ? ' · rotated' : ''}</span>
              </div>
            </div>
          ) : (
            <div className="play-dock-copy">
              <strong>Pick a picture to play</strong>
              <span>Tap any image above — then choose a difficulty</span>
            </div>
          )}

          <div className="difficulty-presets play-dock-presets">
            {DIFFICULTY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`difficulty-chip ${pieceCount === preset.pieces ? 'active' : ''}`}
                onClick={() => setPieceCount(preset.pieces)}
              >
                {preset.label}
                <span className="difficulty-chip-count">{preset.pieces}</span>
              </button>
            ))}
          </div>

          <div className="play-dock-actions">
            <button
              type="button"
              className="play-dock-more"
              aria-expanded={showMoreOptions}
              onClick={() => setShowMoreOptions((open) => !open)}
            >
              {showMoreOptions ? 'Less' : 'More'}
            </button>
            <button
              type="button"
              className="btn btn-primary start-button"
              disabled={!selectedId}
              onClick={startPuzzle}
            >
              Start Puzzle
            </button>
          </div>

          {showMoreOptions && (
            <div className="play-dock-extra">
              <label className="slider-label" htmlFor="piece-count">
                Piece count: <strong>{pieceCount}</strong>
              </label>
              <input
                id="piece-count"
                type="range"
                min={MIN_PIECES}
                max={MAX_PIECES}
                step={1}
                value={pieceCount}
                onChange={(e) => setPieceCount(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-ticks">
                <span>{MIN_PIECES}</span>
                <span>{MAX_PIECES}</span>
              </div>
              <label className="rotation-toggle-row">
                <span>
                  Rotated pieces <span className="rotation-toggle-hint">(harder — off by default)</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={rotationEnabled}
                  className={`toggle-switch ${rotationEnabled ? 'on' : ''}`}
                  onClick={toggleRotation}
                >
                  <span className="toggle-knob" />
                </button>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
