export interface SpotError {
  id: string;
  x: number;
  y: number;
  r: number;
  title: string;
  foundText: string;
}

export interface SpotPuzzle {
  slug: string;
  title: string;
  emoji: string;
  tagline: string;
  intro: string;
  src: string;
  seoTitle?: string;
  playLead?: string;
  errors: SpotError[];
}

export const spotPuzzles: SpotPuzzle[] = [
  {
    slug: 'airport-terminal',
    title: 'The Airport Terminal',
    emoji: '✈️',
    tagline:
      'Find five things that are wrong in this busy airport terminal. Look closely at the departures board, travelers, airplane and luggage to spot all five mistakes.',
    intro: 'Something is not quite right at this busy airport. Can you find all five hidden mistakes?',
    src: '/images/airport-terminal-spot-it.png',
    seoTitle: 'The Airport Terminal — Spot It | Puzzle Harbour',
    playLead: 'Something is not quite right at this busy airport. Can you find all five hidden mistakes?',
    errors: [
      {
        id: 'gate',
        x: 19.4,
        y: 24.9,
        r: 5,
        title: 'Gate 12½',
        foundText: 'One flight on the departures board is assigned to Gate 12½ — airport gates do not work like that.',
      },
      {
        id: 'clock',
        x: 90,
        y: 9.7,
        r: 4.3,
        title: 'Clock with 13',
        foundText: 'The airport clock has a 13 where 12 should be.',
      },
      {
        id: 'wing',
        x: 53.4,
        y: 24.8,
        r: 7,
        title: 'Impossible airplane wing',
        foundText: "One of the airplane's wings is attached or oriented the wrong way.",
      },
      {
        id: 'wheels',
        x: 37.9,
        y: 94.8,
        r: 5,
        title: 'Square suitcase wheels',
        foundText: 'The blue suitcase is rolling on square wheels instead of round ones.',
      },
      {
        id: 'fish',
        x: 90,
        y: 66,
        r: 5.2,
        title: 'Goldfish bowl luggage',
        foundText: 'Someone has put a goldfish bowl on an airport luggage trolley as though it were normal baggage.',
      },
    ],
  },
  {
    slug: 'museum-gallery',
    title: 'The Museum Gallery',
    emoji: '🏛️',
    tagline:
      'Find five things that are wrong in this busy museum gallery. Look closely at the dinosaur exhibits, the flying skeleton, the display case, the painting and the visitors to spot all five mistakes.',
    intro: 'Something is not quite right inside this museum. Can you find all five hidden mistakes?',
    src: '/images/museum-gallery-spot-it.png',
    seoTitle: 'The Museum Gallery — Spot It | Puzzle Harbour',
    playLead: 'Something is not quite right inside this museum. Can you find all five hidden mistakes?',
    errors: [
      {
        id: 'tie',
        x: 33.8,
        y: 33.2,
        r: 5,
        title: 'Dinosaur wearing a tie',
        foundText: 'The large dinosaur skeleton is wearing a red necktie.',
      },
      {
        id: 'painting',
        x: 91.6,
        y: 14.2,
        r: 6,
        title: 'Upside-down painting',
        foundText: 'The framed landscape painting is hanging upside down.',
      },
      {
        id: 'pterosaur',
        x: 57.2,
        y: 19.4,
        r: 7,
        title: 'Floating pterosaur',
        foundText: 'The flying reptile skeleton appears to be floating with no visible support.',
      },
      {
        id: 'fish',
        x: 67.2,
        y: 50.6,
        r: 5,
        title: 'Fish in the fossil case',
        foundText: 'A live fish is swimming inside a museum fossil display case.',
      },
      {
        id: 'binocs',
        x: 11.2,
        y: 56.6,
        r: 5,
        title: 'Backwards binoculars',
        foundText: 'A museum visitor is looking through binoculars the wrong way round.',
      },
    ],
  },
  {
    slug: 'night-carnival',
    title: 'The Night Carnival',
    emoji: '🎡',
    tagline: 'Find five things that are wrong in this midnight fair.',
    intro: 'A charming night carnival — except gravity, clocks, and a pond that should not have a shark.',
    src: '/images/spot-night-carnival.png',
    errors: [
      {
        id: 'popcorn',
        x: 43.2,
        y: 47.8,
        r: 7,
        title: 'Floating popcorn',
        foundText: 'That kernel is hovering. Popcorn does not do that.',
      },
      {
        id: 'shark',
        x: 57.4,
        y: 58.2,
        r: 7,
        title: 'Shark in the pond',
        foundText: 'A carnival duck pond should not include a shark.',
      },
      {
        id: 'clock',
        x: 76.2,
        y: 52.4,
        r: 7,
        title: 'Impossible clock',
        foundText: 'A grandfather clock in the candy stall — and the time cannot exist.',
      },
      {
        id: 'ferris',
        x: 61.5,
        y: 37.8,
        r: 8,
        title: 'Ferris wheel shadow',
        foundText: 'The big wheel is lit from the wrong side for this night sky.',
      },
      {
        id: 'sign',
        x: 86.8,
        y: 72.6,
        r: 7,
        title: 'Gibberish sign',
        foundText: 'The hanging sign is backwards nonsense, not a real notice.',
      },
    ],
  },
];

export function getSpotPuzzle(slug: string | undefined): SpotPuzzle | undefined {
  return spotPuzzles.find((puzzle) => puzzle.slug === slug);
}

const keyFor = (slug: string) => `jigsaw:spot:${slug}`;

export function getFoundErrors(slug: string): string[] {
  try {
    const raw = localStorage.getItem(keyFor(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { found?: string[] };
    return Array.isArray(parsed.found) ? parsed.found : [];
  } catch {
    return [];
  }
}

export function saveFoundErrors(slug: string, found: string[]): void {
  try {
    localStorage.setItem(keyFor(slug), JSON.stringify({ found }));
  } catch {
    // ignore
  }
}
