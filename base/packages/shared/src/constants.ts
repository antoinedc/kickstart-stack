export const LOCALES = ['en', 'fr', 'it'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
