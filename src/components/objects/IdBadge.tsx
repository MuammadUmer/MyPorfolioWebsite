'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check, RotateCw } from 'lucide-react';
import AvatarMark from '@/components/atoms/AvatarMark';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

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
  /** Optional avatar renders; the monogram is used when absent. */
  avatar?: { logo: string; poster: string };
}

const MAX_TILT = 8;

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
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0 });
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * MAX_TILT * 2, ry: x * MAX_TILT * 2 });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div
      className="badge-scene relative mx-auto w-56 pb-8 pt-12 lg:mx-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-14 w-2 -translate-x-1/2 rounded-b-full bg-inverse"
      />

      <div aria-hidden="true" className="badge-swing">
        <div
          className="badge-tilt"
          style={{ '--rx': `${tilt.rx}deg`, '--ry': `${tilt.ry}deg` } as React.CSSProperties}
        >
          <div className="badge-flip h-[336px]" data-flipped={flipped}>
            <div className="badge-face flex h-full flex-col" id={`${idPrefix}__badge--front`}>
              <div className="flex h-16 items-center gap-3 bg-inverse px-4 text-inverse-foreground">
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-current text-sm font-bold">
                  <AvatarMark
                    logo={avatar?.logo}
                    initials={initials}
                    size={36}
                    textClassName="text-sm font-bold"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{name}</span>
                  <span className="block truncate text-xs text-inverse-muted">{role}</span>
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="relative grid flex-1 place-items-center overflow-hidden rounded-tile bg-muted">
                  {avatar?.poster ? (
                    <Image
                      src={avatar.poster}
                      alt=""
                      fill
                      sizes="192px"
                      className="object-contain object-bottom"
                    />
                  ) : (
                    <span className="t-display-num text-foreground/80">{initials}</span>
                  )}
                </div>
                <p className="eyebrow mt-4">{location}</p>
              </div>
            </div>

            <div className="badge-face badge-back flex flex-col gap-3 p-5" id={`${idPrefix}__badge--back`}>
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
            </div>
          </div>
        </div>
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
