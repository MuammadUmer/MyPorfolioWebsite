import type { Metadata } from 'next';
import { getProjects, getProjectBySlug } from '@/lib/services/content';
import type { Project } from '@/lib/types/content';
import { getCanonicalUrl } from '@/lib/seo/site';
import AppLink from '@/components/atoms/Link';
import { ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function normalizeSlug(rawSlug: string): string {
  const decoded = decodeURIComponent(rawSlug);
  return decoded.replace(/\.+$/, '');
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(normalizeSlug(slug));

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

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(normalizeSlug(slug));

  if (!project) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <AppLink
            href="/projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Projects
          </AppLink>
        </div>
      </section>
    );
  }

  const jsonLd = buildProjectJsonLd(project as Project);

  return (
    <section className="py-20">
      <article
        id={`mu-projects-${project!.slug}__case-study__section--primary`}
        className="mx-auto max-w-3xl px-4 md:px-6"
      >
        {/* Back button */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0s' }}>
          <AppLink
            href="/projects"
            variant="muted"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Projects
          </AppLink>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {project!.title}
          </h1>
          <p className="text-muted-foreground">
            {project!.role}
            {project!.company ? ` · ${project!.company}` : ''}
            {project!.period ? ` · ${project!.period}` : ''}
            {project!.domain ? ` · ${project!.domain}` : ''}
          </p>
        </div>

        {/* Overview */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-lg text-muted-foreground">{project!.summary}</p>
        </div>

        {/* Key Contributions */}
        {project!.highlights && project!.highlights.length > 0 && (
          <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-4">Key Contributions</h2>
            <ul className="space-y-3">
              {project!.highlights.map((item) => (
                <li
                  key={item}
                  className="text-muted-foreground flex items-start gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {project!.techStack && project!.techStack.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project!.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-mono border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      </article>
    </section>
  );
}
