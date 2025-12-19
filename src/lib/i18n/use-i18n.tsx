'use client';

import * as React from 'react';
import { en, type TranslationKey } from '@/lib/i18n/dictionary/en';
import { defaultLocale, type Locale } from '@/lib/i18n/config';

export interface I18nContextValue {
  locale: Locale;
  t: (key: TranslationKey | string, options?: { defaultValue?: string; year?: number }) => string;
}

function translate(
  key: TranslationKey | string,
  options?: { defaultValue?: string; year?: number }
): string {
  const record = en as Record<string, string>;
  const template = record[key] ?? options?.defaultValue ?? key;

  if (template.includes('{year}')) {
    const year = options?.year ?? new Date().getFullYear();
    return template.replace('{year}', String(year));
  }

  return template;
}

const I18nContext = React.createContext<I18nContextValue>({
  locale: defaultLocale,
  t: translate,
});

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale: defaultLocale,
      t: translate,
    }),
    []
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  return React.useContext(I18nContext);
}

export { translate };
