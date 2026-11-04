import { getFurnitureDef } from '../data/furnitureCatalog';
import { footprintSize } from '../domain/grid';
import type { ClubState, FurnitureInstance } from '../domain/types';
import { DEFAULT_ISO, depthFor, screenToGridFloat, type IsoConfig } from './isoProjection';

/**
 * Which piece of furniture is under a screen point?
 * Tall items are drawn above their footprint, so a click on the visible body lands on the
 * ground cells behind it. We test the whole standing prism (footprint lifted up to the
 * item's drawn height) and take the front-most hit, with flat floor pieces and rugs last
 * so they never steal clicks from what stands on them.
 */
export function pickFurniture(state: ClubState, x: number, y: number, cfg: IsoConfig = DEFAULT_ISO): FurnitureInstance | undefined {
  let best: FurnitureInstance | undefined;
  let bestScore = -Infinity;
  for (const f of state.furniture) {
    const def = getFurnitureDef(f.catalogId);
    if (!def) continue;
    const { w, h } = footprintSize(f.catalogId, f.facing);
    const height = def.kind === 'dancefloor' ? 0 : (def.art.height ?? 0);
    let hit = false;
    for (let lift = 0; lift <= height + 1e-6 && !hit; lift += 6) {
      const g = screenToGridFloat(x, y + Math.min(lift, height), cfg);
      hit = g.col >= f.col && g.col < f.col + w && g.row >= f.row && g.row < f.row + h;
    }
    if (!hit) continue;
    const flat = def.kind === 'dancefloor' || def.walkable;
    const score = depthFor(f.col, f.row, w, h) + (flat ? -1000 : 0) + height / 1000;
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  return best;
}
