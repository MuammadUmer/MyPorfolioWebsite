'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { translate } from '@/lib/i18n/translate';
import type { Project } from '@/lib/types/content';

export interface ProjectAccordionProps {
  /** Every project, in order. Only `visibleCount` panels are shown at a time and they rotate through this list. */
  projects: Project[];
  idPrefix: string;
  visibleCount?: number;
}

const HIGHLIGHT_COUNT = 3;

function shortTitle(title: string): string {
  return title.split(' – ')[0] ?? title;
}

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({
  projects,
  idPrefix,
  visibleCount = 3,
}) => {
  const total = projects.length;
  const shown = Math.min(visibleCount, total);

  const [slots, setSlots] = React.useState<number[]>(() =>
    Array.from({ length: shown }, (_, index) => index)
  );
  const [cursor, setCursor] = React.useState(total > 0 ? shown % total : 0);
  const [openSlug, setOpenSlug] = React.useState(projects[0]?.slug ?? '');
  const [announcement, setAnnouncement] = React.useState('');
  const [focusSlug, setFocusSlug] = React.useState<string | null>(null);
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    if (!focusSlug) return;
    buttonRefs.current[focusSlug]?.focus();
    setFocusSlug(null);
  }, [focusSlug]);

  const canRotate = total > shown;
  const visible = slots.map((index) => projects[index]);

  const rotate = (position: number) => {
    const removed = visible[position];
    let next = cursor;
    for (let guard = 0; guard < total && slots.includes(next); guard += 1) {
      next = (next + 1) % total;
    }

    const nextSlots = [...slots.slice(0, position), ...slots.slice(position + 1), next];
    const added = projects[next];
    setSlots(nextSlots);
    setCursor((next + 1) % total);

    if (removed.slug === openSlug) {
      const replacement = projects[nextSlots[Math.min(position, nextSlots.length - 1)]];
      setOpenSlug(replacement.slug);
      setFocusSlug(replacement.slug);
    }
    setAnnouncement(`${shortTitle(removed.title)} removed. ${shortTitle(added.title)} added.`);
  };

  const move = (from: number, delta: number) => {
    const target = visible[(from + delta + visible.length) % visible.length];
    setOpenSlug(target.slug);
    setFocusSlug(target.slug);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, position: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(position, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(position, -1);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:h-[720px] lg:flex-row">
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {visible.map((project, position) => {
        const open = project.slug === openSlug;
        const buttonId = `${idPrefix}__btn--${project.slug}`;
        const panelId = `${idPrefix}__panel--${project.slug}`;
        const title = shortTitle(project.title);

        return (
          <article
            key={project.slug}
            id={`${idPrefix}__card--${project.slug}`}
            className={`accordion-panel surface-card animate-fade-in-up relative flex flex-col ${
              open ? 'lg:flex-[5]' : 'lg:min-w-[88px] lg:flex-1'
            }`}
            onMouseEnter={() => setOpenSlug(project.slug)}
          >
            <h3 className="m-0">
              <button
                ref={(node) => {
                  buttonRefs.current[project.slug] = node;
                }}
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenSlug(project.slug)}
                onFocus={() => setOpenSlug(project.slug)}
                onKeyDown={(event) => handleKeyDown(event, position)}
                className={`flex w-full items-center gap-4 p-5 pr-20 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring ${
                  open ? '' : 'lg:absolute lg:inset-0 lg:flex-col lg:items-start lg:justify-start lg:gap-6 lg:px-5 lg:pb-20 lg:pr-5 lg:pt-6'
                }`}
              >
                <span className="eyebrow" aria-hidden="true">
                  {String(position + 1).padStart(2, '0')}
                </span>
                <span
                  className={
                    open
                      ? 't-h3 flex-1'
                      : 'flex-1 font-semibold lg:flex-none lg:rotate-180 lg:[writing-mode:vertical-rl]'
                  }
                >
                  {title}
                </span>
              </button>
            </h3>

            {canRotate ? (
              <button
                type="button"
                id={`${idPrefix}__btn--next-${project.slug}`}
                aria-label={`Remove ${title} and show the next project`}
                onClick={() => rotate(position)}
                className={`absolute z-10 grid h-11 w-11 place-items-center rounded-full bg-inverse text-inverse-foreground transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  open
                    ? 'right-4 top-4'
                    : 'right-4 top-4 lg:bottom-4 lg:left-1/2 lg:right-auto lg:top-auto lg:-translate-x-1/2 lg:hover:scale-105'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="animate-fade-in-up grid gap-6 px-5 pb-5 lg:min-w-[640px] lg:grid-cols-[3fr_2fr] lg:overflow-y-auto lg:[scrollbar-width:thin]"
            >
              <div className="flex flex-col gap-4">
                <p className="eyebrow">
                  {project.domain}
                  {project.company ? ` · ${project.company}` : ''}
                </p>
                <p className="t-h4">{project.title}</p>
                <p className="text-muted-foreground">{project.summary}</p>
                <ul className="flex flex-col gap-3 text-sm">
                  {project.highlights.slice(0, HIGHLIGHT_COUNT).map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="line-clamp-3">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <Link
                    href={`/projects/${project.slug}`}
                    id={`${idPrefix}__link--${project.slug}`}
                    className="btn btn-primary inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {translate('projects.viewCaseStudy')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="surface-deep flex flex-col gap-4 p-5">
                <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2">
                  <dt className="text-deep-muted">Role</dt>
                  <dd>{project.role}</dd>
                  {project.company ? (
                    <>
                      <dt className="text-deep-muted">Company</dt>
                      <dd>{project.company}</dd>
                    </>
                  ) : null}
                  {project.period ? (
                    <>
                      <dt className="text-deep-muted">Period</dt>
                      <dd>{project.period}</dd>
                    </>
                  ) : null}
                  <dt className="text-deep-muted">Domain</dt>
                  <dd>{project.domain}</dd>
                  {project.status === 'in-progress' ? (
                    <>
                      <dt className="text-deep-muted">Status</dt>
                      <dd>{translate('projects.inProgress')}</dd>
                    </>
                  ) : null}
                </dl>
                <div>
                  <p className="mb-2 text-deep-muted">Stack</p>
                  <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-1 min-[1280px]:grid-cols-2">
                    {project.techStack.map((tech) => (
                      <li key={tech} className="break-words">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProjectAccordion;
