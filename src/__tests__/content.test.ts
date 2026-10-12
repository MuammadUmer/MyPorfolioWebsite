import {
  getProjects,
  getProjectBySlug,
  getExperience,
  getSkillCategories,
  getCertifications,
  getEducation,
  getProfile,
} from '@/lib/services/content';

describe('content service', () => {
  it('returns projects from fixtures', () => {
    const projects = getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    const innova = projects.find((p) => p.slug === 'innova-care');
    expect(innova).toBeDefined();
    expect(innova?.title).toContain('Innova Care');
  });

  it('includes the in-progress projects with the status flag', () => {
    const inProgress = getProjects().filter((project) => project.status === 'in-progress');
    expect(inProgress.map((project) => project.slug).sort()).toEqual(
      ['grocery-ecommerce-platform', 'investlytics', 'zenith-ai'].sort()
    );
  });

  it('has unique project slugs', () => {
    const slugs = getProjects().map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
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

  it('returns experience items, most recent first', () => {
    const exp = getExperience();
    expect(exp.length).toBeGreaterThanOrEqual(3);
    expect(exp[0].company).toBe('F Three Technologies');
    expect(exp[0].role).toBe('Lead Software Engineer');
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

  it('returns certifications and education', () => {
    const certifications = getCertifications();
    expect(certifications.length).toBe(6);
    expect(certifications.filter((item) => item.status === 'in-progress')).toHaveLength(1);

    const education = getEducation();
    expect(education[0]).toMatchObject({
      degree: 'B.S. Software Engineering',
      institution: 'COMSATS University Islamabad',
    });
  });

  it('returns the profile with unchanged links', () => {
    const profile = getProfile();
    expect(profile.name).toBe('Muhammad Umer');
    expect(profile.role).toBe('Lead Software Engineer');
    expect(profile.links).toEqual({
      email: 'mailto:muhammadumerswati@gmail.com',
      linkedin: 'https://linkedin.com/in/muhammad-umer-07180911b',
      github: 'https://github.com/MuammadUmer',
      cv: '/CV.pdf',
      cvDownloadName: 'Muhammad-Umer-CV.pdf',
    });
    expect(profile.about).toHaveLength(4);
    expect(profile.domains).toEqual(['Healthcare', 'Real Estate', 'AI', 'Blockchain', 'Logistics']);
  });
});
