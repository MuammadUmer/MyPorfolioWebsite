'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Project } from '@/lib/types/content';
import ProjectCard from '@/components/molecules/ProjectCard';
import Reveal from '@/components/atoms/Reveal';

export interface ProjectsGridProps {
  projects: Project[];
}

const selectClasses = 'field appearance-none pr-10';
const labelClasses = 'eyebrow mb-2 block';

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const domains = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.domain))).sort(),
    [projects]
  );

  const roles = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.role))).sort(),
    [projects]
  );

  const [domainFilter, setDomainFilter] = React.useState<string>('all');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'default' | 'az' | 'za'>('default');

  const visibleProjects = React.useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesDomain =
        domainFilter === 'all' || project.domain.toLowerCase() === domainFilter.toLowerCase();
      const matchesRole =
        roleFilter === 'all' || project.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesDomain && matchesRole;
    });

    if (sortBy === 'az') {
      return filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === 'za') {
      return filtered.slice().sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [projects, domainFilter, roleFilter, sortBy]);

  return (
    <section
      id="mu-projects__projects-grid__section--primary"
      aria-label="Projects list and filters"
      className="mt-[var(--space-stack)]"
    >
      <div className="surface-card mb-8 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="mu-projects__filters__select--domain" className={labelClasses}>
              Domain
            </label>
            <div className="relative">
              <select
                id="mu-projects__filters__select--domain"
                className={selectClasses}
                value={domainFilter}
                onChange={(event) => setDomainFilter(event.target.value)}
              >
                <option value="all">All domains</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mu-projects__filters__select--role" className={labelClasses}>
              Role
            </label>
            <div className="relative">
              <select
                id="mu-projects__filters__select--role"
                className={selectClasses}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="all">All roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mu-projects__sort__field--order" className={labelClasses}>
              Sort by
            </label>
            <div className="relative">
              <select
                id="mu-projects__sort__field--order"
                className={selectClasses}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'default' | 'az' | 'za')}
              >
                <option value="default">Default</option>
                <option value="az">Title A–Z</option>
                <option value="za">Title Z–A</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No projects found matching your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleProjects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 2) * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsGrid;
