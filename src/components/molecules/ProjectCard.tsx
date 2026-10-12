import AppLink from '@/components/atoms/Link';
import { translate } from '@/lib/i18n/translate';
import type { Project } from '@/lib/types/content';

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article
      id={`mu-projects__projects-grid__card--${project.slug}`}
      className="surface-card h-full transition-colors duration-200 hover:border-border-strong"
    >
      <AppLink href={`/projects/${project.slug}`} className="group block h-full p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="t-h4 font-semibold transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          {project.status === 'in-progress' && (
            <span className="badge-progress shrink-0">{translate('projects.inProgress')}</span>
          )}
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          {project.role}
          {project.company ? ` · ${project.company}` : ''}
          {project.domain ? ` · ${project.domain}` : ''}
        </p>
        <p className="mb-4 line-clamp-2 text-sm font-normal text-muted-foreground">
          {project.summary}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 6).map((tech) => (
              <span key={tech} className="tech-chip">
                {tech}
              </span>
            ))}
          </div>
        )}
      </AppLink>
    </article>
  );
};

export default ProjectCard;
