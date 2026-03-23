// src/components/Navbar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    path: '/',
    label: 'Inicio',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        {active && <path d="M9 21V12h6v9" fill="white"/>}
        {!active && <polyline points="9 22 9 12 15 12 15 22"/>}
      </svg>
    )
  },
  {
    path: '/events',
    label: 'Explorar',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={active ? "3" : "2"}/>
      </svg>
    )
  },
  {
    path: '/create',
    label: 'Crear',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? '0' : '2'}/>
        <line x1="12" y1="8" x2="12" y2="16" stroke={active ? 'white' : 'currentColor'}/>
        <line x1="8" y1="12" x2="16" y2="12" stroke={active ? 'white' : 'currentColor'}/>
      </svg>
    )
  },
  {
    path: '/moments',
    label: 'Momentos',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? '0' : '2'}/>
        <circle cx="8.5" cy="8.5" r="1.5" fill={active ? 'white' : 'currentColor'}/>
        <polyline points="21 15 16 10 5 21" stroke={active ? 'white' : 'currentColor'}/>
      </svg>
    )
  },
  {
    path: '/profile',
    label: 'Perfil',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? '0' : '2'}/>
        <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? '0' : '2'}/>
        {active && (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
          </>
        )}
      </svg>
    )
  },
]

export default function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 navbar-glass z-50 pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center py-3 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${
                active
                  ? 'text-primary scale-105'
                  : 'text-text-secondary hover:text-text'
              }`}
              style={active ? {color: 'var(--primary)'} : {color: 'var(--text-secondary)'}}
            >
              <span className="transition-all">
                {item.icon(active)}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full" style={{background: 'var(--primary)', marginTop: '2px'}}/>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
