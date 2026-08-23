import { useEffect } from 'react';
import { SITE_URL } from '../data/siteConfig';

export interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/category/animals" — resolved against SITE_URL. Omit to skip the canonical tag. */
  path?: string;
  image?: string;
  noindex?: boolean;
  /** One or more JSON-LD objects to embed as <script type="application/ld+json"> tags. */
  jsonLd?: object | object[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeLink(rel: string): void {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove();
}

const JSON_LD_ATTR = 'data-seo-jsonld';

function clearJsonLd(): void {
  document.head.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((el) => el.remove());
}

/**
 * Sets document.title and upserts <meta>/<link>/<script type="application/ld+json"> tags for the
 * current route. No react-helmet dependency — only one route is ever mounted at a time in this app,
 * so overwriting in place on every navigation is sufficient (no need to restore previous values).
 */
export function useSeo(options: SeoOptions): void {
  const { title, description, path, image, noindex, jsonLd } = options;

  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    if (path) {
      const url = `${SITE_URL}${path}`;
      upsertLink('canonical', url);
      upsertMeta('property', 'og:url', url);
    } else {
      removeLink('canonical');
    }

    if (image) {
      const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
      upsertMeta('property', 'og:image', absoluteImage);
      upsertMeta('name', 'twitter:image', absoluteImage);
    }

    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    clearJsonLd();
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const item of items) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute(JSON_LD_ATTR, '1');
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, noindex, JSON.stringify(jsonLd)]);
}
