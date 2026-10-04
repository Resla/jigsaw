import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { galleryImages, type GalleryImage } from '../data/gallery';
import { categories, type CategorySlug } from '../data/categories';
import { readAndDownscaleImage } from '../engine/imageUtils';
import { generateCustomImageId, saveCustomImage } from '../engine/imageStore';
import {
  DAILY_PATH,
  DAILY_PIECE_COUNT,
  dailyPlayUrl,
  getDailyChallengeInfo,
  getStreak,
  hasCompletedToday,
} from '../engine/dailyChallenge';
import { loadPersistedState } from '../engine/persistence';
import { computeProgress, getPuzzleHistory, type PuzzleHistoryEntry } from '../engine/puzzleHistory';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, SITE_NAME } from '../data/siteConfig';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { FeedbackSection } from '../components/FeedbackSection';
import { GalleryArt } from '../components/LivingPicture';
import { HistoryThumb } from '../components/HistoryThumb';
import { stories } from '../data/stories';
import { spotPuzzles } from '../data/spotIt';
import { ROTATION_PREF_KEY, getStoredBoolPref, getStoredPieceCount } from '../engine/playPrefs';

const FEATURED_STORY = stories[0];
const FEATURED_SPOT = spotPuzzles[0];
const PLAY_COVER = galleryImages.find((image) => image.id === 'curious-puppy');

const NEW_PUZZLE_IDS = [
  'tower-bridge-night',
  'clownfish-anemone',
  'sushi-platter',
  'pink-peony',
  'ring-nebula',
  'shibuya-crossing',
  'provence-lavender',
  'breaching-humpback',
  'margherita-pizza',
  'milky-way-alps',
];
const newPuzzles = NEW_PUZZLE_IDS.map((id) => galleryImages.find((image) => image.id === id)).filter(
  (image): image is GalleryImage => Boolean(image),
);

const CONTINUE_LIMIT = 3;
const CONTINUE_MIN_PERCENT = 15;

const HERO_COVER_IDS = [
  'clownfish-anemone',
  'tower-bridge-night',
  'pink-peony',
  'sushi-platter',
  'tropical-beach',
  'starry-night',
  'curious-puppy',
  'provence-lavender',
  'blue-macaw',
  'wildflower-coast',
];

interface ContinueRow {
  entry: PuzzleHistoryEntry;
  percent: number;
}

function loadContinueRows(): ContinueRow[] {
  const rows: ContinueRow[] = [];
  for (const entry of getPuzzleHistory()) {
    const saved = loadPersistedState(entry.storageKey);
    if (!saved || saved.solved) continue;
    const percent = computeProgress(saved.groupMap, entry.pieceCount);
    if (percent < CONTINUE_MIN_PERCENT || percent >= 100) continue;
    rows.push({ entry, percent });
    if (rows.length === CONTINUE_LIMIT) break;
  }
  return rows;
}

