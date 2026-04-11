'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { SportIcon, sportIconSVGString, SPORT_COLORS } from '@/components/SportIcon'

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
  madrid:{lat:40.4168,lon:-3.7038},barcelona:{lat:41.3851,lon:2.1734},
  valencia:{lat:39.4699,lon:-0.3763},sevilla:{lat:37.3891,lon:-5.9845},
  cordoba:{lat:37.8882,lon:-4.7794},granada:{lat:37.1773,lon:-3.5986},
  malaga:{lat:36.7213,lon:-4.4213},alicante:{lat:38.346,lon:-0.4907},
  murcia:{lat:37.9923,lon:-1.1304},zaragoza:{lat:41.6488,lon:-0.8891},
  bilbao:{lat:43.263,lon:-2.935},cadiz:{lat:36.5267,lon:-6.2896},
  huelva:{lat:37.2614,lon:-6.9447},jaen:{lat:37.7798,lon:-3.7876},almeria:{lat:36.834,lon:-2.4637},
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
function EventMap({ events }) {
  const mapRef         = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef     = useRef([])
  const userMarkerRef  = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapInstanceRef.current) return // ya inicializado

    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const initMap = () => {
      const L = window.L
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
        .setView([40.4168, -3.7038], 6)

      // Tiles CartoDB Positron — claros, legibles en modo claro y oscuro
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      mapInstanceRef.current = map

      // Marcadores individuales por evento
      addMarkers(L, map, events)

      // Geolocalización: centrar el mapa en el usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude: lat, longitude: lon } = pos.coords

            // Marcador de posición del usuario (círculo azul)
            if (userMarkerRef.current) userMarkerRef.current.remove()
            const userIcon = L.divIcon({
              html: `<div style="background:#2563eb;border:3px solid white;border-radius:50%;width:16px;height:16px;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
              className: '',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })
            userMarkerRef.current = L.marker([lat, lon], { icon: userIcon })
              .addTo(map)
              .bindPopup('<div style="font-family:sans-serif;font-size:13px;font-weight:600">📍 Tu ubicación</div>')

            map.setView([lat, lon], 11)
          },
          () => {},
          { timeout: 6000 }
        )
      }
    }

    // Cargar Leaflet JS si no está ya
    if (window.L) {
      initMap()
    } else {
      const existing = document.getElementById('leaflet-js')
      if (existing) {
        existing.addEventListener('load', initMap)
      } else {
        const script = document.createElement('script')
        script.id  = 'leaflet-js'
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = initMap
        document.head.appendChild(script)
      }
    }

    return () => { /* no destruir el mapa para que persista */ }
  }, []) // solo al montar

  // Actualizar marcadores cuando cambian los eventos
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return
    const L = window.L
    const map = mapInstanceRef.current

    // Limpiar marcadores anteriores
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    addMarkers(L, map, events)
  }, [events])

  function addMarkers(L, map, evs) {
    evs.forEach(ev => {
      let lat, lon
      if (ev.lat && ev.lon) {
        lat = ev.lat
        lon = ev.lon
      } else {
        const coords = PROV_COORDS[ev.province]
        if (!coords) return
        const offset = getOffset(ev.id)
        lat = coords.lat + offset.lat
        lon = coords.lon + offset.lon
      }

      const color = SPORT_COLORS[ev.sport] || '#586875'
      const iconSVG = sportIconSVGString(ev.sport, color)

      const icon = L.divIcon({
        html: `<div style="background:white;border:2.5px solid ${color};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.25);cursor:pointer"><svg width="20" height="20" viewBox="0 0 24 24">${iconSVG}</svg></div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const timeStr = (ev.time || '').slice(0, 5)
      const popup = `
        <div style="min-width:190px;font-family:sans-serif;padding:2px">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#111">${ev.title}</div>
          <div style="font-size:12px;color:#666;margin-bottom:3px">📅 ${formatDate(ev.date)}${timeStr ? ' · ' + timeStr : ''}</div>
          <div style="font-size:12px;color:#666;margin-bottom:10px">📍 ${ev.location || ''}</div>
          <a href="/events/${ev.id}" style="display:inline-block;background:${color};color:white;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;text-decoration:none">Ver evento →</a>
        </div>
      `

      const marker = L.marker([lat, lon], { icon })
        .addTo(map)
        .bindPopup(popup)

      markersRef.current.push(marker)
    })
  }

  return (
    <div ref={mapRef} style={{
      height: 380,
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid var(--border)',
      marginBottom: 16,
    }}/>
  )
}

// ── Contenido principal ───────────────────────────────────────────────────────
function EventsContent() {
  const searchParams = useSearchParams()
  const initSport    = searchParams.get('sport') || 'all'

  const [view,     setView]    = useState('list') // 'list' | 'map'
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
            {/* Toggle lista/mapa */}
            <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {[['list', '☰'], ['map', '🗺']].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '8px 12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15,
                  background: view === v ? '#586875' : 'transparent',
                  color: view === v ? '#f6eddc' : 'var(--muted)',
                  transition: 'all 0.15s ease',
                }}>{icon}</button>
              ))}
            </div>
            <Link href="/create" className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 13 }}>+ Crear</Link>
          </div>
        </header>

        {/* Búsqueda */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            className="input"
            placeholder="🔍  Buscar eventos, lugares..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 16, fontSize: 14 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 16 }}>✕</button>
          )}
        </div>

        {/* Banner geo */}
        {geoLabel && prov !== 'all' && (
          <div className="anim-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(88,104,117,0.10)', border: '1px solid rgba(88,104,117,0.22)', borderRadius: 12, padding: '10px 14px', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>📍 {geoLabel}</span>
            <button onClick={() => { setProv('all'); setGeoLabel('') }}
              style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Ver todos ✕
            </button>
          </div>
        )}

        {/* Filtro provincias */}
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
          {PROVINCES.map(p => (
            <button key={p.id} onClick={() => { setProv(p.id); if (p.id !== prov) setGeoLabel('') }}
              className={`pill ${prov === p.id ? 'pill-active' : 'pill-inactive'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Filtro deporte */}
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
          {SPORT_FILTERS.map(f => (
            <button key={f.id} onClick={() => setSport(f.id)}
              className={`pill ${sport === f.id ? 'pill-active' : 'pill-inactive'}`}>
              <span>{f.icon}</span><span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Filtro nivel */}
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 20 }}>
          {LEVEL_FILTERS.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)}
              className={`pill ${level === l.id ? 'pill-active' : 'pill-inactive'}`}>
              <span>{l.icon}</span><span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Cargando */}
        {loading && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className="spinner"/>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>Cargando eventos...</p>
          </div>
        )}

        {/* Vista mapa */}
        {!loading && view === 'map' && (
          <>
            <EventMap events={filtered} />
            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 16 }}>
              Toca una chincheta para ver los detalles del evento
            </p>
          </>
        )}

        {/* Vista lista — sin resultados */}
        {!loading && view === 'list' && filtered.length === 0 && (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Sin resultados</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Prueba con otros filtros o crea un evento nuevo</div>
            <Link href="/create" className="btn btn-primary" style={{ fontSize: 14 }}>+ Crear evento</Link>
          </div>
        )}

        {/* Vista lista — cards */}
        {!loading && view === 'list' && (
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
                        <SportIcon sport={ev.sport} size={28} color={color} />
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
