import { getProjects, getProjectBySlug, getExperience, getSkillCategories } from '@/lib/services/content';

describe('content service', () => {
  it('returns projects from fixtures', () => {
    const projects = getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    const innova = projects.find((p) => p.slug === 'innova-care');
    expect(innova).toBeDefined();
    expect(innova?.title).toContain('Innova Care');
  });

  it('gets project by slug', () => {
    const project = getProjectBySlug('innova-care');
    expect(project).toBeDefined();
    expect(project?.slug).toBe('innova-care');
  });

  it('returns undefined for unknown project slug', () => {
    const project = getProjectBySlug('unknown-slug');
    expect(project).toBeUndefined();
  });

  it('returns experience items', () => {
    const exp = getExperience();
    expect(exp.length).toBeGreaterThanOrEqual(3);
    const f3 = exp.find((e) => e.company === 'F3 Technologies');
    expect(f3).toBeDefined();
    expect(f3?.role).toMatch(/Software Engineer/);
  });

  it('returns skill categories', () => {
    const skills = getSkillCategories();
    expect(skills.length).toBeGreaterThan(0);
    const backend = skills.find((s) => s.category === 'Backend & APIs');
    expect(backend).toBeDefined();
    expect(backend?.items).toContain('Node.js');
  });
});
