import type { Metadata } from 'next';
import AboutSection from '@/components/organisms/AboutSection';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import EducationList from '@/components/organisms/EducationList';
import {
  getAboutCopy,
  getCertifications,
  getEducation,
  getProfile,
  getProjects,
} from '@/lib/services/content';
import { getCanonicalUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'About – Muhammad Umer',
  description:
    'About Muhammad Umer: Senior Full Stack Engineer based in Riyadh with 7+ years of experience in backend, cloud, and cross-platform apps.',
  alternates: { canonical: getCanonicalUrl('/about') },
};

export default function AboutPage() {
  const education = getEducation();

  return (
    <>
      <AboutSection
        page="about"
        profile={getProfile()}
        copy={getAboutCopy()}
        education={education}
        projectCount={getProjects().length}
      />
      <CertificationsSection page="about" certifications={getCertifications()} />
      <EducationList education={education} />
    </>
  );
}
