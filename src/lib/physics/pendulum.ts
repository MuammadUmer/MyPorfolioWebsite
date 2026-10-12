export interface PendulumState {
  /** radians, 0 = hanging straight down, positive = swung to the right */
  angle: number;
  /** radians per second */
  velocity: number;
}

export interface PendulumConfig {
  /** natural angular frequency (rad/s): sqrt(g / length); ~4.6 ≈ a 0.45 m lanyard + card */
  omega0: number;
  /** velocity damping (1/s) — air drag + fabric friction */
  damping: number;
  /** hard limit so the card never flips over its pivot */
  maxAngle: number;
}

export const DEFAULT_PENDULUM: PendulumConfig = {
  omega0: 4.6,
  damping: 0.9,
  maxAngle: 0.75,
};

export const REST_EPSILON = { angle: 0.0008, velocity: 0.01 };

const MAX_STEP = 1 / 120;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Advances a damped pendulum (θ'' = −ω₀² sin θ − c θ') with semi-implicit Euler, sub-stepped for stability.
 * `dt` is in seconds.
 */
export function stepPendulum(
  state: PendulumState,
  dt: number,
  config: PendulumConfig = DEFAULT_PENDULUM
): PendulumState {
  let { angle, velocity } = state;
  let remaining = Math.min(dt, 0.1);

  while (remaining > 0) {
    const h = Math.min(remaining, MAX_STEP);
    const acceleration = -config.omega0 * config.omega0 * Math.sin(angle) - config.damping * velocity;
    velocity += acceleration * h;
    angle += velocity * h;
    if (Math.abs(angle) > config.maxAngle) {
      angle = Math.sign(angle) * config.maxAngle;
      velocity *= -0.35;
    }
    remaining -= h;
  }

  return { angle, velocity };
}

export function isAtRest(state: PendulumState): boolean {
  return Math.abs(state.angle) < REST_EPSILON.angle && Math.abs(state.velocity) < REST_EPSILON.velocity;
}

/** A pointer moving across a hanging card pushes it: sideways speed (px/ms) becomes angular velocity. */
export function kick(state: PendulumState, pointerSpeedPxPerMs: number, strength = 0.5): PendulumState {
  const push = clamp(pointerSpeedPxPerMs, -3, 3) * strength;
  return { angle: state.angle, velocity: clamp(state.velocity + push, -6, 6) };
}

/** Angle of the line from the pivot to the pointer while the card is being dragged. */
export function angleFromPointer(
  pivot: { x: number; y: number },
  pointer: { x: number; y: number },
  config: PendulumConfig = DEFAULT_PENDULUM
): number {
  const dx = pointer.x - pivot.x;
  const dy = Math.max(pointer.y - pivot.y, 40);
  return clamp(Math.atan2(dx, dy), -config.maxAngle, config.maxAngle);
}
