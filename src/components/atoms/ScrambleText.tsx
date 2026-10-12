'use client';

import * as React from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_';
const DURATION_MS = 220;

function canAnimate(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return (
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface ScrambleTextProps {
  text: string;
  className?: string;
}

/**
 * Decode-style hover effect for the nearest link/button ancestor. The real text always stays in the
 * accessibility tree; the animated copy is aria-hidden and its width is reserved to avoid layout shift.
 */
const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className }) => {
  const hostRef = React.useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = React.useState(text);

  React.useEffect(() => {
    setDisplay(text);
    const host = hostRef.current?.closest('a,button') as HTMLElement | null;
    if (!host || !canAnimate()) return;

    let frame = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        const resolved = Math.floor(progress * text.length);
        setDisplay(
          text
            .split('')
            .map((char, index) =>
              index < resolved || char === ' '
                ? char
                : CHARS.charAt(Math.floor(Math.random() * CHARS.length))
            )
            .join('')
        );
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      setDisplay(text);
    };

    host.addEventListener('mouseenter', run);
    host.addEventListener('mouseleave', reset);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('mouseenter', run);
      host.removeEventListener('mouseleave', reset);
    };
  }, [text]);

  return (
    <span ref={hostRef} className={['inline-grid', className].filter(Boolean).join(' ')}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default ScrambleText;
