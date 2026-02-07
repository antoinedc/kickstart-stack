import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function HomePage() {
  const t = useTranslations('common')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">{{PROJECT_NAME}}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {{PROJECT_DESCRIPTION}}
      </p>
      <Link
        href="/app"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        {t('getStarted')}
      </Link>
    </div>
  )
}
