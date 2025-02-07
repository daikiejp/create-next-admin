export type Locale = (typeof locales)[number];

export const locales = ['en', 'es', 'ja'] as const;
export const defaultLocale: Locale = 'en';
