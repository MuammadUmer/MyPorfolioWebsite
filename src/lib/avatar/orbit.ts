export const MAX_AZIMUTH_DEG = 14;
export const MAX_POLAR_DEG = 6;
export const BASE_POLAR_DEG = 84;
export const SWAY_DEG = 3;
export const SWAY_AFTER_MS = 2500;

export interface Pointer {
  /** -1 (left edge) … 1 (right edge) */
  x: number;
  /** -1 (top edge) … 1 (bottom edge) */
  y: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function pointerFromEvent(clientX: number, clientY: number, width: number, height: number): Pointer {
  if (width <= 0 || height <= 0) return { x: 0, y: 0 };
  return {
    x: clamp((clientX / width) * 2 - 1, -1, 1),
    y: clamp((clientY / height) * 2 - 1, -1, 1),
  };
}

/** Moves `current` a fraction of the way towards `target` (frame-rate independent enough for a 60Hz loop). */
export function approach(current: number, target: number, factor = 0.08): number {
  return current + (target - current) * factor;
}

/**
 * Camera orbit that makes the avatar appear to look toward the pointer. When the pointer has been idle
 * for a while a slow sway keeps the avatar alive.
 */
export function orbitFor(pointer: Pointer, idleMs: number, timeMs: number, radius = 'auto'): string {
  const sway = idleMs > SWAY_AFTER_MS ? Math.sin(timeMs / 1800) * SWAY_DEG : 0;
  const azimuth = -pointer.x * MAX_AZIMUTH_DEG + sway;
  const polar = BASE_POLAR_DEG - pointer.y * MAX_POLAR_DEG;
  return `${azimuth.toFixed(2)}deg ${polar.toFixed(2)}deg ${radius}`;
}
