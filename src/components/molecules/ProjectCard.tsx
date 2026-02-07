import AppLink from '@/components/atoms/Link';
import type { Project } from '@/lib/types/content';

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article
      id={`mu-projects__projects-grid__card--${project.slug}`}
      className="animate-fade-in-up rounded-lg border border-border bg-card/80 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <AppLink href={`/projects/${project.slug}`} className="block group">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {project.role}
          {project.company ? ` · ${project.company}` : ''}
          {project.domain ? ` · ${project.domain}` : ''}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.summary}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
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
