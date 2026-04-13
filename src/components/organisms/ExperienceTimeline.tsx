import * as React from 'react';
import type { Experience } from '@/lib/types/content';

export interface ExperienceTimelineProps {
  items: Experience[];
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ items }) => {
  return (
    <section
      id="mu-experience__timeline__section--primary"
      className="py-20"
    >
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Experience</h1>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-[7px]" />

          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={`${item.company}-${item.period}`}
                className="animate-fade-in-up relative pl-10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">{item.role}</h3>
                    <p className="text-muted-foreground">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {item.period}
                    </p>
                  </div>

                  {item.description ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}

                  {item.responsibilities?.length ? (
                    <ul className="space-y-2">
                      {item.responsibilities.map((resp) => (
                        <li
                          key={resp}
                          className="text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
