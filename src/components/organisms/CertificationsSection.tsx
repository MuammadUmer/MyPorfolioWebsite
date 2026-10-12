import * as React from 'react';
import Eyebrow from '@/components/atoms/Eyebrow';
import Reveal from '@/components/atoms/Reveal';
import SectionHeading from '@/components/atoms/SectionHeading';
import HighlightList from '@/components/objects/HighlightList';
import { translate } from '@/lib/i18n/translate';
import { slugify } from '@/lib/services/slug';
import type { Certification } from '@/lib/types/content';

export interface CertificationsSectionProps {
  certifications: Certification[];
  page?: string;
  /** Home renders an `h2`; a standalone page can pass `h1`. */
  headingLevel?: 'h1' | 'h2';
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  page = 'home',
  headingLevel = 'h2',
}) => {
  const isHome = page === 'home';
  const idPrefix = `mu-${page}__certifications`;
  const headingId = `${idPrefix}__heading--title`;

  return (
    <section
      id={`${idPrefix}__section--primary`}
      aria-labelledby={headingId}
      className={`${isHome ? 'section-pad' : 'pb-[var(--space-section)]'} defer-render`}
    >
      <div className="container-page grid grid-cols-12 gap-x-[var(--space-gutter)] gap-y-[var(--space-stack)]">
        {isHome ? <span id="certifications" className="col-span-12 block h-0" /> : null}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
          <Eyebrow index={isHome ? "04" : undefined}>{translate('section.certifications.bold')}</Eyebrow>
          <SectionHeading
            id={headingId}
            as={headingLevel}
            className="t-h2-detail"
            bold={translate('section.certifications.bold')}
            italic={translate('section.certifications.italic')}
          />
          <Reveal as="p" className="font-mono text-sm text-muted-foreground">
            {translate('certifications.summary', { values: { count: certifications.length } })}
          </Reveal>
        </div>
        <Reveal className="col-span-12 lg:col-span-7">
          <HighlightList
            label={translate('section.certifications.bold')}
            idPrefix={idPrefix}
            items={certifications.map((certification) => ({
              id: slugify(certification.name),
              title: certification.name,
              subtitle: certification.issuer,
              badge:
                certification.status === 'in-progress'
                  ? translate('projects.inProgress')
                  : undefined,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
};

export default CertificationsSection;
