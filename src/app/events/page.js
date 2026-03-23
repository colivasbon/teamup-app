'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

// ─── Datos de fallback mientras no hay BD configurada ──
const DEMO_EVENTS = [
  { id:'1', sport:'running', icon:'🏃', title:'Running Matutino', description:'Ruta suave por la Alameda. Todos los niveles bienvenidos.', date:'2026-03-30', time:'07:30:00', location:'Alameda de Córdoba', province:'cordoba', level:'any', max_players:10, price:'Gratis', third_place:false, creator_name:'Carlos O.', participant_count:7, color:'#5b6ef5' },
  { id:'2', sport:'padel',   icon:'🎾', title:'Torneo Pádel Nivel Medio', description:'Rondas de 20 min con rotación. Raquetas disponibles.', date:'2026-03-29', time:'18:00:00', location:'Club de Pádel Centro', province:'valencia', level:'intermediate', max_players:4, price:'5€/persona', third_place:true, creator_name:'Laura M.', participant_count:2, color:'#06d6a0' },
  { id:'3', sport:'senderismo', icon:'🥾', title:'Senderismo Sierra Norte', description:'Ruta 12 km, dificultad media. Llevar agua y calzado.', date:'2026-03-30', time:'09:00:00', location:'Plaza del Pueblo', province:'madrid', level:'advanced', max_players:20, price:'Gratis', third_place:true, creator_name:'Javi M.', participant_count:12, color:'#f59e0b' },
  { id:'4', sport:'futbol', icon:'⚽', title:'Fútbol 7 tarde', description:'Partido amistoso, cualquier nivel. A disfrutar.', date:'2026-03-28', time:'20:00:00', location:'Polideportivo Municipal', province:'sevilla', level:'any', max_players:14, price:'Gratis', third_place:true, creator_name:'Diego R.', participant_count:11, color:'#ef4444' },
  { id:'5', sport:'gimnasio', icon:'💪', title:'Entreno Funcional Grupal', description:'4 rondas de ejercicios funcionales de alta intensidad.', date:'2026-03-25', time:'19:00:00', location:'Box CrossFit Sur', province:'madrid', level:'intermediate', max_players:12, price:'Gratis', third_place:false, creator_name:'Laura S.', participant_count:8, color:'#8b5cf6' },
]

const SPORT_ICONS = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾' }
const SPORT_COLORS = { running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444', gimnasio:'#8b5cf6', tenis:'#fbbf24' }

const SPORT_FILTERS = [
  {id:'all',label:'Todos',icon:'✨'},
  {id:'running',label:'Running',icon:'🏃'},
  {id:'padel',label:'Pádel',icon:'🎾'},
  {id:'senderismo',label:'Senderismo',icon:'🥾'},
  {id:'futbol',label:'Fútbol',icon:'⚽'},
  {id:'gimnasio',label:'Gimnasio',icon:'💪'},
]

const LEVEL_FILTERS = [
  {id:'all',label:'Todos',icon:'🌍'},
  {id:'beginner',label:'Principiante',icon:'🌱'},
  {id:'intermediate',label:'Intermedio',icon:'⭐'},
  {id:'advanced',label:'Avanzado',icon:'🔥'},
]

const PROVINCES = [
  {id:'all',name:'Todas'},
  {id:'madrid',name:'Madrid'},
  {id:'barcelona',name:'Barcelona'},
  {id:'valencia',name:'Valencia'},
  {id:'sevilla',name:'Sevilla'},
  {id:'cordoba',name:'Córdoba'},
  {id:'granada',name:'Granada'},
  {id:'malaga',name:'Málaga'},
  {id:'alicante',name:'Alicante'},
  {id:'murcia',name:'Murcia'},
  {id:'zaragoza',name:'Zaragoza'},
  {id:'bilbao',name:'Bilbao'},
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const tom   = new Date(today); tom.setDate(tom.getDate()+1)
  if (d.getTime() === today.getTime()) return 'Hoy'
  if (d.getTime() === tom.getTime())   return 'Mañana'
  return d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})
}

function formatTime(t) {
  return t ? t.slice(0,5) : ''
}

