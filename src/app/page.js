'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'

const SPORTS = [
  { id:'running',    name:'Running',    icon:'🏃', from:'#5b6ef5', to:'#818cf8' },
  { id:'padel',      name:'Pádel',      icon:'🎾', from:'#06b6d4', to:'#06d6a0' },
  { id:'senderismo', name:'Senderismo', icon:'🥾', from:'#f59e0b', to:'#f97316' },
  { id:'futbol',     name:'Fútbol',     icon:'⚽', from:'#ef4444', to:'#dc2626' },
  { id:'gimnasio',   name:'Gimnasio',   icon:'💪', from:'#8b5cf6', to:'#d946ef' },
  { id:'tenis',      name:'Tenis',      icon:'🎾', from:'#fbbf24', to:'#f59e0b' },
]

const NEARBY = [
  { id:'demo-1', icon:'🏃', title:'Running Matutino',   loc:'Alameda de Córdoba',     time:'Hoy · 07:30',    p:7,  max:10, color:'#5b6ef5' },
  { id:'demo-2', icon:'🎾', title:'Torneo Pádel Medio', loc:'Club Pádel Centro',       time:'Mañana · 18:00', p:2,  max:4,  color:'#06d6a0' },
  { id:'demo-4', icon:'⚽', title:'Fútbol 7 tarde',     loc:'Polideportivo Municipal', time:'Vie · 20:00',    p:11, max:14, color:'#ef4444' },
]

export default function Home() {
  const { user, profile } = useAuth()

  const avatarUrl   = profile?.avatar_url || null
  const displayName = profile?.full_name || user?.user_metadata?.full_name || null

  return (
    <>
      <div className="page-wrap">

        {/* Header */}
        <header style={{ paddingTop:60, paddingBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <svg width="36" height="36" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="11" fill="url(#hg1)"/>
                <path d="M11 17L17 11L23 17L17 23Z" fill="white" opacity="0.92"/>
                <circle cx="17" cy="17" r="3.5" fill="white"/>
                <defs>
                  <linearGradient id="hg1" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5b6ef5"/><stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontSize:23, fontWeight:800, letterSpacing:'-0.04em', background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                TeamUp
              </span>
            </div>
            <p style={{ fontSize:14, color:'var(--muted)', margin:0 }}>Haz deporte, conoce gente</p>
          </div>

          {/* Avatar real del usuario */}
          <Link href="/profile" style={{
            width:40, height:40, borderRadius:'50%',
            background: avatarUrl ? 'transparent' : 'var(--glass)',
            border:'2px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, backdropFilter:'blur(14px)',
            overflow:'hidden', flexShrink:0,
            boxShadow:'var(--shadow-sm)',
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName || 'Perfil'} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <span>👤</span>
            }
          </Link>
        </header>

        {/* Stats */}
        <div className="card anim-1" style={{ display:'flex', justifyContent:'space-around', padding:'16px 12px', marginBottom:28 }}>
          {[['150+','Eventos activos'],['1.2k','Deportistas'],['47','Provincias']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--primary)', letterSpacing:'-0.03em', lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Deportes */}
        <h2 style={{ fontSize:19, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.03em' }}>¿Qué hacemos hoy?</h2>
        <p style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>Elige un deporte y únete a un evento</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {SPORTS.map((s,i)=>(
            <Link key={s.id} href={`/events?sport=${s.id}`} className={`anim-${Math.min(i+1,6)}`} style={{
              display:'block', background:`linear-gradient(140deg,${s.from},${s.to})`,
              borderRadius:20, padding:'20px 18px', position:'relative', overflow:'hidden',
              boxShadow:`0 6px 24px ${s.from}44`,
              transition:'transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px) scale(1.02)';e.currentTarget.style.boxShadow=`0 12px 36px ${s.from}66`}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=`0 6px 24px ${s.from}44`}}
            >
              <div style={{ position:'absolute', right:-16, bottom:-16, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.14)', filter:'blur(18px)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', right:8, bottom:2, fontSize:52, opacity:0.16, lineHeight:1, pointerEvents:'none', userSelect:'none' }}>{s.icon}</div>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:30, marginBottom:8, lineHeight:1 }}>{s.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'white', letterSpacing:'-0.02em' }}>{s.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Eventos cercanos */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <h3 style={{ fontSize:17, fontWeight:700, margin:0, letterSpacing:'-0.02em' }}>Eventos cerca de ti</h3>
          <Link href="/events" style={{ fontSize:13, fontWeight:600, color:'var(--primary)' }}>Ver todos →</Link>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          {NEARBY.map((ev,i)=>(
            <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${i+4}`} style={{
              display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
              borderLeft:`3px solid ${ev.color}`,
            }}>
              <div className="sport-icon" style={{ background:`${ev.color}18`, border:`1.5px solid ${ev.color}30`, borderRadius:16, fontSize:22 }}>
                {ev.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, letterSpacing:'-0.02em', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--text)' }}>{ev.title}</div>
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

        {/* CTA crear evento — margen generoso antes del navbar */}
        <Link href="/create" className="btn btn-primary" style={{ display:'flex', width:'100%', fontSize:16, padding:'15px 24px', borderRadius:16, marginBottom:32, justifyContent:'center', gap:8 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear evento
        </Link>

      </div>
      <Navbar />
    </>
  )
}
