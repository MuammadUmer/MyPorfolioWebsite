import type { Metadata } from 'next';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
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
  const projects = getProjects().slice().sort((a, b) => a.title.localeCompare(b.title));

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
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Heading as="h1" className="text-2xl font-semibold md:text-3xl">
        Projects
      </Heading>
      <Text muted className="mt-2 max-w-2xl text-base">
        Selected projects that showcase backend architecture, APIs, cloud-native design, and cross-functional
        collaboration across healthcare, real estate, AI, and logistics.
      </Text>

      <ProjectsGrid projects={projects} />

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(jsonLd)}
      </script>
    </div>
  );
}