function pickHeroImage(dailyImage: GalleryImage): GalleryImage {
  if (HERO_COVER_IDS.includes(dailyImage.id)) return dailyImage;
  return (
    galleryImages.find((image) => HERO_COVER_IDS.includes(image.id) && image.id !== dailyImage.id) ?? dailyImage
  );
}

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
  const location = useLocation();
  const [daily] = useState(getDailyChallengeInfo);
  const [streak] = useState(getStreak);
  const [completedToday] = useState(hasCompletedToday);
  const [pieceCount] = useState(getStoredPieceCount);
  const [rotationEnabled] = useState(() => getStoredBoolPref(ROTATION_PREF_KEY, false));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [continueRows, setContinueRows] = useState<ContinueRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImage = pickHeroImage(daily.image);
  const heroIsDaily = heroImage.id === daily.image.id;

  useEffect(() => {
    setContinueRows(loadContinueRows());
  }, []);

  useEffect(() => {
    if (location.hash !== '#browse') return;
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  useSeo({
    title: 'Free Online Jigsaw Puzzles, Story Puzzles & Spot It | Puzzle Harbour',
    description:
      'Play free online jigsaw puzzles in your browser. Choose from 24 to 500 pieces, try the daily puzzle, Story Puzzles, Spot It challenges, multiplayer, or use your own photo.',
    path: '/',
    image: heroImage.src,
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

  const optionsQuery = () => `rotate=${rotationEnabled ? 1 : 0}`;

  const puzzleUrl = (image: GalleryImage) =>
    `/puzzle/${image.id}?pieces=${image.animated ? 24 : pieceCount}&${optionsQuery()}`;

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

      <section className="hp-hero" aria-labelledby="hp-hero-heading">
        <div className="hp-hero-copy">
          <span className="hp-eyebrow">{galleryImages.length} free puzzles · new one every day</span>
          <h1 id="hp-hero-heading">Free jigsaw puzzles, right in your browser</h1>
          <p>
            Pick a picture and start snapping pieces — from a gentle 24 up to 500. No download, no sign-up, and
            it works on your phone.
          </p>
          <div className="hp-hero-actions">
            <a href="#browse" className="btn btn-primary hp-cta">
              Browse puzzles
            </a>
          </div>
          {streak > 0 && <p className="hp-streak">🔥 {streak}-day daily streak — keep it going</p>}
        </div>

        <div className="hp-daily">
          <Link
            to={heroIsDaily ? dailyPlayUrl(daily) : puzzleUrl(heroImage)}
            className="hp-daily-card"
            aria-label={
              heroIsDaily ? `Play today’s puzzle: ${heroImage.title}` : `Start ${heroImage.title}`
            }
          >
            <span className="hp-daily-image">
              <GalleryArt src={heroImage.src} title={heroImage.title} animated={heroImage.animated} />
            </span>
            <span className="hp-daily-badge">
              {heroIsDaily
                ? `Daily #${daily.dayNumber}${completedToday ? ' · Solved ✓' : ''}`
                : 'Start here'}
            </span>
            <span className="hp-daily-caption">
              <strong>{heroImage.title}</strong>
              <span>
                {heroIsDaily
                  ? `${DAILY_PIECE_COUNT} pieces · same picture for everyone today`
                  : 'A bright picture to start with — tap to play'}
              </span>
            </span>
          </Link>
          {heroIsDaily ? (
            <Link to={DAILY_PATH} className="hp-daily-more">
              Past daily puzzles and how streaks work →
            </Link>
          ) : (
            <Link to={dailyPlayUrl(daily)} className="hp-daily-strip">
              <span>
                Daily #{daily.dayNumber}
                {completedToday ? ' · Solved' : ''}
              </span>
              <strong>{daily.image.title}</strong>
              <span>Play today’s 100-piece puzzle →</span>
            </Link>
          )}
        </div>
      </section>

      {continueRows.length > 0 && (
        <section className="hp-section" aria-labelledby="hp-continue-heading">
          <div className="hp-section-head">
            <h2 id="hp-continue-heading">Continue playing</h2>
            <Link to="/my-puzzles">All my puzzles</Link>
          </div>
          <div className="hp-continue-grid">
            {continueRows.map(({ entry, percent }) => (
              <Link key={entry.storageKey} to={entry.route} className="hp-continue-card">
                <HistoryThumb entry={entry} className="hp-continue-thumb" />
                <span className="hp-continue-body">
                  <strong>{entry.title}</strong>
                  <span className="hp-progress" aria-label={`${percent}% complete`}>
                    <span className="hp-progress-fill" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="hp-continue-meta">
                    {percent}% · {entry.pieceCount} pieces
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="hp-section" id="browse" aria-labelledby="hp-browse-heading">
        <div className="hp-section-head">
          <h2 id="hp-browse-heading">Browse by category</h2>
        </div>
        <div className="hp-category-grid">
          {categories.map((category) => {
            const coverId = CATEGORY_COVERS[category.slug];
            const cover = galleryImages.find((image) => image.id === coverId);
            const count = galleryImages.filter((image) => image.categories.includes(category.slug)).length;
            return (
              <Link key={category.slug} to={`/category/${category.slug}`} className="hp-category-tile">
                {cover && <GalleryArt src={cover.src} title={cover.title} animated={cover.animated} />}
                <span className="hp-category-label">
                  <strong>{category.name}</strong>
                  <span>{count} puzzles</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="hp-section" aria-labelledby="hp-new-heading">
        <div className="hp-section-head">
          <h2 id="hp-new-heading">New puzzles</h2>
        </div>
        <div className="hp-puzzle-grid">
          {newPuzzles.map((image) => (
            <Link key={image.id} to={puzzleUrl(image)} className="gallery-card">
              <span className="gallery-card-image">
                <GalleryArt src={image.src} title={image.title} animated={image.animated} />
              </span>
              <span className="gallery-card-title">{image.title}</span>
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="hp-upload"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <span aria-hidden="true">{isUploading ? '⏳' : '📷'}</span>
          <span>
            <strong>{isUploading ? 'Processing your photo…' : 'Turn your own photo into a jigsaw'}</strong>
            <span>It stays on your device — nothing is uploaded to a server.</span>
          </span>
        </button>
      </section>

      <section className="hp-section" aria-labelledby="hp-modes-heading">
        <div className="hp-section-head">
          <h2 id="hp-modes-heading">More ways to play</h2>
        </div>
        <div className="hp-modes-grid">
          <Link to="/stories" className="hp-mode-card">
            <span className="hp-mode-image">
              <img src={FEATURED_STORY.beats[0].src} alt="" loading="lazy" />
            </span>
            <span className="hp-mode-body">
              <strong>Story Puzzles</strong>
              <span>Read a short picture story, then solve each scene to unlock the next act.</span>
            </span>
          </Link>
          <Link to="/spot-it" className="hp-mode-card">
            <span className="hp-mode-image">
              <img src={FEATURED_SPOT.src} alt="" loading="lazy" />
            </span>
            <span className="hp-mode-body">
              <strong>Spot it</strong>
              <span>Each busy scene hides five things that don’t belong. How fast can you find them?</span>
            </span>
          </Link>
          <Link to="/play" className="hp-mode-card">
            <span className="hp-mode-image">
              {PLAY_COVER && (
                <GalleryArt src={PLAY_COVER.src} title={PLAY_COVER.title} animated={PLAY_COVER.animated} />
              )}
            </span>
            <span className="hp-mode-body">
              <strong>Play together</strong>
              <span>Share a four-letter code and race a friend on the same picture.</span>
            </span>
          </Link>
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
    </div>
  );
}
