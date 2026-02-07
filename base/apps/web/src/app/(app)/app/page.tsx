'use client'

import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="text-muted-foreground">{t('welcome')}</p>
    </div>
  )
}
