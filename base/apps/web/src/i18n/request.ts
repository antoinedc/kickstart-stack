import { getRequestConfig } from 'next-intl/server'
import { routing, type Locale } from './routing'

// Static imports for all locale message files
import en from '../../messages/en/index'
import fr from '../../messages/fr/index'
import it from '../../messages/it/index'

const messages: Record<string, typeof en> = { en, fr, it }

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale],
  }
})
