import { describe, expect, it } from 'vitest';
import { LOCATIONS, MAP_ROADS, STARTER_LOCATION, getLocation } from '../../src/data/locations';
import { FURNITURE } from '../../src/data/furnitureCatalog';
import { buyAndPlace } from '../../src/domain/economy';
import { createNewClub } from '../../src/domain/club';
import { Game } from '../../src/domain/game';
import { createRng } from '../../src/domain/rng';
import { SCHEMA_VERSION, type ClubState } from '../../src/domain/types';
import { buyBlocker, buyLocation, isOwned, ownedLocations, starRating, travelTo } from '../../src/domain/world';
import { LocalSaveRepository, MemoryStore, SAVE_KEY } from '../../src/persistence/localSaveRepository';
import { validateState } from '../../src/persistence/validate';

/** Locations that are open today. */
const OPEN = [STARTER_LOCATION, 'main_street'];

const rich = (): ClubState => ({ ...createNewClub(0), level: 12, cash: 1_000_000 });

/** A club where one extra location is open, as it will be once more places are built. */
const withOpenLocation = (id: string) => {
  const loc = getLocation(id)!;
  const prev = loc.playable;
  loc.playable = true;
  return () => {
    loc.playable = prev;
  };
};

describe('location data', () => {
  it('has unique ids, a starter club that is open and free, and valid roads', () => {
    const ids = LOCATIONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    const start = getLocation(STARTER_LOCATION)!;
    expect(start.playable).toBe(true);
    expect(start.price).toBe(0);
    expect(start.requiredLevel).toBe(0);
    for (const [a, b] of MAP_ROADS) {
      expect(getLocation(a)).toBeTruthy();
      expect(getLocation(b)).toBeTruthy();
    }
  });

  it('keeps every location but the open ones greyed out for now', () => {
    for (const l of LOCATIONS) expect(l.playable).toBe(OPEN.includes(l.id));
  });
});

describe('greyed-out locations cannot be entered', () => {
  it('cannot be bought even with plenty of cash and level', () => {
    for (const l of LOCATIONS) {
      if (OPEN.includes(l.id)) continue;
      expect(buyBlocker(rich(), l.id)).toBe('Coming later');
      expect(buyLocation(rich(), l.id).ok).toBe(false);
      expect(travelTo(rich(), l.id).ok).toBe(false);
    }
  });

  it('the Game reports an error notice and changes nothing', () => {
    const game = new Game(rich(), createRng(1));
    const before = JSON.stringify(game.state);
    expect(game.buyLocation('nashville').ok).toBe(false);
    expect(game.travel('nashville').ok).toBe(false);
    expect(JSON.stringify(game.state)).toBe(before);
  });
});

describe('buying and travelling (for when more locations open)', () => {
  it('checks level, cash and ownership', () => {
    const restore = withOpenLocation('nashville');
    try {
      const loc = getLocation('nashville')!;
      expect(buyBlocker({ ...rich(), level: loc.requiredLevel - 1 }, loc.id)).toMatch(/level/i);
      expect(buyBlocker({ ...rich(), cash: loc.price - 1 }, loc.id)).toMatch(/cash/i);
      expect(buyBlocker(rich(), loc.id)).toBe(null);
      const bought = buyLocation(rich(), loc.id);
      if (!bought.ok) throw new Error(bought.reason);
      expect(buyBlocker(bought.state, loc.id)).toMatch(/already/i);
    } finally {
      restore();
    }
  });

  it('parks the old club, starts a fresh one, and travelling back restores it exactly', () => {
    const restore = withOpenLocation('nashville');
    try {
      const home = rich();
      home.clubName = 'Home Base';
      home.stats.guestsVisited = 77;
      const homeFurniture = JSON.stringify(home.furniture);
      const bought = buyLocation(home, 'nashville');
      if (!bought.ok) throw new Error(bought.reason);
      const away = bought.state;
      expect(away.location).toBe('nashville');
      expect(away.cash).toBe(home.cash - getLocation('nashville')!.price);
      expect(away.clubName).toBe('Nashville Club');
      expect(away.stats.guestsVisited).toBe(0);
      expect(away.furniture.length).toBeGreaterThan(0);
      expect(ownedLocations(away).sort()).toEqual([STARTER_LOCATION, 'nashville'].sort());
      expect(away.parkedClubs[STARTER_LOCATION].clubName).toBe('Home Base');
      expect(validateState(JSON.parse(JSON.stringify(away))).ok).toBe(true);

      const back = travelTo(away, STARTER_LOCATION);
      if (!back.ok) throw new Error(back.reason);
      expect(back.state.location).toBe(STARTER_LOCATION);
      expect(back.state.clubName).toBe('Home Base');
      expect(back.state.stats.guestsVisited).toBe(77);
      expect(JSON.stringify(back.state.furniture)).toBe(homeFurniture);
      expect(isOwned(back.state, 'nashville')).toBe(true);
      expect(back.state.cash).toBe(away.cash);
      expect(travelTo(back.state, STARTER_LOCATION).ok).toBe(false);
    } finally {
      restore();
    }
  });

  it('shared things stay shared when travelling', () => {
    const restore = withOpenLocation('nashville');
    try {
      const home = rich();
      home.inventory = { speaker_basic: 2 };
      home.celebrityWall = { dj_nova: 1 };
      const bought = buyLocation(home, 'nashville');
      if (!bought.ok) throw new Error(bought.reason);
      expect(bought.state.inventory).toEqual({ speaker_basic: 2 });
      expect(bought.state.celebrityWall).toEqual({ dj_nova: 1 });
      expect(bought.state.level).toBe(home.level);
    } finally {
      restore();
    }
  });
});

