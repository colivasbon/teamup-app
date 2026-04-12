'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NotifBadge } from '@/components/NotifBadge'

// Inicio — casita limpia sin detalles blancos
const IconHome = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.4:1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
      fill={a ? 'currentColor' : 'none'}
      fillOpacity={a ? 0.9 : 0}
    />
    {/* Puerta — usa currentColor, no white */}
    <path d="M9 21V13h6v8" stroke="currentColor" strokeWidth={a?2:1.8} fill="none"
      opacity={a ? 0.45 : 1}
    />
  </svg>
)

// Explorar
const IconSearch = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>
  </svg>
)

// Momentos — imagen minimalista sin sol/montaña detallados
const IconMoments = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
    {/* Marco de la foto */}
    <rect x="3" y="3" width="18" height="18" rx="3"
      fill={a ? 'currentColor' : 'none'}
      fillOpacity={a ? 0.9 : 0}
    />
    {/* Círculo (sol) — usa currentColor con opacidad */}
    <circle cx="8.5" cy="8.5" r="1.5"
      fill={a ? 'rgba(0,0,0,0.35)' : 'currentColor'}
      stroke="none"
    />
    {/* Montaña — usa currentColor con opacidad */}
    <path d="M21 15 L16 10 L5 21"
      stroke={a ? 'rgba(0,0,0,0.35)' : 'currentColor'}
      strokeWidth={a?2.2:1.8}
      fill="none"
    />
  </svg>
)

// Crear
const IconCreate = ({ a }) => (
  <div style={{
    width:44, height:44, borderRadius:15,
    background: a ? '#586875' : 'var(--glass)',
    border: a ? 'none' : '1.5px solid var(--border)',
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow: a ? '0 4px 18px rgba(88,104,117,0.42)' : 'none',
    backdropFilter:'blur(14px)',
  }}>
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke={a ? '#f6eddc' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </div>
)

// Perfil
const IconProfile = ({ a }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={a?'currentColor':'none'} fillOpacity={a?0.9:0}/>
    <circle cx="12" cy="7" r="4" fill={a?'currentColor':'none'} fillOpacity={a?0.9:0}/>
  </svg>
)

const NAV_ITEMS = [
  { href:'/',        label:'Inicio',   icon: (a) => <IconHome a={a}/> },
  { href:'/events',  label:'Explorar', icon: (a) => <IconSearch a={a}/> },
  { href:'/create',  label:'Crear',    icon: (a) => <IconCreate a={a}/> },
  { href:'/moments', label:'Momentos', icon: (a) => <IconMoments a={a}/> },
  { href:'/profile', label:'Perfil',   icon: (a) => <IconProfile a={a}/> },
]

export default function Navbar() {
  const path     = usePathname()
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/' && path?.startsWith(href))
          const isProfile = label === 'Perfil'
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                {icon(active)}
                {isProfile && user && <NotifBadge userId={user.id} />}
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
