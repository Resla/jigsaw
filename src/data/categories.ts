export type CategorySlug = 'animals' | 'nature' | 'kids-easy' | 'hard';

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  emoji: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
}

export const categories: CategoryDef[] = [
  {
    slug: 'animals',
    name: 'Animals',
    emoji: '🐾',
    tagline: 'Cats, dogs, and wildlife',
    seoTitle: 'Animal Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online animal jigsaw puzzles — dogs, cats, big cats, and wildlife. Pick a piece count and play instantly in your browser, no download needed.',
    intro:
      'From curious puppies to a lioness mid-stare, these animal jigsaw puzzles are a favorite for a reason: familiar, colorful subjects that are satisfying to piece back together. Pick any image below, choose how many pieces, and start playing free in your browser.',
  },
  {
    slug: 'nature',
    name: 'Nature & Landscapes',
    emoji: '🏞️',
    tagline: 'Mountains, coasts, and forests',
    seoTitle: 'Nature & Landscape Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online nature and landscape jigsaw puzzles — mountains, fjords, forests, deserts, and beaches. Play instantly in your browser, no download needed.',
    intro:
      'Sweeping mountain ranges, quiet fjords, and sun-drenched beaches — these nature and landscape jigsaw puzzles are great for slowing down and losing an hour. Every puzzle is free to play right in your browser.',
  },
  {
    slug: 'kids-easy',
    name: 'Easy Puzzles for Kids',
    emoji: '🧒',
    tagline: 'Bright, simple, and beginner-friendly',
    seoTitle: 'Easy Jigsaw Puzzles for Kids — Play Free Online',
    seoDescription:
      'Free easy jigsaw puzzles for kids and beginners. Bright, simple images with low piece counts — play online in your browser, no download needed.',
    intro:
      'Bright colors, simple backgrounds, and forgiving piece counts make these jigsaw puzzles a great starting point for kids and anyone new to online puzzling. Every puzzle here is free, and the piece count can always be turned down further.',
  },
  {
    slug: 'hard',
    name: 'Hard & Advanced',
    emoji: '🧠',
    tagline: 'Dense detail, big piece counts',
    seoTitle: 'Hard Jigsaw Puzzles — 300 to 500 Pieces, Free Online',
    seoDescription:
      'Free hard jigsaw puzzles online with dense detail and high piece counts, up to 500 pieces. A real challenge for experienced solvers, right in your browser.',
    intro:
      'Textured fur, repeating architecture, and dense foliage — these images were picked because they are genuinely tricky to piece back together. Bump the piece count up to 500 for the toughest possible version of any puzzle on this site.',
  },
];

export function getCategory(slug: string | undefined): CategoryDef | undefined {
  return categories.find((c) => c.slug === slug);
}
