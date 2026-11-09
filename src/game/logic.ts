import type { GridPoint } from './levels';

export function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

export function isNextPoint(route: GridPoint[], selected: GridPoint[], candidate: GridPoint): boolean {
  if (selected.length >= route.length) return false;
  return pointKey(route[selected.length]!) === pointKey(candidate);
}

export function isRouteComplete(route: GridPoint[], selected: GridPoint[]): boolean {
  return route.length === selected.length && route.every((point, index) => pointKey(point) === pointKey(selected[index]!));
}

export function nextProgress(selected: GridPoint[], route: GridPoint[]): number {
  return Math.min(selected.length, route.length);
}
