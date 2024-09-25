export const adjectives = [
  'Bouncy',
  'Clutch',
  'Slippery',
  'Sneaky',
  'Dizzy',
  'Zippy',
  'Wobbly',
  'Jumpy',
  'Lanky',
  'Scrappy',
  'Happy',
  'Perky',
  'Gritty',
  'Agile',
  'Feisty',
  'Rowdy',
  'Crafty',
  'Wild',
  'Speedy',
  'Brawny',
  'Flashy',
  'Peppy',
];

export const nouns = [
  'Mascots',
  'Referees',
  'Benchwarmers',
  'Hooligans',
  'Fans',
  'Cleats',
  'Jerseys',
  'Outfielders',
  'Helmets',
  'Dribblers',
  'Ringers',
  'Pitchers',
  'Bats',
  'Tacklers',
  'Hustlers',
  'Defenders',
  'Sprinters',
  'Spiders',
  'Catchers',
  'Wizards',
];

export const generateRandomAdjective = () => {
  return adjectives[Math.floor(Math.random() * adjectives.length)];
};

export const generateRandomNoun = () => {
  return nouns[Math.floor(Math.random() * nouns.length)];
};

export const generateRandomGuestName = () => {
  return `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }`;
};
