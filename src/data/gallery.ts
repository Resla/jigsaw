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
  {
    id: 'trinity-long-room',
    title: 'Trinity College Long Room',
    src: '/images/hard-trinity-library.jpg',
    credit: 'Photo: Diliff, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Long_Room_Interior,_Trinity_College_Dublin,_Ireland_-_Diliff.jpg',
    categories: ['hard'],
    seoDescription:
      'The Long Room at Trinity College Dublin, with two storeys of old books and a barrel-vaulted ceiling. A dense interior jigsaw that stays tricky up to 500 pieces.',
  },
  {
    id: 'milan-cathedral',
    title: 'Milan Cathedral',
    src: '/images/city-milan-cathedral.jpg',
    credit: 'Photo: Jiuguang Wang, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Milan_Cathedral_from_Piazza_del_Duomo.jpg',
    categories: ['cities', 'hard'],
    seoDescription:
      'Milan’s Gothic cathedral from the piazza, crowded with spires and statues. A detailed architecture jigsaw puzzle, free to play online.',
  },
  {
    id: 'notre-dame-rose',
    title: 'Notre-Dame Rose Window',
    src: '/images/art-notre-dame-rose.jpg',
    credit: 'Photo: Julie Anne Workman, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:North_rose_window_of_Notre-Dame_de_Paris,_Aug_2010.jpg',
    categories: ['art', 'hard'],
    seoDescription:
      'The north rose window of Notre-Dame de Paris: hundreds of stained-glass medallions in a dark stone frame. A genuinely hard online jigsaw.',
  },
  {
    id: 'hunters-in-the-snow',
    title: 'Hunters in the Snow',
    src: '/images/art-hunters-snow.jpg',
    credit: 'Pieter Bruegel the Elder, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_(Winter)_-_Google_Art_Project.jpg',
    categories: ['art', 'hard'],
    seoDescription:
      'Bruegel’s Hunters in the Snow: a winter village, skaters on the ice, and a hunting party coming home. A busy classic-art jigsaw, free online.',
  },
  {
    id: 'garden-of-earthly-delights',
    title: 'The Garden of Earthly Delights',
    src: '/images/art-bosch-delights.jpg',
    credit: 'Hieronymus Bosch, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg',
    categories: ['art', 'hard'],
    seoDescription:
      'Bosch’s Garden of Earthly Delights triptych, packed with tiny figures and strange inventions. One of the hardest free art jigsaws on the site.',
  },
  {
    id: 'alhambra-court',
    title: 'Court of the Myrtles, Alhambra',
    src: '/images/city-alhambra.jpg',
    credit: 'Photo: Jebulon, CC0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Patio_de_los_Arrayanes_Alhambra_Granada_Spain.jpg',
    categories: ['cities', 'hard'],
    seoDescription:
      'The Court of the Myrtles at the Alhambra in Granada, with a long reflecting pool and Moorish arches. A calm-looking puzzle that gets hard at high piece counts.',
  },
  {
    id: 'neuschwanstein-castle',
    title: 'Neuschwanstein Castle',
    src: '/images/city-neuschwanstein.jpg',
    credit: 'Photo: Tauno Räsänen, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_from_Marienbr%C3%BCcke,_2011_May.jpg',
    categories: ['cities', 'hard'],
    seoDescription:
      'Neuschwanstein Castle above the Bavarian forest, seen from Marienbrücke. Towers, windows, and trees make a detailed free architecture jigsaw.',
  },
  {
    id: 'prague-old-town',
    title: 'Prague Old Town Square',
    src: '/images/city-prague.jpg',
    credit: 'Photo: A.Savin, Free Art License via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Prague_07-2016_View_from_Old_Town_Hall_Tower_img3.jpg',
    categories: ['cities', 'hard'],
    seoDescription:
      'Prague’s Old Town Square from the town-hall tower: red roofs, the Týn Church, and a busy cobbled square. A dense city jigsaw up to 500 pieces.',
  },
  {
    id: 'hoh-rain-forest',
    title: 'Hoh Rain Forest',
    src: '/images/nature-hoh-rainforest.jpg',
    credit: 'Photo: PKThundr7, CC BY 4.0 via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Hall_of_Mosses,_Hoh_Rainforest,_Olympic_National_Park,_Washington_(2015).jpg',
    categories: ['nature'],
    seoDescription:
      'A mossy stream in the Hoh Rain Forest, Olympic National Park. Fallen logs and hanging moss make a quiet, green nature jigsaw, free online.',
  },
  {
    id: 'twelve-apostles',
    title: 'Twelve Apostles, Victoria',
    src: '/images/nature-twelve-apostles.jpg',
    credit: 'Photo: Dietmar Rabich, CC BY-SA 4.0 via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Princetown_(AU),_Port_Campbell_National_Park,_Twelve_Apostles_--_2019_--_0930.jpg',
    categories: ['nature'],
    seoDescription:
      'The Twelve Apostles sea stacks off Victoria’s coast, with limestone cliffs and a long sandy beach. A free coastal landscape jigsaw puzzle.',
  },
  {
    id: 'tre-cime-dolomites',
    title: 'Tre Cime di Lavaredo',
    src: '/images/nature-tre-cime.jpg',
    credit: 'Photo: Wolfgang Moroder, CC BY-SA 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Drei_Zinnen_Tre_Cime_di_Lavaredo_Dolomites.jpg',
    categories: ['nature'],
    seoDescription:
      'The snow-covered Tre Cime peaks in the Dolomites, rising through a sea of cloud. A striking mountain jigsaw puzzle, free to play online.',
  },
  {
    id: 'skogafoss',
    title: 'Skógafoss Waterfall',
    src: '/images/nature-skogafoss.jpg',
    credit: 'Photo: Alexander Grebenkov, CC BY 3.0 via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Sk%C3%B3gafoss_from_below.jpg',
    categories: ['nature'],
    seoDescription:
      'Skógafoss in Iceland, a wide curtain of water dropping into a mossy green amphitheatre. A free waterfall jigsaw puzzle to play online.',
  },
  {
    id: 'moraine-lake',
    title: 'Moraine Lake',
    src: '/images/nature-moraine-lake.jpg',
    credit: 'Photo: Gorgo, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Moraine_Lake_17092005.jpg',
    categories: ['nature'],
    seoDescription:
      'Turquoise Moraine Lake in Banff, with the Valley of the Ten Peaks mirrored in still water. A classic mountain-lake jigsaw puzzle, free online.',
  },
  {
    id: 'hay-wain',
    title: 'The Hay Wain',
    src: '/images/landscape-hay-wain.jpg',
    credit: 'John Constable, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:John_Constable_-_The_Hay_Wain_(1821).jpg',
    categories: ['nature', 'art', 'hard'],
    seoDescription:
      'Constable’s The Hay Wain: a Suffolk cottage, a wagon in the stream, and a wide English sky. A classic landscape-painting jigsaw of the kind you would buy in a box.',
  },
  {
    id: 'sierra-nevada',
    title: 'Among the Sierra Nevada',
    src: '/images/landscape-sierra-nevada.jpg',
    credit: 'Albert Bierstadt, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Albert_Bierstadt_-_Among_the_Sierra_Nevada,_California_-_Google_Art_Project.jpg',
    categories: ['nature', 'art', 'hard'],
    seoDescription:
      'Bierstadt’s mountain lake in the Sierra Nevada, with deer at the water and sun through the mist. A dramatic painted landscape jigsaw, free to play online.',
  },
  {
    id: 'the-harvesters',
    title: 'The Harvesters',
    src: '/images/landscape-harvesters.jpg',
    credit: 'Pieter Bruegel the Elder, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder-_The_Harvesters_-_Google_Art_Project.jpg',
    categories: ['nature', 'art', 'hard'],
    seoDescription:
      'Bruegel’s The Harvesters: golden wheat, a village lunch under a tree, and fields rolling to the sea. A busy landscape painting that feels like a boxed jigsaw.',
  },
  {
    id: 'poppy-field-argenteuil',
    title: 'Poppy Field near Argenteuil',
    src: '/images/landscape-poppy-field.jpg',
    credit: 'Claude Monet, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Poppy_Field_-_Google_Art_Project.jpg',
    categories: ['nature', 'art', 'flowers'],
    seoDescription:
      'Monet’s poppy field near Argenteuil — a hillside of red flowers, a blue parasol, and a summer sky. A classic landscape-painting jigsaw, free to play online.',
  },
  {
    id: 'wheat-field-cypresses',
    title: 'Wheat Field with Cypresses',
    src: '/images/landscape-wheat-cypresses.jpg',
    credit: 'Vincent van Gogh, public domain via Wikimedia Commons',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheat_Field_with_Cypresses_(National_Gallery_version).jpg',
    categories: ['nature', 'art'],
    seoDescription:
      'Van Gogh’s Wheat Field with Cypresses: swirling clouds, a tall cypress, and a gold field in Provence. A painterly landscape jigsaw, free to play online.',
  },
  {
    id: 'ruisdael-windmill',
    title: 'The Windmill at Wijk',
    src: '/images/landscape-ruisdael-mill.jpg',
    credit: 'Jacob van Ruisdael, public domain via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Windmill_at_Wijk_bij_Duurstede_1670_Ruisdael.jpg',
    categories: ['nature', 'art'],
    seoDescription:
      'Ruisdael’s windmill on the river at Wijk bij Duurstede, under a heavy Dutch sky. A painted landscape of the sort you would find on a boxed jigsaw puzzle.',
  },
];
