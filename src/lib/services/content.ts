import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';
import skillsData from '@/data/skills.json';
import type { Project, Experience, SkillCategory } from '@/lib/types/content';

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
  return experienceData as Experience[];
}

export function getSkillCategories(): SkillCategory[] {
  return skillsData as SkillCategory[];
}
