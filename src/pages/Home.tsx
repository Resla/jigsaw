import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { galleryImages, type GalleryImage } from '../data/gallery';
import { categories, type CategorySlug } from '../data/categories';
import { readAndDownscaleImage } from '../engine/imageUtils';
import { generateCustomImageId, saveCustomImage } from '../engine/imageStore';
import { getDailyChallengeInfo, getStreak, hasCompletedToday } from '../engine/dailyChallenge';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, SITE_NAME } from '../data/siteConfig';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { FeedbackSection } from '../components/FeedbackSection';
import { GalleryArt } from '../components/LivingPicture';
import { DifficultyChips } from '../components/DifficultyChips';
import { stories } from '../data/stories';
import { spotPuzzles } from '../data/spotIt';
import {
  MAX_PIECES,
  MIN_PIECES,
  ROTATION_PREF_KEY,
  getStoredBoolPref,
  getStoredPieceCount,
  setStoredBoolPref,
  setStoredPieceCount,
} from '../engine/playPrefs';

const FEATURED_STORY = stories[0];
const FEATURED_SPOT = spotPuzzles[0];
const PLAY_COVER = galleryImages.find((image) => image.id === 'curious-puppy');

const SAMPLE_IDS = ['sunny-pals', 'curious-puppy', 'tropical-beach', 'starry-night', 'sitting-cat'];
const samplePictures = SAMPLE_IDS.map((id) => galleryImages.find((image) => image.id === id)).filter(
  (image): image is GalleryImage => Boolean(image),
);

const CATEGORY_COVERS: Record<CategorySlug, string> = {
  animals: 'curious-puppy',
  nature: 'coastal-forest',
  art: 'starry-night',
  cities: 'tower-bridge-night',
  flowers: 'pink-peony',
  food: 'sushi-platter',
  ocean: 'clownfish-anemone',
  space: 'ring-nebula',
  'kids-easy': 'sunny-pals',
  hard: 'autumn-forest',
};

const HOME_FAQS: { question: string; answer: string; link?: { to: string; label: string } }[] = [
  {
    question: 'What is a Story Puzzle?',
    answer:
      'A short picture story you read, then assemble as a jigsaw. Finishing unlocks the next act. Four stories, including a pet heist and an undersea circus — something other jigsaw sites do not do.',
    link: { to: '/story/great-pet-heist', label: 'Start The Great Pet Heist' },
  },
  {
    question: 'What is Spot it?',
    answer:
      'A find-what-does-not-belong game next to the jigsaws. Each picture hides five things that should not be there.',
    link: { to: '/spot-it/night-carnival', label: 'Try The Night Carnival' },
  },
  {
    question: 'Are these jigsaw puzzles free to play online?',
    answer:
      'Yes. Every gallery puzzle here is a free online jigsaw — no paywall, no trial, and no piece-count lock. Open a picture and start assembling it in your browser.',
  },
  {
    question: 'Do I need to download an app or create an account?',
    answer:
      'No. Puzzle Harbour runs in the browser. There is nothing to install, and you do not sign in. It also works offline as a PWA if you add it to your home screen.',
  },
  {
    question: 'Are there jigsaw puzzles for kids?',
    answer:
      'Yes. The kids category uses bright, simple scenes and low piece counts, and a few pictures even move while you play. Grown-ups who want an easy warm-up use it too.',
    link: { to: '/category/kids-easy', label: 'Easy jigsaw puzzles for kids' },
  },
  {
    question: 'How hard can the puzzles get?',
    answer:
      'As hard as you like. Most pictures play well at 24, 48, or 100 pieces. The hard category is built for dense detail, and any puzzle can go up to 500 pieces.',
    link: { to: '/category/hard', label: 'Hard jigsaw puzzles' },
  },
  {
    question: 'Can I play jigsaw puzzles with friends?',
    answer:
      'Yes. Create a room, share a four-letter code, and race the same picture. Nobody needs an account — it is a race, not a shared board.',
    link: { to: '/play', label: 'Play together' },
  },
  {
    question: 'Can I turn my own photo into a jigsaw?',
    answer:
      'Yes. Use Upload your own photo on this page, pick a piece count, and play. Custom uploads stay on your device and are not listed in the public gallery.',
  },
];

