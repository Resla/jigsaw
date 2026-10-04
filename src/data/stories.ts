export interface StoryQuote {
  who: string;
  text: string;
}

export interface StoryBeat {
  src: string;
  act: string;
  title: string;
  narration: string;
  quotes: StoryQuote[];
  pieces: number;
}

export interface StoryDef {
  slug: string;
  title: string;
  emoji: string;
  tagline: string;
  intro: string;
  ending: string;
  beats: StoryBeat[];
}

export const stories: StoryDef[] = [
  {
    slug: 'great-pet-heist',
    title: 'The Great Pet Heist',
    emoji: '🐾',
    tagline: 'Read the scene. Assemble it. Unlock the next act.',
    intro: 'A suburban crew. One locked pantry. The legendary Mega-Bites.',
    ending:
      'Mission accomplished. The safe is empty. The kibble is everywhere. Sir Reginald pretends this was always the plan.',
    beats: [
      {
        src: '/images/heist-act1.png',
        act: 'Act I',
        title: 'The Plan',
        narration:
          'Sir Reginald assembles the team. The pantry must be breached. Every pet has a role: Pixel on lookout, the hamster on intel, Barnaby on muscle.',
        pieces: 8,
        quotes: [
          { who: 'Sir Reginald', text: 'The Mega-Bites box is the target. Do not improvise.' },
          { who: 'Hamster', text: 'I brought a magnifying glass. I am very official.' },
          { who: 'Barnaby', text: 'I understood the word treats.' },
        ],
      },
      {
        src: '/images/heist-act2.png',
        act: 'Act II',
        title: 'The Infiltration',
        narration:
          'The plan is in motion. Barnaby “disables” the motion sensors. Pixel watches from the kettle with binoculars. The hamster unplugs whatever that plug is.',
        pieces: 12,
        quotes: [
          { who: 'Pixel', text: 'Hallway clear. Also, I can see a potential human.' },
          { who: 'Barnaby', text: 'The red dots on the floor are delicious, I assume.' },
          { who: 'Sir Reginald', text: 'That is a robot vacuum. Stay on mission.' },
        ],
      },
      {
        src: '/images/heist-act3.png',
        act: 'Act III',
        title: 'The Pantry',
        narration:
          'The door is open. The stash is real. Sir Reginald claims the high ground. Barnaby opens the kibble. The hamster secures a biscuit bigger than his hopes.',
        pieces: 16,
        quotes: [
          { who: 'Sir Reginald', text: 'Meow Bites was only the beginning.' },
          { who: 'Barnaby', text: 'I have made a kibble mountain. For science.' },
          { who: 'Hamster', text: 'This cracker is now a national treasure.' },
        ],
      },
      {
        src: '/images/heist-epilogue.png',
        act: 'Epilogue',
        title: 'The Caper',
        narration:
          'They did not only find the stash. They found a pet paradise. Then they walked out like nothing happened. The safe is empty. The blueprint says mission accomplished. Twice.',
        pieces: 12,
        quotes: [
          { who: 'Sir Reginald', text: 'We were never here.' },
          { who: 'Pixel', text: 'I saw nothing. I have binoculars, and I saw nothing.' },
          { who: 'Barnaby', text: 'Can we do the red-dot floor again tomorrow?' },
        ],
      },
    ],
  },
  {
    slug: 'great-museum-heist',
    title: 'The Great Museum Heist',
    emoji: '🖼️',
    tagline: 'An art mystery. Read the scene. Assemble it. Unlock the next act.',
    intro: 'Sly the raccoon and a nocturnal crew. One Grand Gallery. The priceless Golden Acorn.',
    ending:
      'They did not only take the prize. They framed the night as a masterpiece and left the empty frames looking slightly embarrassed.',
    beats: [
      {
        src: '/images/museum-act1.png',
        act: 'Act I',
        title: 'The Blueprint Room',
        narration:
          'In the museum basement, Sly spreads the Grand Gallery plan. Flick checks the guard rota. Hoot inspects the tiny cases. Pip tunes a rope-grapple that should not work, and absolutely will.',
        pieces: 8,
        quotes: [
          { who: 'Sly', text: 'The Golden Acorn is in the Grand Gallery. Lights out. No souvenirs.' },
          { who: 'Flick', text: 'Night shift ends at midnight. We have a window. A small, elegant window.' },
          { who: 'Pip', text: 'Grapple is calibrated. Please do not ask in what units.' },
        ],
      },
      {
        src: '/images/museum-act2.png',
        act: 'Act II',
        title: 'The Gallery Infiltration',
        narration:
          'Moonlight, marble, and a red laser labyrinth. Flick limbos under a beam. Hoot flies the velvet bag. Sly works the balcony. Pip scouts the floor like a very brave crumb.',
        pieces: 12,
        quotes: [
          { who: 'Hoot', text: 'Lasers are rude. I am flying over the rude.' },
          { who: 'Flick', text: 'This is not acrobatics. This is security research.' },
          { who: 'Sly', text: 'Stay low. The acorn does not know we are coming.' },
        ],
      },
      {
        src: '/images/museum-act3.png',
        act: 'Act III',
        title: 'The Golden Prize',
        narration:
          'The case is open. The Golden Acorn glows like it has been waiting. Cheese for the mouse, a toast for the crew, and a tiny crane that reads mission accomplished.',
        pieces: 16,
        quotes: [
          { who: 'Sly', text: 'Heist accomplished. Nobody touch the empty frames on the way out.' },
          { who: 'Flick', text: 'We should look casual. I am wearing a turtleneck. I am already casual.' },
          { who: 'Pip', text: 'I brought the sign. The sign is the most important part.' },
        ],
      },
      {
        src: '/images/museum-epilogue.png',
        act: 'Epilogue',
        title: 'The Golden Acorn',
        narration:
          'They did not just take art. They made a story: a framed portrait of the crew, a leftover blueprint, and a museum that will notice a little too late.',
        pieces: 12,
        quotes: [
          { who: 'Hoot', text: 'I inspected the painting. It is us. I approve.' },
          { who: 'Sly', text: 'The world’s museums are on notice. Softly. Politely. On notice.' },
          { who: 'Pip', text: 'Mission 2 is the Moon Cheese Museum. I have already started a list.' },
        ],
      },
    ],
  },
  {
    slug: 'great-space-time-bake-off',
    title: 'The Great Space-Time Bake-Off',
    emoji: '🍰',
    tagline: 'A cosmic cooking caper. Read the scene. Assemble it. Unlock the next act.',
    intro: 'Chef Zog, Jaxax, and a very serious pig. One Intergalactic Championship. The legendary Chrono-Cake.',
    ending:
      'They did not only take a trophy. They invented a flavor that should not exist, then politely filed the recipe under Future: Vanilla Vortex.',
    beats: [
      {
        src: '/images/bakeoff-act1.png',
        act: 'Act I',
        title: 'The Blueprint',
        narration:
          'Talent is not enough. To win the Intergalactic Championship they need prehistoric honey from Ancient Earth. Chef Zog finalizes the Chrono-Cake blueprint. Jaxax weighs the stardust. The robot whisks. The pig takes notes.',
        pieces: 8,
        quotes: [
          { who: 'Zog', text: 'The recipe is simple. We only have to steal time. And honey.' },
          { who: 'Jaxax', text: 'I measured the flour. It is hovering. That seems correct.' },
          { who: 'Pig', text: 'I have logged the risk as “becoming a snack.” Noted.' },
        ],
      },
      {
        src: '/images/bakeoff-act2.png',
        act: 'Act II',
        title: 'Dino-Stealth',
        narration:
          'Moonlight in the prehistoric pantry. A mechanical T-Rex slumbers. Bio-luminescent honey drips from the hive. Success means the trophy. Failure means lunch.',
        pieces: 12,
        quotes: [
          { who: 'Zog', text: 'Stealth is key. Also, do not wake the dinosaur chef.' },
          { who: 'Jaxax', text: 'The bees have tiny helmets. I respect that.' },
          { who: 'Pig', text: 'Honey acquired. Please confirm we are still not a snack.' },
        ],
      },
      {
        src: '/images/bakeoff-act3.png',
        act: 'Act III',
        title: 'Cosmic Creation',
        narration:
          'Under the Intergalactic Arena lights, Zog lifts the Chrono-Cake: galaxies, dinosaurs, and extinct honey. The judges glow. Confetti falls. Victory tastes like legend.',
        pieces: 16,
        quotes: [
          { who: 'Zog', text: 'We did not steal a treasure. We baked one.' },
          { who: 'Jaxax', text: 'Four arms was the correct number of arms for this.' },
          { who: 'Pig', text: 'Trophy secured. I will file this under “not eaten.”' },
        ],
      },
      {
        src: '/images/bakeoff-epilogue.png',
        act: 'Epilogue',
        title: 'The Chrono-Cake',
        narration:
          'Back on the ship they slice a victory cake. The Chrono-Cake is already a legacy. New time-travel recipes are on the console. The galaxy is waiting, and it is hungry.',
        pieces: 12,
        quotes: [
          { who: 'Zog', text: 'Next up: the Vanilla Vortex. Do not tell the judges yet.' },
          { who: 'Jaxax', text: 'I saved a slice. It is in a tiny dome. For science.' },
          { who: 'Pig', text: 'Mission accomplished. I still have my notes. And my life.' },
        ],
      },
    ],
  },
  {
    slug: 'magical-undersea-circus',
    title: 'The Magical Undersea Circus',
    emoji: '🎪',
    tagline: 'A midnight show in a coral amphitheater. Read the scene. Assemble it. Unlock the next act.',
    intro: 'Inky the octopus, Shelly the turtle, Puff, and Coral the seahorse. One glowing midnight show.',
    ending:
      'The bow is over. A glow in the sand points to the next stop: the Lost Sunken City of Atlantis.',
    beats: [
      {
        src: '/images/circus-act1.png',
        act: 'Act I',
        title: 'The Rehearsal',
        narration:
          'Behind a kelp curtain, Inky juggles pearls. Shelly fits a top hat onto Puff. Coral tunes a shell-trumpet. The midnight show is almost ready.',
        pieces: 8,
        quotes: [
          { who: 'Shelly', text: 'Hold still. A hat makes the act official.' },
          { who: 'Inky', text: 'Eight arms. Eight pearls. This is math, not magic. Mostly.' },
          { who: 'Coral', text: 'The trumpet is in tune. The kelp is not. I can work with that.' },
        ],
      },
      {
        src: '/images/circus-act2.png',
        act: 'Act II',
        title: 'The Performance',
        narration:
          'The curtain is up. Shelly walks the high wire with an umbrella. Inky lights the ring. Puff floats in ribbons. Coral leads the seahorse band. They have found their stage.',
        pieces: 12,
        quotes: [
          { who: 'Puff', text: 'I am inflated for dramatic effect. On purpose.' },
          { who: 'Shelly', text: 'Do not look down. There is only water. That is the problem.' },
          { who: 'Inky', text: 'The pearls are the spotlight. I am merely holding them.' },
        ],
      },
      {
        src: '/images/circus-act3.png',
        act: 'Act III',
        title: 'The Graceful Finale',
        narration:
          'The roar fades to a ripple. Spotlights soften. Whale song in the distance. The ocean gathers into one last, quiet turn around the pearls.',
        pieces: 16,
        quotes: [
          { who: 'Coral', text: 'This is the soft part. Play like the water is listening.' },
          { who: 'Inky', text: 'Finale means I drop nothing. I have never been more professional.' },
          { who: 'Puff', text: 'I am calm. I am spherical. I am art.' },
        ],
      },
      {
        src: '/images/circus-epilogue.png',
        act: 'Epilogue',
        title: 'The Final Bow',
        narration:
          'Hats off. The little ones line up. The greatest trick was the family they made. In the sand, a glow teases Atlantis.',
        pieces: 12,
        quotes: [
          { who: 'Shelly', text: 'We pass the curiosity on. That is the real encore.' },
          { who: 'Puff', text: 'I un-puffed. For friendship.' },
          { who: 'Inky', text: 'Atlantis next. I will pack extra pearls.' },
        ],
      },
    ],
  },
];

export function getStory(slug: string | undefined): StoryDef | undefined {
  if (slug === 'runaway-sandwich' || slug === 'party-invitation') {
    return stories.find((story) => story.slug === 'great-pet-heist');
  }
  return stories.find((story) => story.slug === slug);
}
