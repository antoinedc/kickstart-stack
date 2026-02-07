'use client'

import { useEffect } from 'react'
import { LocaleProvider, useAppLocale } from '@/providers/LocaleProvider'

function AuthContent({ children }: { children: React.ReactNode }) {
  const { locale } = useAppLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <>{children}</>
}

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthContent>{children}</AuthContent>
    </LocaleProvider>
  )
}
