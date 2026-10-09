import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import Eyebrow from '@/components/atoms/Eyebrow';
import LinkButton from '@/components/atoms/LinkButton';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import ProjectAccordion from '@/components/objects/ProjectAccordion';
import { translate } from '@/lib/i18n/translate';
import type { Project } from '@/lib/types/content';

export const FEATURED_PROJECT_COUNT = 3;

export interface ProjectsShowcaseProps {
  projects: Project[];
}

/** Home "work" section: hover-expand accordion of the featured projects + link to the full list. */
const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ projects }) => {
  const featured = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <section
      id="mu-home__projects__section--primary"
      aria-labelledby="mu-home__projects__heading--title"
      className="section-pad defer-render"
    >
      <div className="container-page">
        <span id="projects" className="block h-0" />
        <div className="mb-[var(--space-stack)] flex flex-col gap-6">
          <Eyebrow index="03">{translate('nav.projects')}</Eyebrow>
          <SectionHeading
            id="mu-home__projects__heading--title"
            bold={translate('section.projects.bold')}
            italic={translate('section.projects.italic')}
          />
          <Reveal as="p" className="font-mono text-sm text-muted-foreground">
            {translate('projects.hint')}
          </Reveal>
        </div>

        <Reveal>
          <ProjectAccordion projects={featured} idPrefix="mu-home__featured-projects" />
        </Reveal>

        <Reveal delay={100} className="mt-8">
          <LinkButton
            href="/projects"
            variant="secondary"
            size="lg"
            id="mu-home__projects__link--all-projects"
            actionId="act-home__projects__click-all-projects"
          >
            {translate('projects.allProjects', { values: { count: projects.length } })}
            <ArrowRight aria-hidden="true" />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
