'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import OnboardingModal from '@/components/OnboardingModal'
import { getSupabase } from '@/lib/supabase'

// Número de repeticiones del carrusel para que el loop sea fluido
const REPEAT = 6

function AppShell({ children }) {
  const { user, profile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sponsors, setSponsors] = useState([])

  useEffect(() => {
    if (!user) { setShowOnboarding(false); return }
    if (profile === undefined) return
    const needsOnboarding = profile !== null && (!profile?.location || !profile?.sports?.length)
    setShowOnboarding(needsOnboarding)
  }, [user, profile])

  // Cargar patrocinadores desde Supabase
  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    sb.from('sponsors')
      .select('id, name, logo_url, website_url')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setSponsors(data) })
  }, [])

  return (
    <div className="app-shell">

      {/* Cinta del eslogan — elemento normal en el flujo, no fixed.
          Aparece arriba al entrar en la app y desaparece al hacer scroll.
          No tapa nada, no sigue al usuario. */}
      <div className="slogan-bar" style={{
        width: '100%',
        height: 26, overflow: 'hidden',
        background: '#586875',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', height: '100%',
          animation: 'marquee 80s linear infinite',
          width: 'max-content',
        }}>
          {Array.from({length: 12}).map((_, i) => (
            <span key={i} style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
              color: '#f6eddc', textTransform: 'uppercase',
              padding: '0 28px', flexShrink: 0, whiteSpace: 'nowrap',
            }}>HAZ DEPORTE · CONOCE GENTE</span>
          ))}
        </div>
      </div>

      {children}

      {showOnboarding && user && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

    </div>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a2028" />
        <title>TeamUp — Haz deporte, conoce gente</title>
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
