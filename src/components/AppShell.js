'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import OnboardingModal from '@/components/OnboardingModal'
import { getSupabase } from '@/lib/supabase'
import CookieBanner from '@/components/CookieBanner'

export default function AppShell({ children }) {
  const { user, profile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sponsors, setSponsors] = useState([])

  useEffect(() => {
    if (!user) { setShowOnboarding(false); return }
    if (profile === undefined) return
    const needsOnboarding = profile !== null && (!profile?.location || !profile?.sports?.length)
    setShowOnboarding(needsOnboarding)
  }, [user, profile])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Fallback: no-op if registration fails in unsupported browsers.
      })
    }
  }, [])

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

      {/* Banner de cookies — solo aparece si no hay decisión guardada */}
      <CookieBanner />

    </div>
  )
}
