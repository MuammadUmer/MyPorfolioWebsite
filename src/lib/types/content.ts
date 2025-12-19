export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  role: string;
  company?: string;
  period?: string;
  domain: string;
  summary: string;
  techStack: string[];
  highlights: string[];
  links?: ProjectLink[];
}

export interface Experience {
  company: string;
  role: string;
  location?: string;
  period: string;
  responsibilities: string[];
  techStack?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}
