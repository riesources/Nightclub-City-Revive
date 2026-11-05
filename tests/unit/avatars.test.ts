import { describe, expect, it } from 'vitest';
import {
  DEFAULT_APPEARANCE,
  EYEWEAR,
  HAIR_STYLES,
  IRIS_COLORS,
  appearanceFromSeed,
  isValidAppearance,
} from '../../src/data/appearanceCatalog';
import { drawAvatar, type AvatarPose } from '../../src/render/avatarArt';
import type { Painter } from '../../src/render/painter';
import { staffAppearance } from '../../src/ui/staffLook';

/** Painter that counts calls and rejects non-finite numbers. */
class CountingPainter implements Painter {
  calls = 0;
  private chk(...n: number[]) {
    this.calls++;
    for (const v of n) if (!Number.isFinite(v)) throw new Error('non-finite coordinate');
  }
  fill(c: number, a?: number) { this.chk(c, a ?? 1); }
  noStroke() {}
  stroke(w: number, c: number, a?: number) { this.chk(w, c, a ?? 1); }
  circle(x: number, y: number, r: number) { this.chk(x, y, r); }
  ellipse(x: number, y: number, w: number, h: number) { this.chk(x, y, w, h); }
  rect(x: number, y: number, w: number, h: number) { this.chk(x, y, w, h); }
  roundRect(x: number, y: number, w: number, h: number, r: number) { this.chk(x, y, w, h, r); }
  poly(pts: { x: number; y: number }[]) { this.chk(...pts.flatMap((p) => [p.x, p.y])); }
}

const pose = (over: Partial<AvatarPose> = {}): AvatarPose => ({ phase: 0.3, dancing: false, walking: false, arms: 'down', ...over });

describe('avatar appearance', () => {
  it('older saves without eyes or eyewear are still valid', () => {
    expect(isValidAppearance(DEFAULT_APPEARANCE)).toBe(true);
    expect(isValidAppearance({ ...DEFAULT_APPEARANCE, eyes: undefined, eyewear: undefined })).toBe(true);
  });

  it('rejects unknown eyewear and iris colours', () => {
    expect(isValidAppearance({ ...DEFAULT_APPEARANCE, eyewear: 'monocle' })).toBe(false);
    expect(isValidAppearance({ ...DEFAULT_APPEARANCE, eyes: '#123456' })).toBe(false);
  });

  it('seeded guests are valid, deterministic and vary', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed < 200; seed++) {
      const a = appearanceFromSeed(seed);
      expect(isValidAppearance(a)).toBe(true);
      expect(appearanceFromSeed(seed)).toEqual(a);
      seen.add(`${a.eyewear}/${a.eyes}`);
    }
    expect(seen.size).toBeGreaterThan(6);
    expect([...seen].some((k) => k.startsWith('shades'))).toBe(true);
    expect([...seen].some((k) => k.startsWith('round'))).toBe(true);
  });

  it('bouncers are bald in shades and bartenders wear white', () => {
    const b = staffAppearance({ name: 'Rex', role: 'bouncer' });
    expect(b.hairStyle).toBe('bald');
    expect(b.eyewear).toBe('shades');
    expect(staffAppearance({ name: 'Mia', role: 'bartender' }).top).toBe('#f7f7fb');
  });
});

describe('avatar drawing', () => {
  it('draws every hair style, eyewear and iris colour with finite coordinates', () => {
    for (const hairStyle of HAIR_STYLES) {
      for (const eyewear of EYEWEAR) {
        for (const gender of ['m', 'f'] as const) {
          const p = new CountingPainter();
          drawAvatar(p, { ...DEFAULT_APPEARANCE, gender, hairStyle, eyewear, eyes: IRIS_COLORS[1] }, 100, 100, 1, pose());
          expect(p.calls).toBeGreaterThan(20);
        }
      }
    }
  });

  it('draws every pose and outfit', () => {
    for (const arms of ['down', 'up', 'drink', 'headphones', 'crossed'] as const) {
      for (const outfit of [undefined, 'bouncer', 'bartender'] as const) {
        for (const sitting of [false, true]) {
          const p = new CountingPainter();
          drawAvatar(p, DEFAULT_APPEARANCE, 50, 90, 0.72, pose({ arms, outfit, sitting, seatLift: 10, dancing: arms === 'up' }));
          expect(p.calls).toBeGreaterThan(20);
        }
      }
    }
  });

  it('crossed arms and outfits add drawing work', () => {
    const base = new CountingPainter();
    drawAvatar(base, DEFAULT_APPEARANCE, 0, 0, 1, pose());
    const crossed = new CountingPainter();
    drawAvatar(crossed, DEFAULT_APPEARANCE, 0, 0, 1, pose({ arms: 'crossed', outfit: 'bouncer' }));
    expect(crossed.calls).toBeGreaterThan(base.calls);
  });
});
