import { Link } from 'react-router-dom';
import { getFoundErrors, spotPuzzles } from '../data/spotIt';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export function SpotItPage() {
  useSeo({
    title: 'Spot It Puzzles – Find 5 Things Wrong | Puzzle Harbour',
    description:
      'Look closely at each illustrated scene and find five things that should not be there. Play free visual Spot It puzzles online and challenge your observation skills.',
    path: '/spot-it',
  });

  return (
    <div className="home-page">
      <SiteHeader />

      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Spot it</span>
      </nav>

      <header className="page-hero">
        <h1>
          <span aria-hidden="true">🔎</span> Spot It Puzzles
        </h1>
        <p className="page-hero-lead">
          Look closely at one illustrated scene and tap five things that should not be there. The odd details
          are hidden in the picture itself.
        </p>
      </header>

      <div className="story-feature-list">
        {spotPuzzles.map((puzzle) => {
          const found = getFoundErrors(puzzle.slug).length;
          const done = found >= puzzle.errors.length;
          return (
            <Link key={puzzle.slug} to={`/spot-it/${puzzle.slug}`} className="story-feature">
              <img src={puzzle.src} alt={puzzle.title} />
              <div className="story-feature-copy">
                <p className="story-book-act">{puzzle.errors.length} to find</p>
                <h2>
                  {puzzle.emoji} {puzzle.title}
                </h2>
                <p>{puzzle.intro}</p>
                <span className="btn btn-primary">
                  {done ? 'Find them again' : found === 0 ? 'Start spotting' : `Continue · ${found} of ${puzzle.errors.length}`}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <SiteFooter />
    </div>
  );
}
