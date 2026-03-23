'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const EVENTS = [
  { id:1,  sport:'running',    icon:'🏃', title:'Running Matutino',          desc:'Ruta suave por la Alameda. Todos los niveles bienvenidos.', date:'Hoy',    time:'07:30', loc:'Alameda de Córdoba',    province:'cordoba',   level:'any',          levelLabel:'Todos',        levelColor:'#6b7599', color:'#5b6ef5', p:7,  max:10, wait:2, creator:'Carlos O.',  thirdPlace:false },
  { id:2,  sport:'padel',      icon:'🎾', title:'Torneo Pádel Nivel Medio',  desc:'Rondas de 20 min con rotación. Raquetas disponibles.', date:'Mañana', time:'10:00', loc:'Club Pádel Córdoba',     province:'cordoba',   level:'intermediate', levelLabel:'Intermedio',   levelColor:'#f59e0b', color:'#06d6a0', p:6,  max:8,  wait:1, creator:'María G.',   thirdPlace:true  },
  { id:3,  sport:'senderismo', icon:'🥾', title:'Ruta Sierra Nevada',        desc:'12 km con desnivel +890m. Llevar agua y calzado adecuado.',    date:'Sáb',    time:'08:00', loc:'Plaza Mayor, Granada',  province:'granada',   level:'advanced',     levelLabel:'Avanzado',     levelColor:'#ef4444', color:'#f59e0b', p:12, max:20, wait:8, creator:'Javi M.',    thirdPlace:true  },
  { id:4,  sport:'futbol',     icon:'⚽', title:'Fútbol 7 tarde',            desc:'Partido amistoso. Cualquier nivel. A disfrutar.', date:'Vie',    time:'20:00', loc:'Polideportivo Municipal', province:'sevilla',   level:'any',          levelLabel:'Todos',        levelColor:'#6b7599', color:'#ef4444', p:11, max:14, wait:3, creator:'Diego R.',   thirdPlace:true  },
  { id:5,  sport:'gimnasio',   icon:'💪', title:'Entreno Funcional Grupal',  desc:'4 rondas de ejercicios funcionales. Alta intensidad.', date:'Hoy',    time:'19:00', loc:'Box CrossFit Sur',      province:'madrid',    level:'intermediate', levelLabel:'Intermedio',   levelColor:'#f59e0b', color:'#8b5cf6', p:8,  max:12, wait:0, creator:'Laura S.',   thirdPlace:false },
]

const SPORT_FILTERS = [
  { id:'all',        label:'Todos',     icon:'✨' },
  { id:'running',    label:'Running',   icon:'🏃' },
  { id:'padel',      label:'Pádel',     icon:'🎾' },
  { id:'senderismo', label:'Senderismo',icon:'🥾' },
  { id:'futbol',     label:'Fútbol',    icon:'⚽' },
  { id:'gimnasio',   label:'Gimnasio',  icon:'💪' },
]

const LEVEL_FILTERS = [
  { id:'all',          label:'Todos',        icon:'🌍' },
  { id:'beginner',     label:'Principiante', icon:'🌱' },
  { id:'intermediate', label:'Intermedio',   icon:'⭐' },
  { id:'advanced',     label:'Avanzado',     icon:'🔥' },
]

const PROVINCES = [
  { id:'all',       name:'Todas' },
  { id:'madrid',    name:'Madrid' },
  { id:'barcelona', name:'Barcelona' },
  { id:'valencia',  name:'Valencia' },
  { id:'sevilla',   name:'Sevilla' },
  { id:'cordoba',   name:'Córdoba' },
  { id:'granada',   name:'Granada' },
  { id:'malaga',    name:'Málaga' },
  { id:'alicante',  name:'Alicante' },
]

