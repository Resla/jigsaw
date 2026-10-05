import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

const UPDATED = '4 October 2026';

type LegalKind = 'privacy' | 'terms';

const COPY: Record<
  LegalKind,
  { title: string; seoTitle: string; seoDescription: string; heading: string }
> = {
  privacy: {
    title: 'Privacy',
    seoTitle: 'Privacy Policy | Puzzle Harbour',
    seoDescription:
      'How Puzzle Harbour handles information: no accounts, progress stays in your browser, and what happens if we add advertising later.',
    heading: 'Privacy Policy',
  },
  terms: {
    title: 'Terms',
    seoTitle: 'Terms of Use | Puzzle Harbour',
    seoDescription:
      'The rules for playing free jigsaw puzzles on Puzzle Harbour: personal use, photo uploads, multiplayer rooms, and image credits.',
    heading: 'Terms of Use',
  },
};

function LegalLayout({
  kind,
  children,
}: {
  kind: LegalKind;
  children: ReactNode;
}) {
  const copy = COPY[kind];
  useSeo({
    title: copy.seoTitle,
    description: copy.seoDescription,
    path: `/${kind}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: copy.heading,
      url: `${SITE_URL}/${kind}`,
      dateModified: '2026-10-04',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    },
  });

  return (
    <div className="home-page">
      <SiteHeader />
      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>{copy.title}</span>
      </nav>
      <article className="legal-page">
        <header className="page-hero">
          <h1>{copy.heading}</h1>
          <p className="page-hero-lead">Last updated {UPDATED}</p>
        </header>
        {children}
      </article>
      <SiteFooter />
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout kind="privacy">
      <p>
        {SITE_NAME} ({SITE_URL.replace('https://', '')}) is a free browser jigsaw site. We do not ask you to
        create an account, and we do not run a membership database. This page explains what stays on your
        device, what briefly travels over the network when you play with someone else, and how we may show
        ads later.
      </p>

      <h2>What stays on your device</h2>
      <p>
        Puzzle progress, best times, daily-streak counts, piece-count preferences, and photos you turn into
        a jigsaw are stored in this browser (localStorage and IndexedDB). Custom photos are not uploaded to
        our servers. Clearing site data or switching browsers removes that history. We cannot recover it.
      </p>

      <h2>Play together rooms</h2>
      <p>
        If you create or join a room, a short-lived room record is stored on our Cloudflare Worker so both
        players see the same picture, piece count, display name, and race progress. We use this only to run
        the race. We do not sell it, and we do not use it to build a profile of you.
      </p>

      <h2>Feedback</h2>
      <p>
        The homepage feedback form is optional. If you send a note, we see whatever you type, plus an email
        address only if you choose to leave one. Use that form if you want to reach us — we do not publish a
        staff inbox on this site.
      </p>

      <h2>Advertising</h2>
      <p>
        The site does not show ads today. We plan to apply for Google AdSense. If ads are approved, Google
        may set cookies or use device identifiers to show and measure advertisements. We will update this
        policy and, where required, add a consent choice before personalized ads run for visitors in regions
        that require it. You can learn how Google uses data in advertising from Google’s own policies.
      </p>

      <h2>Children</h2>
      <p>
        Some puzzles are made for kids, and anyone can play without signing in. We do not knowingly collect
        names, emails, or other personal details from children. The feedback form should be used by an adult
        if a child wants to write in.
      </p>

      <h2>Pictures on the site</h2>
      <p>
        Gallery photos come from sources such as Wikimedia Commons and Unsplash, or are original artwork for
        Story Puzzles and kids pictures. Each puzzle page names the credit and, where the licence needs it,
        links back to the source.
      </p>

      <h2>Changes</h2>
      <p>
        If we start showing ads, add analytics, or change how rooms work, we will change the date at the top
        of this page. Continued use of the site after an update means you have read the new version.
      </p>

      <p>
        See also our <Link to="/terms">Terms of Use</Link>.
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout kind="terms">
      <p>
        By using {SITE_NAME} you agree to these terms. The site is a free hobby project. It is offered as-is,
        with no paid subscription and no promise that every feature will stay online forever.
      </p>

      <h2>What you may do</h2>
      <p>
        You may play the puzzles, share a daily result or a room code with friends, and upload your own photo
        to make a private jigsaw on this device. You may not scrape the site in a way that harms it, copy the
        Story Puzzle artwork for a competing product, or use rooms to abuse other players.
      </p>

      <h2>Your photos</h2>
      <p>
        If you upload a picture, you confirm you have the right to use it as a jigsaw. Uploads stay in your
        browser. We are not responsible for photos you do not have permission to use.
      </p>

      <h2>Our pictures</h2>
      <p>
        Third-party photos remain under their original licences (for example Creative Commons or public
        domain). Credits on each puzzle page are part of that licence. Original {SITE_NAME} illustrations
        stay ours unless a page says otherwise.
      </p>

      <h2>No warranty</h2>
      <p>
        Rooms, streaks, and saved games can be lost if your browser data is cleared or a server has a fault.
        We are not liable for lost progress, or for any damages that come from using a free website. If you
        are not happy with the site, stop using it.
      </p>

      <h2>Ads and changes</h2>
      <p>
        We may add advertising, change features, or take the site down. We will not charge you to play the
        public gallery without saying so clearly first.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can go through the feedback form on the <Link to="/">homepage</Link>.
        The <Link to="/privacy">Privacy Policy</Link> explains what we store.
      </p>
    </LegalLayout>
  );
}
