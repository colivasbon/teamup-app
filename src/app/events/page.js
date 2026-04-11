'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { SportIcon, sportIconSVGString, SPORT_COLORS } from '@/components/SportIcon'
import { SportImg } from '@/components/SportImg'
import ThemeButton from '@/components/ThemeButton'

const DEMO_EVENTS = [
  { id:'demo-1', sport:'running',    title:'Running Matutino',         description:'Ruta suave por la Alameda.', date:'2026-06-30', time:'07:30:00', location:'Alameda de Córdoba',      province:'cordoba',  level:'any',          max_players:10, price:'Gratis',     third_place:false, creator_name:'Carlos O.', participant_count:7  },
  { id:'demo-2', sport:'padel',      title:'Torneo Pádel Nivel Medio', description:'Rondas de 20 min.',          date:'2026-06-29', time:'18:00:00', location:'Club de Pádel Centro',    province:'valencia', level:'intermediate', max_players:4,  price:'5€/persona', third_place:true,  creator_name:'Laura M.', participant_count:2  },
  { id:'demo-3', sport:'senderismo', title:'Senderismo Sierra Norte',  description:'Ruta 12 km.',                date:'2026-06-30', time:'09:00:00', location:'Plaza del Pueblo',         province:'madrid',   level:'advanced',     max_players:20, price:'Gratis',     third_place:true,  creator_name:'Javi M.',  participant_count:12 },
  { id:'demo-4', sport:'futbol',     title:'Fútbol 7 tarde',           description:'Partido amistoso.',          date:'2026-06-28', time:'20:00:00', location:'Polideportivo Municipal',  province:'sevilla',  level:'any',          max_players:14, price:'Gratis',     third_place:true,  creator_name:'Diego R.', participant_count:11 },
]

const SPORT_FILTERS = [
  {id:'all',label:'Todos',icon:'✨'},{id:'running',label:'Running',icon:'🏃'},{id:'padel',label:'Pádel',icon:'🎾'},
  {id:'senderismo',label:'Senderismo',icon:'🥾'},{id:'futbol',label:'Fútbol',icon:'⚽'},{id:'gimnasio',label:'Gimnasio',icon:'💪'},
  {id:'tenis',label:'Tenis',icon:'🎾'},{id:'natacion',label:'Natación',icon:'🏊'},{id:'ciclismo',label:'Ciclismo',icon:'🚴'},
  {id:'yoga',label:'Yoga',icon:'🧘'},{id:'baloncesto',label:'Baloncesto',icon:'🏀'},{id:'voleibol',label:'Voleibol',icon:'🏐'},{id:'badminton',label:'Bádminton',icon:'🏸'},
]

const LEVEL_FILTERS = [
  {id:'all',label:'Todos',icon:'🌍'},{id:'beginner',label:'Principiante',icon:'🌱'},
  {id:'intermediate',label:'Intermedio',icon:'⭐'},{id:'advanced',label:'Avanzado',icon:'🔥'},
]

const PROVINCES = [
  {id:'all',name:'Todas'},{id:'madrid',name:'Madrid'},{id:'barcelona',name:'Barcelona'},
  {id:'valencia',name:'Valencia'},{id:'sevilla',name:'Sevilla'},{id:'cordoba',name:'Córdoba'},
  {id:'granada',name:'Granada'},{id:'malaga',name:'Málaga'},{id:'alicante',name:'Alicante'},
  {id:'murcia',name:'Murcia'},{id:'zaragoza',name:'Zaragoza'},{id:'bilbao',name:'Bilbao'},
  {id:'cadiz',name:'Cádiz'},{id:'huelva',name:'Huelva'},{id:'jaen',name:'Jaén'},{id:'almeria',name:'Almería'},
]

