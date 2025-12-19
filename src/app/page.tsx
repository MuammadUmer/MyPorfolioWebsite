import HeroSection from '@/components/organisms/HeroSection';
import { getProjects } from '@/lib/services/content';

const YEARS_EXPERIENCE = 6;
const DOMAINS = ['Healthcare', 'Real Estate', 'AI', 'Blockchain', 'Logistics'];

export default function HomePage() {
  const projects = getProjects();
  const featuredProjects = projects.slice(0, 3);
  const totalProjects = projects.length;

  return (
    <div className="flex justify-center px-4 py-8 md:px-6 md:py-12">
      <HeroSection
        featuredProjects={featuredProjects}
        yearsExperience={YEARS_EXPERIENCE}
        totalProjects={totalProjects}
        domains={DOMAINS}
      />
    </div>
  );
}