export default function Events() {
  const [sport,  setSport]  = useState('all')
  const [level,  setLevel]  = useState('all')
  const [prov,   setProv]   = useState('all')

  const filtered = EVENTS.filter(e =>
    (sport==='all' || e.sport===sport) &&
    (prov==='all'  || e.province===prov) &&
    (level==='all' || e.level===level  || e.level==='any')
  )

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        {/* Header */}
        <header style={{ paddingTop:60, paddingBottom:18 }}>
          <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.04em' }}>Eventos</h1>
          <p style={{ fontSize:14, color:'var(--muted)', margin:0 }}>
            {filtered.length} evento{filtered.length!==1?'s':''} disponibles
          </p>
        </header>

        {/* Filtro provincias */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {PROVINCES.map(p => (
            <button key={p.id} onClick={()=>setProv(p.id)}
              className={`pill ${prov===p.id?'pill-active':'pill-inactive'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Filtro deporte */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {SPORT_FILTERS.map(f => (
            <button key={f.id} onClick={()=>setSport(f.id)}
              className={`pill ${sport===f.id?'pill-active':'pill-inactive'}`}>
              <span>{f.icon}</span><span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Filtro nivel */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:22 }}>
          {LEVEL_FILTERS.map(l => (
            <button key={l.id} onClick={()=>setLevel(l.id)}
              className={`pill ${level===l.id?'pill-active':'pill-inactive'}`}
              style={level===l.id ? { background:'linear-gradient(135deg,#8b5cf6,#d946ef)', boxShadow:'0 3px 14px rgba(139,92,246,0.35)' } : {}}>
              <span>{l.icon}</span><span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Sin resultados */}
        {filtered.length===0 && (
          <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Sin resultados</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Prueba con otros filtros</div>
          </div>
        )}

        {/* Lista de eventos */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map((ev, i) => {
            const pct = Math.round((ev.p/ev.max)*100)
            const barColor = pct>=90?'#ef4444':pct>=70?'#f59e0b':ev.color
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className={`card anim-${Math.min(i+1,6)}`}
                style={{ display:'block', overflow:'hidden', position:'relative' }}
              >
                {/* Barra de color superior */}
                <div style={{ height:3, background:`linear-gradient(90deg,${ev.color},${ev.color}55)` }}/>

                <div style={{ padding:'16px 18px' }}>
                  {/* Cabecera */}
                  <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:12 }}>
                    <div className="sport-icon" style={{ background:`${ev.color}18`, border:`1.5px solid ${ev.color}30`, borderRadius:16 }}>
                      {ev.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                        <h3 style={{ fontSize:15, fontWeight:700, margin:0, letterSpacing:'-0.02em', lineHeight:1.3, color:'var(--text)' }}>{ev.title}</h3>
                        {ev.thirdPlace && (
                          <span className="badge" style={{ background:'rgba(251,191,36,0.15)', color:'#f59e0b', flexShrink:0 }}>🍺 Tercer tiempo</span>
                        )}
                      </div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>por {ev.creator}</div>
                    </div>
                  </div>

                  <p style={{ fontSize:13, color:'var(--text2)', margin:'0 0 14px', lineHeight:1.6 }}>{ev.desc}</p>

                  {/* Meta info */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 18px', marginBottom:14, fontSize:12, color:'var(--muted)' }}>
                    <span>📅 {ev.date} · {ev.time}</span>
                    <span>📍 {ev.loc}</span>
                    <span className="badge" style={{ background:`${ev.color}18`, color:ev.color }}>
                      {ev.levelLabel}
                    </span>
                  </div>

                  {/* Ocupación + botón */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div className="pbar">
                        <div className="pbar-fill" style={{ width:`${pct}%`, background:barColor }}/>
                      </div>
                    </div>
                    <span style={{ fontSize:12, color:barColor, fontWeight:700, whiteSpace:'nowrap' }}>
                      {ev.p}/{ev.max}
                      {ev.wait>0 && <span style={{ color:'var(--violet)', fontWeight:500 }}> +{ev.wait}</span>}
                    </span>
                    <button
                      onClick={e => e.preventDefault()}
                      style={{
                        background:`linear-gradient(135deg,${ev.color},${ev.color}bb)`,
                        color:'white', border:'none', borderRadius:10,
                        padding:'9px 18px', fontWeight:700, fontSize:13,
                        cursor:'pointer', letterSpacing:'-0.01em',
                        boxShadow:`0 3px 14px ${ev.color}44`,
                        transition:'all 0.16s ease',
                        fontFamily:'inherit',
                      }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                      onMouseLeave={e=>e.currentTarget.style.transform=''}
                    >
                      Unirse
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
      <Navbar />
    </>
  )
}
