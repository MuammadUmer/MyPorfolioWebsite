export const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.experience': 'Experience',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.contact': 'Contact',

  'home.hero.title': 'Muhammad Umer – Senior Software Engineer',
  'home.hero.subtitle':
    'Backend, cloud, React/React Native, and blockchain engineer with healthcare and logistics experience.',
  'home.hero.cta.viewProjects': 'View Projects',
  'home.hero.cta.contact': 'Contact Me',
  'home.hero.cta.downloadCv': 'Download CV',

  'footer.copyright': '© {year} Muhammad Umer. All rights reserved.',
} as const;

export type TranslationKey = keyof typeof en;
