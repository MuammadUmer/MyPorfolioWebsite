import * as React from 'react';
import Eyebrow from '@/components/atoms/Eyebrow';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import { translate } from '@/lib/i18n/translate';
import type { TimelineEntry } from '@/lib/types/content';

export interface ExperienceTimelineProps {
  entries: TimelineEntry[];
  page?: string;
  /** `summary` collapses long bullet lists behind a disclosure; `full` shows everything. */
  density?: 'summary' | 'full';
}

const SUMMARY_BULLETS = 4;

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  entries,
  page = 'home',
  density = 'summary',
}) => {
  const isHome = page === 'home';
  const idPrefix = `mu-${page}__timeline`;
  const headingId = `${idPrefix}__heading--title`;

  return (
    <section
      id={`mu-${page}__experience__section--primary`}
      aria-labelledby={headingId}
      className={`${isHome ? 'section-pad' : 'page-top pb-[var(--space-section)]'} defer-render`}
    >
      <div className="container-page">
        {isHome ? <span id="experience" className="block h-0" /> : null}
        <div className="mb-[var(--space-stack)] flex flex-col gap-6">
          <Eyebrow index="05">{translate('nav.experience')}</Eyebrow>
          <SectionHeading
            id={headingId}
            as={isHome ? 'h2' : 'h1'}
            bold={translate('section.experience.bold')}
            italic={translate('section.experience.italic')}
          />
        </div>

        <div className="relative">
        {/* One spine through every year: left on phones, centred from lg up. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 w-px -translate-x-1/2 lg:left-1/2">
          <span className="timeline-rail absolute inset-0" />
          <span className="timeline-fill absolute inset-0" />
          <span className="timeline-pulse absolute inset-y-0 -left-px w-[3px]" />
        </div>
        <ol className="relative flex flex-col gap-10 lg:gap-14">
          {entries.map((entry, index) => {
            const collapsed = density === 'summary' && entry.bullets.length > SUMMARY_BULLETS + 1;
            const visible = collapsed ? entry.bullets.slice(0, SUMMARY_BULLETS) : entry.bullets;
            const rest = collapsed ? entry.bullets.slice(SUMMARY_BULLETS) : [];
            const tag =
              entry.kind === 'education'
                ? translate('experience.tag.education')
                : translate('experience.tag.experience');

            return (
              <li key={entry.id} className="tl-item" data-side={index % 2 === 0 ? 'left' : 'right'}>
                <div className="tl-rail relative" aria-hidden="true">
                  <div className="tl-dot absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-inverse ring-4 ring-background" />
                </div>

                {entry.year ? (
                  <p aria-hidden="true" className="tl-year">
                    {entry.year}
                  </p>
                ) : null}

                <Reveal
                  as="div"
                  className="tl-card surface-card p-6"
                  id={`${idPrefix}__card--${entry.id}`}
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-deep px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-widest text-deep-foreground">
                      {tag}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {entry.period}
                    </span>
                  </div>

                  <h3 className="t-h3">{entry.title}</h3>
                  <p className="mt-1 text-muted-foreground">
                    {entry.organisation}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </p>

                  {entry.description ? (
                    <p className="mt-4 leading-relaxed text-muted-foreground">{entry.description}</p>
                  ) : null}

                  {entry.bullets.length > 0 ? (
                    <ul className="mt-4 flex flex-col gap-2">
                      {visible.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {rest.length > 0 ? (
                    <details className="group mt-3">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full border border-border-strong px-4 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-open:hidden">
                        {translate('experience.showMore', { values: { count: rest.length } })}
                      </summary>
                      <ul className="flex flex-col gap-2">
                        {rest.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-muted-foreground">
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