const PROV_COORDS = {
  // Andalucía
  almeria:{lat:36.834,lon:-2.4637}, cadiz:{lat:36.5267,lon:-6.2896}, cordoba:{lat:37.8882,lon:-4.7794},
  granada:{lat:37.1773,lon:-3.5986}, huelva:{lat:37.2614,lon:-6.9447}, jaen:{lat:37.7798,lon:-3.7876},
  malaga:{lat:36.7213,lon:-4.4213}, sevilla:{lat:37.3891,lon:-5.9845},
  // Aragón
  huesca:{lat:42.1401,lon:-0.4089}, teruel:{lat:40.3456,lon:-1.1065}, zaragoza:{lat:41.6488,lon:-0.8891},
  // Asturias
  asturias:{lat:43.3614,lon:-5.8593}, oviedo:{lat:43.3614,lon:-5.8593},
  // Baleares
  'illes-balears':{lat:39.5696,lon:2.6502}, baleares:{lat:39.5696,lon:2.6502}, palma:{lat:39.5696,lon:2.6502},
  // Canarias
  'las-palmas':{lat:28.1235,lon:-15.4363}, 'santa-cruz-de-tenerife':{lat:28.4636,lon:-16.2518},
  // Cantabria
  cantabria:{lat:43.1828,lon:-3.9878}, santander:{lat:43.4623,lon:-3.8099},
  // Castilla-La Mancha
  albacete:{lat:38.9942,lon:-1.8585}, 'ciudad-real':{lat:38.9848,lon:-3.9274},
  cuenca:{lat:40.0704,lon:-2.1374}, guadalajara:{lat:40.6321,lon:-3.1661}, toledo:{lat:39.8628,lon:-4.0273},
  // Castilla y León
  avila:{lat:40.6567,lon:-4.6814}, burgos:{lat:42.3439,lon:-3.6969}, leon:{lat:42.5987,lon:-5.5671},
  palencia:{lat:42.0095,lon:-4.5244}, salamanca:{lat:40.9701,lon:-5.6635}, segovia:{lat:40.9429,lon:-4.1088},
  soria:{lat:41.7638,lon:-2.4643}, valladolid:{lat:41.6523,lon:-4.7245}, zamora:{lat:41.5034,lon:-5.7460},
  // Cataluña
  barcelona:{lat:41.3851,lon:2.1734}, girona:{lat:41.9794,lon:2.8214},
  lleida:{lat:41.6148,lon:0.6277}, tarragona:{lat:41.1189,lon:1.2445},
  // Extremadura
  badajoz:{lat:38.8794,lon:-6.9706}, caceres:{lat:39.4752,lon:-6.3724},
  // Galicia
  'a-coruna':{lat:43.3623,lon:-8.4115}, lugo:{lat:43.0097,lon:-7.5568},
  ourense:{lat:42.3354,lon:-7.8639}, pontevedra:{lat:42.4333,lon:-8.6481}, vigo:{lat:42.2328,lon:-8.7226},
  // La Rioja
  'la-rioja':{lat:42.4650,lon:-2.4489}, logrono:{lat:42.4650,lon:-2.4489},
  // Madrid
  madrid:{lat:40.4168,lon:-3.7038},
  // Murcia
  murcia:{lat:37.9923,lon:-1.1304},
  // Navarra
  navarra:{lat:42.6954,lon:-1.6761}, pamplona:{lat:42.8169,lon:-1.6432},
  // País Vasco
  araba:{lat:42.8467,lon:-2.6716}, bilbao:{lat:43.263,lon:-2.935},
  gipuzkoa:{lat:43.3128,lon:-1.9758}, 'san-sebastian':{lat:43.3183,lon:-1.9812},
  vizcaya:{lat:43.263,lon:-2.935},
  // Valencia
  alicante:{lat:38.346,lon:-0.4907}, castellon:{lat:39.9864,lon:-0.0513},
  valencia:{lat:39.4699,lon:-0.3763},
  // Ciudades autónomas
  ceuta:{lat:35.8894,lon:-5.3198}, melilla:{lat:35.2923,lon:-2.9381},
}

// Pequeño offset pseudo-aleatorio basado en el id del evento para evitar superposición
function getOffset(id) {
  let hash = 0
  const s = String(id)
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i)
  const lat = ((hash % 100) / 100) * 0.12 - 0.06
  const lon = (((hash >> 4) % 100) / 100) * 0.16 - 0.08
  return { lat, lon }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0)
  const tom = new Date(today); tom.setDate(tom.getDate() + 1)
  if (dt.getTime() === today.getTime()) return 'Hoy'
  if (dt.getTime() === tom.getTime())   return 'Mañana'
  return dt.toLocaleDateString('es-ES', {weekday:'short', day:'numeric', month:'short'})
}

