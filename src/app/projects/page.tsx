import type { Metadata } from 'next';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import Eyebrow from '@/components/atoms/Eyebrow';
import SectionHeading from '@/components/atoms/SectionHeading';
import { getProjects } from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';
import { translate } from '@/lib/i18n/translate';

export const metadata: Metadata = {
  title: 'Projects – Muhammad Umer | Case Studies',
  description:
    'Case studies of backend, cloud, healthcare, AI, and real estate projects delivered by Muhammad Umer.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  openGraph: {
    type: 'website',
    url: getCanonicalUrl('/projects'),
    title: 'Projects – Muhammad Umer | Case Studies',
    description:
      'Explore detailed case studies of high-impact projects across healthcare, AI, logistics, and real estate.',
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((project, index) => ({
      '@type': 'Project',
      position: index + 1,
      url: getCanonicalUrl(`/projects/${project.slug}`),
      name: project.title,
      description: project.summary,
    })),
  };

  return (
    <section className="page-top pb-[var(--space-section)]">
      <div className="container-page">
        <div className="flex flex-col gap-6">
          <Eyebrow>{translate('nav.projects')}</Eyebrow>
          <SectionHeading
            as="h1"
            bold={translate('section.projects.bold')}
            italic={translate('section.projects.italic')}
          />
          <p className="t-lead max-w-[var(--measure)] text-muted-foreground">
            Selected projects that showcase backend architecture, APIs, cloud-native design, and cross-functional
            collaboration across healthcare, real estate, AI, and logistics.
          </p>
        </div>

        <ProjectsGrid projects={projects} />

        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      </div>
    </section>
  );
}
