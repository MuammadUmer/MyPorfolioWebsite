'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check, RotateCw } from 'lucide-react';
import AvatarMark from '@/components/atoms/AvatarMark';
import Grommet from '@/components/atoms/Grommet';
import Lanyard from '@/components/atoms/Lanyard';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import {
  angleFromPointer,
  isAtRest,
  kick,
  stepPendulum,
  type PendulumState,
} from '@/lib/physics/pendulum';

export interface IdBadgeProps {
  name: string;
  initials: string;
  role: string;
  location: string;
  /** Existing profile statements shown on the back of the card. */
  glanceTitle: string;
  glanceItems: string[];
  flipLabel: string;
  idPrefix: string;
  /** Optional images; the monogram is used when absent. `portrait` is the photo, `logo` the avatar head. */
  avatar?: { logo?: string; portrait?: string; poster?: string };
}

export const STRAP_LENGTH = 96;
export const HOLE_Y = 24;
const INITIAL_SWING = 0.2;

const GROMMET_SIZE = 32;

const IdBadge: React.FC<IdBadgeProps> = ({
  name,
  initials,
  role,
  location,
  glanceTitle,
  glanceItems,
  flipLabel,
  idPrefix,
  avatar,
}) => {
  const [flipped, setFlipped] = React.useState(false);
  const sceneRef = React.useRef<HTMLDivElement | null>(null);
  const swingRef = React.useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const photo = avatar?.portrait ?? avatar?.poster;

  // Pendulum: swings on load, is pushed by the pointer sweeping across it, and can be dragged and released.
  React.useEffect(() => {
    const scene = sceneRef.current;
    const swing = swingRef.current;
    if (!scene || !swing || reducedMotion) return;

    let state: PendulumState = { angle: INITIAL_SWING, velocity: 0 };
    let running = false;
    let visible = false;
    let dragging = false;
    let raf = 0;
    let previous = 0;
    let lastX = 0;
    let lastT = 0;
    let lastDragAngle = 0;
    let lastDragT = 0;

    const render = () => swing.style.setProperty('--swing', `${state.angle}rad`);

    const loop = (now: number) => {
      const dt = (now - previous) / 1000;
      previous = now;
      if (!dragging) state = stepPendulum(state, dt);
      render();
      if (!dragging && isAtRest(state)) {
        state = { angle: 0, velocity: 0 };
        render();
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      previous = performance.now();
      raf = requestAnimationFrame(loop);
    };

    // the swing box rotates, so the fixed pivot is the scene's top-centre
    const pivot = () => {
      const rect = scene.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top };
    };

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('button')) return;
      dragging = true;
      scene.setPointerCapture(event.pointerId);
      scene.style.cursor = 'grabbing';
      lastDragAngle = state.angle;
      lastDragT = event.timeStamp;
      start();
    };

    const onMove = (event: PointerEvent) => {
      if (dragging) {
        const next = angleFromPointer(pivot(), { x: event.clientX, y: event.clientY });
        const dt = Math.max(event.timeStamp - lastDragT, 1) / 1000;
        state = { angle: next, velocity: (next - lastDragAngle) / dt };
        lastDragAngle = next;
        lastDragT = event.timeStamp;
        render();
        return;
      }
      if (event.pointerType !== 'mouse') return;
      const dt = event.timeStamp - lastT;
      if (lastT > 0 && dt > 0 && dt < 80) {
        state = kick(state, (event.clientX - lastX) / dt);
        start();
      }
      lastX = event.clientX;
      lastT = event.timeStamp;
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      scene.style.cursor = 'grab';
      if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
      state = { angle: state.angle, velocity: Math.max(-6, Math.min(6, state.velocity)) };
      start();
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) start();
      else {
        cancelAnimationFrame(raf);
        running = false;
      }
    });
    observer.observe(scene);

    scene.style.cursor = 'grab';
    scene.addEventListener('pointerdown', onDown);
    scene.addEventListener('pointermove', onMove);
    scene.addEventListener('pointerup', onUp);
    scene.addEventListener('pointercancel', onUp);
    render();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.removeEventListener('pointerdown', onDown);
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerup', onUp);
      scene.removeEventListener('pointercancel', onUp);
      scene.style.cursor = '';
      swing.style.removeProperty('--swing');
    };
  }, [reducedMotion]);

  return (
    <div
      ref={sceneRef}
      data-testid="id-badge-scene"
      className="badge-scene relative mx-auto w-56 touch-pan-y select-none pb-8 lg:mx-0"
    >
      <div
        ref={swingRef}
        aria-hidden="true"
        className="badge-swing relative"
        style={{ paddingTop: STRAP_LENGTH }}
      >
        <div className="badge-tilt">
          <div className="badge-flip h-[372px]" data-flipped={flipped}>
            <div className="badge-face relative flex h-full flex-col" id={`${idPrefix}__badge--front`}>
              <div className="relative bg-inverse text-inverse-foreground">
                <div className="h-11" />
                <div className="flex h-14 items-center gap-3 px-4 pb-1">
                  <AvatarMark
                    logo={avatar?.logo}
                    initials={initials}
                    size={52}
                    textClassName="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current text-sm font-bold"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{name}</span>
                    <span className="block text-xs leading-tight text-inverse-muted">{role}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="relative grid flex-1 place-items-center overflow-hidden rounded-tile bg-muted">
                  {photo ? (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="192px"
                      className="object-cover object-top"
                      draggable={false}
                    />
                  ) : (
                    <span className="t-display-num text-foreground/80">{initials}</span>
                  )}
                </div>
                <p className="eyebrow mt-4">{location}</p>
              </div>
              <Grommet size={GROMMET_SIZE} className="absolute left-1/2 top-2 -translate-x-1/2" />
            </div>

            <div
              className="badge-face badge-back flex flex-col gap-3 px-5 pb-5 pt-14"
              id={`${idPrefix}__badge--back`}
            >
              <p className="eyebrow">{glanceTitle}</p>
              <ul className="flex flex-col gap-3">
                {glanceItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-inverse text-inverse-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Grommet size={GROMMET_SIZE} className="absolute left-1/2 top-2 -translate-x-1/2" />
            </div>
          </div>
        </div>

        <Lanyard length={STRAP_LENGTH} holeY={HOLE_Y} />
      </div>

      <button
        type="button"
        id={`${idPrefix}__btn--flip-badge`}
        aria-label={flipLabel}
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
        className="absolute -bottom-3 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-inverse text-inverse-foreground transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default IdBadge;
