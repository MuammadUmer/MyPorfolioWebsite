import * as React from 'react';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import type { Experience } from '@/lib/types/content';

export interface ExperienceTimelineProps {
  items: Experience[];
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ items }) => {
  return (
    <section
      id="mu-experience__timeline__section--primary"
      className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-12"
    >
      <Heading as="h1" className="mb-6 text-3xl font-semibold">
        Experience
      </Heading>
      <ol className="space-y-6 border-l border-border pl-4 md:pl-6">
        {items.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative pl-4">
            <span className="absolute -left-1.5 top-1 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <Heading as="h3" className="text-lg font-semibold">
              {item.role}
            </Heading>
            <Text muted className="text-sm">
              {item.company}
              {item.location ? ` · ${item.location}` : ''}
            </Text>
            <Text muted className="mt-1 text-xs uppercase tracking-wide">
              {item.period}
            </Text>
            {item.responsibilities?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-foreground/80">
                {item.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ExperienceTimeline;
