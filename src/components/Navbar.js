'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NotifBadge } from '@/components/NotifBadge'
import { SportIcon } from '@/components/SportIcon'

const IconHome = ({ active }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.4:1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill={active?'currentColor':'none'}/>
    {active && <path d="M9 21V12h6v9" fill="none" stroke="white" strokeWidth="2"/>}
  </svg>
)
const IconSearch = ({ active }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>
  </svg>
)
const IconMoments = ({ active }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" fill={active?'currentColor':'none'}/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={active?'white':'currentColor'} stroke="none"/>
    <path d="M21 15 L16 10 L5 21" stroke={active?'white':'currentColor'} strokeWidth={active?2.2:1.8} fill="none"/>
  </svg>
)

const NAV_ITEMS = [
  { href: '/',        label: 'Inicio',   icon: (a) => <IconHome active={a}/> },
  { href: '/events',  label: 'Explorar', icon: (a) => <IconSearch active={a}/> },
  { href: '/create',  label: 'Crear',    icon: (a) => (
    <div style={{
      width:44, height:44, borderRadius:15,
      background: a ? '#586875' : 'var(--glass)',
      border: a ? 'none' : '1.5px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: a ? '0 4px 18px rgba(88,104,117,0.42)' : 'none',
      transition:'all 0.18s cubic-bezier(.34,1.56,.64,1)',
      backdropFilter:'blur(14px)',
    }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?'#f6eddc':'currentColor'} strokeWidth="2.4" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  )},
  { href: '/moments', label: 'Momentos', icon: (a) => <IconMoments active={a}/> },
  { href: '/profile', label: 'Perfil',   icon: (a, user, notifBadge) => (
    <div style={{ position:'relative', display:'inline-flex' }}>
      {user?.user_metadata?.avatar_url || user?.avatar_url ? (
        <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border: a ? '2px solid #586875' : '1.5px solid var(--border)' }}>
          <img src={user.user_metadata?.avatar_url || user.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        </div>
      ) : (
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2.3:1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={a?'currentColor':'none'}/>
          <circle cx="12" cy="7" r="4" fill={a?'currentColor':'none'}/>
        </svg>
      )}
      {notifBadge}
    </div>
  )},
]

export default function Navbar() {
  const path    = usePathname()
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/' && path?.startsWith(href))
          const notifBadge = label === 'Perfil' && user
            ? <NotifBadge userId={user.id} />
            : null
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              {icon(active, user, notifBadge)}
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