export function Home() {
  const navigate = useNavigate();
  const [daily] = useState(getDailyChallengeInfo);
  const [streak] = useState(getStreak);
  const [completedToday] = useState(hasCompletedToday);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pieceCount, setPieceCountState] = useState(getStoredPieceCount);
  const [rotationEnabled, setRotationEnabled] = useState(() => getStoredBoolPref(ROTATION_PREF_KEY, false));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImage = galleryImages.find((image) => image.id === selectedId) ?? null;

  useSeo({
    title: 'Free Online Jigsaw Puzzles, Story Puzzles & Spot It | Puzzle Harbour',
    description:
      'Play free online jigsaw puzzles in your browser. Choose from 24 to 500 pieces, try the daily puzzle, Story Puzzles, Spot It challenges, multiplayer, or use your own photo.',
    path: '/',
    image: FEATURED_STORY?.beats[0]?.src,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free browser jigsaw puzzles plus Story Puzzles — read a scene, then assemble it — and Spot it find-the-difference pictures.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  });

  const choosePieces = (value: number) => {
    setPieceCountState(value);
    setStoredPieceCount(value);
  };

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
        <p>Pick a picture, choose a piece count, and start. No download or sign-up.</p>
      </header>

      <section className="home-section" aria-label="Play together, Story Puzzles, and Spot it">
        <h2 className="gallery-heading">Play together, Story Puzzles &amp; Spot it</h2>
        <div className="home-entry-grid">
          <Link to="/play" className="home-entry-card">
            <span className="home-entry-thumb">
              {PLAY_COVER && (
                <GalleryArt src={PLAY_COVER.src} title={PLAY_COVER.title} animated={PLAY_COVER.animated} />
              )}
            </span>
            <span className="home-entry-copy">
              <strong>Play together</strong>
              <span>Share a code and race</span>
            </span>
          </Link>
          <Link to="/stories" className="home-entry-card">
            <span className="home-entry-thumb">
              <img src={FEATURED_STORY.beats[0].src} alt="" />
            </span>
            <span className="home-entry-copy">
              <strong>Story Puzzles</strong>
              <span>Read, then assemble</span>
            </span>
          </Link>
          <Link to="/spot-it" className="home-entry-card">
            <span className="home-entry-thumb">
              <img src={FEATURED_SPOT.src} alt="" />
            </span>
            <span className="home-entry-copy">
              <strong>Spot it</strong>
              <span>Find what does not belong</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="home-section home-jigsaw-block" aria-label="Jigsaw puzzles">
        <h2 className="gallery-heading">Jigsaws</h2>
        <div className="jigsaw-controls">
          <span className="jigsaw-controls-label">Difficulty</span>
          <DifficultyChips pieceCount={pieceCount} onChange={choosePieces} />
        </div>

        <h3 className="gallery-subheading">Today</h3>
        <Link
          className="daily-card"
          to={`/puzzle/${daily.image.id}`}
          onClick={(event) => {
            event.preventDefault();
            navigate(`/puzzle/${daily.image.id}?pieces=${daily.pieceCount}&rotate=0&daily=${daily.date}`);
          }}
        >
          <span className="daily-card-thumb">
            <GalleryArt src={daily.image.src} title={daily.image.title} animated={daily.image.animated} />
          </span>
          <div className="daily-card-body">
            <span className="daily-card-eyebrow">Today's Challenge — Daily #{daily.dayNumber}</span>
            <span className="daily-card-title">
              {completedToday ? 'Solved today — play again?' : "Play today’s puzzle"}
            </span>
            {streak > 0 && <span className="daily-card-streak">🔥 {streak}-day streak</span>}
          </div>
          <span className="daily-card-arrow">→</span>
        </Link>

        <h3 className="gallery-subheading">Browse</h3>
        <div className="browse-grid">
          {categories.map((category) => {
            const coverId = CATEGORY_COVERS[category.slug];
            const cover = galleryImages.find((image) => image.id === coverId);
            const count = galleryImages.filter((image) => image.categories.includes(category.slug)).length;
            return (
              <Link key={category.slug} to={`/category/${category.slug}`} className="browse-card">
                <span className="browse-card-image">
                  {cover && <GalleryArt src={cover.src} title={cover.title} animated={cover.animated} />}
                </span>
                <span className="browse-card-body">
                  <strong>
                    {category.emoji} {category.name}
                  </strong>
                  <span>{category.tagline}</span>
                  <em>{count} puzzles</em>
                </span>
              </Link>
            );
          })}
        </div>

        <h3 className="gallery-subheading">A few to try</h3>
        <p className="moving-pictures-lead">Tap a picture, then Start in the bar below.</p>
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
          {samplePictures.map((image) => (
            <Link
              key={image.id}
              to={`/puzzle/${image.id}?pieces=${image.animated ? 24 : pieceCount}&${optionsQuery()}`}
              className={`gallery-card ${selectedId === image.id ? 'selected' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                setSelectedId(image.id);
                if (image.animated) choosePieces(24);
              }}
            >
              <span className="gallery-card-image">
                <GalleryArt src={image.src} title={image.title} animated={image.animated} />
                {image.animated && <span className="gallery-moves-badge">Moves!</span>}
              </span>
              <span className="gallery-card-title">{image.title}</span>
            </Link>
          ))}
        </div>
      </section>

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

      <section className="home-about" aria-labelledby="home-about-heading">
        <h2 id="home-about-heading">A free online jigsaw, without the fuss</h2>
        <p>
          Puzzle Harbour is a free jigsaw puzzle site that runs in your browser. There is nothing to
          install and no account to create. Choose an image, set the piece count from a gentle 24 up to a
          500-piece grind, and play on a phone or a laptop. Come back for the daily challenge if you like a
          streak, or open <Link to="/play">Play together</Link> and race a friend with a four-letter room
          code.
        </p>
        <p>
          The gallery is curated on purpose:{' '}
          <Link to="/category/animals">animals</Link>,{' '}
          <Link to="/category/nature">nature and landscapes</Link>,{' '}
          <Link to="/category/art">classic art</Link>,{' '}
          <Link to="/category/cities">city skylines</Link>,{' '}
          <Link to="/category/flowers">flowers</Link>,{' '}
          <Link to="/category/food">food</Link>,{' '}
          <Link to="/category/ocean">ocean life</Link>,{' '}
          <Link to="/category/space">space</Link>,{' '}
          <Link to="/category/hard">hard puzzles</Link>, and bright{' '}
          <Link to="/category/kids-easy">jigsaw puzzles for kids</Link> — including a few pictures that
          move. <Link to="/stories">Story Puzzles</Link> turn a scene into a jigsaw before the next act
          unlocks. <Link to="/spot-it">Spot it</Link> is a find-the-odd-detail game when you want a break
          from snapping pieces. You can also upload your own photo and keep that puzzle on this device.
        </p>

        <h3>Questions people ask</h3>
        <div className="home-faq">
          {HOME_FAQS.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>
                {faq.answer}
                {faq.link && (
                  <>
                    {' '}
                    <Link to={faq.link.to}>{faq.link.label}</Link>
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </section>

      <FeedbackSection />
      <SiteFooter />

      <div className={`play-dock ${selectedImage ? 'ready' : ''}`}>
        <div className="play-dock-inner">
          {selectedImage ? (
            <div className="play-dock-pick">
              {selectedImage.animated ? (
                <GalleryArt src={selectedImage.src} title={selectedImage.title} animated />
              ) : (
                <img src={selectedImage.src} alt="" />
              )}
              <div className="play-dock-copy">
                <strong>{selectedImage.title}</strong>
                <span>{pieceCount} pieces{rotationEnabled ? ' · rotated' : ''}</span>
              </div>
            </div>
          ) : (
            <div className="play-dock-copy">
              <strong>Pick a picture to play</strong>
              <span>Tap a sample above, then Start</span>
            </div>
          )}

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
                onChange={(e) => choosePieces(Number(e.target.value))}
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
