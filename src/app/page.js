'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
  { id:'running',    name:'Running',    icon:'🏃', from:'#586875', to:'#3f4f5a' },
  { id:'padel',      name:'Pádel',      icon:'🎾', from:'#7a9a8a', to:'#5a7a6a' },
  { id:'senderismo', name:'Senderismo', icon:'🥾', from:'#a07840', to:'#c8a96e' },
  { id:'futbol',     name:'Fútbol',     icon:'⚽', from:'#5a6870', to:'#3a4850' },
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

  const [myEvents,    setMyEvents]    = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

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
        <header style={{ paddingTop:56, paddingBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>

          {/* Logo — color azul en claro, crema en oscuro */}
          <Link href="/" style={{
            color:'#586875',
            display:'flex', alignItems:'center',
            flex:1, minWidth:0,
          }}>
            <style>{`[data-theme="dark"] .home-logo { color: #f6eddc !important; }`}</style>
            <span className="home-logo" style={{ color:'inherit', display:'flex', alignItems:'center' }}>
              <LogoTeamUp height={36} />
            </span>
          </Link>

          {/* Lado derecho: ThemeButton + Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <ThemeButton />
            <Link href="/profile" style={{
              width:44, height:44, borderRadius:'50%',
              background: avatarUrl ? 'transparent' : 'var(--glass)',
              border:'2px solid var(--border)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, backdropFilter:'blur(14px)',
              overflow:'hidden', flexShrink:0,
              boxShadow:'var(--shadow-sm)',
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName || 'Perfil'} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <span>👤</span>
              }
            </Link>
          </div>
        </header>

        {/* ── Stats ── */}
        <div className="card anim-1" style={{ display:'flex', justifyContent:'space-around', padding:'16px 12px', marginBottom:28 }}>
          {[['150+','Eventos activos'],['1.2k','Deportistas'],['47','Provincias']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--primary)', letterSpacing:'-0.03em', lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── Mis próximos eventos (solo logueado) ── */}
        {user && myEvents.length > 0 && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <h3 style={{ fontSize:17, fontWeight:700, margin:0, letterSpacing:'-0.02em' }}>Mis próximos eventos</h3>
              <Link href="/profile" style={{ fontSize:13, fontWeight:600, color:'var(--primary)' }}>Ver todos →</Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
              {myEvents.map((ev, i) => {
                const color = '#586875'
                const pct   = ev.max_players > 0 ? Math.round(((ev.participant_count||0) / ev.max_players) * 100) : 0
                return (
                  <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${i+1}`} style={{
                    display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                    borderLeft:'3px solid #586875',
                  }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'rgba(88,104,117,0.10)', border:'1.5px solid rgba(88,104,117,0.20)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                      <SportIcon sport={ev.sport} size={36} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{ev.title}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:7 }}>{ev.location}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:11, color:'var(--muted)', whiteSpace:'nowrap' }}>{fmtDate(ev.date, ev.time)}</span>
                        <div style={{ flex:1 }}><div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:color }}/></div></div>
                        <span style={{ fontSize:11, fontWeight:700, color:color, whiteSpace:'nowrap' }}>{ev.participant_count||0}/{ev.max_players}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:18, color:'var(--muted)', flexShrink:0 }}>›</div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* ── Banner notificaciones (solo si hay sin leer) ── */}
        {user && unreadCount > 0 && (
          <Link href="/profile" className="card anim-1" style={{
            display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
            marginBottom:20, textDecoration:'none',
            background:'linear-gradient(135deg, rgba(88,104,117,0.18), rgba(88,104,117,0.08))',
            border:'1.5px solid rgba(88,104,117,0.30)',
          }}>
            <div style={{
              width:42, height:42, borderRadius:'50%', flexShrink:0,
              background:'#586875', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, position:'relative',
            }}>
              🔔
              <span style={{
                position:'absolute', top:-3, right:-3, width:16, height:16,
                background:'#ef4444', borderRadius:'50%', border:'2px solid var(--bg)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:800, color:'white', lineHeight:1,
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>
                {unreadCount === 1 ? '1 notificación nueva' : `${unreadCount} notificaciones nuevas`}
              </div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Ver en tu perfil</div>
            </div>
            <span style={{ fontSize:18, color:'var(--muted)' }}>›</span>
          </Link>
        )}

        {/* ── Deportes ── */}
        <h2 style={{ fontSize:19, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.03em' }}>¿Qué hacemos hoy?</h2>
        <p style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>Elige un deporte y únete a un evento</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {SPORTS.map((s,i)=>(
            <Link key={s.id} href={`/events?sport=${s.id}`} className={`anim-${Math.min(i+1,6)}`} style={{
              display:'block',
              background:`linear-gradient(140deg,${s.from},${s.to})`,
              borderRadius:20, padding:'0', paddingTop:'90px', position:'relative', overflow:'hidden',
              boxShadow:`0 6px 24px ${s.from}55`,
              transition:'transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow=`0 12px 36px ${s.from}77` }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 6px 24px ${s.from}55` }}
            >
              {/* Icono de fondo semitransparente — esquina inferior derecha */}
              <div style={{ position:'absolute', right:6, bottom:4, opacity:0.18, pointerEvents:'none' }}>
                <SportIcon sport={s.id} size={72} />
              </div>
              {/* Contenido: icono + nombre abajo a la izquierda */}
              <div style={{ position:'absolute', bottom:16, left:18, zIndex:1 }}>
                <SportIcon sport={s.id} size={48} />
                <div style={{ fontSize:15, fontWeight:700, color:'#f6eddc', letterSpacing:'-0.02em' }}>{s.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Eventos cercanos ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <h3 style={{ fontSize:17, fontWeight:700, margin:0, letterSpacing:'-0.02em' }}>Eventos cerca de ti</h3>
          <Link href="/events" style={{ fontSize:13, fontWeight:600, color:'var(--primary)' }}>Ver todos →</Link>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          {DEMO_NEARBY.map((ev,i)=>(
            <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${i+4}`} style={{
              display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
              borderLeft:`3px solid ${ev.color}`,
            }}>
              <div style={{ width:52, height:52, background:`${ev.color}18`, border:`1.5px solid ${ev.color}30`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                <SportIcon sport={ev.sport} size={36} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{ev.title}</div>
                <div style={{ fontSize:12, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:8 }}>{ev.loc}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11, color:'var(--muted)', whiteSpace:'nowrap' }}>{ev.time}</span>
                  <div style={{ flex:1 }}><div className="pbar"><div className="pbar-fill" style={{ width:`${Math.round((ev.p/ev.max)*100)}%`, background:ev.color }}/></div></div>
                  <span style={{ fontSize:11, fontWeight:700, color:ev.color, whiteSpace:'nowrap' }}>{ev.p}/{ev.max}</span>
                </div>
              </div>
              <div style={{ fontSize:18, color:'var(--muted)', flexShrink:0 }}>›</div>
            </Link>
          ))}
        </div>

        <Link href="/create" className="btn btn-primary" style={{ display:'flex', width:'100%', fontSize:16, padding:'15px 24px', borderRadius:16, marginBottom:32, justifyContent:'center', gap:8 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear evento
        </Link>

      </div>

      {/* ── Carrusel patrocinadores ── */}

      <Navbar />
    </>
  )
}
