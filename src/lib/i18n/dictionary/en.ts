export const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.experience': 'Experience',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.contact': 'Contact',
  'nav.menu': 'Menu',
  'nav.close': 'Close',

  'home.hero.title': 'Muhammad Umer – Lead Software Engineer',
  'home.hero.subtitle':
    'Senior Full Stack Engineer with 7+ years building scalable cloud-native APIs, React/React Native apps, and event-driven systems across healthcare, real estate, AI, and blockchain.',
  'home.hero.cta.viewProjects': 'View Projects',
  'home.hero.cta.contact': 'Contact Me',
  'home.hero.cta.downloadCv': 'Download CV',

  'section.about.bold': 'About',
  'section.about.italic': 'me.',
  'section.skills.bold': 'Skills',
  'section.skills.italic': '& tools.',
  'section.projects.bold': 'Selected',
  'section.projects.italic': 'projects.',
  'section.certifications.bold': 'Certifications',
  'section.certifications.italic': '& courses.',
  'section.experience.bold': 'Experience',
  'section.experience.italic': '& education.',
  'section.contact.bold': 'Contact',
  'section.contact.italic': 'me.',

  'about.quickFacts': 'Quick facts',
  'about.glance': 'At a glance',
  'about.flipCard': 'Flip card',
  'about.fact.basedIn': 'Based in',
  'about.fact.role': 'Role',
  'about.fact.experience': 'Experience',
  'about.fact.education': 'Education',
  'about.fact.domains': 'Domains',
  'about.fact.projects': 'Projects',
  'about.stat.years': 'Years Experience',
  'about.stat.projects': 'Projects Delivered',
  'about.stat.domains': 'Domains',

  'skills.summary': '{items} items in {families} families',
  'skills.filter.all': 'All',
  'skills.usedIn': 'Used in',
  'skills.showing': 'Showing {shown} of {total} — {category}',

  'projects.hint': 'Hover or focus a panel to open it',
  'projects.viewCaseStudy': 'View case study',
  'projects.allProjects': 'All {count} projects',
  'projects.inProgress': 'In Progress',

  'certifications.summary': '{count} certifications',

  'experience.showMore': 'Show {count} more responsibilities',
  'experience.tag.experience': 'Experience',
  'experience.tag.education': 'Education',

  'footer.copyright': '© {year} Muhammad Umer. All rights reserved.',
  'footer.backToTop': 'Back to top',
} as const;

export type TranslationKey = keyof typeof en;
