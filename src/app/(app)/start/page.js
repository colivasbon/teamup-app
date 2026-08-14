'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { SportIcon } from '@/components/SportIcon'
import ThemeButton from '@/components/ThemeButton'

// Logo SVG inline — usa currentColor para cambiar con el tema
function LogoTeamUp({ height = 36 }) {
  const w = Math.round(height * (800 / 320))
  return (
    <svg width={w} height={height} viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" aria-label="TeamUp" style={{ display:'block' }}>
      <g fill="currentColor">
        {/* T */}
        <path d="M149.49,25.61v37.21c0,6.22-5.04,11.26-11.26,11.26h-29.11c-.78,0-1.41.63-1.41,1.41v170.35c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V75.49c0-.78-.63-1.41-1.41-1.41h-29.11c-6.22,0-11.26-5.04-11.26-11.26V25.61c0-6.22,5.04-11.26,11.26-11.26h112.92c6.22,0,11.26,5.04,11.26,11.26Z"/>
        {/* E */}
        <path d="M204.2,75.49v35.48h5.17c6.22,0,11.26,5.04,11.26,11.26v29.37c0,6.22-5.04,11.26-11.26,11.26h-5.17v33.09c0,.78.63,1.41,1.41,1.41h15.14c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-57.19c-6.22,0-11.26-5.04-11.26-11.26V25.48c0-6.22,5.04-11.26,11.26-11.26h40.63v.13h16.55c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-15.14c-.78,0-1.41.63-1.41,1.41Z"/>
        {/* A */}
        <path d="M234.83,25.22v220.23c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26v-79.73c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v79.73c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26V25.22c0-6.22-5.04-11.26-11.26-11.26h-87.76c-6.22,0-11.26,5.04-11.26,11.26ZM286.72,107.34v-30.4c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v30.4c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24Z"/>
        {/* M */}
        <path d="M518.32,25.48v220.36c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.2c0-1.79-1.45-3.24-3.24-3.24h0c-1.79,0-3.24,1.45-3.24,3.24v168.64c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.37c0-1.89-1.53-3.41-3.41-3.41h0c-1.89,0-3.41,1.53-3.41,3.41v168.47c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V56.45c0-23.32,18.9-42.22,42.22-42.22h115.51c6.22,0,11.26,5.04,11.26,11.26Z"/>
        {/* U */}
        <path d="M617.53,25.17v168.64c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24V25.17c0-6.22-5.04-11.26-11.26-11.26h-29.43c-6.22,0-11.26,5.04-11.26,11.26v220.35c0,6.22,5.04,11.26,11.26,11.26h81.27c6.22,0,11.26-5.04,11.26-11.26V25.17c0-6.22-5.04-11.26-11.26-11.26h-22.83c-6.22,0-11.26,5.04-11.26,11.26Z"/>
        {/* P */}
        <path d="M730.13,13.79v.11h-50.26c-6.22,0-11.26,5.04-11.26,11.26v220.46c0,6.22,5.04,11.26,11.26,11.26h32.46c6.22,0,11.26-5.04,11.26-11.26v-97.34c0-.78.63-1.41,1.41-1.41h5.14c30.83,0,55.82-24.99,55.82-55.82v-21.44c0-30.83-24.99-55.82-55.82-55.82h0ZM723.59,90.35v-26.11c0-1.81,1.47-3.27,3.27-3.27h0c1.81,0,3.27,1.47,3.27,3.27v26.11c0,1.81-1.47,3.27-3.27,3.27h0c-1.81,0-3.27-1.47-3.27-3.27Z"/>
      </g>
    </svg>
  )
}

const SPORT_ICONS  = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴', yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸' }

