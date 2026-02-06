import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import { getContentService } from '@/lib/services/content-source';

export default async function CmsProjectsExamplePage() {
  const contentService = getContentService();
  const projects = await contentService.getProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Heading as="h1" className="text-2xl font-semibold md:text-3xl">
        CMS-backed projects example
      </Heading>
      <Text muted className="mt-2 max-w-2xl text-sm md:text-base">
        This page uses the content service abstraction, which can read from a headless CMS when
        configured or fall back to local JSON fixtures by default.
      </Text>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="rounded-lg border border-border bg-background/80 p-4 shadow-sm"
          >
            <Heading as="h2" className="text-base font-semibold md:text-lg">
              {project.title}
            </Heading>
            <Text muted className="mt-1 text-xs md:text-sm">
              {project.role}
              {project.company ? ` · ${project.company}` : ''}
              {project.domain ? ` · ${project.domain}` : ''}
            </Text>
            <Text muted className="mt-2 text-xs md:text-sm">
              {project.summary}
            </Text>
          </article>
        ))}
      </div>
    </div>
  );
}
