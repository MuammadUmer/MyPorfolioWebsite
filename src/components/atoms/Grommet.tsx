import * as React from 'react';

export interface GrommetProps {
  /** Outer diameter in px. The punched hole is 60% of it. */
  size?: number;
  className?: string;
}

/**
 * Polished chrome eyelet drawn as SVG: brushed-metal gradient, bevelled inner edge, a bright rim highlight
 * and soft inner/outer shadows. The centre is transparent so the card's cut-out shows through.
 */
const Grommet: React.FC<GrommetProps> = ({ size = 32, className }) => {
  const id = React.useId().replace(/:/g, '');
  const outer = 16;
  const inner = 9.6;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#c9ced6" />
          <stop offset="0.52" stopColor="#8e949e" />
          <stop offset="0.74" stopColor="#dfe3e9" />
          <stop offset="1" stopColor="#7b818b" />
        </linearGradient>
        <linearGradient id={`${id}-bevel`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#5d636d" stopOpacity="0.7" />
          <stop offset="1" stopColor="#2f333a" stopOpacity="0.8" />
        </linearGradient>
        <filter id={`${id}-drop`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.1" floodColor="#000000" floodOpacity="0.45" />
        </filter>
        <filter id={`${id}-inset`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
        <mask id={`${id}-cut`}>
          <rect width="32" height="32" fill="#fff" />
          <circle cx="16" cy="16" r={inner} fill="#000" />
        </mask>
        <clipPath id={`${id}-clip`}>
          <path d={`M16 ${16 - outer}a${outer} ${outer} 0 1 0 0.01 0zM16 ${16 - inner}a${inner} ${inner} 0 1 1-0.01 0z`} clipRule="evenodd" />
        </clipPath>
      </defs>

      {/* body of the ring (hole punched through) with its outer drop shadow */}
      <g mask={`url(#${id}-cut)`} filter={`url(#${id}-drop)`}>
        <circle cx="16" cy="16" r={outer - 0.4} fill={`url(#${id}-metal)`} />
      </g>

      {/* rim highlight on the outer edge */}
      <circle cx="16" cy="16" r={outer - 0.9} fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="0.7" />
      <circle cx="16" cy="16" r={outer - 0.2} fill="none" stroke="#4a4f58" strokeOpacity="0.55" strokeWidth="0.5" />

      {/* bevelled inner wall + inner shadow so the hole looks punched through the metal */}
      <circle cx="16" cy="16" r={inner + 0.9} fill="none" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />
      <g clipPath={`url(#${id}-clip)`}>
        <circle
          cx="16"
          cy="17.6"
          r={inner + 0.6}
          fill="none"
          stroke="#000000"
          strokeOpacity="0.5"
          strokeWidth="2.4"
          filter={`url(#${id}-inset)`}
        />
      </g>
    </svg>
  );
};

export default Grommet;
