import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthLayoutClient } from './AuthLayoutClient'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '{{PROJECT_NAME}}',
    template: '%s | {{PROJECT_NAME}}',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthLayoutClient>{children}</AuthLayoutClient>
      </body>
    </html>
  )
}
