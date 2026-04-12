'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NotifBadge } from '@/components/NotifBadge'

const IconHome = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
      fill={a ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={a ? 2.3 : 1.8}/>
    {a && <rect x="9" y="13" width="6" height="8" rx="1" fill="var(--bg)" stroke="none"/>}
    {!a && <path d="M9 21V14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" stroke="currentColor" strokeWidth="1.8" fill="none"/>}
  </svg>
)

const IconSearch = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={a ? 2.3 : 1.8}
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="21" y1="21" x2="16.2" y2="16.2"/>
  </svg>
)

const IconMoments = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"
      fill={a ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={a ? 2.3 : 1.8}/>
    <circle cx="8.5" cy="8.5" r="1.5"
      fill={a ? 'var(--bg)' : 'currentColor'} stroke="none"/>
    <path d="M21 15 L16 10 L5 21"
      stroke={a ? 'var(--bg)' : 'currentColor'}
      strokeWidth={a ? 2 : 1.8} fill="none"/>
  </svg>
)

const IconCreate = ({ a }) => (
  <div style={{
    width: 44, height: 44, borderRadius: 15,
    background: a ? '#586875' : 'var(--glass)',
    border: a ? 'none' : '1.5px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: a ? '0 4px 18px rgba(88,104,117,0.42)' : 'none',
    backdropFilter: 'blur(14px)',
  }}>
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke={a ? '#f6eddc' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </div>
)

const IconProfile = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={a ? 2.3 : 1.8}
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      fill={a ? 'currentColor' : 'none'}/>
    <circle cx="12" cy="7" r="4" fill={a ? 'currentColor' : 'none'}/>
  </svg>
)

const NAV_ITEMS = [
  { href: '/',        label: 'Inicio',   icon: (a) => <IconHome a={a}/> },
  { href: '/events',  label: 'Explorar', icon: (a) => <IconSearch a={a}/> },
  { href: '/create',  label: 'Crear',    icon: (a) => <IconCreate a={a}/> },
  { href: '/moments', label: 'Momentos', icon: (a) => <IconMoments a={a}/> },
  { href: '/profile', label: 'Perfil',   icon: (a) => <IconProfile a={a}/> },
]

// Texto del carrusel — suficientes repeticiones para que nunca se corte
const SPONSOR_ITEMS = Array(24).fill('PATROCINADOR')

export default function Navbar() {
  const path     = usePathname()
  const { user } = useAuth()

  return (
    <nav className="navbar">

      {/* ── Carrusel patrocinadores — parte del navbar, siempre encima ── */}
      <div style={{
        overflow: 'hidden',
        height: 26,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'marquee 60s linear infinite',   /* MUY LENTO */
          width: 'max-content',
          flexShrink: 0,
        }}>
          {SPONSOR_ITEMS.map((txt, i) => (
            <span key={i} style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: 'var(--text)',
              textTransform: 'uppercase',
              opacity: 0.35,
              whiteSpace: 'nowrap',
              padding: '0 28px',
              flexShrink: 0,
            }}>{txt}</span>
          ))}
        </div>
      </div>

      {/* ── Iconos de navegación ── */}
      <div className="nav-inner">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/' && path?.startsWith(href))
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon(active)}
                {label === 'Perfil' && user && <NotifBadge userId={user.id} />}
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </div>

    </nav>
  )
}
