'use client';

import * as React from 'react';
import Image from 'next/image';

export interface AvatarMarkProps {
  /** Head-only avatar still. When missing (or when it fails to load) the initials are shown instead. */
  logo?: string;
  initials: string;
  size?: number;
  /** Classes for the initials fallback (keeps the previous monogram look). */
  textClassName?: string;
}

/** The avatar's head on its own: no circle or ring, softly faded at the shoulders by `.avatar-head`. */
const AvatarMark: React.FC<AvatarMarkProps> = ({
  logo,
  initials,
  size = 40,
  textClassName = 'text-xl font-bold tracking-tight',
}) => {
  const [failed, setFailed] = React.useState(false);

  if (!logo || failed) {
    return <span className={textClassName}>{initials}</span>;
  }

  return (
    <span
      className="avatar-head relative inline-block shrink-0"
      style={{ width: size, height: size }}
      data-avatar-mark="head"
    >
      <Image
        src={logo}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-contain object-bottom"
        draggable={false}
        onError={() => setFailed(true)}
      />
    </span>
  );
};

export default AvatarMark;
