import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { galleryImages } from '../data/gallery';
import { categories, getCategory } from '../data/categories';
import { SITE_URL } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { GalleryArt } from '../components/LivingPicture';
import { DifficultyChips } from '../components/DifficultyChips';
import { getStoredPieceCount, setStoredPieceCount } from '../engine/playPrefs';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategory(slug);
  const images = category ? galleryImages.filter((img) => img.categories.includes(category.slug)) : [];
  const [pieceCount, setPieceCount] = useState(getStoredPieceCount);

  const choosePieces = (value: number) => {
    setPieceCount(value);
    setStoredPieceCount(value);
  };

  useSeo({
    title: category ? `${category.seoTitle} | Puzzle Harbour` : 'Category Not Found | Puzzle Harbour',
    description: category ? category.seoDescription : 'That puzzle category could not be found.',
    path: category ? `/category/${category.slug}` : undefined,
    noindex: !category,
    image: images[0]?.src,
    jsonLd: category
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.seoTitle,
            description: category.seoDescription,
            url: `${SITE_URL}/category/${category.slug}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: images.length,
              itemListElement: images.map((image, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: image.title,
                url: `${SITE_URL}/puzzle/${image.id}`,
              })),
            },
          },
        ]
      : undefined,
  });

  if (!category) {
    return (
      <div className="home-page">
        <SiteHeader />
        <div className="history-empty">
          <p>We couldn't find that category.</p>
          <Link to="/">Back to gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <SiteHeader />

      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>{category.name}</span>
      </nav>

      <header className="page-hero">
        <h1>
          <span aria-hidden="true">{category.emoji}</span>{' '}
          {category.heading ??
            (category.slug === 'animals'
              ? 'Animal Jigsaw Puzzles'
              : category.slug === 'hard'
                ? 'Hard Jigsaw Puzzles'
                : category.name)}
        </h1>
        <p className="page-hero-lead">{category.intro}</p>
      </header>

      <nav className="category-chip-row" aria-label="Puzzle categories">
        {categories.map((item) => (
          <Link
            key={item.slug}
            to={`/category/${item.slug}`}
            className={`category-chip${item.slug === category.slug ? ' active' : ''}`}
          >
            <span className="category-chip-emoji">{item.emoji}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="jigsaw-controls">
        <span className="jigsaw-controls-label">Difficulty</span>
        <DifficultyChips pieceCount={pieceCount} onChange={choosePieces} />
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <Link key={image.id} to={`/puzzle/${image.id}`} className="gallery-card category-gallery-card">
            <span className="gallery-card-image">
              <GalleryArt src={image.src} title={image.title} animated={image.animated} />
              {image.animated && <span className="gallery-moves-badge">Moves!</span>}
            </span>
            <span className="gallery-card-title">{image.title}</span>
          </Link>
        ))}
      </div>

      {images.length === 0 && <p className="category-empty">No puzzles in this category yet — check back soon.</p>}
      {category.slug === 'animals' && (
        <p className="page-hero-lead">
          Each picture opens as a free jigsaw in your browser. Choose a piece count above, then tap a scene to
          start.
        </p>
      )}
      {category.slug === 'kids-easy' && (
        <section className="category-extra" aria-labelledby="kids-easy-heading">
          <h2 id="kids-easy-heading">Easy jigsaw puzzles for kids</h2>
          <p>
            These puzzles use bright, simple scenes and lower piece counts, making them easier to solve on
            phones, tablets and computers. Choose a small puzzle for a quick game or increase the number of
            pieces for a bigger challenge. Everything plays directly in your browser — no download or account
            needed.
          </p>
          <div className="home-faq">
            <details>
              <summary>What makes these puzzles easy?</summary>
              <p>Clear pictures and lower piece counts make these puzzles simpler to start and finish.</p>
            </details>
            <details>
              <summary>Can kids play these puzzles on a tablet?</summary>
              <p>Yes. Puzzle Harbour works in the browser on phones, tablets and computers.</p>
            </details>
            <details>
              <summary>Do I need to download anything?</summary>
              <p>No. The puzzles play directly in your browser.</p>
            </details>
          </div>
        </section>
      )}
      {category.about && (
        <section className="category-extra" aria-labelledby={`${category.slug}-about-heading`}>
          <h2 id={`${category.slug}-about-heading`}>{category.about.heading}</h2>
          {category.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {category.about.faqs && category.about.faqs.length > 0 && (
            <div className="home-faq">
              {category.about.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          )}
        </section>
      )}
      <SiteFooter />
    </div>
  );
}
