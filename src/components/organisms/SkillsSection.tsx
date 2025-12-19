import * as React from 'react';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import type { SkillCategory } from '@/lib/types/content';

export interface SkillsSectionProps {
  categories: SkillCategory[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  return (
    <section
      id="mu-skills__skills-grid__section--primary"
      className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-12"
    >
      <Heading as="h1" className="mb-6 text-3xl font-semibold">
        Skills
      </Heading>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article
            key={category.category}
            className="rounded-lg border border-border bg-background/80 p-4"
          >
            <Heading as="h2" className="mb-2 text-lg font-semibold">
              {category.category}
            </Heading>
            {category.items?.length ? (
              <ul className="flex flex-wrap gap-1 text-sm">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-foreground/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <Text muted>No skills listed.</Text>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
