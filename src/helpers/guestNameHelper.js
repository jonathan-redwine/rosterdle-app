const adjectives = [
  'Bouncy',
  'Swift',
  'Clutch',
  'Slippery',
  'Sneaky',
  'Rowdy',
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

const nouns = [
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

export const generateRandomGuestName = () => {
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }`;
};
