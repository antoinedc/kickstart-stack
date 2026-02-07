'use client'

import { useTranslations } from 'next-intl'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const t = useTranslations('auth.login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{{PROJECT_NAME}}</h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            {t('title')}
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
