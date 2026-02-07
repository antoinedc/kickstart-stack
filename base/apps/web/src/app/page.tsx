import { redirect } from 'next/navigation'

// Redirect root to default locale's home page
export default function RootPage() {
  redirect('/en')
}