function EventsContent() {
  const searchParams = useSearchParams()
  const initSport    = searchParams.get('sport') || 'all'

  const [sport,    setSport]   = useState(initSport)
  const [level,    setLevel]   = useState('all')
  const [prov,     setProv]    = useState('all')
  const [events,   setEvents]  = useState([])
  const [loading,  setLoading] = useState(true)
  const [fromDB,   setFromDB]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data && data.length > 0) {
      setEvents(data)
      setFromDB(true)
    } else {
      // Fallback a datos demo
      setEvents(DEMO_EVENTS)
      setFromDB(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Filtrado en cliente
  const filtered = events.filter(e => {
    const c = SPORT_COLORS[e.sport] || '#5b6ef5'
    e._color = e.color || c
    e._icon  = e.icon  || SPORT_ICONS[e.sport] || '🎯'
    return (
      (sport==='all' || e.sport===sport) &&
      (prov==='all'  || e.province===prov) &&
      (level==='all' || e.level===level  || e.level==='any')
    )
  })

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        <header style={{ paddingTop:60, paddingBottom:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.04em' }}>Eventos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>
              {loading ? 'Cargando...' : `${filtered.length} evento${filtered.length!==1?'s':''} disponibles`}
            </p>
          </div>
          <Link href="/create" className="btn btn-primary" style={{ padding:'10px 16px', fontSize:13 }}>+ Crear</Link>
        </header>

        {/* Filtro provincias */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {PROVINCES.map(p=>(
            <button key={p.id} onClick={()=>setProv(p.id)}
              className={`pill ${prov===p.id?'pill-active':'pill-inactive'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Filtro deporte */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
          {SPORT_FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setSport(f.id)}
              className={`pill ${sport===f.id?'pill-active':'pill-inactive'}`}>
              <span>{f.icon}</span><span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Filtro nivel */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:22 }}>
          {LEVEL_FILTERS.map(l=>(
            <button key={l.id} onClick={()=>setLevel(l.id)}
              className={`pill ${level===l.id?'pill-active':'pill-inactive'}`}
              style={level===l.id?{background:'linear-gradient(135deg,#8b5cf6,#d946ef)',boxShadow:'0 3px 14px rgba(139,92,246,0.35)'}:{}}>
              <span>{l.icon}</span><span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Estado cargando */}
        {loading && (
          <div style={{ padding:'40px 0', textAlign:'center' }}>
            <div className="spinner"/>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:12 }}>Cargando eventos...</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && filtered.length===0 && (
          <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Sin resultados</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:20 }}>Prueba con otros filtros o crea un evento nuevo</div>
            <Link href="/create" className="btn btn-primary" style={{ fontSize:14 }}>+ Crear evento</Link>
          </div>
        )}

        {/* Lista de eventos */}
        {!loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map((ev,i)=>{
              const pCnt  = typeof ev.participant_count === 'number' ? ev.participant_count : 0
              const pct   = ev.max_players > 0 ? Math.round((pCnt/ev.max_players)*100) : 0
              const color = ev._color || SPORT_COLORS[ev.sport] || '#5b6ef5'
              const barC  = pct>=90?'#ef4444':pct>=70?'#f59e0b':color
              return (
                <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${Math.min(i+1,6)}`}
                  style={{ display:'block', overflow:'hidden', position:'relative' }}>
                  <div style={{ height:3, background:`linear-gradient(90deg,${color},${color}55)` }}/>
                  <div style={{ padding:'16px 18px' }}>
                    <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:12 }}>
                      <div className="sport-icon" style={{ background:`${color}18`, border:`1.5px solid ${color}30`, borderRadius:16 }}>
                        {ev._icon}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                          <h3 style={{ fontSize:15, fontWeight:700, margin:0, letterSpacing:'-0.02em', lineHeight:1.3, color:'var(--text)' }}>{ev.title}</h3>
                          {ev.third_place && <span className="badge" style={{ background:'rgba(251,191,36,0.15)', color:'#f59e0b', flexShrink:0 }}>🍺</span>}
                        </div>
                        <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>por {ev.creator_name || 'Organizador'}</div>
                      </div>
                    </div>
                    {ev.description && (
                      <p style={{ fontSize:13, color:'var(--text2)', margin:'0 0 14px', lineHeight:1.6 }}>{ev.description}</p>
                    )}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', marginBottom:14, fontSize:12, color:'var(--muted)' }}>
                      <span>📅 {formatDate(ev.date)} · {formatTime(ev.time)}</span>
                      <span>📍 {ev.location}</span>
                      {ev.price && ev.price !== 'Gratis' && <span>💶 {ev.price}</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:barC }}/></div>
                      </div>
                      <span style={{ fontSize:12, color:barC, fontWeight:700, whiteSpace:'nowrap' }}>
                        {pCnt}/{ev.max_players}
                      </span>
                      <button onClick={e=>e.preventDefault()} style={{
                        background:`linear-gradient(135deg,${color},${color}bb)`,
                        color:'white', border:'none', borderRadius:10,
                        padding:'9px 18px', fontWeight:700, fontSize:13,
                        cursor:'pointer', letterSpacing:'-0.01em',
                        boxShadow:`0 3px 14px ${color}44`,
                        transition:'all 0.16s ease', fontFamily:'inherit',
                      }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                      onMouseLeave={e=>e.currentTarget.style.transform=''}>
                        Unirse
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}

export default function Events() {
  return (
    <Suspense fallback={
      <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
        <div className="spinner"/>
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}
