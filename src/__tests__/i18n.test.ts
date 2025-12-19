import { translate } from '@/lib/i18n/use-i18n';

describe('i18n translate helper', () => {
  it('returns known keys from the English dictionary', () => {
    expect(translate('nav.projects')).toBe('Projects');
    expect(translate('home.hero.title')).toContain('Muhammad Umer');
  });

  it('falls back to default value when key is missing', () => {
    const result = translate('non.existing.key', { defaultValue: 'Fallback' });
    expect(result).toBe('Fallback');
  });

  it('falls back to key when no translation or default value is provided', () => {
    const key = 'non.existing.key';
    const result = translate(key);
    expect(result).toBe(key);
  });

  it('replaces {year} placeholder when present', () => {
    const result = translate('footer.copyright', { year: 2030 });
    expect(result).toContain('2030');
  });
});
