import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { GalleryArt } from '../components/LivingPicture';
import {
  DAILY_PATH,
  DAILY_PIECE_COUNT,
  dailyPlayUrl,
  getDailyChallengeInfo,
  getRecentDailies,
  getStreak,
  hasCompletedToday,
} from '../engine/dailyChallenge';

const ARCHIVE_DAYS = 14;

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'When does the daily jigsaw puzzle change?',
    answer:
      'A new puzzle unlocks every day at midnight UTC. Everyone in the world gets the same picture on the same day, so you can compare times with friends.',
  },
  {
    question: 'How many pieces is the daily puzzle?',
    answer: `Every daily puzzle is ${DAILY_PIECE_COUNT} pieces with no rotation — big enough to be satisfying, short enough for a coffee break.`,
  },
  {
    question: 'How does the streak work?',
    answer:
      'Solve today’s puzzle to add a day to your streak. Miss a day and it starts again at one. Your streak is saved in this browser, so there is no account to create.',
  },
  {
    question: 'Can I play yesterday’s puzzle?',
    answer: `Yes. The last ${ARCHIVE_DAYS} daily puzzles are listed on this page. Catching up on older puzzles is just for fun — only today’s puzzle counts toward your streak.`,
  },
  {
    question: 'Is the daily jigsaw free?',
    answer: 'Yes. It is free, runs in your browser on phones, tablets and computers, and needs no download or sign-up.',
  },
];

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function DailyPage() {
  const [today] = useState(() => getDailyChallengeInfo());
  const [streak] = useState(getStreak);
  const [completedToday] = useState(hasCompletedToday);
  const recent = getRecentDailies(ARCHIVE_DAYS, today.date);

  useSeo({
    title: 'Daily Jigsaw Puzzle — A Free New Puzzle Every Day | Puzzle Harbour',
    description: `Play today’s free daily jigsaw puzzle online: one new ${DAILY_PIECE_COUNT}-piece picture every day, the same for everyone. Keep your streak, share your time, and catch up on past puzzles.`,
    path: DAILY_PATH,
    image: today.image.src,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Daily Jigsaw Puzzle', item: `${SITE_URL}${DAILY_PATH}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Game',
        name: 'Puzzle Harbour Daily Jigsaw Puzzle',
        description: `A new free ${DAILY_PIECE_COUNT}-piece online jigsaw puzzle every day.`,
        url: `${SITE_URL}${DAILY_PATH}`,
        genre: 'Jigsaw puzzle',
        gamePlatform: 'Web browser',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  });

  return (
    <div className="home-page">
      <SiteHeader />

      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Daily Jigsaw Puzzle</span>
      </nav>

      <header className="page-hero">
        <h1>
          <span aria-hidden="true">📅</span> Daily Jigsaw Puzzle
        </h1>
        <p className="page-hero-lead">
          One new picture every day, the same for everyone. Solve today’s {DAILY_PIECE_COUNT}-piece jigsaw, keep
          your streak going, and share your time with friends — free in your browser.
        </p>
      </header>

      <Link to={dailyPlayUrl(today)} className="daily-card daily-hero-card">
        <span className="daily-card-thumb">
          <GalleryArt src={today.image.src} title={today.image.title} animated={today.image.animated} />
        </span>
        <span className="daily-card-body">
          <span className="daily-card-eyebrow">
            Daily #{today.dayNumber} · {formatDate(today.date)} · {DAILY_PIECE_COUNT} pieces
          </span>
          <span className="daily-card-title">
            {completedToday ? `Solved today — ${today.image.title}` : `Play today’s puzzle: ${today.image.title}`}
          </span>
          {streak > 0 && <span className="daily-card-streak">🔥 {streak}-day streak</span>}
        </span>
        <span className="daily-card-arrow">→</span>
      </Link>

      {recent.length > 0 && (
        <section className="home-section" aria-labelledby="daily-archive-heading">
          <h2 id="daily-archive-heading">Previous daily puzzles</h2>
          <div className="gallery-grid">
            {recent.map((day) => (
              <Link key={day.date} to={dailyPlayUrl(day)} className="gallery-card category-gallery-card">
                <span className="gallery-card-image">
                  <GalleryArt src={day.image.src} title={day.image.title} animated={day.image.animated} />
                </span>
                <span className="gallery-card-title">
                  <span className="daily-archive-meta">
                    #{day.dayNumber} · {formatDate(day.date)}
                  </span>
                  {day.image.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="category-extra" aria-labelledby="daily-how-heading">
        <h2 id="daily-how-heading">How the daily jigsaw works</h2>
        <p>
          Every day at midnight UTC a new picture is picked from the Puzzle Harbour gallery — animals,
          landscapes, cities, flowers, food, space, and classic paintings. Everyone plays the same puzzle, cut
          into the same {DAILY_PIECE_COUNT} pieces, so your time is directly comparable with anyone else’s.
        </p>
        <p>
          When you finish, tap <strong>Share Result</strong> to copy a short summary with your time, moves,
          and streak — perfect for a family group chat or a friendly office rivalry. It never gives away the
          picture.
        </p>
        <p>
          Want more? Browse the <Link to="/">full gallery</Link>, try a{' '}
          <Link to="/stories">Story Puzzle</Link>, or <Link to="/play">race a friend</Link> on any picture.
        </p>
        <div className="home-faq">
          {FAQS.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
