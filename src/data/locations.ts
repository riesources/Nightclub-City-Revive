import type { HairStyle } from './appearanceCatalog';
import type { Genre } from '../domain/types';

/**
 * Club locations for the world map.
 * CONFIRMED (S11): the original had a map of districts joined by roads, with star
 * ratings, locks, NEW badges and VACANCY signs; the first club was the biggest,
 * and locations unlocked by level.
 * For now only the starter club can be entered; every other location is shown greyed out
 * (`playable: false`) until its design is approved and built.
 * PROPOSED: every price, level, theme palette, signature mix and guest look below.
 */
export interface LocationTheme {
  wallRight: number;
  wallLeft: number;
  floor: number;
  kerb: [number, number];
  asphalt: [number, number];
  lane: number;
  /** Second floor colour: tiles alternate in a checkerboard. */
  floorAlt?: number;
  /** Wall stripe colour: vertical stripes instead of bottle alcoves. */
  wallStripe?: number;
}

export interface LocationDef {
  id: string;
  name: string;
  tagline: string;
  /** Level needed to buy. */
  requiredLevel: number;
  price: number;
  /** False for places drawn on the map that are not built yet. */
  playable: boolean;
  theme: LocationTheme;
  /** The mix locals love: a small tip bonus while it plays. */
  signatureMix: Genre;
  /** Hair and hat styles over-represented in the local crowd. */
  guestHair: HairStyle[];
  /** Map position (percent of the map box). */
  pos: { x: number; y: number };
}

export const LOCATION_TIP_BONUS = 1.12;
export const GUEST_BIAS_PERCENT = 35;
export const STARTER_LOCATION = 'dj_alley';

const theme = (wallRight: number, wallLeft: number, floor: number, kerb: [number, number], asphalt: [number, number], lane: number, extra: Partial<LocationTheme> = {}): LocationTheme => ({ wallRight, wallLeft, floor, kerb, asphalt, lane, ...extra });

export const LOCATIONS: LocationDef[] = [
  { id: 'dj_alley', name: 'DJ Alley', tagline: 'Where it all starts', requiredLevel: 0, price: 0, playable: true, signatureMix: 'club_mix', guestHair: [], pos: { x: 12, y: 80 }, theme: theme(0x4a2744, 0x34264f, 0x45464e, [0x4a4b58, 0x42434f], [0x1d1e26, 0x191a21], 0xe8c15a) },
  { id: 'main_street', name: 'Main Street', tagline: 'Blue lights, big crowds', requiredLevel: 5, price: 20_000, playable: true, signatureMix: 'house', guestHair: ['fedora', 'cap'], pos: { x: 41, y: 78 }, theme: theme(0x1d3f6b, 0x16305a, 0x23252d, [0x4d5d78, 0x44536c], [0x1a2230, 0x161d2a], 0xf4f4f8, { floorAlt: 0xe4e7ee, wallStripe: 0x2a5aa0 }) },
  { id: 'twilight_acropolis', name: 'Twilight Acropolis', tagline: 'Gothic ruins after dark (coming soon)', requiredLevel: 8, price: 40_000, playable: false, signatureMix: 'hiphop', guestHair: ['mohawk', 'long', 'spiky'], pos: { x: 16, y: 50 }, theme: theme(0x5a1a22, 0x3d1018, 0x3a3340, [0x4a4352, 0x423b4a], [0x1b1620, 0x16121a], 0xb85cff) },
  { id: 'nashville', name: 'Nashville', tagline: 'Brick, neon and a stage (coming soon)', requiredLevel: 10, price: 60_000, playable: false, signatureMix: 'pop', guestHair: ['cap', 'ponytail', 'fedora'], pos: { x: 44, y: 46 }, theme: theme(0x5b3a28, 0x45291c, 0x4a4038, [0x5d4f45, 0x54473d], [0x211c19, 0x1b1714], 0xffb347) },
  { id: 'neon_grid', name: 'Neon Grid City', tagline: 'Glowing lines in the dark (coming soon)', requiredLevel: 12, price: 90_000, playable: false, signatureMix: 'electronic', guestHair: ['spiky', 'mohawk', 'beanie'], pos: { x: 83, y: 80 }, theme: theme(0x0f3a4a, 0x0a2c3a, 0x20303a, [0x2a4a5a, 0x244252], [0x0d1a22, 0x0a141b], 0x19d7ff) },
  { id: 'gaslight', name: 'Gaslight District', tagline: 'Steampunk streets (coming later)', requiredLevel: 15, price: 0, playable: false, signatureMix: 'club_mix', guestHair: [], pos: { x: 20, y: 22 }, theme: theme(0x4a2744, 0x34264f, 0x45464e, [0x4a4b58, 0x42434f], [0x1d1e26, 0x191a21], 0xe8c15a) },
  { id: 'las_vegas', name: 'Las Vegas', tagline: 'Bright lights (coming later)', requiredLevel: 18, price: 0, playable: false, signatureMix: 'club_mix', guestHair: [], pos: { x: 47, y: 20 }, theme: theme(0x4a2744, 0x34264f, 0x45464e, [0x4a4b58, 0x42434f], [0x1d1e26, 0x191a21], 0xe8c15a) },
  { id: 'new_york', name: 'New York', tagline: 'The big city (coming later)', requiredLevel: 20, price: 0, playable: false, signatureMix: 'club_mix', guestHair: [], pos: { x: 70, y: 28 }, theme: theme(0x4a2744, 0x34264f, 0x45464e, [0x4a4b58, 0x42434f], [0x1d1e26, 0x191a21], 0xe8c15a) },
  { id: 'tokyo', name: 'Tokyo', tagline: 'After-hours (coming later)', requiredLevel: 25, price: 0, playable: false, signatureMix: 'club_mix', guestHair: [], pos: { x: 88, y: 42 }, theme: theme(0x4a2744, 0x34264f, 0x45464e, [0x4a4b58, 0x42434f], [0x1d1e26, 0x191a21], 0xe8c15a) },
];

export const getLocation = (id: string): LocationDef | undefined => LOCATIONS.find((l) => l.id === id);

/** Road links drawn on the map (pairs of location ids). */
export const MAP_ROADS: [string, string][] = [
  ['dj_alley', 'main_street'],
  ['main_street', 'nashville'],
  ['nashville', 'twilight_acropolis'],
  ['twilight_acropolis', 'gaslight'],
  ['nashville', 'las_vegas'],
  ['nashville', 'new_york'],
  ['new_york', 'tokyo'],
  ['main_street', 'neon_grid'],
];
