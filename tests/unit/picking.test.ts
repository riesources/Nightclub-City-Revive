import { describe, expect, it } from 'vitest';
import { createNewClub } from '../../src/domain/club';
import type { ClubState } from '../../src/domain/types';
import { DEFAULT_ISO, gridToScreen } from '../../src/render/isoProjection';
import { pickFurniture } from '../../src/render/picking';

const base = (): ClubState => ({ ...createNewClub(0), furniture: [] });
const inst = (id: string, catalogId: string, col: number, row: number) => ({ id, catalogId, col, row, facing: 0 as const });
const centre = (col: number, row: number, w = 1, h = 1) => gridToScreen(col + w / 2, row + h / 2, DEFAULT_ISO);

describe('picking furniture by what is drawn', () => {
  it('picks a tall item by its visible body, not the tile behind it', () => {
    const s = { ...base(), furniture: [inst('spk', 'speaker_basic', 5, 5), inst('stool', 'stool_red', 5, 4)] };
    const c = centre(5, 5);
    // Click on the upper body of the speaker: that point is over the ground cell behind it.
    expect(pickFurniture(s, c.x, c.y - 30)?.id).toBe('spk');
  });

  it('does not let a floor tile steal the click from what stands on it', () => {
    const s = { ...base(), furniture: [inst('tile', 'floor_neon_blue', 5, 5), inst('spk', 'speaker_basic', 5, 5)] };
    const c = centre(5, 5);
    expect(pickFurniture(s, c.x, c.y)?.id).toBe('spk');
  });

  it('prefers the front item when two overlap on screen', () => {
    const s = { ...base(), furniture: [inst('back', 'speaker_basic', 5, 4), inst('front', 'speaker_basic', 5, 5)] };
    const c = centre(5, 5);
    expect(pickFurniture(s, c.x, c.y - 10)?.id).toBe('front');
  });

  it('returns nothing on empty floor', () => {
    const c = centre(3, 3);
    expect(pickFurniture(base(), c.x, c.y)).toBeUndefined();
  });
});
