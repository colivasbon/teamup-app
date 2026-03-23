'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    href: '/', label: 'Inicio',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>{!a&&<polyline points="9 22 9 12 15 12 15 22"/>}{a&&<path d="M9 21V12h6v9" fill="white" stroke="none"/>}</svg>
  },
  {
    href: '/events', label: 'Explorar',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.4:1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  },
  {
    href: '/create', label: 'Crear',
    icon: (a) => (
      <div style={{
        width:42, height:42, borderRadius:14,
        background: a ? 'var(--grad)' : 'var(--glass)',
        border: a ? 'none' : '1.5px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow: a ? '0 4px 16px rgba(var(--primary-rgb),0.4)' : 'none',
        transition:'all 0.18s ease',
        backdropFilter:'blur(12px)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a?'white':'currentColor'} strokeWidth="2.2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    )
  },
  {
    href: '/moments', label: 'Momentos',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/>{a&&<><circle cx="8.5" cy="8.5" r="1.5" fill="white" stroke="none"/><polyline points="21 15 16 10 5 21" stroke="white" strokeWidth="1.8" fill="none"/></>}{!a&&<><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>}</svg>
  },
  {
    href: '/profile', label: 'Perfil',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>{a&&<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.4" fill="none"/><circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.4" fill="none"/></>}</svg>
  },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="navbar">
      <div className="nav-inner">
        {items.map(({ href, label, icon }) => {
          const active = path === href
          return (
            <Link key={href} href={href} className={`nav-item${active?' active':''}`}>
              {icon(active)}
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
