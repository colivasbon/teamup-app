'use client'

import Link from 'next/link'

const sports = [
  { id:'running',    name:'Running',    icon:'🏃', from:'#5b6ef5', to:'#818cf8' },
  { id:'padel',      name:'Pádel',      icon:'🎾', from:'#06b6d4', to:'#06d6a0' },
  { id:'senderismo', name:'Senderismo', icon:'🥾', from:'#f59e0b', to:'#ef4444' },
  { id:'futbol',     name:'Fútbol',     icon:'⚽', from:'#ef4444', to:'#dc2626' },
  { id:'gimnasio',   name:'Gimnasio',   icon:'💪', from:'#8b5cf6', to:'#d946ef' },
  { id:'tenis',      name:'Tenis',      icon:'🎾', from:'#f59e0b', to:'#fbbf24' },
]

const preview = [
  { id:1, icon:'🏃', title:'Running Dominguero', loc:'Parque de la Ciudad · Madrid', time:'Hoy · 10:00', p:8,  max:15, color:'#5b6ef5' },
  { id:2, icon:'🎾', title:'Partido de Pádel',   loc:'Club Pádel Centro · Valencia',  time:'Mañana · 18:00', p:2, max:4, color:'#06d6a0' },
]

export default function Home() {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div className="page-wrap" style={{ padding:'0 20px' }}>

        {/* ── Header ── */}
        <header style={{ paddingTop:56, paddingBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              {/* Logo */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="11" fill="url(#lg1)"/>
                <path d="M11 17L17 11L23 17L17 23Z" fill="white" opacity="0.92"/>
                <circle cx="17" cy="17" r="3.5" fill="white"/>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5b6ef5"/><stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                TeamUp
              </span>
            </div>
            <p style={{ fontSize:14, color:'var(--muted)', margin:0 }}>Haz deporte, conoce gente</p>
          </div>
          <Link href="/profile" className="btn-icon" style={{ textDecoration:'none', fontSize:18 }}>👤</Link>
        </header>

        {/* ── Stats ── */}
        <div className="card anim-1" style={{ display:'flex', justifyContent:'space-around', padding:'16px 12px', marginBottom:24, borderRadius:'var(--radius)' }}>
          {[['150+','Eventos'],['1.2k','Deportistas'],['50','Provincias']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color:'var(--primary)', letterSpacing:'-0.02em' }}>{v}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── Section ── */}
        <div style={{ marginBottom:16 }}>
          <h2 style={{ fontSize:18, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em' }}>¿Qué quieres hacer hoy?</h2>
          <p style={{ fontSize:14, color:'var(--muted)', margin:0 }}>Elige un deporte y únete</p>
        </div>

        {/* ── Sports grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {sports.map((s,i)=>(
            <Link
              key={s.id}
              href={`/events?sport=${s.id}`}
              className={`anim-${Math.min(i+1,6)}`}
              style={{
                display:'block',
                background:`linear-gradient(135deg,${s.from},${s.to})`,
                borderRadius:20,
                padding:'20px 18px',
                textDecoration:'none',
                position:'relative',
                overflow:'hidden',
                boxShadow:`0 6px 24px ${s.from}44`,
                transition:'transform 0.18s ease, box-shadow 0.18s ease',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px) scale(1.02)';e.currentTarget.style.boxShadow=`0 10px 32px ${s.from}66`}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 6px 24px ${s.from}44`}}
            >
              {/* glow orb */}
              <div style={{ position:'absolute', right:-12, bottom:-12, width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(14px)' }}/>
              {/* big faded icon */}
              <div style={{ position:'absolute', right:8, bottom:4, fontSize:48, opacity:0.18, lineHeight:1, pointerEvents:'none', userSelect:'none' }}>{s.icon}</div>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:30, marginBottom:8, lineHeight:1 }}>{s.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'white', letterSpacing:'-0.01em' }}>{s.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Preview events ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <h3 style={{ fontSize:16, fontWeight:700, margin:0, letterSpacing:'-0.02em' }}>Eventos cercanos</h3>
          <Link href="/events" style={{ fontSize:13, fontWeight:600, color:'var(--primary)', textDecoration:'none' }}>Ver todos →</Link>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {preview.map((ev,i)=>(
            <Link
              key={ev.id}
              href="/events"
              className={`card anim-${i+4}`}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', textDecoration:'none', color:'inherit' }}
            >
              <div className="sport-icon" style={{ background:`${ev.color}18`, border:`1.5px solid ${ev.color}33`, fontSize:22 }}>{ev.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, letterSpacing:'-0.01em', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</div>
                <div style={{ fontSize:12, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:8 }}>{ev.loc}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11, color:'var(--muted)' }}>{ev.time}</span>
                  <div style={{ flex:1 }}>
                    <div className="pbar"><div className="pbar-fill" style={{ width:`${(ev.p/ev.max)*100}%`, background:ev.color }}/></div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:ev.color }}>{ev.p}/{ev.max}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ position:'fixed', bottom:76, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 40px)', maxWidth:440, zIndex:50 }}>
          <Link href="/create" className="btn-primary" style={{ display:'flex', width:'100%' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Crear evento
          </Link>
        </div>

      </div>
    </div>
  )
}
