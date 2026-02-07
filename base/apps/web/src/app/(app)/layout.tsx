import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppLayoutClient } from './AppLayoutClient'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '{{PROJECT_NAME}}',
    template: '%s | {{PROJECT_NAME}}',
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  )
}
