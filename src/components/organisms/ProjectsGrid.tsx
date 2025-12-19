'use client';

import * as React from 'react';
import Text from '@/components/atoms/Text';
import type { Project } from '@/lib/types/content';
import ProjectCard from '@/components/molecules/ProjectCard';

export interface ProjectsGridProps {
  projects: Project[];
}

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
  const [sortBy, setSortBy] = React.useState<'title-asc' | 'title-desc'>('title-asc');

  const visibleProjects = React.useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesDomain =
        domainFilter === 'all' || project.domain.toLowerCase() === domainFilter.toLowerCase();
      const matchesRole =
        roleFilter === 'all' || project.role.toLowerCase().includes(roleFilter.toLowerCase());
      return matchesDomain && matchesRole;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return a.title.localeCompare(b.title);
    });
  }, [projects, domainFilter, roleFilter, sortBy]);

  return (
    <section
      id="mu-projects__projects-grid__section--primary"
      aria-label="Projects list and filters"
      className="mt-8 space-y-6"
    >
      <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-background/80 p-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="mu-projects__filters__select--domain"
            className="text-sm font-medium text-foreground"
          >
            Filter by domain
          </label>
          <select
            id="mu-projects__filters__select--domain"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
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
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="mu-projects__filters__select--role"
            className="text-sm font-medium text-foreground"
          >
            Filter by role
          </label>
          <select
            id="mu-projects__filters__select--role"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
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
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="mu-projects__sort__field--order"
            className="text-sm font-medium text-foreground"
          >
            Sort by
          </label>
          <select
            id="mu-projects__sort__field--order"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as 'title-asc' | 'title-desc')
            }
          >
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
          </select>
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <Text muted>No projects match the selected filters.</Text>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsGrid;
