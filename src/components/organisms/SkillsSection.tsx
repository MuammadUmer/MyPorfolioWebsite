'use client';

import * as React from 'react';
import type { SkillCategory } from '@/lib/types/content';

export interface SkillsSectionProps {
  categories: SkillCategory[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('All');

  const filters = ['All', ...categories.map((c) => c.category)];

  const visible =
    activeFilter === 'All'
      ? categories
      : categories.filter((c) => c.category === activeFilter);

  return (
    <section
      id="mu-skills__skills-grid__section--primary"
      className="py-20"
    >
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Skills</h1>
        </div>

        {/* Filter bar */}
        <div
          className="animate-fade-in-up flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter skills by category"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                id={`mu-skills__filters__btn--${filter.toLowerCase().replace(/\s+&?\s*/g, '-')}`}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-transparent'
                }`}
                aria-pressed={isActive}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((category) => (
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
