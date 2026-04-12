'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import OnboardingModal from '@/components/OnboardingModal'

function AppShell({ children }) {
  const { user, profile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!user) { setShowOnboarding(false); return }
    if (profile === undefined) return
    const needsOnboarding = profile !== null && (!profile?.location || !profile?.sports?.length)
    setShowOnboarding(needsOnboarding)
  }, [user, profile])

  // Detectar si estamos en la página de perfil para ocultar la cinta
  // (se hace via clase en body desde la propia página si fuera necesario,
  //  pero aquí la dejamos siempre visible — solo quitamos en perfil via CSS)

  return (
    <div className="app-shell">

      {/* ── Cinta del eslogan — fixed top, TODAS las páginas ── */}
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        height:26, overflow:'hidden',
        background:'#586875',
      }}>
        <div style={{
          display:'flex', alignItems:'center', height:'100%',
          animation:'marquee 40s linear infinite',
          width:'max-content',
          whiteSpace:'nowrap',
        }}>
          {[...Array(12)].map((_,i) => (
            <span key={i} style={{
              fontSize:10, fontWeight:800, letterSpacing:'0.2em',
              color:'#f6eddc', textTransform:'uppercase',
              padding:'0 28px', flexShrink:0,
            }}>HAZ DEPORTE · CONOCE GENTE</span>
          ))}
        </div>
      </div>

      {children}

      {showOnboarding && user && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

      {/* ── Carrusel patrocinadores ──
          fixed, JUSTO encima del navbar.
          El navbar tiene padding-bottom de safe-area, ~68px de contenido.
          Usamos bottom: 68px fijo + safe-area por encima. ── */}
      <div className="sponsors-bar">
        <div style={{
          display:'flex', alignItems:'center', height:'100%',
          animation:'marquee 20s linear infinite',
          width:'max-content',
        }}>
          {/* Repetimos muchas veces para que nunca se vea el final */}
          {[...Array(20)].map((_,i) => (
            <span key={i} style={{
              fontSize:12, fontWeight:900, letterSpacing:'0.18em',
              color:'var(--text)', textTransform:'uppercase',
              opacity:0.35, whiteSpace:'nowrap',
              padding:'0 32px', flexShrink:0,
            }}>PATROCINADOR</span>
          ))}
        </div>
      </div>

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
