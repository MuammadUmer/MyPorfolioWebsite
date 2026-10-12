'use client';

import * as React from 'react';
import Image from 'next/image';

export interface AvatarMarkProps {
  /** Small circular avatar image. When missing (or when it fails to load) the initials are shown instead. */
  logo?: string;
  initials: string;
  size?: number;
  /** Classes for the initials fallback (keeps the previous monogram look). */
  textClassName?: string;
}

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
      className="relative inline-block shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      <Image
        src={logo}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </span>
  );
};

export default AvatarMark;
