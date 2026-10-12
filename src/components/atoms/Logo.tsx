import * as React from 'react';

export interface LogoProps {
  className?: string;
}

const polygonPoints = (sides: number, radius: number) =>
  Array.from({ length: sides }, (_, k) => {
    const angle = (Math.PI / 180) * (-90 + (360 / sides) * k);
    return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

const HEX_30 = polygonPoints(6, 30);
const HEX_32 = polygonPoints(6, 32);
const HEPTAGON_16 = polygonPoints(7, 16);
const SPOKES = Array.from({ length: 7 }, (_, k) => {
  const angle = (Math.PI / 180) * (-90 + (360 / 7) * k);
  return { x: +(11 * Math.cos(angle)).toFixed(2), y: +(11 * Math.sin(angle)).toFixed(2) };
});

const M_PATH = 'M80 310 V100 L180 210 L280 100 V310';
const U_PATH = 'M280 100 H470 M360 100 V250 Q360 300 410 300 H420 Q470 300 470 250 V100';
const RING_COLORS = ['#EA4335', '#FBBC04', '#34A853', '#4285F4'];

const nodeStroke = { stroke: 'var(--logo-trace)', strokeWidth: 4 } as const;

/**
 * "MU" drawn as a circuit: the two letters are traces and the tools I work with sit on the junctions
 * (Node.js, Google Cloud, Docker, Kubernetes, a server, React and an AI network). Colours come from the
 * `--logo-*` tokens so it follows the light/dark theme; brand icons keep their own colours.
 */
const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="40 56 470 300"
    className={className}
    aria-hidden="true"
    focusable="false"
    data-logo="mu-circuit"
  >
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={M_PATH} stroke="var(--logo-trace)" strokeWidth={12} />
      <path d={U_PATH} stroke="var(--logo-trace)" strokeWidth={12} />
      <g className="logo-lit">
        <path d={M_PATH} stroke="var(--logo-glow)" strokeWidth={4} opacity={0.9} />
        <path d={U_PATH} stroke="var(--logo-glow)" strokeWidth={4} opacity={0.9} />
      </g>
      <path className="logo-pulse" pathLength={400} d={M_PATH} stroke="#fff" strokeWidth={4} />
      <path
        className="logo-pulse"
        pathLength={400}
        d={U_PATH}
        stroke="#fff"
        strokeWidth={4}
        style={{ animationDelay: '-2s' }}
      />
    </g>

    <g transform="translate(80,100)">
      <polygon points={HEX_30} fill="#539E43" strokeLinejoin="round" {...nodeStroke} />
      <text x={0} y={-1} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize={13} fontWeight={700} fill="#fff">
        node
      </text>
      <text x={0} y={12} textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize={9} fontWeight={700} fill="#fff">
        JS
      </text>
    </g>

    <g transform="translate(180,210)">
      <polygon points={HEX_32} fill="var(--logo-node)" strokeLinejoin="round" {...nodeStroke} />
      {RING_COLORS.map((color, k) => (
        <circle
          key={color}
          r={11}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray="17.3 51.8"
          strokeDashoffset={-17.3 * k}
          transform="rotate(-45)"
        />
      ))}
      <circle r={4} fill="var(--logo-trace)" />
    </g>

    <g transform="translate(280,100)">
      <circle r={27} fill="var(--logo-node)" {...nodeStroke} />
      <g fill="#2496ED" transform="translate(-1,2) scale(.95)">
        <rect x={-12} y={-6} width={5.5} height={5.5} />
        <rect x={-5.5} y={-6} width={5.5} height={5.5} />
        <rect x={1} y={-6} width={5.5} height={5.5} />
        <rect x={7.5} y={-6} width={5.5} height={5.5} />
        <rect x={-5.5} y={-12.5} width={5.5} height={5.5} />
        <rect x={1} y={-12.5} width={5.5} height={5.5} />
        <path d="M-17 0.5 H16 Q17 -3 20 -3.5 Q21 -1 23 -1 Q22 3 17 5 Q9 12 -6 11 Q-15 10 -17 3 Z" />
      </g>
    </g>

    <g transform="translate(360,190)">
      <circle r={23} fill="var(--logo-node)" {...nodeStroke} />
      <polygon points={HEPTAGON_16} fill="#326CE5" strokeLinejoin="round" />
      <g stroke="#fff" strokeWidth={1.8} strokeLinecap="round" fill="none">
        <circle r={6.5} />
        {SPOKES.map(({ x, y }) => (
          <line key={`${x}:${y}`} x1={0} y1={0} x2={x} y2={y} />
        ))}
      </g>
      <circle r={2} fill="#fff" />
    </g>

    <g transform="translate(470,100)">
      <rect x={-25} y={-25} width={50} height={50} rx={10} fill="var(--logo-node)" {...nodeStroke} />
      <g fill="none" stroke="#5B9BFF" strokeWidth={2}>
        <rect x={-14} y={-15} width={28} height={8} rx={2} />
        <rect x={-14} y={-4} width={28} height={8} rx={2} />
        <rect x={-14} y={7} width={28} height={8} rx={2} />
      </g>
      <g fill="#5B9BFF">
        <circle cx={-9} cy={-11} r={1.4} />
        <circle cx={-9} cy={0} r={1.4} />
        <circle cx={-9} cy={11} r={1.4} />
      </g>
    </g>

    <g transform="translate(80,312)">
      <circle r={29} fill="#0c2a6e" {...nodeStroke} />
      <g stroke="#7fc4ff" strokeWidth={1.2} opacity={0.85}>
        {[-10, 10].flatMap((ly) =>
          [-15, 15].flatMap((lx) =>
            [-15, 0, 15].map((my) => (
              <line key={`${lx}:${ly}:${my}`} x1={lx} y1={ly} x2={0} y2={my} />
            ))
          )
        )}
      </g>
      <g fill="#cfe9ff">
        {[
          [-15, -10],
          [-15, 10],
          [0, -15],
          [0, 0],
          [0, 15],
          [15, -10],
          [15, 10],
        ].map(([cx, cy]) => (
          <circle key={`${cx}:${cy}`} cx={cx} cy={cy} r={3} />
        ))}
      </g>
    </g>

    <g transform="translate(280,312)">
      <circle r={27} fill="var(--logo-node)" {...nodeStroke} />
      <g fill="none" stroke="#61DAFB" strokeWidth={2}>
        <ellipse rx={16} ry={6.3} />
        <ellipse rx={16} ry={6.3} transform="rotate(60)" />
        <ellipse rx={16} ry={6.3} transform="rotate(120)" />
      </g>
      <circle r={3} fill="#61DAFB" />
    </g>
  </svg>
);

export default Logo;
