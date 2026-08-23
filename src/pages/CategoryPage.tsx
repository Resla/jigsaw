import { Link, useParams } from 'react-router-dom';
import { galleryImages } from '../data/gallery';
import { getCategory } from '../data/categories';
import { SITE_URL } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategory(slug);
  const images = category ? galleryImages.filter((img) => img.categories.includes(category.slug)) : [];

  useSeo({
    title: category ? `${category.seoTitle} | Jigsaw` : 'Category Not Found | Jigsaw',
    description: category ? category.seoDescription : 'That puzzle category could not be found.',
    path: category ? `/category/${category.slug}` : undefined,
    noindex: !category,
    jsonLd: category
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
          ],
        }
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
          <span aria-hidden="true">{category.emoji}</span> {category.name}
        </h1>
        <p className="page-hero-lead">{category.intro}</p>
      </header>

      <div className="gallery-grid">
        {images.map((image) => (
          <Link key={image.id} to={`/puzzle/${image.id}`} className="gallery-card category-gallery-card">
            <span className="gallery-card-image">
              <img src={image.src} alt={image.title} loading="lazy" />
            </span>
            <span className="gallery-card-title">{image.title}</span>
          </Link>
        ))}
      </div>

      {images.length === 0 && <p className="category-empty">No puzzles in this category yet — check back soon.</p>}
    </div>
  );
}
