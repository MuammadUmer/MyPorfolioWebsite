import * as React from 'react';
import type { SkillCategory } from '@/lib/types/content';

export interface SkillsSectionProps {
  categories: SkillCategory[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  return (
    <section
      id="mu-skills__skills-grid__section--primary"
      className="py-20"
    >
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Skills</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <article
              key={category.category}
              className="animate-fade-in-up rounded-lg border border-border bg-card/80 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <h2 className="text-lg font-semibold mb-4">
                {category.category}
              </h2>
              {category.items?.length ? (
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills listed.</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
