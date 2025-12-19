export const defaultLocale = 'en' as const;

export type Locale = typeof defaultLocale;

export const supportedLocales: Locale[] = [defaultLocale];
