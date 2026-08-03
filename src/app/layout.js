'use client'

import './globals.css'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import OnboardingModal from '@/components/OnboardingModal'
import { getSupabase } from '@/lib/supabase'
import CookieBanner from '@/components/CookieBanner'

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

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a2028" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TeamUp" />
        <meta name="description" content="TeamUp ayuda a organizar y unirse a eventos deportivos cerca de ti. Corre, juega pádel, haz senderismo y conoce gente nueva de manera fácil." />
        <meta name="keywords" content="TeamUp, deporte, eventos deportivos, running, pádel, yoga, ciclismo, senderismo, comunidad, actividad física" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="TeamUp — Haz deporte, conoce gente" />
        <meta property="og:description" content="Organiza y únete a eventos deportivos cerca de ti. Encuentra compañeros para correr, pádel, yoga y más." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TeamUp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TeamUp — Haz deporte, conoce gente" />
        <meta name="twitter:description" content="Organiza y únete a eventos deportivos cerca de ti. Encuentra compañeros para correr, pádel, yoga y más." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#1a2028" />
        <title>TeamUp — Haz deporte, conoce gente</title>
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('tu-theme'); if(t)document.documentElement.setAttribute('data-theme', t);}catch(e){}})();" }} />
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
