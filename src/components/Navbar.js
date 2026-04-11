'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NotifBadge } from '@/components/NotifBadge'

const icons = {
  home: (active) => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill={active ? 'currentColor' : 'none'}/>
      {active && <path d="M9 21V12h6v9" fill="none" stroke="white" strokeWidth="2"/>}
    </svg>
  ),
  events: (active) => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7.5"/>
      <line x1="21" y1="21" x2="16.2" y2="16.2"/>
    </svg>
  ),
  create: (active) => (
    <div style={{
      width: 44, height: 44, borderRadius: 15,
      background: active ? '#586875' : 'var(--glass)',
      border: active ? 'none' : '1.5px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: active ? '0 4px 18px rgba(88,104,117,0.42)' : 'none',
      transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)',
      backdropFilter: 'blur(14px)',
    }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={active ? '#f6eddc' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  ),
  moments: (active) => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" fill={active ? 'currentColor' : 'none'}/>
      <circle cx="8.5" cy="8.5" r="1.5" fill={active ? 'white' : 'currentColor'} stroke="none"/>
      <path d="M21 15 L16 10 L5 21" stroke={active ? 'white' : 'currentColor'} strokeWidth={active ? 2.2 : 1.8} fill="none"/>
    </svg>
  ),
  // Campana para notificaciones
  notifications: (active) => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill={active ? 'currentColor' : 'none'}/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={active ? 'white' : 'currentColor'}/>
    </svg>
  ),
  profile: (active) => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={active ? 'currentColor' : 'none'}/>
      <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'}/>
    </svg>
  ),
}

const NAV_ITEMS = [
  { href: '/',               label: 'Inicio',  key: 'home' },
  { href: '/events',         label: 'Explorar',key: 'events' },
  { href: '/create',         label: 'Crear',   key: 'create' },
  { href: '/notifications',  label: 'Avisos',  key: 'notifications' },
  { href: '/profile',        label: 'Perfil',  key: 'profile' },
]

export default function Navbar() {
  const path      = usePathname()
  const { user }  = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {NAV_ITEMS.map(({ href, label, key }) => {
          const active = path === href || (href !== '/' && path?.startsWith(href))
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              <div style={{ position:'relative', display:'inline-flex' }}>
                {icons[key](active)}
                {key === 'notifications' && user && (
                  <NotifBadge userId={user.id} />
                )}
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
