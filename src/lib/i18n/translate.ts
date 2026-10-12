import { en, type TranslationKey } from '@/lib/i18n/dictionary/en';

export interface TranslateOptions {
  defaultValue?: string;
  year?: number;
  values?: Record<string, string | number>;
}

export function translate(key: TranslationKey | string, options?: TranslateOptions): string {
  const record = en as Record<string, string>;
  let template = record[key] ?? options?.defaultValue ?? key;

  if (template.includes('{year}')) {
    const year = options?.year ?? new Date().getFullYear();
    template = template.replace('{year}', String(year));
  }

  if (options?.values) {
    for (const [name, value] of Object.entries(options.values)) {
      template = template.split(`{${name}}`).join(String(value));
    }
  }

  return template;
}
