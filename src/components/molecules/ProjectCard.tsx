import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import AppLink from '@/components/atoms/Link';
import type { Project } from '@/lib/types/content';

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article
      id={`mu-projects__projects-grid__card--${project.slug}`}
      className="rounded-lg border border-border bg-background/80 p-4 shadow-sm transition-colors hover:border-accent/70"
    >
      <Heading as="h2" className="text-base font-semibold md:text-lg">
        <AppLink href={`/projects/${project.slug}`} className="hover:underline">
          {project.title}
        </AppLink>
      </Heading>
      <Text muted className="mt-1 text-xs md:text-sm">
        {project.role}
        {project.company ? ` · ${project.company}` : ''}
        {project.domain ? ` · ${project.domain}` : ''}
      </Text>
      <Text muted className="mt-2 text-xs md:text-sm">
        {project.summary}
      </Text>
      {project.techStack && project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {project.techStack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground/80"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
