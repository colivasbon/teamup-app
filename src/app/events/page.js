'use client'

import { useState } from 'react'
import Link from 'next/link'

const events = [
  { id:1, sport:'running', icon:'🏃', title:'Running Dominguero', desc:'Ruta suave por el parque. Todos los niveles bienvenidos.', date:'Dom 30 Mar', time:'10:00', loc:'Parque de la Ciudad', province:'madrid', level:'any', levelLabel:'Todos', levelIcon:'🌍', thirdPlace:true, p:8,  max:15, wait:5, creator:'Miguel R.', color:'#5b6ef5' },
  { id:2, sport:'padel',   icon:'🎾', title:'Partido de Pádel',   desc:'Buscamos 2 más para completar. Nivel intermedio.', date:'Sáb 29 Mar', time:'18:00', loc:'Club de Pádel Centro', province:'valencia', level:'intermediate', levelLabel:'Intermedio', levelIcon:'⭐', thirdPlace:false, p:2, max:4,  wait:2, creator:'Laura M.', color:'#06d6a0' },
  { id:3, sport:'senderismo', icon:'🥾', title:'Senderismo Sierra Norte', desc:'Ruta 12 km, dificultad media. Llevar agua y calzado cómodo.', date:'Dom 30 Mar', time:'09:00', loc:'Plaza del Pueblo', province:'madrid', level:'advanced', levelLabel:'Avanzado', levelIcon:'🔥', thirdPlace:true, p:12, max:20, wait:8, creator:'Carlos A.', color:'#f59e0b' },
  { id:4, sport:'futbol', icon:'⚽', title:'Fútbol 7 tarde', desc:'Partido amistoso, cualquier nivel. A divertirse.', date:'Vie 28 Mar', time:'20:00', loc:'Polideportivo Municipal', province:'sevilla', level:'any', levelLabel:'Todos', levelIcon:'🌍', thirdPlace:true, p:11, max:14, wait:3, creator:'Javi P.', color:'#ef4444' },
]

const sportF = [
  {id:'all',label:'Todos',icon:'✨'},{id:'running',label:'Running',icon:'🏃'},
  {id:'padel',label:'Pádel',icon:'🎾'},{id:'senderismo',label:'Senderismo',icon:'🥾'},
  {id:'futbol',label:'Fútbol',icon:'⚽'},{id:'gimnasio',label:'Gimnasio',icon:'💪'},
]
const levelF = [
  {id:'all',label:'Todos',icon:'🌍'},{id:'beginner',label:'Principiante',icon:'🌱'},
  {id:'intermediate',label:'Intermedio',icon:'⭐'},{id:'advanced',label:'Avanzado',icon:'🔥'},
]
const provs = [
  {id:'all',name:'Todas'},{id:'madrid',name:'Madrid'},{id:'barcelona',name:'Barcelona'},
  {id:'valencia',name:'Valencia'},{id:'sevilla',name:'Sevilla'},{id:'malaga',name:'Málaga'},
  {id:'alicante',name:'Alicante'},{id:'murcia',name:'Murcia'},{id:'cordoba',name:'Córdoba'},
  {id:'zaragoza',name:'Zaragoza'},
]

export default function Events() {
  const [sport, setSport]     = useState('all')
  const [prov, setProv]       = useState('all')
  const [level, setLevel]     = useState('all')

  const filtered = events.filter(e =>
    (sport==='all'||e.sport===sport) &&
    (prov==='all'||e.province===prov) &&
    (level==='all'||e.level===level||e.level==='any')
  )

  return (
    <div style={{ paddingBottom:100 }}>
      <div className="page-wrap" style={{ padding:'0 20px' }}>

        {/* Header */}
        <header style={{ paddingTop:56, paddingBottom:16 }}>
          <h1 style={{ fontSize:22, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.03em' }}>Eventos</h1>
          <p style={{ fontSize:14, color:'var(--muted)', margin:0 }}>
            {filtered.length} evento{filtered.length!==1?'s':''} disponibles
          </p>
        </header>

        {/* Province */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {provs.map(p=>(
            <button key={p.id} onClick={()=>setProv(p.id)}
              className={`pill ${prov===p.id?'pill-active':'pill-inactive'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Sport */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {sportF.map(f=>(
            <button key={f.id} onClick={()=>setSport(f.id)}
              className={`pill ${sport===f.id?'pill-active':'pill-inactive'}`}>
              <span>{f.icon}</span><span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Level */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:20 }}>
          {levelF.map(l=>(
            <button key={l.id} onClick={()=>setLevel(l.id)}
              className={`pill pill-violet ${level===l.id?'pill-active':'pill-inactive'}`}>
              <span>{l.icon}</span><span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Empty */}
        {filtered.length===0 && (
          <div className="card" style={{ padding:40, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:600, marginBottom:4 }}>Sin resultados</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Prueba con otros filtros</div>
          </div>
        )}

        {/* Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map((ev,i)=>{
            const pct = Math.round((ev.p/ev.max)*100)
            const barColor = pct>=90?'#ef4444':pct>=70?'#f59e0b':ev.color
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className={`card anim-${Math.min(i+1,6)}`}
                style={{ display:'block', padding:'18px', textDecoration:'none', color:'inherit', overflow:'hidden', position:'relative' }}
              >
                {/* color accent top */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${ev.color},${ev.color}66)` }}/>

                <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginTop:6 }}>
                  <div className="sport-icon" style={{ background:`${ev.color}18`, border:`1.5px solid ${ev.color}30`, borderRadius:16 }}>{ev.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:2 }}>
                      <h3 style={{ fontSize:15, fontWeight:700, margin:0, letterSpacing:'-0.02em', lineHeight:1.3 }}>{ev.title}</h3>
                      {ev.thirdPlace && <span className="badge" style={{ background:'rgba(251,191,36,0.15)', color:'#f59e0b', flexShrink:0 }}>🍺</span>}
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>por {ev.creator}</div>
                  </div>
                </div>

                <p style={{ fontSize:13, color:'var(--muted)', margin:'12px 0', lineHeight:1.6 }}>{ev.desc}</p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', marginBottom:14, fontSize:12, color:'var(--muted)' }}>
                  <span>📅 {ev.date} · {ev.time}</span>
                  <span>📍 {ev.loc}</span>
                  <span className="badge" style={{ background:`${ev.color}18`, color:ev.color }}>{ev.levelIcon} {ev.levelLabel}</span>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:barColor }}/></div>
                  </div>
                  <span style={{ fontSize:12, color:barColor, fontWeight:600, whiteSpace:'nowrap' }}>
                    {ev.p}/{ev.max}
                    {ev.wait>0 && <span style={{ color:'var(--violet)', fontWeight:500 }}> +{ev.wait}</span>}
                  </span>
                  <button
                    onClick={e=>e.preventDefault()}
                    style={{
                      background:`linear-gradient(135deg,${ev.color},${ev.color}cc)`,
                      color:'white', border:'none', borderRadius:10,
                      padding:'8px 18px', fontWeight:700, fontSize:13,
                      cursor:'pointer', letterSpacing:'-0.01em',
                      boxShadow:`0 3px 12px ${ev.color}44`,
                      transition:'all 0.15s ease',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                  >
                    Unirse
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
