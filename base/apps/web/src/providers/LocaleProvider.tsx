'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getAppLocale, setAppLocale } from '@/lib/locale'
import type { Locale } from '@/i18n/routing'

// Static imports for messages
import en from '../../../messages/en/index'
import fr from '../../../messages/fr/index'
import it from '../../../messages/it/index'

const allMessages: Record<string, typeof en> = { en, fr, it }

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
})

export function useAppLocale() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLocaleState(getAppLocale())
    setHydrated(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setAppLocale(newLocale)
    setLocaleState(newLocale)
  }, [])

  // Prevent SSR mismatch
  if (!hydrated) return null

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
