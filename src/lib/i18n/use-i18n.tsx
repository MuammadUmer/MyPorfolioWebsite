'use client';

import * as React from 'react';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { translate, type TranslateOptions } from '@/lib/i18n/translate';
import type { TranslationKey } from '@/lib/i18n/dictionary/en';

export interface I18nContextValue {
  locale: Locale;
  t: (key: TranslationKey | string, options?: TranslateOptions) => string;
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
