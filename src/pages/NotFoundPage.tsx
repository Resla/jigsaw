import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { DAILY_PATH } from '../engine/dailyChallenge';

export function NotFoundPage() {
  useSeo({
    title: 'Page not found | Puzzle Harbour',
    description: 'That page is not on Puzzle Harbour. Try the gallery, the daily puzzle, or a category.',
    path: '/404',
    noindex: true,
  });

  return (
    <div className="home-page">
      <SiteHeader />
      <article className="legal-page not-found-page">
        <header className="page-hero">
          <h1>Page not found</h1>
          <p className="page-hero-lead">
            That address is not a puzzle, story, or category on Puzzle Harbour. The link may be old, or it
            may have been typed with a typo.
          </p>
        </header>
        <p>Here are solid places to start:</p>
        <ul className="not-found-links">
          <li>
            <Link to="/">Home — free jigsaw gallery</Link>
          </li>
          <li>
            <Link to={DAILY_PATH}>Today’s daily jigsaw</Link>
          </li>
          <li>
            <Link to="/category/animals">Animal puzzles</Link>
          </li>
          <li>
            <Link to="/stories">Story Puzzles</Link>
          </li>
        </ul>
      </article>
      <SiteFooter />
    </div>
  );
}
