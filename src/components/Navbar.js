'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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


export default function Navbar() {
  const path     = usePathname()
  const router   = useRouter()
  const { user, profile } = useAuth()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const isBusiness = profile?.account_type === 'business'

  return (
    <>
      {/* Mini menú Evento / Torneo para cuentas business */}
      {showCreateMenu && (
        <>
          <div onClick={() => setShowCreateMenu(false)}
            style={{ position:'fixed', inset:0, zIndex:199, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}/>
          <div style={{
            position:'fixed', bottom:82, left:'50%', transform:'translateX(-50%)',
            zIndex:200, background:'var(--bg)', borderRadius:20,
            border:'1px solid var(--border)', padding:'8px',
            width:220, boxShadow:'0 8px 32px rgba(0,0,0,0.22)',
          }}>
            <button onClick={() => { setShowCreateMenu(false); router.push('/create') }}
              style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'13px 16px',
                background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
                borderRadius:14, fontSize:14, fontWeight:700, color:'var(--text)' }}>
              <span style={{ fontSize:24 }}>🗓</span> Crear evento
            </button>
            <button onClick={() => { setShowCreateMenu(false); router.push('/create/tournament') }}
              style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'13px 16px',
                background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
                borderRadius:14, fontSize:14, fontWeight:700, color:'var(--text)' }}>
              <span style={{ fontSize:24 }}>🏆</span> Crear torneo
            </button>
          </div>
        </>
      )}

      <nav className="navbar">

        {/* ── Iconos de navegación ── */}
        <div className="nav-inner">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const active = path === href || (href !== '/' && path?.startsWith(href))

            // Botón Crear: si es business abre el menú, si no va directo
            if (label === 'Crear' && isBusiness) {
              return (
                <button key={href} onClick={() => setShowCreateMenu(p => !p)}
                  className={`nav-item${active || showCreateMenu ? ' active' : ''}`}
                  style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                  <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                    {icon(active || showCreateMenu)}
                  </div>
                  <span className="nav-label">Crear</span>
                </button>
              )
            }

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
    </>
  )
}
