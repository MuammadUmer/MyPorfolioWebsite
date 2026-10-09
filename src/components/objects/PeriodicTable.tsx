'use client';

import * as React from 'react';
import Link from 'next/link';
import type { SkillTile } from '@/lib/skills/tiles';
import { translate } from '@/lib/i18n/translate';

export interface SkillTileView extends SkillTile {
  usedIn: Array<{ slug: string; title: string }>;
}

export interface PeriodicTableProps {
  tiles: SkillTileView[];
  categories: Array<{ name: string; family: number }>;
  idPrefix: string;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ tiles, categories, idPrefix }) => {
  const [filter, setFilter] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const active = tiles.find((tile) => tile.id === activeId) ?? null;
  const shown = filter ? tiles.filter((tile) => tile.category === filter).length : tiles.length;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setActiveId(null);
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <div
        role="group"
        aria-label="Filter skills by category"
        className="-mx-[var(--space-gutter)] mb-8 flex gap-2 overflow-x-auto px-[var(--space-gutter)] pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <button
          type="button"
          id={`${idPrefix}__chip--all`}
          className="chip shrink-0"
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
        >
          {translate('skills.filter.all')}
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            id={`${idPrefix}__chip--${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
            className={`chip family-${category.family} shrink-0`}
            aria-pressed={filter === category.name}
            onClick={() => setFilter(filter === category.name ? null : category.name)}
          >
            <span className="fam-dot" aria-hidden="true" />
            {category.name}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {translate('skills.showing', {
          values: { shown, total: tiles.length, category: filter ?? translate('skills.filter.all') },
        })}
      </p>

      <div className="grid gap-8 lg:grid-cols-12">
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2 lg:col-span-8">
          {tiles.map((tile) => {
            const dimmed = filter !== null && tile.category !== filter;
            return (
              <li key={tile.id} className={tile.wide ? 'col-span-2' : undefined}>
                <button
                  type="button"
                  id={`${idPrefix}__card--${tile.id}`}
                  className={`skill-tile family-${tile.family} h-full w-full`}
                  data-dim={dimmed}
                  aria-pressed={activeId === tile.id}
                  onMouseEnter={() => setActiveId(tile.id)}
                  onFocus={() => setActiveId(tile.id)}
                  onClick={() => setActiveId(activeId === tile.id ? null : tile.id)}
                >
                  <span aria-hidden="true" className="font-mono text-[0.75rem] leading-none opacity-80">
                    {String(tile.number).padStart(2, '0')}
                  </span>
                  {tile.symbol ? (
                    <span aria-hidden="true" className="text-[1.75rem] font-bold leading-none tracking-tight">
                      {tile.symbol}
                    </span>
                  ) : null}
                  <span className="text-xs leading-tight">{tile.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside
          aria-live="polite"
          aria-label="Skill details"
          className="surface-deep p-6 lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
        >
          {active ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <span aria-hidden="true" className="text-5xl font-bold tracking-tight">
                  {active.symbol ?? String(active.number).padStart(2, '0')}
                </span>
                <span className="text-deep-muted">{String(active.number).padStart(2, '0')}</span>
              </div>
              <p className="text-lg font-semibold">{active.label}</p>
              <p className="text-deep-muted">{active.category}</p>
              {active.usedIn.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-deep-muted">
                    {translate('skills.usedIn')}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {active.usedIn.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {project.title.split(' – ')[0]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-deep-muted">{translate('skills.hint')}</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PeriodicTable;
