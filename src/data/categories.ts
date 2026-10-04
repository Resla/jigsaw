export type CategorySlug =
  | 'animals'
  | 'nature'
  | 'art'
  | 'cities'
  | 'flowers'
  | 'food'
  | 'ocean'
  | 'space'
  | 'kids-easy'
  | 'hard';

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  emoji: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  /** H1 text; falls back to `name`. */
  heading?: string;
  /** Longer copy rendered below the puzzle grid. */
  about?: { heading: string; paragraphs: string[]; faqs?: CategoryFaq[] };
}

export const categories: CategoryDef[] = [
  {
    slug: 'animals',
    name: 'Animals',
    emoji: '🐾',
    tagline: 'Cats, dogs, and wildlife',
    seoTitle: 'Animal Jigsaw Puzzles – Play Free Online',
    seoDescription:
      'Play free animal jigsaw puzzles online, from cute pets to colourful wildlife. Choose your piece count and start solving instantly in your browser.',
    intro:
      'From curious puppies to a lioness mid-stare, these animal jigsaw puzzles are familiar, colourful subjects you can piece back together. Pick a picture, choose a piece count, and play free in your browser.',
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
    slug: 'art',
    name: 'Art & Paintings',
    emoji: '🎨',
    tagline: 'Classic paintings as jigsaws',
    seoTitle: 'Art & Painting Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online art jigsaw puzzles — Van Gogh, Vermeer, Monet, Hokusai, and more classic paintings. Play instantly in your browser, no download needed.',
    intro:
      'Famous paintings make some of the most satisfying jigsaws: bold color, clear shapes, and a picture you already know. These art puzzles are free to play in your browser — pick a painting, choose a piece count, and start.',
  },
  {
    slug: 'cities',
    name: 'Cities & Travel',
    emoji: '🏙️',
    tagline: 'Skylines, landmarks, and night lights',
    heading: 'City & Travel Jigsaw Puzzles',
    seoTitle: 'City & Travel Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online city jigsaw puzzles: Tower Bridge at night, Tokyo’s Shibuya Crossing, the Dubai skyline, New York’s Hudson Yards and more. No download needed.',
    intro:
      'Travel the world one piece at a time. These city and travel jigsaw puzzles cover glowing skylines, famous bridges, and quiet corners of old temples — all free to play in your browser.',
    about: {
      heading: 'Tips for solving city jigsaw puzzles',
      paragraphs: [
        'Skylines are great puzzles because they split naturally into zones. Build the sky first if it has a gradient or clouds, then work the line where buildings meet the sky — that silhouette is the easiest edge to recognise.',
        'Night photos reward a different approach: sort pieces by light colour. Warm window light, blue LED trim, and red traffic signals each form small clusters that snap together quickly, leaving the darker areas for last.',
        'Aerial views like the Dubai skyline are harder because the streets repeat. Raise the piece count only once you are comfortable — 100 pieces is a good middle ground for most city pictures.',
      ],
      faqs: [
        {
          question: 'Which city puzzle is the easiest?',
          answer:
            'Tower Bridge at Night is a good start: the bridge is a strong central shape and the river reflections give clear colour bands.',
        },
        {
          question: 'Which city puzzle is the hardest?',
          answer:
            'The Dubai skyline and Shibuya Crossing are the toughest. Both have lots of small, similar detail that is easy to mix up at high piece counts.',
        },
      ],
    },
  },
  {
    slug: 'flowers',
    name: 'Flowers',
    emoji: '🌸',
    tagline: 'Blooms, meadows, and gardens',
    heading: 'Flower Jigsaw Puzzles',
    seoTitle: 'Flower Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online flower jigsaw puzzles: roses, peonies, cherry blossom, orchids, lavender fields, wildflower meadows and Van Gogh’s Sunflowers. Play in your browser.',
    intro:
      'A pink peony, a red rose garden, a lady’s slipper orchid, a Provence lavender field, spring cherry blossom, and an alpine meadow packed with wildflowers. These flower jigsaw puzzles range from relaxing to properly tricky, and every one is free to play online.',
    about: {
      heading: 'How to solve a flower jigsaw puzzle',
      paragraphs: [
        'Single-bloom close-ups such as the pink peony or the lady’s slipper orchid are friendly puzzles: one strong colour in the middle and a soft, blurred background around it. Start with the petals, then fill the background by matching the gradient.',
        'Fields and meadows are a bigger challenge. With lavender rows or a wildflower meadow, lots of pieces share the same colours, so look at the direction of stems and the size of the blooms — flowers get smaller toward the horizon.',
        'Want a gentle session? Try 24 or 48 pieces. For a long, absorbing solve, take the wildflower meadow or cherry blossom up to 200 pieces or more.',
      ],
      faqs: [
        {
          question: 'Are flower puzzles good for beginners?',
          answer:
            'Yes — the single-bloom close-ups are some of the easiest puzzles on the site. The meadow and blossom pictures are better once you want more challenge.',
        },
        {
          question: 'Are there flower paintings too?',
          answer:
            'Yes. Van Gogh’s Sunflowers and Monet’s Water Lilies appear here as well as in the art category.',
        },
      ],
    },
  },
  {
    slug: 'food',
    name: 'Food',
    emoji: '🍣',
    tagline: 'Sushi, pizza, coffee, and fresh produce',
    heading: 'Food Jigsaw Puzzles',
    seoTitle: 'Food Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online food jigsaw puzzles: a sushi platter, Margherita pizza, latte art, a colourful market stall and fresh strawberries. Play instantly in your browser.',
    intro:
      'Bright, mouth-watering food photos make cheerful jigsaws. Assemble a sushi platter, a wood-fired Margherita pizza, a cup of latte art, or a market stall overflowing with fruit and vegetables — free, in your browser.',
    about: {
      heading: 'Why food makes a good jigsaw',
      paragraphs: [
        'Food photos are full of strong, separate colours — red tomato, green basil, orange salmon, yellow bananas — so pieces sort into groups almost on their own. That makes food puzzles a good pick for a quick, satisfying solve.',
        'The sushi platter and the market stall are the most detailed pictures here. Each piece of sushi or pile of produce acts like a small puzzle inside the puzzle, which keeps higher piece counts fun instead of frustrating.',
      ],
      faqs: [
        {
          question: 'Which food puzzle is best for kids?',
          answer:
            'Fresh Strawberries and the Margherita pizza: simple subjects, big areas of colour, and clear edges.',
        },
      ],
    },
  },
  {
    slug: 'ocean',
    name: 'Ocean & Sea Life',
    emoji: '🐠',
    tagline: 'Reefs, turtles, and whales',
    heading: 'Ocean & Sea Life Jigsaw Puzzles',
    seoTitle: 'Ocean & Sea Life Jigsaw Puzzles — Play Free Online',
    seoDescription:
      'Free online ocean jigsaw puzzles: clownfish in an anemone, a green sea turtle, a breaching humpback whale, coral reefs and tropical beaches.',
    intro:
      'Dive into ocean jigsaw puzzles: clownfish tucked into an anemone, a green sea turtle at the surface, a humpback whale breaching off Hawaii, and a busy coral reef. Free to play in your browser.',
    about: {
      heading: 'Tips for ocean jigsaw puzzles',
      paragraphs: [
        'Open water is the hardest part of any sea puzzle, because large areas of blue look the same. Build the animal first, then work outward and use ripples, bubbles, and slight changes in shade to place the water pieces.',
        'Reef scenes are the opposite: full of texture and colour. Group pieces by coral type and fish colour, and the reef comes together in sections.',
      ],
      faqs: [
        {
          question: 'Which ocean puzzle is easiest?',
          answer:
            'Clownfish in an Anemone. The bright orange and white stripes stand out clearly against the green tentacles.',
        },
        {
          question: 'Where are the photos from?',
          answer:
            'Most come from Wikimedia Commons, including public-domain photos from NOAA. Each puzzle page credits the photographer and licence.',
        },
      ],
    },
  },
  {
    slug: 'space',
    name: 'Space',
    emoji: '🌌',
    tagline: 'Galaxies, nebulae, and night skies',
    heading: 'Space Jigsaw Puzzles',
    seoTitle: 'Space Jigsaw Puzzles — Galaxies & Nebulae, Free Online',
    seoDescription:
      'Free online space jigsaw puzzles: Hubble’s Ring Nebula and spiral galaxy NGC 1300, planet Earth from orbit, and the Milky Way over the Alps.',
    intro:
      'Real space images make striking jigsaws. Put together Hubble’s view of the Ring Nebula, the barred spiral galaxy NGC 1300, planet Earth from orbit, or the Milky Way rising over a Swiss lake — free in your browser.',
    about: {
      heading: 'How to solve a space jigsaw puzzle',
      paragraphs: [
        'Space pictures are mostly dark, so the bright subject is your anchor. Assemble the galaxy, nebula, or planet first — its colours change from the centre outward, which tells you where each piece goes.',
        'The black background is where space puzzles get hard. Look for individual stars: their size and position are unique, and matching them across piece edges is often the only clue. Lower piece counts keep this manageable.',
      ],
      faqs: [
        {
          question: 'Are these real photos?',
          answer:
            'The nebula and galaxy are Hubble Space Telescope images, and the Milky Way is a long-exposure photograph. The Earth picture is a 3D rendering built from NASA Blue Marble imagery.',
        },
        {
          question: 'Which space puzzle is hardest?',
          answer:
            'The Milky Way. Thousands of similar stars and a dark tree line make it a real challenge at 200 pieces or more.',
        },
      ],
    },
  },
  {
    slug: 'kids-easy',
    name: 'Easy Puzzles for Kids',
    emoji: '🧒',
    tagline: 'Bright, simple, and beginner-friendly',
    seoTitle: 'Jigsaw Puzzles for Kids – Easy & Free Online',
    seoDescription:
      'Play easy online jigsaw puzzles for kids with bright pictures and adjustable piece counts. Works on phones, tablets and computers with no download required.',
    intro:
      'These are easy jigsaw puzzles with bright, simple pictures. Play in your browser on a phone, tablet, or computer — nothing to download. Use the difficulty chips to raise or lower the piece count before you open a picture.',
  },
  {
    slug: 'hard',
    name: 'Hard & Advanced',
    emoji: '🧠',
    tagline: 'Dense detail, big piece counts',
    seoTitle: 'Hard Jigsaw Puzzles – Up to 500 Pieces',
    seoDescription:
      'Take on hard online jigsaw puzzles with detailed scenes and up to 500 pieces. Increase the difficulty and solve free in your browser.',
    intro:
      'This category is harder because the pictures have dense detail — textured fur, repeating trees, similar colours — so pieces are easier to mix up. Use the difficulty chips to raise the piece count; any puzzle here can go up to 500 pieces, free in your browser.',
  },
];

export function getCategory(slug: string | undefined): CategoryDef | undefined {
  return categories.find((c) => c.slug === slug);
}