describe('Main Street', () => {
  it('can be bought at level 5 with $20,000 and entered', () => {
    expect(buyBlocker({ ...rich(), level: 4 }, 'main_street')).toMatch(/level/i);
    expect(buyBlocker({ ...rich(), cash: 19_999 }, 'main_street')).toMatch(/cash/i);
    const bought = buyLocation(rich(), 'main_street');
    if (!bought.ok) throw new Error(bought.reason);
    expect(bought.state.location).toBe('main_street');
    expect(bought.state.clubName).toBe('Main Street Club');
  });

  it('sells its exclusive decor only while you are there', () => {
    const exclusive = FURNITURE.filter((f) => f.location === 'main_street');
    expect(exclusive.length).toBeGreaterThanOrEqual(4);
    const home = rich();
    const bought = buyLocation(home, 'main_street');
    if (!bought.ok) throw new Error(bought.reason);
    for (const f of exclusive) {
      expect(buyAndPlace(home, f.id, 5, 5).ok).toBe(false);
      expect(f.requiredLevel).toBeLessThanOrEqual(12);
    }
    const here = buyAndPlace(bought.state, 'awning_stripe', 4, 3);
    expect(here.ok).toBe(true);
  });
});

describe('star rating', () => {
  it('runs from 0 to 5 with popularity', () => {
    expect(starRating(0)).toBe(0);
    expect(starRating(10_000)).toBe(5);
    const mid = starRating(500);
    expect(mid).toBeGreaterThanOrEqual(0);
    expect(mid).toBeLessThanOrEqual(5);
  });
});

describe('v8 -> v9 migration and validation', () => {
  it('puts an old save in the starter location with no parked clubs', () => {
    const { location: _l, parkedClubs: _p, ...rest } = createNewClub(0);
    const store = new MemoryStore();
    store.setItem(SAVE_KEY, JSON.stringify({ ...rest, schemaVersion: 8 }));
    const r = new LocalSaveRepository(store).load();
    expect(r.status).toBe('ok');
    if (r.status === 'ok') {
      expect(r.state.schemaVersion).toBe(SCHEMA_VERSION);
      expect(r.state.location).toBe(STARTER_LOCATION);
      expect(r.state.parkedClubs).toEqual({});
    }
  });

  it('rejects an unknown location, a parked copy of the current one, and a broken parked club', () => {
    const base = JSON.parse(JSON.stringify(createNewClub(0)));
    expect(validateState({ ...base, location: 'atlantis' }).ok).toBe(false);
    const slot = { clubName: 'X', room: base.room, furniture: [], staff: [], stock: { drinks: 1 }, stats: { drinksSold: 0, guestsVisited: 0, tipsEarned: 0 }, party: null, celebrity: null };
    expect(validateState({ ...base, parkedClubs: { [STARTER_LOCATION]: slot } }).ok).toBe(false);
    expect(validateState({ ...base, parkedClubs: { nashville: slot } }).ok).toBe(true);
    expect(validateState({ ...base, parkedClubs: { nashville: { ...slot, room: { cols: 1, rows: 1 } } } }).ok).toBe(false);
    expect(validateState({ ...base, parkedClubs: { atlantis: slot } }).ok).toBe(false);
  });
});
