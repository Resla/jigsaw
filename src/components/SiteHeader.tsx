import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        <svg className="site-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M11 5h6a2 2 0 0 1 2 2v2.2a2.3 2.3 0 0 0 3.6 1.9c.7-.5 1.7-.3 2.1.5.5 1 .1 2.2-.9 2.7a2.3 2.3 0 0 0 0 4.1c1 .5 1.4 1.7.9 2.7-.4.8-1.4 1-2.1.5A2.3 2.3 0 0 0 19 23.6V26a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2.4a2.3 2.3 0 0 0-3.6-1.9c-.7.5-1.7.3-2.1-.5-.5-1-.1-2.2.9-2.7a2.3 2.3 0 0 0 0-4.1c-1-.5-1.4-1.7-.9-2.7.4-.8 1.4-1 2.1-.5A2.3 2.3 0 0 0 9 9.2V7a2 2 0 0 1 2-2Z"
            fill="currentColor"
          />
        </svg>
        <span className="site-logo-text">Jigsaw</span>
      </Link>
      <nav className="site-nav" aria-label="Main">
        <a href="/#feedback">Feedback</a>
        <Link to="/my-puzzles">My Puzzles</Link>
      </nav>
    </header>
  );
}