function fmtDuration(min) {
  if (!min) return ''
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), m = min % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// ── Mapa con Leaflet cargado dinámicamente ────────────────────────────────────
// ── Contenido principal ───────────────────────────────────────────────────────
function EventsContent() {
  const searchParams = useSearchParams()
  const initSport    = searchParams.get('sport') || 'all'

  const [sport,    setSport]   = useState(initSport)
  const [level,    setLevel]   = useState('all')
  const [prov,     setProv]    = useState('all')
  const [search,   setSearch]  = useState('')
  const [events,   setEvents]  = useState([])
  const [loading,  setLoading] = useState(true)
  const [geoLabel, setGeoLabel] = useState('')

  // Geolocalización: detectar provincia al cargar
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        let closest = null, minDist = Infinity
        for (const [id, c] of Object.entries(PROV_COORDS)) {
          const d = haversine(lat, lon, c.lat, c.lon)
          if (d < minDist) { minDist = d; closest = id }
        }
        if (closest && minDist < 200) {
          const label = PROVINCES.find(p => p.id === closest)?.name || closest
          setGeoLabel(`Cerca de ${label}`)
          setProv(closest)
        }
      },
      () => {},
      { timeout: 5000 }
    )
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sb = getSupabase()
      if (sb) {
        const { data, error } = await sb.from('events_with_counts').select('*').order('date', { ascending: true })
        if (!error && data && data.length > 0) {
          setEvents(data); setLoading(false); return
        }
      }
    } catch (_) {}
    setEvents(DEMO_EVENTS); setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const now = new Date()

  const filtered = events.filter(e => {
    const color = SPORT_COLORS[e.sport] || '#586875'
    e._color = e.color || color

    // FIX: mostrar eventos en curso (no ocultar si aún no ha terminado)
    if (e.date && e.time) {
      const startTime  = new Date(`${e.date}T${e.time}`)
      const durationMs = (e.duration_minutes || 120) * 60000
      const endTime    = new Date(startTime.getTime() + durationMs)
      if (endTime < now) return false
    } else if (e.date) {
      if (new Date(e.date + 'T23:59:00') < now) return false
    }

    const q = search.toLowerCase().trim()
    if (q && !e.title?.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q) && !e.description?.toLowerCase().includes(q)) return false

    return (
      (sport === 'all' || e.sport === sport) &&
      (prov  === 'all' || e.province === prov) &&
      (level === 'all' || e.level === level || e.level === 'any')
    )
  })

  return (
    <>
      <div className="page-wrap" style={{ paddingTop: 0 }}>

        {/* Cabecera */}
        <header style={{ paddingTop: 60, paddingBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 3px', letterSpacing: '-0.04em' }}>Eventos</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              {loading ? 'Cargando...' : `${filtered.length} evento${filtered.length !== 1 ? 's' : ''} ${geoLabel && prov !== 'all' ? `· ${geoLabel}` : ''}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ThemeButton />
            <Link href="/create" className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 13 }}>+ Crear</Link>
          </div>
        </header>

        {/* Sin resultados */}
        {!loading && filtered.length === 0 && (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Sin resultados</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Prueba con otros filtros o crea un evento nuevo</div>
            <Link href="/create" className="btn btn-primary" style={{ fontSize: 14 }}>+ Crear evento</Link>
          </div>
        )}

        {/* Vista lista — cards */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((ev, i) => {
              const pCnt  = typeof ev.participant_count === 'number' ? ev.participant_count : 0
              const pct   = ev.max_players > 0 ? Math.round((pCnt / ev.max_players) * 100) : 0
              const color = ev._color || SPORT_COLORS[ev.sport] || '#586875'
              const barC  = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : color
              return (
                <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${Math.min(i + 1, 6)}`}
                  style={{ display: 'block', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: 3, background: `linear-gradient(90deg,${color},${color}55)` }}/>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                      {/* Icono SVG del deporte */}
                      <div style={{
                        background: `${color}18`,
                        border: `1.5px solid ${color}30`,
                        borderRadius: 16,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <SportImg sport={ev.sport} size={34} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3, color: 'var(--text)' }}>{ev.title}</h3>
                          {ev.third_place && <span className="badge" style={{ background: 'rgba(251,191,36,0.15)', color: '#f59e0b', flexShrink: 0 }}>🍺</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>por {ev.creator_name || 'Organizador'}</div>
                      </div>
                    </div>
                    {ev.description && (
                      <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 12px', lineHeight: 1.6 }}>{ev.description}</p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px', marginBottom: 12, fontSize: 12, color: 'var(--muted)' }}>
                      <span>📅 {formatDate(ev.date)} · {(ev.time || '').slice(0, 5)}</span>
                      {ev.duration_minutes && <span>⏱ {fmtDuration(ev.duration_minutes)}</span>}
                      <span>📍 {ev.location}</span>
                      {ev.price && ev.price !== 'Gratis' && <span>💶 {ev.price}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div className="pbar"><div className="pbar-fill" style={{ width: `${pct}%`, background: barC }}/></div>
                      </div>
                      <span style={{ fontSize: 12, color: barC, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {pCnt}/{ev.max_players}
                      </span>
                      <button onClick={e => e.preventDefault()} style={{
                        background: `linear-gradient(135deg,${color},${color}bb)`,
                        color: 'white', border: 'none', borderRadius: 10,
                        padding: '9px 18px', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', letterSpacing: '-0.01em',
                        boxShadow: `0 3px 14px ${color}44`,
                        transition: 'all 0.16s ease', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''}>
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
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <div className="spinner"/>
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}
