'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

const S_COLORS = {
  Running:'#5b6ef5', Pádel:'#06d6a0', Senderismo:'#f59e0b', Fútbol:'#ef4444', Gimnasio:'#8b5cf6',
}

const MOMENTS = [
  { id:1, author:'Carlos O.', avatar:'🧔', sport:'Running',    time:'Hace 15 min', event:'Running Matutino — Alameda',     text:'Empezando el día con energía en la Alameda 🌅 Mejor compañía imposible, gracias a todos los que se animaron.', likes:12, comments:3, liked:false, stats:{ Distancia:'5.2 km', Tiempo:'28 min', Ritmo:'5:23/km' } },
  { id:2, author:'María G.', avatar:'👩',  sport:'Pádel',      time:'Hace 1 h',    event:'Torneo Pádel Nivel Medio',       text:'Partido épico esta mañana. Ganamos en el tercer set 6-4, pero sobre todo disfrutamos mogollón 🎾', likes:24, comments:8, liked:true,  stats:null },
  { id:3, author:'Javi M.',  avatar:'👨',  sport:'Senderismo', time:'Hace 3 h',    event:'Ruta Sierra Nevada',             text:'Las vistas desde los 2.800m no tienen precio. Ruta completada con éxito, todos llegamos y nadie se perdió 🥾✨', likes:41, comments:12, liked:false, stats:{ Distancia:'14 km', Desnivel:'+890 m', Duración:'5h 20min' } },
  { id:4, author:'Laura S.', avatar:'👩‍🦰', sport:'Gimnasio',   time:'Hace 5 h',    event:'Entreno Funcional Grupal',       text:'Sesión de funcional increíble hoy. El coach nos destruyó pero de la mejor manera posible 💪🔥', likes:18, comments:5, liked:false, stats:{ Series:'4 rondas', Ejercicios:'8', Descanso:'45 seg' } },
  { id:5, author:'Diego R.', avatar:'👦',  sport:'Fútbol',     time:'Ayer',        event:'Fútbol 7 — Polideportivo',       text:'Derrota 3-5 pero qué partido más divertido. Metí dos goles y el equipo luchó hasta el final ⚽', likes:33, comments:15, liked:true,  stats:{ Resultado:'3 — 5', Duración:'60 min', Jugadores:'14' } },
]

const FILTERS = ['Todos','Running','Pádel','Senderismo','Fútbol','Gimnasio']

export default function Moments() {
  const [filter,    setFilter]   = useState('Todos')
  const [liked,     setLiked]    = useState({})
  const [compose,   setCompose]  = useState(false)
  const [msg,       setMsg]      = useState('')

  const feed = filter==='Todos' ? MOMENTS : MOMENTS.filter(m=>m.sport===filter)

  const toggleLike = id => setLiked(p=>({...p,[id]:!p[id]}))

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        {/* Header */}
        <header style={{ paddingTop:60, paddingBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.04em' }}>Momentos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Lo mejor de hoy en la comunidad</p>
          </div>
          <button onClick={()=>setCompose(!compose)} className="btn btn-primary" style={{ padding:'10px 16px', fontSize:13 }}>
            + Publicar
          </button>
        </header>

        {/* Composer */}
        {compose && (
          <div className="card anim-1" style={{ padding:'16px', marginBottom:14 }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🧔</div>
              <div style={{ flex:1 }}>
                <textarea
                  value={msg} onChange={e=>setMsg(e.target.value)}
                  placeholder="¿Qué tal fue el entreno de hoy?"
                  className="input"
                  style={{ resize:'none', minHeight:76, fontSize:14, lineHeight:1.5 }}
                />
                <div style={{ display:'flex', gap:8, marginTop:10, justifyContent:'flex-end' }}>
                  <button className="btn btn-ghost" style={{ fontSize:13, padding:'8px 14px' }} onClick={()=>setCompose(false)}>Cancelar</button>
                  <button className="btn btn-primary" style={{ fontSize:13, padding:'8px 16px' }}>Publicar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:14 }}>
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`pill ${filter===f?'pill-active':'pill-inactive'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {feed.map((m, i)=>{
            const isLiked = liked[m.id]!==undefined ? liked[m.id] : m.liked
            const count   = m.likes + (liked[m.id]!==undefined ? (liked[m.id]?1:0)-(m.liked?1:0) : 0)
            const c       = S_COLORS[m.sport]
            return (
              <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:0, overflow:'hidden' }}>
                {/* Barra de color */}
                <div style={{ height:3, background:c }}/>

                <div style={{ padding:'14px 16px 0' }}>
                  {/* Autor */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:`${c}20`, border:`2px solid ${c}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                      {m.avatar}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{m.author}</div>
                      <div style={{ fontSize:11, color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.event}</div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:c, background:`${c}18`, borderRadius:8, padding:'3px 9px', flexShrink:0 }}>{m.sport}</span>
                  </div>

                  {/* Texto */}
                  <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.55, margin:'0 0 12px' }}>{m.text}</p>

                  {/* Stats */}
                  {m.stats && (
                    <div style={{
                      display:'flex', gap:0,
                      background:'var(--surface2)', borderRadius:12,
                      border:'1px solid var(--border)', marginBottom:12, overflow:'hidden',
                    }}>
                      {Object.entries(m.stats).map(([k,v], idx)=>(
                        <div key={k} style={{
                          flex:1, textAlign:'center', padding:'10px 8px',
                          borderRight: idx<Object.keys(m.stats).length-1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{v}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{k}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div style={{ display:'flex', alignItems:'center', padding:'10px 16px 14px', borderTop:'1px solid var(--border)', gap:16 }}>
                  <button onClick={()=>toggleLike(m.id)} style={{
                    background:'none', border:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:5,
                    color: isLiked ? '#ef4444' : 'var(--muted)',
                    fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit',
                    transition:'all 0.15s', transform: isLiked ? 'scale(1.08)' : 'scale(1)',
                  }}>
                    <span style={{ fontSize:17 }}>{isLiked?'❤️':'🤍'}</span> {count}
                  </button>
                  <button style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:'var(--muted)', fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit' }}>
                    <span style={{ fontSize:17 }}>💬</span> {m.comments}
                  </button>
                  <button style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:16, padding:0 }}>↗</button>
                  <span style={{ fontSize:11, color:'var(--muted)' }}>{m.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign:'center', padding:'20px 0 0' }}>
          <span style={{ fontSize:12, color:'var(--muted)' }}>Has llegado al final del feed ✨</span>
        </div>

      </div>
      <Navbar />
    </>
  )
}
