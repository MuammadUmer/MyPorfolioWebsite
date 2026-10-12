'use client';

import * as React from 'react';

export interface HighlightItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface HighlightListProps {
  items: HighlightItem[];
  idPrefix: string;
  label: string;
}

/** Numbered list where a single inverse bar glides to the hovered/focused row. */
const HighlightList: React.FC<HighlightListProps> = ({ items, idPrefix, label }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [bar, setBar] = React.useState({ y: 0, h: 0 });
  const rowRefs = React.useRef<Record<string, HTMLLIElement | null>>({});

  const activate = (id: string) => {
    const row = rowRefs.current[id];
    if (!row) return;
    setBar({ y: row.offsetTop, h: row.offsetHeight });
    setActiveId(id);
  };

  const clear = () => setActiveId(null);

  return (
    <div
      className="relative"
      onMouseLeave={clear}
      style={
        {
          '--bar-y': `${bar.y}px`,
          '--bar-h': `${bar.h}px`,
          '--bar-o': activeId ? 1 : 0,
        } as React.CSSProperties
      }
    >
      <div aria-hidden="true" className="highlight-bar" />
      <ul aria-label={label} className="divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <li
          key={item.id}
          ref={(node) => {
            rowRefs.current[item.id] = node;
          }}
          id={`${idPrefix}__item--${item.id}`}
          tabIndex={0}
          data-active={activeId === item.id}
          className="highlight-row grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-5 py-5 focus-visible:outline-2 focus-visible:outline-ring sm:grid-cols-[3rem_1fr_auto]"
          onMouseEnter={() => activate(item.id)}
          onFocus={() => activate(item.id)}
          onBlur={clear}
        >
          <span className="eyebrow highlight-muted" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0">
            <span className="t-h4 block">{item.title}</span>
            <span className="highlight-muted block text-sm text-muted-foreground">{item.subtitle}</span>
          </span>
          {item.badge ? <span className="badge-progress">{item.badge}</span> : null}
        </li>
      ))}
      </ul>
    </div>
  );
};

export default HighlightList;
