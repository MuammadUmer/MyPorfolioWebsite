import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';
import { getProjects } from '@/lib/services/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();

  const baseRoutes: MetadataRoute.Sitemap = [
    '/',
    '/about',
    '/experience',
    '/projects',
    '/skills',
    '/contact',
  ].map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: new Date(),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...baseRoutes, ...projectRoutes];
}
