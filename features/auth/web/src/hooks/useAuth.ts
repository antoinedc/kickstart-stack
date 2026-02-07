'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'
import { syncLocaleOnLogin, getAppLocale } from '@/lib/locale'

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
    useAuthStore()
  const router = useRouter()

  useEffect(() => {
    async function validateToken(): Promise<void> {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { user } = await api.get<{ user: any }>('/api/auth/me', token)
        syncLocaleOnLogin(user?.locale)
        setAuth(user, token)
      } catch {
        clearAuth()
      }
    }

    validateToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const result = await api.post<{ user: any; token: string }>(
      '/api/auth/login',
      { email, password }
    )
    syncLocaleOnLogin(result.user?.locale)
    setAuth(result.user, result.token)
    router.push('/app')
    return result
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    organizationName: string
  ) => {
    const locale = getAppLocale()
    const result = await api.post<{ user: any; token: string }>(
      '/api/auth/signup',
      { email, password, name, organizationName, locale }
    )
    setAuth(result.user, result.token)
    router.push('/app')
    return result
  }

  const logout = () => {
    clearAuth()
    router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  }
}

export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role !== 'ADMIN') {
        router.push('/app')
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  return { user, isAuthenticated, isLoading, isAdmin: user?.role === 'ADMIN' }
}
