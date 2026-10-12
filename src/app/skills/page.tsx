import type { Metadata } from 'next';
import SkillsSection from '@/components/organisms/SkillsSection';
import { getProjects, getSkillCategories } from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Skills – Muhammad Umer',
  description:
    'Skills and tools used by Muhammad Umer across architecture, backend, frontend, cloud, data, AI, testing, blockchain, and integrations.',
  alternates: { canonical: getCanonicalUrl('/skills') },
};

export default function SkillsPage() {
  return (
    <SkillsSection
      page="skills"
      categories={getSkillCategories()}
      projects={getProjects()}
    />
  );
}
