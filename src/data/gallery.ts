import type { CategorySlug } from './categories';

export interface GalleryImage {
  id: string;
  title: string;
  src: string;
  credit: string;
  categories: CategorySlug[];
  /** Short blurb used as the meta description and as on-page copy under the puzzle title. */
  seoDescription: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'coastal-forest',
    title: 'Coastal Pine Forest',
    src: '/images/landscape-forest.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Piece together a quiet pine forest meeting the coast. A calming nature jigsaw puzzle, free to play online with up to 500 pieces.',
  },
  {
    id: 'himalayan-peaks',
    title: 'Himalayan Peaks',
    src: '/images/landscape-himalayas.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Reassemble snow-capped Himalayan peaks in this free online jigsaw puzzle — a challenging, detail-rich mountain scene for puzzle lovers.',
  },
  {
    id: 'wildflower-coast',
    title: 'Wildflower Coast',
    src: '/images/landscape-seaside.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature'],
    seoDescription:
      "A colorful coastal meadow in bloom. Play this free wildflower jigsaw puzzle online, no download or sign-up required.",
  },
  {
    id: 'minimal-desk',
    title: 'Minimal Desk Setup',
    src: '/images/landscape-desk.jpg',
    credit: 'Photo via Unsplash',
    categories: ['kids-easy'],
    seoDescription:
      "A clean, minimal desk scene — a gentle, low-clutter jigsaw puzzle that's great for beginners and quick coffee-break sessions.",
  },
  {
    id: 'norwegian-fjord',
    title: 'Norwegian Fjord',
    src: '/images/landscape-fjord.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Solve a dramatic Norwegian fjord jigsaw puzzle online. Sharp cliffs and still water make this a satisfyingly tricky landscape puzzle.',
  },
  {
    id: 'highland-road',
    title: 'Scottish Highland Road',
    src: '/images/landscape-valley.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'kids-easy'],
    seoDescription:
      'A winding Scottish Highland road under open sky — an easygoing landscape jigsaw puzzle, perfect for a relaxed free play session.',
  },
  {
    id: 'forest-waterfall',
    title: 'Forest Waterfall',
    src: '/images/landscape-waterfall.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Piece together a rushing forest waterfall. Rocks, spray, and foliage make this a busy, rewarding free online jigsaw puzzle.',
  },
  {
    id: 'fresh-strawberries',
    title: 'Fresh Strawberries',
    src: '/images/landscape-strawberries.jpg',
    credit: 'Photo via Unsplash',
    categories: ['kids-easy'],
    seoDescription:
      'Bright, simple, and juicy — this fresh strawberries jigsaw puzzle is an easy, colorful pick for kids and beginners alike.',
  },
  {
    id: 'yosemite-valley',
    title: 'Yosemite Valley',
    src: '/images/portrait-cliffs.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Rebuild the towering cliffs of Yosemite Valley in this free online jigsaw puzzle — richly textured rock faces for experienced solvers.',
  },
  {
    id: 'urban-facade',
    title: 'Urban Facade',
    src: '/images/portrait-facade.jpg',
    credit: 'Photo via Unsplash',
    categories: ['hard'],
    seoDescription:
      'A repeating urban building facade turns deceptively tricky as a jigsaw puzzle — free to play online, great for a real challenge.',
  },
  {
    id: 'lioness-portrait',
    title: 'Lioness Portrait',
    src: '/images/portrait-lioness.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'A calm lioness portrait makes for a friendly animal jigsaw puzzle — free online, with a simple background that\u2019s kind to beginners.',
  },
  {
    id: 'curious-puppy',
    title: 'Curious Puppy',
    src: '/images/square-puppy.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'An irresistibly cute puppy jigsaw puzzle, free to play online. Bright colors and a simple scene make it great for kids.',
  },
  {
    id: 'grizzly-bear',
    title: 'Grizzly Bear',
    src: '/images/square-bear.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'hard'],
    seoDescription:
      'A grizzly bear in the wild — this free animal jigsaw puzzle\u2019s dense fur texture makes for a satisfying, detail-heavy challenge.',
  },
  {
    id: 'garden-dachshunds',
    title: 'Garden Dachshunds',
    src: '/images/square-dachshunds.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'Two garden dachshunds make for a cheerful, easy animal jigsaw puzzle — free to play online, perfect for younger puzzlers.',
  },
  {
    id: 'red-fox',
    title: 'Red Fox Portrait',
    src: '/images/animal-fox.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'A red fox portrait jigsaw puzzle, free to play online. Bold color and a soft background make it an easy pick for kids.',
  },
  {
    id: 'sitting-cat',
    title: 'Sitting Cat',
    src: '/images/animal-cat.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'A calm sitting cat jigsaw puzzle, free online with no download. Simple and bright — a great animal puzzle for beginners.',
  },
  {
    id: 'grazing-horses',
    title: 'Grazing Horses',
    src: '/images/animal-horse.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'nature'],
    seoDescription:
      'Horses grazing in an open green pasture — a peaceful animal-and-nature jigsaw puzzle, free to play online.',
  },
  {
    id: 'blue-macaw',
    title: 'Blue & Gold Macaw',
    src: '/images/animal-macaw.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'kids-easy'],
    seoDescription:
      'A vividly colored macaw parrot jigsaw puzzle. Free online play with bold, easy-to-sort colors — fun for kids and casual solvers.',
  },
  {
    id: 'savanna-elephant',
    title: 'Savanna Elephant',
    src: '/images/animal-elephant.jpg',
    credit: 'Photo via Unsplash',
    categories: ['animals', 'nature', 'hard'],
    seoDescription:
      'An African elephant on the savanna — this free jigsaw puzzle\u2019s wrinkled skin and muted tones make it a real test for experienced solvers.',
  },
  {
    id: 'autumn-forest',
    title: 'Autumn Forest',
    src: '/images/nature-autumn-forest.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'A forest ablaze with autumn color. This free online jigsaw puzzle\u2019s dense, layered foliage makes for a wonderfully tricky solve.',
  },
  {
    id: 'desert-dunes',
    title: 'Desert Sand Dunes',
    src: '/images/nature-desert-dunes.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'hard'],
    seoDescription:
      'Smooth desert sand dunes look simple but play tricky — every piece looks alike in this free, surprisingly hard jigsaw puzzle.',
  },
  {
    id: 'tropical-beach',
    title: 'Tropical Beach',
    src: '/images/nature-tropical-beach.jpg',
    credit: 'Photo via Unsplash',
    categories: ['nature', 'kids-easy'],
    seoDescription:
      'Turquoise water, white sand, and palm trees — a bright, easy-to-sort tropical beach jigsaw puzzle, free to play online.',
  },
  {
    id: 'starry-night',
    title: 'The Starry Night',
    src: '/images/art-starry-night.jpg',
    credit: 'Vincent van Gogh, public domain via Wikimedia Commons',
    categories: ['art', 'hard'],
    seoDescription:
      'Piece together Van Gogh’s The Starry Night — a free classic-art jigsaw puzzle of swirling sky and glowing stars, playable online in your browser.',
  },
  {
    id: 'pearl-earring',
    title: 'Girl with a Pearl Earring',
    src: '/images/art-pearl-earring.jpg',
    credit: 'Johannes Vermeer, public domain via Wikimedia Commons',
    categories: ['art', 'kids-easy'],
    seoDescription:
      'Vermeer’s Girl with a Pearl Earring as a free online jigsaw puzzle. A famous portrait with a simple dark background — great for a focused solve.',
  },
  {
    id: 'great-wave',
    title: 'The Great Wave',
    src: '/images/art-great-wave.jpg',
    credit: 'Katsushika Hokusai, public domain via Wikimedia Commons',
    categories: ['art', 'kids-easy'],
    seoDescription:
      'Hokusai’s Great Wave off Kanagawa as a free art jigsaw puzzle. Bold blues and foam make this Japanese woodblock print satisfying to piece together.',
  },
  {
    id: 'sunflowers',
    title: 'Sunflowers',
    src: '/images/art-sunflowers.jpg',
    credit: 'Vincent van Gogh, public domain via Wikimedia Commons',
    categories: ['art', 'kids-easy'],
    seoDescription:
      'Van Gogh’s Sunflowers jigsaw puzzle, free to play online. Warm yellows and a clear vase make this a bright, friendly classic-art puzzle.',
  },
  {
    id: 'water-lilies',
    title: 'Water Lilies',
    src: '/images/art-water-lilies.jpg',
    credit: 'Claude Monet, public domain via Wikimedia Commons',
    categories: ['art', 'hard'],
    seoDescription:
      'Monet’s Water Lilies as a free impressionist jigsaw puzzle. Soft color and reflected light make this a beautifully tricky painting to reassemble.',
  },
  {
    id: 'klimt-kiss',
    title: 'The Kiss',
    src: '/images/art-klimt-kiss.jpg',
    credit: 'Gustav Klimt, public domain via Wikimedia Commons',
    categories: ['art', 'hard'],
    seoDescription:
      'Klimt’s The Kiss as a free online jigsaw puzzle. Gold pattern and rich detail make this Art Nouveau painting a lush, challenging solve.',
  },
  {
    id: 'birth-of-venus',
    title: 'The Birth of Venus',
    src: '/images/art-birth-of-venus.jpg',
    credit: 'Sandro Botticelli, public domain via Wikimedia Commons',
    categories: ['art'],
    seoDescription:
      'Botticelli’s Birth of Venus as a free Renaissance jigsaw puzzle. Soft seas, flowing hair, and a famous pose — play online, no download needed.',
  },
  {
    id: 'la-grande-jatte',
    title: 'A Sunday on La Grande Jatte',
    src: '/images/art-grande-jatte.jpg',
    credit: 'Georges Seurat, public domain via Wikimedia Commons',
    categories: ['art', 'hard'],
    seoDescription:
      'Seurat’s A Sunday on La Grande Jatte as a free pointillist jigsaw puzzle. Crowds, shade, and tiny dots of color make this a rich challenge.',
  },
];
