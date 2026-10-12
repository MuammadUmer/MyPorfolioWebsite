'use client';

import * as React from 'react';
import Image from 'next/image';
import { canRunInteractiveAvatar } from '@/lib/avatar/capabilities';
import { approach, orbitFor, pointerFromEvent, type Pointer } from '@/lib/avatar/orbit';

export interface Avatar3DProps {
  /** Optimised GLB. Loaded lazily, only when the avatar is visible and the device can run it. */
  model: string;
  /** Transparent still render of the same avatar. Always shown first and kept when 3D is unavailable. */
  poster: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Optional camera framing, e.g. `{ target: '0m 1.4m 0m', radius: '2.4m' }`; defaults to the whole model. */
  framing?: { target: string; radius: string };
}

type ViewerElement = HTMLElement & { cameraOrbit?: string };

function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 300);
  return () => window.clearTimeout(id);
}

const Avatar3D: React.FC<Avatar3DProps> = ({
  model,
  poster,
  alt,
  className,
  sizes = '40vw',
  framing,
}) => {
  const radius = framing?.radius ?? 'auto';
  const target = framing?.target ?? 'auto auto auto';
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // 1) Decide whether to upgrade from poster to 3D, then lazy-load the viewer library.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !canRunInteractiveAvatar()) return;

    let cancelled = false;
    let cancelIdle: (() => void) | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        cancelIdle = whenIdle(() => {
          import('@google/model-viewer')
            .then(() => {
              if (!cancelled) setEnabled(true);
            })
            .catch(() => undefined);
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle?.();
    };
  }, []);

  // 2) Once the viewer exists: reveal it on load and make it look toward the cursor.
  React.useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const viewer = container?.querySelector('model-viewer') as ViewerElement | null;
    if (!container || !viewer) return;

    const target: Pointer = { x: 0, y: 0 };
    const current: Pointer = { x: 0, y: 0 };
    let lastMove = performance.now();
    let visible = true;
    let frame = 0;
    let lastOrbit = '';

    const onLoad = () => setReady(true);
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const next = pointerFromEvent(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
      target.x = next.x;
      target.y = next.y;
      lastMove = performance.now();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      current.x = approach(current.x, target.x);
      current.y = approach(current.y, target.y);
      const orbit = orbitFor(current, now - lastMove, now, radius);
      if (orbit !== lastOrbit) {
        viewer.cameraOrbit = orbit;
        lastOrbit = orbit;
      }
    };

    const visibility = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 }
    );
    visibility.observe(container);

    viewer.addEventListener('load', onLoad);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      viewer.removeEventListener('load', onLoad);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, radius]);

  return (
    <div ref={containerRef} className={className} data-avatar-state={ready ? 'model' : 'poster'}>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain object-bottom transition-opacity duration-500 ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {enabled ? (
        <model-viewer
          src={model}
          alt={alt}
          aria-hidden="true"
          loading="eager"
          reveal="auto"
          interaction-prompt="none"
          disable-zoom
          disable-pan
          disable-tap
          shadow-intensity="0"
          environment-image="legacy"
          exposure="1"
          field-of-view="22deg"
          camera-orbit={`0deg 84deg ${radius}`}
          camera-target={target}
          min-camera-orbit="auto auto 0.2m"
          max-camera-orbit="auto auto 20m"
          style={
            {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
              '--poster-color': 'transparent',
              pointerEvents: 'none',
              opacity: ready ? 1 : 0,
              transition: 'opacity 500ms',
            } as React.CSSProperties
          }
        />
      ) : null}
    </div>
  );
};

export default Avatar3D;
