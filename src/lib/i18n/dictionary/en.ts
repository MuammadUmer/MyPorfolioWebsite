export const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.experience': 'Experience',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.contact': 'Contact',

  'home.hero.title': 'Muhammad Umer – Lead Software Engineer',
  'home.hero.subtitle':
    'Senior Full Stack Engineer with 7+ years building scalable cloud-native APIs, React/React Native apps, and event-driven systems across healthcare, real estate, AI, and blockchain.',
  'home.hero.cta.viewProjects': 'View Projects',
  'home.hero.cta.contact': 'Contact Me',
  'home.hero.cta.downloadCv': 'Download CV',

  'footer.copyright': '© {year} Muhammad Umer. All rights reserved.',
} as const;

export type TranslationKey = keyof typeof en;
