import { describe, expect, it } from 'vitest';
import { LEVELS } from '../src/game/levels';
import { isNextPoint, isRouteComplete, nextProgress, pointKey } from '../src/game/logic';
import { markCompleted } from '../src/storage';

describe('NASEEJ level data', () => {
  it('contains 30 playable levels', () => {
    expect(LEVELS).toHaveLength(30);
  });

  it('every route starts and ends on the symmetry axis', () => {
    for (const level of LEVELS) {
      expect(level.route[0]?.x).toBe(0);
      expect(level.route.at(-1)?.x).toBe(0);
      expect(level.route[0]?.y).toBe(0);
      expect(level.route.at(-1)?.y).toBe(8);
    }
  });

  it('contains unique nodes and every route point is selectable', () => {
    for (const level of LEVELS) {
      const keys = level.nodes.map(pointKey);
      expect(new Set(keys).size).toBe(keys.length);
      expect(new Set(level.route.map(pointKey)).size).toBe(level.route.length);
      for (const point of level.route) expect(keys).toContain(pointKey(point));
    }
  });

  it('keeps route points within the drawing grid', () => {
    for (const level of LEVELS) {
      for (const point of level.route) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(4);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(8);
      }
    }
  });
});

describe('path interaction rules', () => {
  const route = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }];

  it('accepts only the next expected point', () => {
    expect(isNextPoint(route, [route[0]!], route[1]!)).toBe(true);
    expect(isNextPoint(route, [route[0]!], route[2]!)).toBe(false);
  });

  it('detects a complete route in the correct order', () => {
    expect(isRouteComplete(route, route)).toBe(true);
    expect(isRouteComplete(route, [route[0]!, route[2]!, route[1]!])).toBe(false);
    expect(isRouteComplete(route, route.slice(0, 2))).toBe(false);
  });

  it('reports bounded progress', () => {
    expect(nextProgress(route.slice(0, 2), route)).toBe(2);
    expect(nextProgress([...route, route[2]!], route)).toBe(3);
  });
});

describe('local progression', () => {
  it('unlocks the next level after completion without duplicate entries', () => {
    const initial = { completed: [], unlocked: 1, lastLevel: 1, language: 'ar' as const };
    const first = markCompleted(initial, 1, new Date('2026-11-09T10:00:00Z'));
    const repeated = markCompleted(first, 1, new Date('2026-11-09T10:00:00Z'));
    expect(first.completed).toEqual([1]);
    expect(first.unlocked).toBe(2);
    expect(repeated.completed).toEqual([1]);
  });

  it('does not unlock later stages when a locked stage is only completed as a daily challenge', () => {
    const initial = { completed: [], unlocked: 1, lastLevel: 1, language: 'en' as const };
    const daily = markCompleted(initial, 18, new Date('2026-11-09T10:00:00Z'), false);
    expect(daily.completed).toEqual([18]);
    expect(daily.unlocked).toBe(1);
    expect(daily.lastLevel).toBe(1);
  });

  it('does not unlock beyond the final level', () => {
    const initial = { completed: Array.from({ length: 29 }, (_, index) => index + 1), unlocked: 30, lastLevel: 30, language: 'en' as const };
    expect(markCompleted(initial, 30).unlocked).toBe(30);
  });
});
