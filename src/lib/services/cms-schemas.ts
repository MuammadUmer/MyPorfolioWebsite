export const projectSchema = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'domain', title: 'Domain', type: 'string' },
    { name: 'summary', title: 'Summary', type: 'text' },
    { name: 'techStack', title: 'Tech stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'text' }] },
  ],
};

export const experienceSchema = {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'responsibilities', title: 'Responsibilities', type: 'array', of: [{ type: 'text' }] },
    { name: 'techStack', title: 'Tech stack', type: 'array', of: [{ type: 'string' }] },
  ],
};

export const skillCategorySchema = {
  name: 'skillCategory',
  title: 'Skill category',
  type: 'document',
  fields: [
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }] },
  ],
};
