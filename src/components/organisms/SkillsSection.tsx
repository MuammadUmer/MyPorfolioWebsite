import * as React from 'react';
import Eyebrow from '@/components/atoms/Eyebrow';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import PeriodicTable, { type SkillTileView } from '@/components/objects/PeriodicTable';
import { translate } from '@/lib/i18n/translate';
import { FAMILY_COUNT, buildSkillTiles, projectsUsing } from '@/lib/skills/tiles';
import type { Project, SkillCategory } from '@/lib/types/content';

export interface SkillsSectionProps {
  categories: SkillCategory[];
  projects: Project[];
  page?: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ categories, projects, page = 'home' }) => {
  const isHome = page === 'home';
  const idPrefix = `mu-${page}__skills`;
  const headingId = `${idPrefix}__heading--title`;

  const tiles: SkillTileView[] = buildSkillTiles(categories).map((tile) => ({
    ...tile,
    usedIn: projectsUsing(tile.label, projects).map((project) => ({
      slug: project.slug,
      title: project.title,
    })),
  }));

  const familyList = categories.map((category, index) => ({
    name: category.category,
    family: (index % FAMILY_COUNT) + 1,
  }));

  return (
    <section
      id={`${idPrefix}__section--primary`}
      aria-labelledby={headingId}
      className={`${isHome ? 'section-pad' : 'page-top pb-[var(--space-section)]'} defer-render`}
    >
      <div className="container-page">
        {isHome ? <span id="skills" className="block h-0" /> : null}
        <div className="mb-[var(--space-stack)] flex flex-col gap-6">
          <Eyebrow index="02">{translate('nav.skills')}</Eyebrow>
          <SectionHeading
            id={headingId}
            as={isHome ? 'h2' : 'h1'}
            bold={translate('section.skills.bold')}
            italic={translate('section.skills.italic')}
          />
          <Reveal as="p" className="font-mono text-sm text-muted-foreground">
            {translate('skills.summary', {
              values: { items: tiles.length, families: categories.length },
            })}
          </Reveal>
        </div>

        <Reveal>
          <PeriodicTable tiles={tiles} categories={familyList} idPrefix={idPrefix} />
        </Reveal>
      </div>
    </section>
  );
};

export default SkillsSection;
