import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';
import skillsData from '@/data/skills.json';
import certificationsData from '@/data/certifications.json';
import educationData from '@/data/education.json';
import type {
  Project,
  Experience,
  SkillCategory,
  Certification,
  Education,
} from '@/lib/types/content';

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  const normalizedSlug = decodeURIComponent(slug)
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.+$/g, '')
    .toLowerCase();

  return (projectsData as Project[]).find(
    (project) => project.slug.trim().toLowerCase() === normalizedSlug
  );
}

export function getExperience(): Experience[] {
  return [...(experienceData as Experience[])].reverse();
}

export function getSkillCategories(): SkillCategory[] {
  return skillsData as SkillCategory[];
}

export function getCertifications(): Certification[] {
  return certificationsData as Certification[];
}

export function getEducation(): Education[] {
  return educationData as Education[];
}
