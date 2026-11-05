import { LOCATIONS, STARTER_LOCATION, getLocation } from '../data/locations';
import { tuning } from '../data/tuning';
import { clone, createNewClub } from './club';
import { roomSizeForLevel } from './progression';
import { fail, ok, type ClubSlot, type ClubState, type Result } from './types';

/** Every location you own, the one you are in first. */
export function ownedLocations(state: ClubState): string[] {
  return [state.location, ...Object.keys(state.parkedClubs)];
}

export function isOwned(state: ClubState, id: string): boolean {
  return state.location === id || id in state.parkedClubs;
}

const toSlot = (s: ClubState): ClubSlot => ({
  clubName: s.clubName,
  room: s.room,
  furniture: s.furniture,
  staff: s.staff,
  stock: s.stock,
  stats: s.stats,
  party: s.party,
  celebrity: s.celebrity,
});

/** Make `slot` the active club of `draft` (the draft's current club must already be parked). */
function activate(draft: ClubState, id: string, slot: ClubSlot): void {
  draft.location = id;
  draft.clubName = slot.clubName;
  const size = roomSizeForLevel(draft.level);
  draft.room = { cols: Math.max(slot.room.cols, size.cols), rows: Math.max(slot.room.rows, size.rows) };
  draft.furniture = slot.furniture;
  draft.staff = slot.staff;
  draft.stock = slot.stock;
  draft.stats = slot.stats;
  draft.party = slot.party;
  draft.celebrity = slot.celebrity;
}

/** Why a location cannot be bought right now, or null when it can. */
export function buyBlocker(state: ClubState, id: string): string | null {
  const loc = getLocation(id);
  if (!loc) return 'Unknown location';
  if (!loc.playable) return 'Coming later';
  if (isOwned(state, id)) return 'You already own a club here';
  if (state.level < loc.requiredLevel) return `Reach level ${loc.requiredLevel} first`;
  if (state.cash < loc.price) return `Not enough cash: $${loc.price.toLocaleString('en-US')}`;
  return null;
}

/** Buy a club and move in. The new club comes with the same small starter layout as the first. */
export function buyLocation(state: ClubState, id: string): Result {
  const blocker = buyBlocker(state, id);
  if (blocker) return fail(blocker);
  const loc = getLocation(id)!;
  const draft = clone(state);
  draft.cash -= loc.price;
  draft.parkedClubs[draft.location] = toSlot(draft);
  const fresh = createNewClub(state.savedAt);
  activate(draft, id, {
    ...toSlot(fresh),
    clubName: `${loc.name} Club`,
    stock: { drinks: tuning.startingDrinkStock },
  });
  return ok(draft);
}

/** Travel to a club you own. Guests are transient, so the caller clears the simulation. */
export function travelTo(state: ClubState, id: string): Result {
  if (!isOwned(state, id)) return fail('You do not own a club there');
  if (state.location === id) return fail('You are already here');
  const draft = clone(state);
  const slot = draft.parkedClubs[id];
  Reflect.deleteProperty(draft.parkedClubs, id);
  draft.parkedClubs[draft.location] = toSlot(draft);
  activate(draft, id, slot);
  return ok(draft);
}

/** 0-5 stars from a club's popularity. */
export function starRating(popularity: number): number {
  return Math.max(0, Math.min(5, Math.round(popularity / (tuning.popularityMax / 5))));
}

export { LOCATIONS, STARTER_LOCATION };
