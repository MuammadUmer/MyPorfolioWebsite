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
  status?: 'in-progress';
}

export interface Experience {
  company: string;
  role: string;
  location?: string;
  period: string;
  description?: string;
  responsibilities: string[];
  techStack?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  status?: 'in-progress';
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details?: string[];
}

export interface ProfileLinks {
  email: string;
  linkedin: string;
  github: string;
  cv: string;
  cvDownloadName: string;
}

export interface ProfileAvatar {
  /** Optimised GLB used by the interactive 3D avatar (hero). */
  model: string;
  /** Transparent still render of the same avatar (hero fallback, badge portrait). */
  poster: string;
  /** Head-only still of the avatar used as the logo mark (no circle; faded by CSS). */
  logo: string;
  /** Photo shown on the ID card. */
  portrait?: string;
  alt: string;
  /** Camera framing shared by the poster render and the live 3D view (model units, usually metres). */
  framing?: { target: string; radius: string };
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  seniority: string;
  location: string;
  yearsExperience: number;
  domains: string[];
  status: string;
  about: string[];
  contactIntro: string;
  links: ProfileLinks;
  avatar?: ProfileAvatar;
}

export interface AboutCopy {
  lead: string;
  body: string[];
  quote: string;
}

export type TimelineKind = 'experience' | 'education';

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  /** Year the entry ended in (or "Present" when open-ended), shown on the timeline spine. */
  year: string;
  period: string;
  title: string;
  organisation: string;
  location?: string;
  description?: string;
  bullets: string[];
}
