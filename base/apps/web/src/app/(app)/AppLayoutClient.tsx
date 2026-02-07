'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { LocaleProvider, useAppLocale } from '@/providers/LocaleProvider'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations('common')
  const { locale } = useAppLocale()

  // Update html lang attribute when locale changes
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className="flex h-screen bg-muted">
      <main className="flex-1 overflow-hidden p-6">{children}</main>
    </div>
  )
}

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <DashboardContent>{children}</DashboardContent>
    </LocaleProvider>
  )
}
