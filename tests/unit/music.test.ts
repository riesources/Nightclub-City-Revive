import { describe, expect, it } from 'vitest';
import { LOCAL_PLAYLISTS, MIX_LABELS, PLAYLISTS, playlistFor } from '../../src/audio/music';
import { getLocation } from '../../src/data/locations';
import { GENRES } from '../../src/domain/types';

describe('music playlists', () => {
  it('every mix has a label and at least three well-formed tracks', () => {
    for (const g of GENRES) {
      expect(MIX_LABELS[g]).toBeTruthy();
      expect(PLAYLISTS[g].length).toBeGreaterThanOrEqual(3);
      for (const t of PLAYLISTS[g]) {
        for (const p of [t.kick, t.snare, t.hat, t.bass]) expect(p).toHaveLength(16);
        if (t.perc) expect(t.perc).toHaveLength(16);
        expect(t.chords).toHaveLength(4);
        expect(t.bpm).toBeGreaterThanOrEqual(80);
        expect(t.bpm).toBeLessThanOrEqual(140);
      }
    }
  });

  it('track names are unique across all mixes', () => {
    const names = GENRES.flatMap((g) => PLAYLISTS[g].map((t) => t.name));
    expect(new Set(names).size).toBe(names.length);
    expect(names.length).toBeGreaterThanOrEqual(18);
  });

  it('district songs are well-formed, unique, and lead their mix in that district only', () => {
    const all = new Set(GENRES.flatMap((g) => PLAYLISTS[g].map((t) => t.name)));
    for (const [loc, mixes] of Object.entries(LOCAL_PLAYLISTS)) {
      expect(getLocation(loc)).toBeTruthy();
      for (const [genre, tracks] of Object.entries(mixes)) {
        expect(GENRES).toContain(genre);
        expect(tracks!.length).toBeGreaterThanOrEqual(4);
        for (const t of tracks!) {
          for (const p of [t.kick, t.snare, t.hat, t.bass]) expect(p).toHaveLength(16);
          expect(t.chords).toHaveLength(4);
          expect(t.bpm).toBeGreaterThanOrEqual(80);
          expect(t.bpm).toBeLessThanOrEqual(140);
          expect(all.has(t.name)).toBe(false);
          all.add(t.name);
        }
      }
    }
    const here = playlistFor('house', 'main_street');
    expect(here[0].name).toBe(LOCAL_PLAYLISTS.main_street.house![0].name);
    expect(here.length).toBe(LOCAL_PLAYLISTS.main_street.house!.length + PLAYLISTS.house.length);
    expect(playlistFor('house', 'dj_alley')).toBe(PLAYLISTS.house);
    expect(playlistFor('hiphop', 'main_street')).toBe(PLAYLISTS.hiphop);
  });
});
