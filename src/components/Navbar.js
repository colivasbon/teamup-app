'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { NotifBadge } from '@/components/NotifBadge'
import { House, HouseFill, Compass, CompassFill, PlusCircle, PlusCircleFill, Images, ImagesFill, User, UserFill, CalendarBlank, Trophy } from '@phosphor-icons/react'

const NAV_ITEMS = [
  { href: '/start',   label: 'Inicio',   Icon: House, IconFill: HouseFill },
  { href: '/events',  label: 'Explorar', Icon: Compass, IconFill: CompassFill },
  { href: '/create',  label: 'Crear',    Icon: PlusCircle, IconFill: PlusCircleFill },
  { href: '/moments', label: 'Momentos', Icon: Images, IconFill: ImagesFill },
  { href: '/profile', label: 'Perfil',   Icon: User, IconFill: UserFill },
]

export default function Navbar() {
  const path     = usePathname()
  const router   = useRouter()
  const { user, profile } = useAuth()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isBusiness = profile?.account_type === 'business'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navbar = (
    <>
      {showCreateMenu && (
        <>
          <div onClick={() => setShowCreateMenu(false)}
            style={{ position:'fixed', inset:0, zIndex:199, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}/>
          <div style={{
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
            zIndex:200, background:'var(--bg)', borderRadius:20,
            border:'1px solid var(--border)', padding:'8px',
            width:'min(320px, calc(100vw - 36px))', boxShadow:'0 14px 40px rgba(0,0,0,0.22)',
            overflow:'hidden', maxHeight:'calc(100vh - 50px)',
          }}>
            <button onClick={() => { setShowCreateMenu(false); router.push('/create') }}
              style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'16px 18px',
                background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
                borderBottom:'1px solid var(--border)', color:'var(--text)', textAlign:'left',
                fontSize:14, fontWeight:700 }}>
              <CalendarBlank size={22} weight="light" color="var(--primary)" /> Crear evento
            </button>
            <button onClick={() => { setShowCreateMenu(false); router.push('/create/tournament') }}
              style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'16px 18px',
                background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
                color:'var(--text)', textAlign:'left', fontSize:14, fontWeight:700 }}>
              <Trophy size={22} weight="light" color="var(--primary)" /> Crear torneo
            </button>
          </div>
        </>
      )}

      <nav className="navbar" style={{
          backdropFilter: 'blur(26px) saturate(130%) contrast(0.95)',
          WebkitBackdropFilter: 'blur(26px) saturate(130%) contrast(0.95)',
          backgroundColor: 'var(--navbar-glass)',
          borderRadius: 0,
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'backdrop-filter',
        }}>
        <div className="nav-inner">
          {NAV_ITEMS.map(({ href, label, Icon, IconFill }) => {
            const active = path === href || (href !== '/' && path?.startsWith(href))
            const isActive = active || (label === 'Crear' && showCreateMenu)

            // Botón Crear especial (caja redondeada)
            if (label === 'Crear' && isBusiness) {
              return (
                <button key={href} onClick={() => setShowCreateMenu(p => !p)}
                  className={`nav-item${isActive ? ' active' : ''}`}
                  style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                  <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                    {isActive
                      ? <PlusCircleFill size={23} weight="fill" />
                      : <PlusCircle size={23} weight="light" />
                    }
                  </div>
                  <span className="nav-label">Crear</span>
                </button>
              )
            }

            const ActiveIcon = IconFill

            return (
              <Link key={href} href={href} className={`nav-item${isActive ? ' active' : ''}`}>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isActive
                    ? <ActiveIcon size={23} weight="fill" />
                    : <Icon size={23} weight="light" />
                  }
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

  return createPortal(navbar, document.body)
}
