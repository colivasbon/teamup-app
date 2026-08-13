import { AuthProvider } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  )
}
