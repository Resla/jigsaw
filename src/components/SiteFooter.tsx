import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { stories } from '../data/stories';
import { spotPuzzles } from '../data/spotIt';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-nav" aria-label="All puzzles and games">
        <div className="site-footer-col">
          <h2>Jigsaws</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer-col">
          <h2>Story Puzzles</h2>
          <ul>
            {stories.map((story) => (
              <li key={story.slug}>
                <Link to={`/story/${story.slug}`}>{story.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer-col">
          <h2>More to play</h2>
          <ul>
            {spotPuzzles.map((puzzle) => (
              <li key={puzzle.slug}>
                <Link to={`/spot-it/${puzzle.slug}`}>{puzzle.title}</Link>
              </li>
            ))}
            <li>
              <Link to="/daily-jigsaw-puzzle">Daily jigsaw puzzle</Link>
            </li>
            <li>
              <Link to="/play">Play together</Link>
            </li>
            <li>
              <Link to="/spot-it">All Spot it pictures</Link>
            </li>
            <li>
              <Link to="/stories">All Story Puzzles</Link>
            </li>
          </ul>
        </div>
      </nav>
    </footer>
  );
}
