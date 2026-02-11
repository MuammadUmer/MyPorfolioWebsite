import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';
import skillsData from '@/data/skills.json';
import type { Project, Experience, SkillCategory } from '@/lib/types/content';

export type ContentBackend = 'json' | 'cms';

function getBackend(): ContentBackend {
  const value = process.env.NEXT_PUBLIC_CONTENT_BACKEND;
  return value === 'cms' ? 'cms' : 'json';
}

async function fetchFromCms<T>(path: string): Promise<T> {
  const baseUrl = process.env.CMS_API_BASE_URL;
  const token = process.env.CMS_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error('CMS configuration is missing');
  }

  const url = new URL(path, baseUrl);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`CMS request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface ContentService {
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  getExperience(): Promise<Experience[]>;
  getSkillCategories(): Promise<SkillCategory[]>;
}

const jsonService: ContentService = {
  async getProjects() {
    return projectsData as Project[];
  },
  async getProjectBySlug(slug: string) {
    const items = projectsData as Project[];
    const match = items.find((project) => project.slug === slug);
    return match ?? null;
  },
  async getExperience() {
    return [...(experienceData as Experience[])].reverse();
  },
  async getSkillCategories() {
    return skillsData as SkillCategory[];
  },
};

const cmsService: ContentService = {
  async getProjects() {
    const items = await fetchFromCms<Project[]>('/projects');
    return items;
  },
  async getProjectBySlug(slug: string) {
    const item = await fetchFromCms<Project | null>(`/projects/${slug}`);
    return item;
  },
  async getExperience() {
    const items = await fetchFromCms<Experience[]>('/experience');
    return items;
  },
  async getSkillCategories() {
    const items = await fetchFromCms<SkillCategory[]>('/skills');
    return items;
  },
};

export function getContentService(): ContentService {
  if (getBackend() === 'cms') {
    return {
      async getProjects() {
        try {
          return await cmsService.getProjects();
        } catch {
          return jsonService.getProjects();
        }
      },
      async getProjectBySlug(slug: string) {
        try {
          const project = await cmsService.getProjectBySlug(slug);
          if (project) return project;
        } catch {
        }
        return jsonService.getProjectBySlug(slug);
      },
      async getExperience() {
        try {
          return await cmsService.getExperience();
        } catch {
          return jsonService.getExperience();
        }
      },
      async getSkillCategories() {
        try {
          return await cmsService.getSkillCategories();
        } catch {
          return jsonService.getSkillCategories();
        }
      },
    };
  }

  return jsonService;
}
