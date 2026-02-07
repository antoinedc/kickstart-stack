import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'fr', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Only show locale prefix for non-default locales (e.g., /fr/features, not /en/features)
  localePrefix: 'as-needed',
  // Don't auto-redirect based on browser Accept-Language header
  localeDetection: false,
})

// Export localized navigation helpers
export const { Link, usePathname, useRouter } =
  createNavigation(routing)
