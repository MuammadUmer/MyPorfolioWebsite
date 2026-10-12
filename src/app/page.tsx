import type { Metadata } from 'next';
import HeroSection from '@/components/organisms/HeroSection';
import AboutSection from '@/components/organisms/AboutSection';
import SkillsSection from '@/components/organisms/SkillsSection';
import ProjectsShowcase from '@/components/organisms/ProjectsShowcase';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import ExperienceTimeline from '@/components/organisms/ExperienceTimeline';
import ContactSection from '@/components/organisms/ContactSection';
import {
  getAboutCopy,
  getCertifications,
  getEducation,
  getProfile,
  getProjects,
  getSkillCategories,
  getTimeline,
} from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  alternates: { canonical: getCanonicalUrl('/') },
};

export default function HomePage() {
  const profile = getProfile();
  const projects = getProjects();

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection
        profile={profile}
        copy={getAboutCopy()}
        education={getEducation()}
        projectCount={projects.length}
      />
      <SkillsSection categories={getSkillCategories()} projects={projects} />
      <ProjectsShowcase projects={projects} />
      <CertificationsSection certifications={getCertifications()} />
      <ExperienceTimeline entries={getTimeline()} />
      <ContactSection profile={profile} />
    </>
  );
}
