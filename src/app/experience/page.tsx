import type { Metadata } from 'next';
import ExperienceTimeline from '@/components/organisms/ExperienceTimeline';
import { getTimeline } from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Experience – Muhammad Umer',
  description:
    'Professional experience and education of Muhammad Umer: Euroko International, Freelance, and F3 Technologies.',
  alternates: { canonical: getCanonicalUrl('/experience') },
};

export default function ExperiencePage() {
  return <ExperienceTimeline page="experience" density="full" entries={getTimeline()} />;
}
