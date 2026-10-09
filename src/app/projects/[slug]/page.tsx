import type { Metadata } from 'next';
import { getProjects, getProjectBySlug } from '@/lib/services/content';
import type { Project } from '@/lib/types/content';
import { getCanonicalUrl } from '@/lib/seo/site';
import AppLink from '@/components/atoms/Link';
import Eyebrow from '@/components/atoms/Eyebrow';
import { translate } from '@/lib/i18n/translate';
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

const backLinkClasses =
  'inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground';

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(normalizeSlug(slug));

  if (!project) {
    return (
      <section className="page-top pb-[var(--space-section)]">
        <div className="container-page text-center">
          <h1 className="t-h3 mb-4">Project not found</h1>
          <AppLink href="/projects" className={backLinkClasses}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </AppLink>
        </div>
      </section>
    );
  }

  const jsonLd = buildProjectJsonLd(project);
  const meta: Array<[string, string]> = [['Role', project.role]];
  if (project.company) meta.push(['Company', project.company]);
  if (project.period) meta.push(['Period', project.period]);
  if (project.domain) meta.push(['Domain', project.domain]);

  return (
    <section className="page-top pb-[var(--space-section)]">
      <article
        id={`mu-projects-${project.slug}__case-study__section--primary`}
        className="container-page"
      >
        <div className="animate-fade-in-up mb-8">
          <AppLink href="/projects" variant="muted" className={backLinkClasses}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </AppLink>
        </div>

        <div className="grid gap-x-[var(--space-gutter)] gap-y-[var(--space-stack)] lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="animate-fade-in-up mb-[var(--space-stack)] flex flex-col gap-4" style={{ animationDelay: '0.1s' }}>
              <Eyebrow>{project.domain}</Eyebrow>
              <h1 className="t-h2-detail">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <p>
                  {project.role}
                  {project.company ? ` · ${project.company}` : ''}
                  {project.period ? ` · ${project.period}` : ''}
                  {project.domain ? ` · ${project.domain}` : ''}
                </p>
                {project.status === 'in-progress' && (
                  <span className="badge-progress">{translate('projects.inProgress')}</span>
                )}
              </div>
            </div>

            <div className="animate-fade-in-up mb-[var(--space-stack)]" style={{ animationDelay: '0.2s' }}>
              <h2 className="t-h3 mb-4">Overview</h2>
              <p className="t-lead max-w-[var(--measure)] text-muted-foreground">{project.summary}</p>
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div className="animate-fade-in-up mb-[var(--space-stack)]" style={{ animationDelay: '0.3s' }}>
                <h2 className="t-h3 mb-4">Key Contributions</h2>
                <ul className="flex max-w-[var(--measure)] flex-col gap-3">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="t-h3 mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-chip min-h-8 px-3 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="surface-deep p-6 lg:sticky lg:top-28">
              <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-3">
                {meta.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-deep-muted">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      </article>
    </section>
  );
}
