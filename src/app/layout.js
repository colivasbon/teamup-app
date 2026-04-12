'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import OnboardingModal from '@/components/OnboardingModal'

function IconSun() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5"/>
      <line x1="12" y1="1.5" x2="12" y2="4"/>   <line x1="12" y1="20" x2="12" y2="22.5"/>
      <line x1="4.22" y1="4.22" x2="5.93" y2="5.93"/><line x1="18.07" y1="18.07" x2="19.78" y2="19.78"/>
      <line x1="1.5" y1="12" x2="4" y2="12"/>    <line x1="20" y1="12" x2="22.5" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.93" y2="18.07"/><line x1="18.07" y1="5.93" x2="19.78" y2="4.22"/>
    </svg>
  )
}
function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function ThemeButton() {
  const [theme,   setTheme]   = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tu-theme', next)
  }

  if (!mounted) return null
  return (
    <button onClick={toggle} className="theme-btn" title={theme==='dark'?'Modo claro':'Modo oscuro'} aria-label="Cambiar tema">
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  )
}

function AppShell({ children }) {
  const { user, profile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [profileLoaded,  setProfileLoaded]  = useState(false)

  useEffect(() => {
    // profile empieza undefined (cargando), luego es null (sin perfil) o un objeto
    // Solo actuar cuando profile ya tiene un valor definido
    if (!user) { setShowOnboarding(false); setProfileLoaded(false); return }
    if (profile === undefined) return // todavía cargando
    setProfileLoaded(true)
    // Solo mostrar si el perfil existe pero le faltan datos
    const needsOnboarding = profile !== null && (!profile?.location || !profile?.sports?.length)
    setShowOnboarding(needsOnboarding)
  }, [user, profile])

  return (
    <div className="app-shell">
      {children}
      {showOnboarding && user && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
      {/* Carrusel patrocinadores — pegado encima del navbar, fuera del scroll */}
      <div style={{
        position:'fixed', bottom:'var(--nav-h)', left:0, right:0, zIndex:98,
        height:32, overflow:'hidden',
        background:'var(--bg)',
        borderTop:'1px solid var(--border)',
        display:'flex', alignItems:'center',
        maxWidth:480, margin:'0 auto',
      }}>
        <div style={{
          display:'flex', alignItems:'center',
          animation:'marquee 25s linear infinite',
          width:'max-content',
          gap:0,
        }}>
          {[...Array(2)].map((_,set) => (
            <div key={set} style={{ display:'flex', alignItems:'center', gap:0 }}>
              {['PATROCINADOR','PATROCINADOR','PATROCINADOR','PATROCINADOR','PATROCINADOR','PATROCINADOR'].map((txt,i) => (
                <span key={i} style={{
                  fontSize:13, fontWeight:900, letterSpacing:'0.14em',
                  color:'var(--text)', textTransform:'uppercase',
                  opacity:0.22, whiteSpace:'nowrap',
                  padding:'0 24px',
                }}>{txt}</span>
              ))}
            </div>
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
