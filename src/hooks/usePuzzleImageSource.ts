import { useEffect, useState } from 'react';
import { galleryImages } from '../data/gallery';
import type { CategorySlug } from '../data/categories';
import { loadCustomImage } from '../engine/imageStore';

export interface PuzzleImageSource {
  id: string;
  title: string;
  src: string;
  credit: string | null;
  seoDescription: string | null;
  categories: CategorySlug[];
}

interface ResolvedImageState {
  status: 'loading' | 'ready' | 'not-found';
  image: PuzzleImageSource | null;
}

/** Resolves either a curated gallery image (by imageId) or a user-uploaded image stored in IndexedDB (by customId). */
export function usePuzzleImageSource(imageId?: string, customId?: string): ResolvedImageState {
  const [state, setState] = useState<ResolvedImageState>({ status: 'loading', image: null });

  useEffect(() => {
    let cancelled = false;

    if (customId) {
      setState({ status: 'loading', image: null });
      loadCustomImage(customId)
        .then((stored) => {
          if (cancelled) return;
          if (!stored) {
            setState({ status: 'not-found', image: null });
            return;
          }
          setState({
            status: 'ready',
            image: {
              id: customId,
              title: stored.title || 'Your Photo',
              src: stored.dataUrl,
              credit: null,
              seoDescription: null,
              categories: [],
            },
          });
        })
        .catch(() => {
          if (!cancelled) setState({ status: 'not-found', image: null });
        });
      return () => {
        cancelled = true;
      };
    }

    if (imageId) {
      const found = galleryImages.find((g) => g.id === imageId);
      setState(
        found
          ? {
              status: 'ready',
              image: {
                id: found.id,
                title: found.title,
                src: found.src,
                credit: found.credit,
                seoDescription: found.seoDescription,
                categories: found.categories,
              },
            }
          : { status: 'not-found', image: null },
      );
      return;
    }

    setState({ status: 'not-found', image: null });
  }, [imageId, customId]);

  return state;
}
