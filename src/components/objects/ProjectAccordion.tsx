'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { translate } from '@/lib/i18n/translate';
import type { Project } from '@/lib/types/content';

export interface ProjectAccordionProps {
  projects: Project[];
  idPrefix: string;
}

function shortTitle(title: string): string {
  return title.split(' – ')[0] ?? title;
}

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({ projects, idPrefix }) => {
  const [openIndex, setOpenIndex] = React.useState(0);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + projects.length) % projects.length;
    setOpenIndex(next);
    buttonRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(index, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(index, -1);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:h-[640px] lg:flex-row">
      {projects.map((project, index) => {
        const open = index === openIndex;
        const buttonId = `${idPrefix}__btn--${project.slug}`;
        const panelId = `${idPrefix}__panel--${project.slug}`;
        const extraTech = Math.max(0, project.techStack.length - 8);

        return (
          <article
            key={project.slug}
            id={`${idPrefix}__card--${project.slug}`}
            className={`accordion-panel surface-card relative flex flex-col ${
              open ? 'lg:flex-[5]' : 'lg:min-w-[88px] lg:flex-1'
            }`}
            onMouseEnter={() => setOpenIndex(index)}
          >
            <h3 className="m-0">
              <button
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(index)}
                onFocus={() => setOpenIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`flex w-full items-center gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring ${
                  open ? '' : 'lg:absolute lg:inset-0 lg:flex-col lg:justify-between lg:py-6'
                }`}
              >
                <span className="eyebrow" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={
                    open
                      ? 't-h3 flex-1'
                      : 'flex-1 font-semibold lg:flex-none lg:rotate-180 lg:[writing-mode:vertical-rl]'
                  }
                >
                  {shortTitle(project.title)}
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-inverse text-inverse-foreground"
                >
                  <Plus
                    className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="animate-fade-in-up grid gap-6 px-5 pb-5 lg:min-w-[640px] lg:grid-cols-2 lg:overflow-y-auto"
            >
              <div className="flex flex-col gap-4">
                <p className="eyebrow">
                  {project.domain}
                  {project.company ? ` · ${project.company}` : ''}
                </p>
                <p className="t-h4">{project.title}</p>
                <p className="text-muted-foreground">{project.summary}</p>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {project.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="line-clamp-3">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 8).map((tech) => (
                    <span key={tech} className="tech-chip">
                      {tech}
                    </span>
                  ))}
                  {extraTech > 0 ? <span className="tech-chip">+{extraTech}</span> : null}
                </div>
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
                  <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
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
