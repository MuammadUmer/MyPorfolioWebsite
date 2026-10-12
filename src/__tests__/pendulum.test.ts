import {
  DEFAULT_PENDULUM,
  angleFromPointer,
  clamp,
  isAtRest,
  kick,
  stepPendulum,
  type PendulumState,
} from '@/lib/physics/pendulum';

const simulate = (state: PendulumState, seconds: number, fps = 60): PendulumState => {
  let current = state;
  for (let i = 0; i < seconds * fps; i += 1) current = stepPendulum(current, 1 / fps);
  return current;
};

describe('stepPendulum', () => {
  it('stays at rest when hanging straight down', () => {
    const next = stepPendulum({ angle: 0, velocity: 0 }, 1 / 60);
    expect(next).toEqual({ angle: 0, velocity: 0 });
    expect(isAtRest(next)).toBe(true);
  });

  it('swings back toward the centre from a displaced angle', () => {
    const after = stepPendulum({ angle: 0.3, velocity: 0 }, 0.1);
    expect(after.angle).toBeLessThan(0.3);
    expect(after.velocity).toBeLessThan(0);
  });

  it('oscillates through the centre and to the other side', () => {
    let state: PendulumState = { angle: 0.3, velocity: 0 };
    let crossed = false;
    for (let i = 0; i < 120; i += 1) {
      state = stepPendulum(state, 1 / 60);
      if (state.angle < -0.05) crossed = true;
    }
    expect(crossed).toBe(true);
  });

  it('has a natural period close to 2π/ω₀ for small swings', () => {
    let state: PendulumState = { angle: 0.05, velocity: 0 };
    const crossings: number[] = [];
    let previousAngle = state.angle;
    const dt = 1 / 240;
    for (let i = 1; i < 240 * 4; i += 1) {
      state = stepPendulum(state, dt, { ...DEFAULT_PENDULUM, damping: 0 });
      if (previousAngle > 0 && state.angle <= 0) crossings.push(i * dt);
      previousAngle = state.angle;
    }
    const period = crossings[1] - crossings[0];
    expect(period).toBeGreaterThan((2 * Math.PI) / DEFAULT_PENDULUM.omega0 - 0.08);
    expect(period).toBeLessThan((2 * Math.PI) / DEFAULT_PENDULUM.omega0 + 0.08);
  });

  it('loses energy and settles', () => {
    const settled = simulate({ angle: 0.5, velocity: 0 }, 20);
    expect(isAtRest(settled)).toBe(true);
  });

  it('is mirror-symmetric', () => {
    const left = simulate({ angle: -0.4, velocity: 0 }, 1.5);
    const right = simulate({ angle: 0.4, velocity: 0 }, 1.5);
    expect(left.angle).toBeCloseTo(-right.angle, 6);
  });

  it('never exceeds the maximum angle, even with a huge push', () => {
    let state: PendulumState = { angle: 0, velocity: 40 };
    for (let i = 0; i < 300; i += 1) {
      state = stepPendulum(state, 1 / 60);
      expect(Math.abs(state.angle)).toBeLessThanOrEqual(DEFAULT_PENDULUM.maxAngle + 1e-9);
    }
  });

  it('survives a long frame (tab was in the background)', () => {
    const next = stepPendulum({ angle: 0.4, velocity: 0 }, 5);
    expect(Number.isFinite(next.angle)).toBe(true);
    expect(Math.abs(next.angle)).toBeLessThanOrEqual(DEFAULT_PENDULUM.maxAngle);
  });
});

describe('pointer interaction', () => {
  it('kicks the card in the direction the pointer moves, with a capped strength', () => {
    expect(kick({ angle: 0, velocity: 0 }, 1).velocity).toBeGreaterThan(0);
    expect(kick({ angle: 0, velocity: 0 }, -1).velocity).toBeLessThan(0);
    expect(kick({ angle: 0, velocity: 0 }, 1000).velocity).toBeLessThanOrEqual(6);
  });

  it('computes the drag angle from the pivot to the pointer', () => {
    const pivot = { x: 100, y: 0 };
    expect(angleFromPointer(pivot, { x: 100, y: 300 })).toBeCloseTo(0);
    expect(angleFromPointer(pivot, { x: 200, y: 300 })).toBeGreaterThan(0);
    expect(angleFromPointer(pivot, { x: 0, y: 300 })).toBeLessThan(0);
    expect(angleFromPointer(pivot, { x: 5000, y: 100 })).toBe(DEFAULT_PENDULUM.maxAngle);
  });

  it('clamps helper values', () => {
    expect(clamp(-5, -1, 1)).toBe(-1);
  });
});
