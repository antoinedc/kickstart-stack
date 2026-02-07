import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