const SPORTS = [
  { id:'running',    name:'Running',    icon:'🏃', from:'var(--primary)', to:'var(--primary-h)' },
  { id:'padel',      name:'Pádel',      icon:'🎾', from:'#7a9a8a', to:'#5a7a6a' },
  { id:'senderismo', name:'Senderismo', icon:'🥾', from:'#a07840', to:'#c8a96e' },
  { id:'futbol',     name:'Fútbol',     icon:'⚽', from:'var(--danger)', to:'#c53030' },
  { id:'gimnasio',   name:'Gimnasio',   icon:'💪', from:'#7a6858', to:'#5a4838' },
  { id:'tenis',      name:'Tenis',      icon:'🎾', from:'#8a9878', to:'#6a7858' },
]

const DEMO_NEARBY = [
  { id:'demo-1', sport:'running',    title:'Running Matutino',   loc:'Alameda de Córdoba',     time:'Hoy · 07:30',    p:7,  max:10, color:'#586875' },
  { id:'demo-2', sport:'padel',      title:'Torneo Pádel Medio', loc:'Club Pádel Centro',       time:'Mañana · 18:00', p:2,  max:4,  color:'#c8a96e' },
  { id:'demo-4', sport:'futbol',     title:'Fútbol 7 tarde',     loc:'Polideportivo Municipal', time:'Vie · 20:00',    p:11, max:14, color:'#7a9a8a' },
]

function fmtDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const tom = new Date(today); tom.setDate(tom.getDate() + 1)
  let day = ''
  if (d.getTime() === today.getTime())     day = 'Hoy'
  else if (d.getTime() === tom.getTime())  day = 'Mañana'
  else day = d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short' })
  return timeStr ? `${day} · ${timeStr.slice(0,5)}` : day
}

