import { useEffect, useId, useState } from 'react';

const markupCache = new Map<string, string>();

interface LivingPictureProps {
  src: string;
  title: string;
  className?: string;
}

function uniquifySvgIds(markup: string, prefix: string): string {
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  return ids.reduce((next, id) => {
    const unique = `${prefix}-${id}`;
    return next
      .replaceAll(`id="${id}"`, `id="${unique}"`)
      .replaceAll(`url(#${id})`, `url(#${unique})`);
  }, markup);
}

/** Inlines an SVG so its CSS animations actually play (they freeze inside `<img>`). */
export function LivingPicture({ src, title, className }: LivingPictureProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [markup, setMarkup] = useState(() => markupCache.get(src) ?? '');

  useEffect(() => {
    const cached = markupCache.get(src);
    if (cached) {
      setMarkup(cached);
      return;
    }
    let cancelled = false;
    fetch(src)
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((text) => {
        markupCache.set(src, text);
        if (!cancelled) setMarkup(text);
      })
      .catch(() => {
        if (!cancelled) setMarkup('');
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!markup) {
    return <img src={src} alt={title} />;
  }

  return (
    <div
      className={`living-picture${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: uniquifySvgIds(markup, instanceId) }}
    />
  );
}

export function GalleryArt({
  src,
  title,
  animated,
}: {
  src: string;
  title: string;
  animated?: boolean;
}) {
  if (animated) {
    return <LivingPicture src={src} title={title} />;
  }
  return <img src={src} alt={title} loading="lazy" />;
}
