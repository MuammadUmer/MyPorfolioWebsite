import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import { getProjects, getProjectBySlug } from '@/lib/services/content';
import type { Project } from '@/lib/types/content';
import { getCanonicalUrl } from '@/lib/seo/site';

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project not found – Muhammad Umer',
      description: 'The requested project case study could not be found.',
    };
  }

  const canonical = getCanonicalUrl(`/projects/${project.slug}`);

  return {
    title: `${project.title} – Case Study | Muhammad Umer`,
    description: project.summary,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${project.title} – Case Study`,
      description: project.summary,
    },
  };
}

function buildProjectJsonLd(project: Project) {
  const canonical = getCanonicalUrl(`/projects/${project.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: project.title,
    description: project.summary,
    url: canonical,
    industry: project.domain,
    creator: {
      '@type': 'Person',
      name: 'Muhammad Umer',
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const jsonLd = buildProjectJsonLd(project as Project);

  return (
    <article
      id={`mu-projects-${project!.slug}__case-study__section--primary`}
      className="mx-auto max-w-5xl px-4 py-10 md:px-6"
    >
      <Heading as="h1" className="text-2xl font-semibold md:text-3xl">
        {project!.title}
      </Heading>
      <Text muted className="mt-2 text-sm md:text-base">
        {project!.role}
        {project!.company ? ` · ${project!.company}` : ''}
        {project!.period ? ` · ${project!.period}` : ''}
        {project!.domain ? ` · ${project!.domain}` : ''}
      </Text>

      <section className="mt-6 space-y-4">
        <Heading as="h2" className="text-lg font-semibold">
          Overview
        </Heading>
        <Text muted>{project!.summary}</Text>
      </section>

      {project!.highlights && project!.highlights.length > 0 && (
        <section className="mt-8 space-y-4">
          <Heading as="h2" className="text-lg font-semibold">
            Key contributions
          </Heading>
          <ul className="list-disc space-y-2 pl-5 text-sm md:text-base">
            {project!.highlights.map((item) => (
              <li key={item} className="text-foreground/80">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project!.techStack && project!.techStack.length > 0 && (
        <section className="mt-8 space-y-3">
          <Heading as="h2" className="text-lg font-semibold">
            Tech stack
          </Heading>
          <div className="flex flex-wrap gap-2">
            {project!.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(jsonLd)}
      </script>
    </article>
  );
}