export default function Home() {
  const { user, profile } = useAuth()
  const avatarUrl   = profile?.avatar_url || null
  const displayName = profile?.full_name || user?.user_metadata?.full_name || null

  const [myEvents,        setMyEvents]        = useState([])
  const [unreadCount,     setUnreadCount]     = useState(0)
  const [sponsors,        setSponsors]        = useState([])
  const [activeEventCount, setActiveEventCount] = useState(null)
  const [participantCount, setParticipantCount] = useState(null)
  const [newEventCount,    setNewEventCount]    = useState(null)
  const [deferredPrompt,  setDeferredPrompt]  = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled,    setIsInstalled]    = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setShowInstallButton(false)
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    setIsInstalled(standalone)
    if (standalone) setShowInstallButton(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }
  }

  // Cargar patrocinadores
  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    sb.from('sponsors')
      .select('id, name, logo_url, website_url')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setSponsors(data) })
  }, [])

  // Cargar estadísticas de comunidad y actividad
  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return

    const today = new Date().toISOString().split('T')[0]
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const sinceIso = since.toISOString()

    const loadStats = async () => {
      try {
        const [activeEventsRes, usersRes, newEventsRes] = await Promise.all([
          sb.from('events').select('id', { count:'exact', head:true }).neq('status', 'cancelled').gte('date', today),
          sb.from('profiles').select('id', { count:'exact', head:true }),
          sb.from('events').select('id', { count:'exact', head:true }).neq('status', 'cancelled').gte('created_at', sinceIso),
        ])

        if (activeEventsRes?.count != null) setActiveEventCount(activeEventsRes.count)
        if (usersRes?.count != null) setParticipantCount(usersRes.count)
        if (newEventsRes?.count != null) setNewEventCount(newEventsRes.count)
      } catch (_) {
        setActiveEventCount(0)
        setParticipantCount(0)
        setNewEventCount(0)
      }
    }
    loadStats()
  }, [])


  // Cargar notificaciones sin leer
  useEffect(() => {
    if (!user) return
    const fetchUnread = async () => {
      try {
        const sb = getSupabase(); if (!sb) return
        const { data } = await sb.from('notifications')
          .select('id').eq('user_id', user.id).eq('read', false)
        setUnreadCount(data?.length || 0)
      } catch(_) {}
    }
    fetchUnread()
    const iv = setInterval(fetchUnread, 30000)
    return () => clearInterval(iv)
  }, [user])

  // Cargar eventos del usuario logueado
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const sb = getSupabase()
        if (!sb) return
        const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD
        // Eventos en los que participa y que aún no han pasado
        const { data } = await sb
          .from('event_participants')
          .select('event_id, events_with_counts(id, title, sport, date, time, location, participant_count, max_players)')
          .eq('user_id', user.id)
          .limit(5)
        if (data) {
          const evs = data
            .map(d => d.events_with_counts)
            .filter(e => e && e.date >= now)
            .sort((a, b) => a.date.localeCompare(b.date))
          setMyEvents(evs.slice(0, 3))
        }
      } catch(_) {}
    }
    load()
  }, [user])

  return (
    <>
      <div className="page-wrap">

        {/* ── Header ── */}
        <header className="start-header">
          <h1 className="sr-only">
            TeamUp — Haz deporte, conoce gente en tu zona
          </h1>

          <Link href="/start" className="start-logo-link">
            <LogoTeamUp height={36} />
          </Link>

          <div className="start-header-actions">
            <ThemeButton />
            {showInstallButton && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="btn btn-primary"
                style={{ minWidth:120, padding:'10px 14px', height:40, whiteSpace:'nowrap' }}
              >
                Instalar app
              </button>
            )}
            <Link href="/profile" className="avatar-wrap" style={{ width:44, height:44 }}>
              {avatarUrl
                ? <Image src={avatarUrl} alt={displayName || 'Perfil'} width={44} height={44} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                : <span className="avatar-placeholder" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>👤</span>
              }
            </Link>
          </div>
        </header>

        {/* ── Actividad de la comunidad (tira compacta) ── */}
        {(activeEventCount > 0 && participantCount > 0 && newEventCount > 0) && (
          <div className="stats-strip anim-1" style={{ marginBottom: 22 }}>
            {[
              [activeEventCount, 'Eventos activos'],
              [participantCount, 'Deportistas'],
              [newEventCount, 'Nuevos 7 días'],
            ].map(([v,l])=>(
              <div key={l}>
                <div className="stat-value">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        )}


        {/* ── Mis próximos eventos (solo logueado) ── */}
        {user && myEvents.length > 0 && (
          <>
            <div className="start-section-head">
              <h3>Mis próximos eventos</h3>
              <Link href="/profile" className="start-section-link">Ver todos →</Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
              {myEvents.map((ev, i) => {
                const color = 'var(--primary)'
                const pct   = ev.max_players > 0 ? Math.round(((ev.participant_count||0) / ev.max_players) * 100) : 0
                return (
                  <Link key={ev.id} href={`/events/${ev.id}`} className={`start-event-card card anim-${i+1}`}>
                    <div className="start-event-icon" style={{ background:'rgba(var(--primary-rgb),0.10)', border:'1.5px solid rgba(var(--primary-rgb),0.20)' }}>
                      <SportIcon sport={ev.sport} size={36} />
                    </div>
                    <div className="start-event-info">
                      <div className="start-event-title">{ev.title}</div>
                      <div className="start-event-loc">{ev.location}</div>
                      <div className="start-event-meta">
                        <span className="start-event-date">{fmtDate(ev.date, ev.time)}</span>
                        <div style={{ flex:1 }}><div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%` }}/></div></div>
                        <span className="start-event-count" style={{ color }}>{ev.participant_count||0}/{ev.max_players}</span>
                      </div>
                    </div>
                    <span className="start-event-arrow">›</span>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* ── Banner notificaciones (solo si hay sin leer) ── */}
        {user && unreadCount > 0 && (
          <Link href="/profile" className="start-notif-banner card anim-1">
            <div className="start-notif-icon">
              🔔
              <span className="start-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
            <div className="start-notif-text">
              <div className="start-notif-title">
                {unreadCount === 1 ? '1 notificación nueva' : `${unreadCount} notificaciones nuevas`}
              </div>
              <div className="start-notif-sub">Ver en tu perfil</div>
            </div>
            <span className="start-event-arrow">›</span>
          </Link>
        )}

        {/* ── Deportes ── */}
        <h2 style={{ fontSize:18, fontWeight:900, margin:'0 0 4px', letterSpacing:'-0.03em', color:'var(--text)', lineHeight:1.15 }}>¿Qué hacemos hoy?</h2>
        <p style={{ fontSize:12.5, color:'var(--muted)', margin:'0 0 10px' }}>Elige un deporte y únete a un evento</p>

        <div className="start-sport-grid">
          {SPORTS.map((s,i)=>(
            <Link key={s.id} href={`/events?sport=${s.id}`} className={`start-sport-card anim-${Math.min(i+1,6)}`}>
              <span className="start-sport-icon" style={{ background:`linear-gradient(140deg,${s.from},${s.to})` }}>
                <SportIcon sport={s.id} size={17} />
              </span>
              <span className="start-sport-label">{s.name}</span>
            </Link>
          ))}
        </div>

        {/* ── Eventos cercanos ── */}
        <div className="start-section-head">
          <h3>Eventos cerca de ti</h3>
          <Link href="/events" className="start-section-link">Ver todos →</Link>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          {DEMO_NEARBY.map((ev,i)=>(
            <Link key={ev.id} href={`/events/${ev.id}`} className={`start-event-card card anim-${i+4}`}>
              <div className="start-event-icon" style={{ background:`${ev.color}18`, border:`1.5px solid ${ev.color}30` }}>
                <SportIcon sport={ev.sport} size={36} />
              </div>
              <div className="start-event-info">
                <div className="start-event-title">{ev.title}</div>
                <div className="start-event-loc">{ev.loc}</div>
                <div className="start-event-meta">
                  <span className="start-event-date">{ev.time}</span>
                  <div style={{ flex:1 }}><div className="pbar"><div className="pbar-fill" style={{ width:`${Math.round((ev.p/ev.max)*100)}%`, background:ev.color }}/></div></div>
                  <span className="start-event-count" style={{ color:ev.color }}>{ev.p}/{ev.max}</span>
                </div>
              </div>
              <span className="start-event-arrow">›</span>
            </Link>
          ))}
        </div>

        <Link href="/create" className="btn btn-primary" style={{ display:'flex', width:'100%', fontSize:15, padding:'13px 24px', borderRadius:14, marginBottom:10, justifyContent:'center', gap:8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear evento
        </Link>

        {/* Ticker patrocinadores: elemento de página, se ve al llegar con scroll */}
        {(() => {
          const list = sponsors.length > 0
            ? sponsors
            : Array.from({length:4}).map((_,i) => ({ id:i, name:'PATROCINADOR', logo_url:null, website_url:null }))
          // Repetir la secuencia completa para que el loop sea fluido
          const repeated = Array.from({length: 10}).flatMap(() => list)
          return (
            <div className="sponsors-ticker">
              <div className="sponsors-ticker__inner">
                {repeated.map((s, i) => (
                  s.website_url
                    ? <a key={i} href={s.website_url} target="_blank" rel="noopener noreferrer" className="sponsors-ticker__item" style={{ textDecoration:'none', cursor:'pointer' }}>
                        {s.logo_url
                          ? <Image src={s.logo_url} alt={s.name} width={140} height={36} style={{ height:36, width:'auto', maxWidth:140, objectFit:'contain', verticalAlign:'middle', filter:'var(--sponsor-filter)' }} />
                          : s.name
                        }
                      </a>
                    : <span key={i} className="sponsors-ticker__item">
                        {s.logo_url
                          ? <Image src={s.logo_url} alt={s.name} width={140} height={36} style={{ height:36, width:'auto', maxWidth:140, objectFit:'contain', verticalAlign:'middle', filter:'var(--sponsor-filter)' }} />
                          : s.name
                        }
                      </span>
                ))}
              </div>
            </div>
          )
        })()}

      </div>

      <Navbar />
    </>
  )
}
