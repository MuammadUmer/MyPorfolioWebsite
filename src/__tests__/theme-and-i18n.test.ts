import { THEME_INIT_SCRIPT, applyTheme, readIsDark } from '@/lib/theme';
import { translate } from '@/lib/i18n/translate';
import { en } from '@/lib/i18n/dictionary/en';

describe('theme helpers', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    window.localStorage.clear();
  });

  it('applies and persists the theme', () => {
    applyTheme(true);
    expect(readIsDark()).toBe(true);
    expect(window.localStorage.getItem('theme')).toBe('dark');
    applyTheme(false);
    expect(readIsDark()).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('init script falls back to light and honours a stored dark choice', () => {
    const run = () => new Function(THEME_INIT_SCRIPT)();

    run();
    expect(document.documentElement.classList.contains('js')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    window.localStorage.setItem('theme', 'dark');
    run();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('init script never throws when storage is unavailable', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => new Function(THEME_INIT_SCRIPT)()).not.toThrow();
    spy.mockRestore();
  });
});

describe('translate with values', () => {
  it('replaces named placeholders', () => {
    expect(translate('projects.allProjects', { values: { count: 19 } })).toBe('All 19 projects');
    expect(translate('experience.showMore', { values: { count: 15 } })).toBe(
      'Show 15 more responsibilities'
    );
    expect(translate('skills.summary', { values: { items: 78, families: 10 } })).toBe(
      '78 items in 10 families'
    );
  });

  it('keeps every dictionary heading phrase free of placeholders', () => {
    Object.entries(en)
      .filter(([key]) => key.startsWith('section.'))
      .forEach(([, value]) => expect(value).not.toMatch(/[{}]/));
  });
});
