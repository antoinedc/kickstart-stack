'use client'

import type { Locale } from '@/i18n/routing'
import { locales, defaultLocale } from '@/i18n/routing'

const LOCALE_KEY = '{{PROJECT_NAME}}-locale'

export function getAppLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  // Priority: localStorage → browser language → default
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale
  }

  // Try browser language
  const browserLang = navigator.language.split('-')[0]
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale
  }

  return defaultLocale
}

export function setAppLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCALE_KEY, locale)
}

export function syncLocaleOnLogin(dbLocale?: string): void {
  if (typeof window === 'undefined') return

  // If localStorage already has a locale, keep it (device preference wins)
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored && locales.includes(stored as Locale)) return

  // Otherwise use DB locale
  if (dbLocale && locales.includes(dbLocale as Locale)) {
    localStorage.setItem(LOCALE_KEY, dbLocale)
  }
}
