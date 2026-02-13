export const TRICK_CATEGORIES = {
  flatground: 'Flatground',
  grinds: 'Grinds',
  slides: 'Slides',
  aerials: 'Aerials',
  transition: 'Transition',
  freestyle: 'Freestyle',
  other: 'Other',
} as const;

export const TRICKS: Record<string, string[]> = {
  flatground: [
    'Ollie', 'Kickflip', 'Heelflip', 'Pop Shove-it', 'Frontside 180',
    'Backside 180', 'Varial Kickflip', 'Varial Heelflip', 'Hardflip',
    'Inward Heelflip', 'Tre Flip (360 Flip)', 'Laser Flip', 'Nollie',
    'Nollie Kickflip', 'Nollie Heelflip', 'Fakie Kickflip', 'Fakie Heelflip',
    'Switch Ollie', 'Switch Kickflip', 'Switch Heelflip', '360 Ollie',
  ],
  grinds: [
    '50-50', '5-0', 'Nosegrind', 'Crooked Grind', 'Smith Grind',
    'Feeble Grind', 'Overcrook', 'Salad Grind', 'Suski Grind',
    'Hurricane Grind', 'Willy Grind',
  ],
  slides: [
    'Boardslide', 'Lipslide', 'Noseslide', 'Tailslide', 'Bluntslide',
    'Nosebluntslide', 'Darkslide',
  ],
  aerials: [
    'Frontside Air', 'Backside Air', 'Method', 'Stalefish', 'Melon',
    'Indy', 'Madonna', '540', '720', '900',
  ],
  transition: [
    'Rock to Fakie', 'Rock n Roll', 'Axle Stall', 'Blunt to Fakie',
    'Disaster', 'Frontside Grind', 'Backside Grind', 'Feeble Stall',
    'Smith Stall', 'Drop In', 'Pump',
  ],
  freestyle: [
    'Manual', 'Nose Manual', 'Casper', 'Primo', 'Fingerflip',
    'No Comply', 'Boneless', 'Caveman', 'Acid Drop', 'Beanplant',
  ],
};

export const ALL_TRICKS = Object.values(TRICKS).flat();
