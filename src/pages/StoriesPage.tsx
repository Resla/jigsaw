import { Link } from 'react-router-dom';
import { stories } from '../data/stories';
import { getStoryUnlocked, isStoryFinished } from '../engine/storyProgress';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export function StoriesPage() {
  useSeo({
    title: 'Story Puzzles — Picture jigsaws | Puzzle Harbour',
    description:
      'Story Puzzles on Puzzle Harbour: pet heist, museum heist, space bake-off, and the Magical Undersea Circus. Read each scene, then assemble it to unlock the next act.',
    path: '/stories',
  });

  return (
    <div className="home-page">
      <SiteHeader />

      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Story Puzzles</span>
      </nav>

      <header className="page-hero">
        <h1>
          <span aria-hidden="true">📖</span> Story Puzzles
        </h1>
        <p className="page-hero-lead">
          Read the picture. Put it together. The next act opens when you finish. The art-caper story is{' '}
          <Link to="/story/great-museum-heist">The Great Museum Heist</Link>.
        </p>
      </header>

      <div className="story-feature-list">
        {stories.map((story) => {
          const cover = story.beats[0];
          const unlocked = getStoryUnlocked(story.slug);
          const finished = isStoryFinished(story.slug, story.beats.length);
          return (
            <Link key={story.slug} to={`/story/${story.slug}`} className="story-feature">
              {cover && <img src={cover.src} alt={story.title} />}
              <div className="story-feature-copy">
                <p className="story-book-act">{story.beats.length} acts</p>
                <h2>
                  {story.emoji} {story.title}
                </h2>
                <p>{story.intro}</p>
                <span className="btn btn-primary">
                  {finished ? 'Read it again' : unlocked === 0 ? 'Open the first scene' : `Continue act ${unlocked + 1}`}
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
