import * as React from 'react';
import Eyebrow from '@/components/atoms/Eyebrow';
import Reveal from '@/components/atoms/Reveal';
import { slugify } from '@/lib/services/slug';
import { translate } from '@/lib/i18n/translate';
import type { Education } from '@/lib/types/content';

export interface EducationListProps {
  education: Education[];
  page?: string;
}

/** Standalone education block used on the About page (Home shows education inside the timeline). */
const EducationList: React.FC<EducationListProps> = ({ education, page = 'about' }) => {
  if (education.length === 0) return null;
  const idPrefix = `mu-${page}__education`;

  return (
    <section
      id={`${idPrefix}__section--primary`}
      aria-labelledby={`${idPrefix}__heading--title`}
      className="pb-[var(--space-section)]"
    >
      <div className="container-page flex flex-col gap-6">
        <Eyebrow>{translate('experience.tag.education')}</Eyebrow>
        <h2 id={`${idPrefix}__heading--title`} className="t-h3">
          {translate('experience.tag.education')}
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {education.map((item) => (
            <Reveal
              as="li"
              key={`${item.degree}-${item.institution}`}
              id={`${idPrefix}__item--${slugify(item.institution)}`}
              className="surface-card p-6"
            >
              <p className="t-h4 font-semibold">{item.degree}</p>
              <p className="mt-1 text-muted-foreground">
                {item.institution} · {item.period}
              </p>
              {item.details?.length ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EducationList;
