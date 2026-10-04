import type { CategorySlug } from './categories';

export interface GalleryImage {
  id: string;
  title: string;
  src: string;
  credit: string;
  /** Source page for licences that require a link back (CC BY / BY-SA). */
  creditUrl?: string;
  categories: CategorySlug[];
  /** Short blurb used as the meta description and as on-page copy under the puzzle title. */
  seoDescription: string;
  /** SVG scene that plays a loop — same artwork used for the jigsaw pieces. */
  animated?: boolean;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'sunny-pals',
    title: 'Sunny Pals',
    src: '/images/kids-sunny-pals.svg',
    credit: 'Puzzle Harbour',
    categories: ['kids-easy', 'animals'],
    animated: true,
    seoDescription:
      'A sunny hill with a waving bunny, a wiggly puppy, and a kitten — a cute moving picture that kids put together as an easy jigsaw.',
  },
  {
    id: 'pond-pals',
    title: 'Pond Pals',
    src: '/images/kids-pond-pals.svg',
    credit: 'Puzzle Harbour',
    categories: ['kids-easy', 'animals'],
    animated: true,
    seoDescription:
      'Ducks, a frog, and a jumping fish on a sunny pond — a cute moving picture that kids put together as an easy jigsaw.',
  },
  {
    id: 'moon-pals',
    title: 'Moon Pals',
    src: '/images/kids-moon-pals.svg',
    credit: 'Puzzle Harbour',
    categories: ['kids-easy', 'animals'],
    animated: true,
    seoDescription:
      'A smiling moon, a blinking owl, and a sleepy fox under twinkling stars — a cozy night picture that kids put together as an easy jigsaw.',
  },
  {
    id: 'party-pals',
    title: 'Party Pals',
    src: '/images/kids-party-pals.svg',
    credit: 'Puzzle Harbour',
    categories: ['kids-easy'],
    animated: true,
    seoDescription:
      'A birthday cake, party hats, and falling confetti — a cheerful moving picture that kids put together as an easy jigsaw.',
  },
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
    categories: ['nature', 'flowers'],
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
    categories: ['food', 'kids-easy'],
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
    categories: ['cities', 'hard'],
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
    categories: ['nature', 'ocean', 'kids-easy'],
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
    categories: ['art', 'flowers', 'kids-easy'],
    seoDescription:
      'Van Gogh’s Sunflowers jigsaw puzzle, free to play online. Warm yellows and a clear vase make this a bright, friendly classic-art puzzle.',
  },
  {
    id: 'water-lilies',
    title: 'Water Lilies',
    src: '/images/art-water-lilies.jpg',
    credit: 'Claude Monet, public domain via Wikimedia Commons',
    categories: ['art', 'flowers', 'hard'],
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
  {
    id: 'tower-bridge-night',
    title: 'Tower Bridge at Night',
    src: '/images/city-london.jpg',
    credit: 'Photo: HyunJae Park, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Tower_Bridge_in_London_at_night.jpg',
    categories: ['cities'],
    seoDescription:
      'London’s Tower Bridge lit up over the River Thames at night. A free city jigsaw puzzle with bold shapes and glowing reflections to guide you.',
  },
  {
    id: 'shibuya-crossing',
    title: 'Shibuya Crossing, Tokyo',
    src: '/images/city-tokyo.jpg',
    credit: 'Photo: Micael Widell, CC BY 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Shibuya_Crossing_Tokyo_At_Night_(150285427).jpeg',
    categories: ['cities', 'hard'],
    seoDescription:
      'Tokyo’s Shibuya Crossing at night, with neon signs and a blur of crowds. A busy, detailed city jigsaw puzzle — free to play online.',
  },
  {
    id: 'hudson-yards-skyline',
    title: 'Hudson Yards Skyline, New York',
    src: '/images/city-nyc.jpg',
    credit: 'Photo: Mike Peel (mikepeel.net), CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:At_New_York_City_2025_001_-_Hudson_Yards_skyline,_New_York,_at_night.jpg',
    categories: ['cities'],
    seoDescription:
      'Glass towers of New York’s Hudson Yards glowing against a deep blue evening sky. A free skyline jigsaw puzzle, playable in your browser.',
  },
  {
    id: 'dubai-skyline',
    title: 'Dubai Skyline & Burj Khalifa',
    src: '/images/city-dubai.jpg',
    credit: 'Photo: Tim Reckmann, CC BY 2.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Dubai_Skyline_mit_Burj_Khalifa_(18241030269).jpg',
    categories: ['cities', 'hard'],
    seoDescription:
      'An aerial view of Dubai with the Burj Khalifa rising above the skyline. Repeating streets make this free city jigsaw a real challenge.',
  },
  {
    id: 'kyoto-bamboo-fountain',
    title: 'Bamboo Water Basin, Kyoto',
    src: '/images/city-kyoto.jpg',
    credit: 'Photo: Hyppolyte de Saint-Rambert, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Ry%C5%8Dan-ji_eau_bassin.jpg',
    categories: ['cities', 'nature'],
    seoDescription:
      'A bamboo spout trickling into a stone water basin at Ryōan-ji temple in Kyoto. A calm, green Japanese garden jigsaw puzzle, free online.',
  },
  {
    id: 'pink-peony',
    title: 'Pink Peony',
    src: '/images/flower-peony.jpg',
    credit: 'Photo: Acabashi, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Cottage_garden_pink_peony_bloom_at_Boreham,_Essex,_England.jpg',
    categories: ['flowers', 'kids-easy'],
    seoDescription:
      'A soft pink cottage-garden peony in full bloom. One big flower on dark leaves makes this an easy, relaxing flower jigsaw puzzle.',
  },
  {
    id: 'red-rose-garden',
    title: 'Red Rose Garden',
    src: '/images/flower-roses.jpg',
    credit: 'Photo: دانية دروبي, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Close_up_of_Red_Rose_in_Brooklyn_botanic_garden.jpg',
    categories: ['flowers'],
    seoDescription:
      'Deep red roses blooming at the Brooklyn Botanic Garden. Rich petals and layered leaves make a lovely free flower jigsaw puzzle.',
  },
  {
    id: 'lady-slipper-orchid',
    title: 'Pink Lady’s Slipper Orchid',
    src: '/images/flower-orchid.jpg',
    credit: 'Photo: Thomas G. Barnes, U.S. Fish and Wildlife Service, public domain',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Close_up_of_dark_pink_lady_slipper_orchid_or_moccasin_flower_cypripedium_acaule.jpg',
    categories: ['flowers', 'kids-easy'],
    seoDescription:
      'A wild pink lady’s slipper orchid on a soft green background. A simple, striking flower jigsaw puzzle that is easy to start.',
  },
  {
    id: 'cherry-blossom',
    title: 'Spring Cherry Blossom',
    src: '/images/flower-cherryblossom.jpg',
    credit: 'Photo: Acabashi, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Prunus_pink_blossom_Japanese_flowering_cherry_Stansted_Mountfitchet_Essex_01.jpg',
    categories: ['flowers', 'hard'],
    seoDescription:
      'Japanese flowering cherry trees covered in pink blossom under a spring sky. Thousands of petals make this a tricky flower jigsaw.',
  },
  {
    id: 'provence-lavender',
    title: 'Provence Lavender Field',
    src: '/images/flower-lavender.jpg',
    credit: 'Photo: Marek Gehrmann, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Lavender_Field_Provence_France_021.JPG',
    categories: ['flowers', 'nature'],
    seoDescription:
      'Purple lavender rows in front of an old stone farmhouse in Provence, France. A sunny, colourful flower jigsaw puzzle, free online.',
  },
  {
    id: 'mount-rainier-wildflowers',
    title: 'Mount Rainier Wildflowers',
    src: '/images/flower-daisies.jpg',
    credit: 'Photo: NPS, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Lupine,_subalpine_daisy,_arrowleaf_groundsel_and_more_blooming_in_the_meadows_around_Tipsoo_Lake._(ccd7af05-0ab5-4f0d-a5f7-b63aa4cd5696).JPG',
    categories: ['flowers', 'nature', 'hard'],
    seoDescription:
      'Lupine, daisies, and yellow groundsel in a meadow near Tipsoo Lake, Mount Rainier. A dense wildflower jigsaw puzzle for keen solvers.',
  },
  {
    id: 'cornfield-sunset',
    title: 'Cornfield Sunset',
    src: '/images/flower-sunflowers.jpg',
    credit: 'Photo: Summer Stock, CC0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Sunflower_field_at_sunset.jpg',
    categories: ['nature'],
    seoDescription:
      'A blazing orange sunset over a green field dotted with sunflowers. A warm, dramatic countryside jigsaw puzzle, free to play online.',
  },
  {
    id: 'sushi-platter',
    title: 'Sushi Platter',
    src: '/images/food-sushi.jpg',
    credit: 'Photo: chidorian, CC BY-SA 2.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Sushi_platter.jpg',
    categories: ['food', 'hard'],
    seoDescription:
      'A round platter of nigiri, maki rolls, prawns, and tamago seen from above. A colourful, detailed food jigsaw puzzle, free online.',
  },
  {
    id: 'margherita-pizza',
    title: 'Margherita Pizza',
    src: '/images/food-pizza.jpg',
    credit: 'Photo: Mario56, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Margherita_Originale.JPG',
    categories: ['food', 'kids-easy'],
    seoDescription:
      'A wood-fired Margherita pizza with tomato, mozzarella, and fresh basil. Big blocks of colour make this an easy, tasty food jigsaw.',
  },
  {
    id: 'latte-art',
    title: 'Latte Art Coffee',
    src: '/images/food-coffee.jpg',
    credit: 'Photo: Abdulrohmatt, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Cup_of_coffee_with_latte_art_2016.jpg',
    categories: ['food'],
    seoDescription:
      'A cup of coffee with a swan drawn in the milk foam, set against garden greenery. A cosy coffee-break jigsaw puzzle, free online.',
  },
  {
    id: 'market-produce',
    title: 'Fruit & Vegetable Market',
    src: '/images/food-vegetables.jpg',
    credit: 'Photo: FranHogan, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Fruits_and_Vegetables_in_Boquete,_Panama.jpg',
    categories: ['food', 'hard'],
    seoDescription:
      'Bananas, tomatoes, peppers, corn, and greens piled high at a market in Boquete, Panama. A busy, colourful food jigsaw puzzle.',
  },
  {
    id: 'clownfish-anemone',
    title: 'Clownfish in an Anemone',
    src: '/images/ocean-clownfish.jpg',
    credit: 'Photo: Nick Hobgood, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Amphiprion_ocellaris_(Clown_anemonefish)_by_Nick_Hobgood.jpg',
    categories: ['ocean', 'animals', 'kids-easy'],
    seoDescription:
      'Two orange-and-white clownfish nestled in a sea anemone in Papua New Guinea. A bright, easy ocean jigsaw puzzle for all ages.',
  },
  {
    id: 'green-sea-turtle',
    title: 'Green Sea Turtle',
    src: '/images/ocean-seaturtle.jpg',
    credit: 'Photo: Sirkfish, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Green_Sea_Turtle-Jetty_Park_Pier-19_Oct_14-2.jpg',
    categories: ['ocean', 'animals', 'hard'],
    seoDescription:
      'A green sea turtle swimming at the surface off Cape Canaveral, Florida. Patterned flippers meet open teal water in this sea jigsaw.',
  },
  {
    id: 'breaching-humpback',
    title: 'Breaching Humpback Whale',
    src: '/images/ocean-whale.jpg',
    credit: 'Photo: J. Moore / NOAA, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Hawaiian_Islands_Humpback_Whale_National_Marine_Sanctuary_breaching_2018.png',
    categories: ['ocean', 'animals'],
    seoDescription:
      'A humpback whale leaps from the sea beside a NOAA boat in Hawaii’s humpback whale sanctuary. A free whale jigsaw puzzle online.',
  },
  {
    id: 'coral-reef-starfish',
    title: 'Coral Reef & Starfish',
    src: '/images/ocean-starfish.jpg',
    credit: 'Photo: NOAA Fisheries / Andrew Gray, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Crown-of-thorns_starfish_coral_colony_Pagan_2022.png',
    categories: ['ocean', 'hard'],
    seoDescription:
      'A crown-of-thorns starfish on branching coral, surrounded by reef fish off Pagan Island. A textured, deep-blue reef jigsaw puzzle.',
  },
  {
    id: 'ring-nebula',
    title: 'The Ring Nebula',
    src: '/images/space-nebula.jpg',
    credit: 'Image: NASA, ESA, C.R. O’Dell et al., public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Hubble_reveals_the_Ring_Nebula%E2%80%99s_true_shape.jpg',
    categories: ['space'],
    seoDescription:
      'Hubble’s view of the Ring Nebula: a glowing blue and gold shell of gas from a dying star. A vivid, free space jigsaw puzzle.',
  },
  {
    id: 'spiral-galaxy-ngc1300',
    title: 'Spiral Galaxy NGC 1300',
    src: '/images/space-galaxy.jpg',
    credit: 'Image: NASA, ESA, and the Hubble Heritage Team (STScI/AURA), public domain',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg',
    categories: ['space', 'hard'],
    seoDescription:
      'The barred spiral galaxy NGC 1300, photographed by the Hubble Space Telescope. Sweeping arms and dark space make a tricky jigsaw.',
  },
  {
    id: 'planet-earth',
    title: 'Planet Earth from Space',
    src: '/images/space-earth.jpg',
    credit: 'Image: Yuri Samoilov, CC BY 2.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Earth_(45138212292).jpg',
    categories: ['space', 'kids-easy'],
    seoDescription:
      'Planet Earth seen from space, with clouds over the Americas and city lights on the night side. A simple, striking space jigsaw.',
  },
  {
    id: 'milky-way-alps',
    title: 'Milky Way over the Alps',
    src: '/images/space-milkyway.jpg',
    credit: 'Photo: Giles Laurent, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:035_Vertical_panorama_of_the_Milky_Way_during_Perseids_seen_from_Oeschinensee_Photo_by_Giles_Laurent.jpg',
    categories: ['space', 'nature', 'hard'],
    seoDescription:
      'The Milky Way rising over mountains and pine forest at Oeschinensee, Switzerland. Thousands of stars make this a hard space jigsaw.',
  },
];
