import type { Metadata } from 'next';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import { getProjects } from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

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
    <section className="py-20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="animate-fade-in-up mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
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
