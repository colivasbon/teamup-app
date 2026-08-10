'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import PosterModal from '@/components/PosterModal'
import { getSportColor } from '@/components/SportIcon'

const S_COLORS = { running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444', gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316', yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6' }
const S_ICONS  = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴', yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸' }

const DEMO = {
  'demo-1': { id:'demo-1', title:'Running Matutino',         sport:'running',    level:'any',          date:'2026-03-30', time:'07:30:00', location:'Alameda de Córdoba',      province:'Córdoba',  max_players:10, price:'Gratis',     third_place:false, description:'Ruta de running matutino por la Alameda. Ritmo medio 5:00–5:30/km. Todos los niveles bienvenidos. Llevar agua.',             creator_name:'Carlos O.', participant_count:7,  tags:['Aire libre','Todos los niveles','Grupo pequeño'] },
  'demo-2': { id:'demo-2', title:'Torneo Pádel Nivel Medio', sport:'padel',      level:'intermediate', date:'2026-03-29', time:'18:00:00', location:'Club de Pádel Centro',    province:'Valencia', max_players:4,  price:'5€/persona', third_place:true,  description:'Torneo amistoso con rotación de parejas. Raquetas disponibles en el club.',                                              creator_name:'Laura M.', participant_count:2,  tags:['Indoor','Mixto','Torneo'] },
  'demo-3': { id:'demo-3', title:'Senderismo Sierra Norte',  sport:'senderismo', level:'advanced',     date:'2026-03-30', time:'09:00:00', location:'Plaza del Pueblo',         province:'Madrid',   max_players:20, price:'Gratis',     third_place:true,  description:'Ruta de 12 km por la Sierra Norte. Imprescindible calzado de montaña.',               creator_name:'Javi M.', participant_count:12, tags:['Montaña','Natural','Tercer tiempo'] },
  'demo-4': { id:'demo-4', title:'Fútbol 7 tarde',           sport:'futbol',     level:'any',          date:'2026-03-28', time:'20:00:00', location:'Polideportivo Municipal',  province:'Sevilla',  max_players:14, price:'Gratis',     third_place:true,  description:'Partido amistoso de fútbol 7.',                     creator_name:'Diego R.', participant_count:11, tags:['Fútbol 7','Casual','Tercer tiempo'] },
  'demo-5': { id:'demo-5', title:'Entreno Funcional Grupal', sport:'gimnasio',   level:'intermediate', date:'2026-03-25', time:'19:00:00', location:'Box CrossFit Sur',         province:'Madrid',   max_players:12, price:'Gratis',     third_place:false, description:'4 rondas de ejercicios funcionales.',                creator_name:'Laura S.', participant_count:8,  tags:['HIIT','Fuerza','Grupo'] },
  'demo-6': { id:'demo-6', title:'Dobles Tenis Casual',      sport:'tenis',      level:'beginner',     date:'2026-04-01', time:'10:00:00', location:'Club de Tenis Parque Sur', province:'Málaga',   max_players:8,  price:'Gratis',     third_place:false, description:'Partidos de dobles para todos los niveles.',                                            creator_name:'Ana G.',   participant_count:3,  tags:['Pista dura','Casual','Principiantes'] },
}

const TABS = ['Info','Participantes','Momentos','Chat']
const isDemo = (id) => String(id).startsWith('demo-') || !!DEMO[id]

function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})
}

function canPostMoment(ev) {
  if (!ev?.date || !ev?.time) return false
  const start = new Date(`${ev.date}T${ev.time}`)
  const now   = new Date()
  const diffH = (now - start) / 3600000
  return diffH >= 0 && diffH <= 48
}

function EventDetailInner() {
  const { id }      = useParams()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { user }     = useAuth()
  const chatRef      = useRef(null)
  const chatPollRef  = useRef(null)
  const prevMsgCount = useRef(0)
  const fileRef      = useRef(null)

  const [ev,           setEv]          = useState(null)
  const [mapCoords,    setMapCoords]    = useState(null)
  const [pCount,       setPCount]      = useState(0)
  const [participants, setParticipants]= useState([])
  const [loading,      setLoad]        = useState(true)
  const initTab = searchParams?.get('tab') || 'Info'
  const [tab,          setTab]         = useState(initTab)
  const [joined,       setJoined]      = useState(false)
  const [joining,      setJoining]     = useState(false)

  // Chat
  const [messages,    setMessages]  = useState([])
  const [chatMsg,     setChat]      = useState('')
  const [sendingMsg,  setSending]   = useState(false)
  const [loadingChat, setLoadChat]  = useState(false)
  const [chatError,   setChatError] = useState('')

  // Póster
  const [showPoster, setShowPoster] = useState(false)

  // Momentos
  const [moments,       setMoments]      = useState([])
  const [loadingMoments,setLoadMoments]  = useState(false)
  const [compose,       setCompose]      = useState(false)
  const [newMoment,     setNewMoment]    = useState({ text:'', imageFile: null, imagePreview: null })
  const [posting,       setPosting]      = useState(false)
  const [momentLikes,   setMomentLikes]  = useState({})
  const [momentCounts,  setMomentCounts] = useState({})

  // ── Carga inicial ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (isDemo(id)) {
        const d = DEMO[id]
        if (d) { setEv(d); setPCount(d.participant_count || 0) }
        setLoad(false); return
      }
      try {
        const sb = getSupabase()
        if (sb) {
          const eventPromise = sb.from('events_with_counts').select('*').eq('id', id).single()
          const joinedPromise = user
            ? sb.from('event_participants').select('id').eq('event_id', id).eq('user_id', user.id).maybeSingle()
            : Promise.resolve(null)

          const [{ data, error }, joinedData] = await Promise.all([eventPromise, joinedPromise])
          if (!error && data) {
            setEv(data)
            setPCount(data.participant_count || 0)
            setJoined(!!joinedData?.data)
            setLoad(false)

            if (data?.location) {
              const tryGeocode = async (query) => {
                try {
                  const r = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=es`,
                    { headers: { 'Accept-Language': 'es', 'User-Agent': 'TeamUpApp/1.0' } }
                  )
                  const results = await r.json()
                  return results?.[0] ? { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) } : null
                } catch { return null }
              }
              const full = [data.location, data.province].filter(Boolean).join(', ')
              tryGeocode(full).then(coords => {
                if (!coords && data.location) {
                  return tryGeocode(data.location)
                }
                return coords
              }).then(coords => {
                if (coords) setMapCoords(coords)
              }).catch(() => {})
            }
            return
          }
        }
      } catch(_) {}
      const fallback = DEMO[id] || DEMO['demo-1']
      setEv(fallback); setPCount(fallback?.participant_count || 7); setLoad(false)
    }
    load()
  }, [id, user])

  // ── Participantes ────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'Participantes') return
    const loadP = async () => {
      if (isDemo(id)) {
        setParticipants([
          { id:'p1', full_name:'Carlos O.', username:'carlosO', avatar_url:null },
          { id:'p2', full_name:'Laura M.',  username:'lauraM',  avatar_url:null },
          { id:'p3', full_name:'Javi R.',   username:'javiR',   avatar_url:null },
        ]); return
      }
      try {
        const sb = getSupabase(); if (!sb) return
        const { data: epData } = await sb.from('event_participants')
          .select('user_id')
          .eq('event_id', id)
          .eq('status', 'joined')
        if (epData && epData.length > 0) {
          const userIds = epData.map(p => p.user_id)
          const { data: profData } = await sb.from('profiles')
            .select('id, full_name, username, avatar_url')
            .in('id', userIds)
          setParticipants(profData || [])
        } else setParticipants([])
      } catch(_) { setParticipants([]) }
    }
    loadP()
  }, [tab, id])

  // ── Mapa Leaflet ────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'Info' || !mapCoords) return
    const container = document.getElementById('map-container')
    if (!container) return
    let mapInstance = null
    const initMap = async () => {
      if (!window.L) {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }
        await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = resolve
          document.head.appendChild(script)
        })
      }
      if (container._leaflet_id) return
      mapInstance = window.L.map('map-container', { zoomControl: false, attributionControl: false }).setView([mapCoords.lat, mapCoords.lon], 15)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance)
      const color = S_COLORS[ev?.sport] || 'var(--primary)'
      const customIcon = window.L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:11px;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      window.L.marker([mapCoords.lat, mapCoords.lon], { icon: customIcon }).addTo(mapInstance)
    }
    initMap()
    return () => { if (mapInstance) mapInstance.remove() }
  }, [tab, mapCoords, ev?.sport])

  // ── Chat: Cargar mensajes ───────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (isDemo(id)) {
      setMessages([
        { id:'m1', user_id:'p1', content:'¡Nos vemos allí!', created_at:'2026-03-20T10:00:00Z', profiles:{ full_name:'Carlos O.', avatar_url:null } },
        { id:'m2', user_id:'p2', content:'Llegaré 5 mins antes.', created_at:'2026-03-20T10:05:00Z', profiles:{ full_name:'Laura M.', avatar_url:null } },
      ])
      return
    }
    try {
      const sb = getSupabase()
      if (!sb) return
      const { data, error } = await sb.from('event_messages')
        .select('id, content, created_at, user_id, profiles(id, full_name, username, avatar_url)')
        .eq('event_id', id)
        .order('created_at', { ascending: true })
      if (!error && data) {
        setMessages(data)
        setChatError('')
      } else if (error) {
        setChatError(error.message || 'Error cargando mensajes')
      }
    } catch(err) {
      setChatError('Error de conexión')
    }
  }, [id])

  useEffect(() => {
    if (tab !== 'Chat') return
    setLoadChat(true)
    fetchMessages().then(() => setLoadChat(false))

    chatPollRef.current = setInterval(fetchMessages, 4000)
    return () => { if (chatPollRef.current) clearInterval(chatPollRef.current) }
  }, [tab, fetchMessages])

  useEffect(() => {
    if (tab === 'Chat' && messages.length > prevMsgCount.current) {
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
      }, 100)
    }
    prevMsgCount.current = messages.length
  }, [messages, tab])

  // ── Chat: Enviar mensaje ─────────────────────────────────
  const sendMsg = async () => {
    if (!chatMsg.trim() || sendingMsg) return
    const text = chatMsg.trim()
    setChat('')
    setSending(true)

    if (isDemo(id)) {
      const fakeMsg = {
        id: 'm-' + Date.now(),
        user_id: user?.id || 'me',
        content: text,
        created_at: new Date().toISOString(),
        profiles: { full_name: user?.user_metadata?.full_name || user?.email || 'Tú', avatar_url: null }
      }
      setMessages(prev => [...prev, fakeMsg])
      setSending(false)
      return
    }

    try {
      const sb = getSupabase()
      if (!sb || !user) return
      const { error } = await sb.from('event_messages').insert({
        event_id: id,
        user_id: user.id,
        content: text,
      })
      if (!error) {
        await fetchMessages()
      } else {
        setChatError('Error al enviar: ' + error.message)
      }
    } catch(err) {
      setChatError('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  // ── Unirse / Salir del evento ────────────────────────────
  const toggleJoin = async () => {
    if (!user) { router.push('/auth'); return }
    setJoining(true)
    if (isDemo(id)) {
      setJoined(j => !j)
      setPCount(c => joined ? c - 1 : c + 1)
      setJoining(false)
      return
    }
    try {
      const sb = getSupabase(); if (!sb) return
      if (joined) {
        await sb.from('event_participants')
          .update({ status: 'left' })
          .eq('event_id', id).eq('user_id', user.id)
        setJoined(false)
        setPCount(c => Math.max(0, c - 1))
      } else {
        await sb.from('event_participants').upsert({
          event_id: id, user_id: user.id, status: 'joined', joined_at: new Date().toISOString()
        })
        setJoined(true)
        setPCount(c => c + 1)
      }
    } catch(_) {}
    setJoining(false)
  }

  // ── Momentos ─────────────────────────────────────────────
  const loadMoments = useCallback(async () => {
    if (isDemo(id)) {
      setMoments([
        { id:'m-demo-1', text:'¡Entrenamiento superado! 💪🏻', image_url:null, created_at:'2026-03-20T11:00:00Z', profiles:{ full_name:'Carlos O.', avatar_url:null } }
      ])
      return
    }
    try {
      const sb = getSupabase(); if (!sb) return
      const { data } = await sb.from('moments')
        .select('id, text, image_url, created_at, user_id, profiles(full_name, avatar_url)')
        .eq('event_id', id)
        .order('created_at', { ascending: false })
      if (data) setMoments(data)
    } catch(_) {}
  }, [id])

  useEffect(() => {
    if (tab === 'Momentos') {
      setLoadMoments(true)
      loadMoments().then(() => setLoadMoments(false))
    }
  }, [tab, loadMoments])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setNewMoment(prev => ({ ...prev, imageFile: file, imagePreview: preview }))
  }

  const postMoment = async () => {
    if (!newMoment.text.trim() && !newMoment.imageFile) return
    setPosting(true)
    if (isDemo(id)) {
      const fakeM = {
        id: 'm-' + Date.now(),
        text: newMoment.text,
        image_url: newMoment.imagePreview,
        created_at: new Date().toISOString(),
        profiles: { full_name: user?.user_metadata?.full_name || 'Tú', avatar_url: null }
      }
      setMoments(prev => [fakeM, ...prev])
      setNewMoment({ text:'', imageFile: null, imagePreview: null })
      setCompose(false)
      setPosting(false)
      return
    }
    try {
      const sb = getSupabase(); if (!sb || !user) return
      let image_url = null
      if (newMoment.imageFile) {
        const ext = newMoment.imageFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: upErr } = await sb.storage.from('moments').upload(path, newMoment.imageFile)
        if (!upErr) {
          const { data: pUrl } = sb.storage.from('moments').getPublicUrl(path)
          image_url = pUrl?.publicUrl || null
        }
      }
      const { error } = await sb.from('moments').insert({
        user_id: user.id,
        event_id: id,
        text: newMoment.text,
        image_url,
        sport: ev?.sport || null,
        province: ev?.province || null,
      })
      if (!error) {
        await loadMoments()
        setNewMoment({ text:'', imageFile: null, imagePreview: null })
        setCompose(false)
      }
    } catch(_) {}
    setPosting(false)
  }

  const toggleMomentLike = async (mId) => {
    if (!user) { router.push('/auth'); return }
    const liked = !!momentLikes[mId]
    setMomentLikes(prev => ({ ...prev, [mId]: !liked }))
    setMomentCounts(prev => ({ ...prev, [mId]: (prev[mId] || 0) + (liked ? -1 : 1) }))
    if (isDemo(id)) return
    try {
      const sb = getSupabase(); if (!sb) return
      if (liked) {
        await sb.from('moment_likes').delete().eq('moment_id', mId).eq('user_id', user.id)
      } else {
        await sb.from('moment_likes').insert({ moment_id: mId, user_id: user.id })
      }
    } catch(_) {}
  }

  if (loading) {
    return (
      <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
        <div className="spinner"/>
      </div>
    )
  }

  if (!ev) {
    return (
      <div className="app-shell" style={{ padding:24, textAlign:'center' }}>
        <h2>Evento no encontrado</h2>
        <button onClick={() => router.push('/events')} className="btn btn-primary" style={{ marginTop:16 }}>
          Volver a eventos
        </button>
      </div>
    )
  }

  const c = S_COLORS[ev.sport] || 'var(--primary)'
  const icon = S_ICONS[ev.sport] || '⚽'

  return (
    <>
      <div className="page-wrap" style={{ paddingBottom:100 }}>
        {/* Banner del deporte */}
        <div style={{
          position:'relative', margin:'-16px -18px 0', padding:'24px 20px 20px',
          background:`linear-gradient(180deg, ${c}33 0%, transparent 100%)`,
          borderBottom:'1px solid var(--border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <button onClick={() => router.back()} style={{
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:10, width:36, height:36, display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:16, cursor:'pointer', color:'var(--text)',
            }}>←</button>
            <div style={{ display:'flex', gap:8 }}>
              {/* Botón Compartir (Póster/QR) */}
              <button onClick={() => setShowPoster(true)} style={{
                background:'var(--surface)', border:'1px solid var(--border)',
                borderRadius:10, padding:'6px 12px', display:'flex', alignItems:'center',
                gap:6, fontSize:12, fontWeight:600, cursor:'pointer', color:'var(--text)',
              }}>
                📲 Compartir
              </button>
              {user && ev.creator_id === user.id && (
                <button onClick={() => router.push(`/events/${id}/edit`)} style={{
                  background:'var(--surface)', border:'1px solid var(--border)',
                  borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:600,
                  cursor:'pointer', color:'var(--text)',
                }}>
                  ✏️ Editar
                </button>
              )}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontSize:36 }}>{icon}</span>
            <div>
              <span style={{
                fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em',
                color:c, background:`${c}22`, padding:'3px 8px', borderRadius:6,
              }}>{ev.sport}</span>
              <h1 style={{ fontSize:20, fontWeight:800, margin:'4px 0 0', lineHeight:1.2 }}>{ev.title}</h1>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--muted)', marginTop:8 }}>
            <span>📅 {fmt(ev.date)}</span>
            <span>⏰ {ev.time?.slice(0,5)}h</span>
            <span>📍 {ev.province}</span>
          </div>
        </div>

        {/* Pestañas */}
        <div style={{
          display:'flex', gap:4, margin:'16px 0', background:'var(--surface)',
          padding:4, borderRadius:12, border:'1px solid var(--border)',
        }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'8px 0', borderRadius:8, border:'none',
              background: tab === t ? 'var(--primary)' : 'transparent',
              color: tab === t ? 'white' : 'var(--muted)',
              fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* TAB INFO */}
        {tab === 'Info' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>Descripción</h3>
              <p style={{ fontSize:13, color:'var(--text)', lineHeight:1.5 }}>{ev.description || 'Sin descripción.'}</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="card" style={{ padding:12, textAlign:'center' }}>
                <span style={{ fontSize:11, color:'var(--muted)', display:'block' }}>Aforo</span>
                <strong style={{ fontSize:16 }}>{pCount} / {ev.max_players}</strong>
              </div>
              <div className="card" style={{ padding:12, textAlign:'center' }}>
                <span style={{ fontSize:11, color:'var(--muted)', display:'block' }}>Precio</span>
                <strong style={{ fontSize:16, color:'var(--success)' }}>{ev.price}</strong>
              </div>
            </div>

            {/* Mapa */}
            {ev.location && (
              <div className="card" style={{ padding:16 }}>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>Ubicación</h3>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:12 }}>📍 {ev.location}, {ev.province}</p>
                <div id="map-container" style={{ width:'100%', height:180, borderRadius:12, overflow:'hidden', background:'var(--surface2)' }}/>
              </div>
            )}

            {/* Botón unirse */}
            <button onClick={toggleJoin} disabled={joining} className={`btn ${joined ? 'btn-outline' : 'btn-primary'}`} style={{
              width:'100%', padding:14, fontSize:15, fontWeight:700, borderRadius:14, marginTop:8,
              background: joined ? 'transparent' : `linear-gradient(135deg, ${c}, ${c}dd)`,
              borderColor: joined ? 'var(--border)' : 'transparent',
            }}>
              {joining ? 'Procesando...' : joined ? '✓ Inscrito (Salir)' : 'Unirme al evento'}
            </button>
          </div>
        )}

        {/* TAB PARTICIPANTES */}
        {tab === 'Participantes' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {participants.length === 0 ? (
              <div className="card" style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
                No hay participantes inscritos aún.
              </div>
            ) : (
              participants.map(p => (
                <div key={p.id} className="card" style={{ display:'flex', alignItems:'center', gap:12, padding:12 }}>
                  <div style={{
                    width:40, height:40, borderRadius:'50%', background:'var(--surface2)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700,
                  }}>
                    {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width:'100%', height:'100%', borderRadius:'50%' }}/> : p.full_name?.[0] || 'U'}
                  </div>
                  <div>
                    <strong style={{ fontSize:14, display:'block' }}>{p.full_name}</strong>
                    <span style={{ fontSize:12, color:'var(--muted)' }}>@{p.username || 'deportista'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB MOMENTOS */}
        {tab === 'Momentos' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {canPostMoment(ev) && user && joined && (
              <button onClick={() => setCompose(!compose)} className="btn btn-primary" style={{ width:'100%', padding:12, fontSize:13 }}>
                {compose ? 'Cancelar' : '📸 Compartir foto/momento'}
              </button>
            )}

            {compose && (
              <div className="card" style={{ padding:16, display:'flex', flexDirection:'column', gap:12 }}>
                <textarea
                  placeholder="¿Cómo ha ido el evento?"
                  value={newMoment.text}
                  onChange={e => setNewMoment(prev => ({ ...prev, text: e.target.value }))}
                  style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:10, color:'var(--text)', minHeight:80 }}
                />
                {newMoment.imagePreview && (
                  <img src={newMoment.imagePreview} alt="Preview" style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:10 }}/>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display:'none' }}/>
                  <button onClick={() => fileRef.current?.click()} style={{ background:'var(--surface2)', border:'none', padding:'8px 12px', borderRadius:8, fontSize:12, cursor:'pointer', color:'var(--text)' }}>
                    🖼️ Seleccionar foto
                  </button>
                  <button onClick={postMoment} disabled={posting} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:12 }}>
                    {posting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            )}

            {loadingMoments ? (
              <div style={{ textAlign:'center', padding:24 }}><div className="spinner"/></div>
            ) : moments.length === 0 ? (
              <div className="card" style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
                Aún no hay momentos compartidos en este evento.
              </div>
            ) : (
              moments.map(m => (
                <div key={m.id} className="card" style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>
                      {m.profiles?.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <strong style={{ fontSize:13, display:'block' }}>{m.profiles?.full_name || 'Usuario'}</strong>
                      <span style={{ fontSize:10, color:'var(--muted)' }}>{new Date(m.created_at).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}</span>
                    </div>
                  </div>
                  {m.text && <p style={{ fontSize:13, margin:0, lineHeight:1.4 }}>{m.text}</p>}
                  {m.image_url && <img src={m.image_url} alt="" style={{ width:'100%', borderRadius:10, maxHeight:300, objectFit:'cover' }}/>}
                  <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, color:'var(--muted)' }}>
                    <button onClick={() => toggleMomentLike(m.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14 }}>
                      {momentLikes[m.id] ? '❤️' : '🤍'} {momentCounts[m.id] || 0}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CHAT */}
        {tab === 'Chat' && (
          <div style={{ display:'flex', flexDirection:'column', height:'calc(100dvh - 280px)', minHeight:350 }}>
            {chatError && (
              <div style={{ padding:8, background:'#ef444422', border:'1px solid #ef4444', borderRadius:8, color:'#ef4444', fontSize:12, marginBottom:8 }}>
                {chatError}
              </div>
            )}
            <div ref={chatRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4 }}>
              {loadingChat ? (
                <div style={{ textAlign:'center', padding:24 }}><div className="spinner"/></div>
              ) : messages.length === 0 ? (
                <div className="card" style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
                  Aún no hay mensajes. ¡Sé el primero en saludar!
                </div>
              ) : (
                messages.map(m => {
                  const isMe = m.user_id === user?.id
                  return (
                    <div key={m.id} style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth:'80%', display:'flex', flexDirection:'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}>
                      <span style={{ fontSize:10, color:'var(--muted)', marginBottom:2 }}>
                        {m.profiles?.full_name || 'Usuario'}
                      </span>
                      <div style={{
                        padding:'10px 14px', borderRadius:14,
                        background: isMe ? c : 'var(--surface)',
                        color: isMe ? 'white' : 'var(--text)',
                        fontSize:13, lineHeight:1.4,
                        borderBottomRightRadius: isMe ? 2 : 14,
                        borderBottomLeftRadius: isMe ? 14 : 2,
                      }}>
                        {m.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input chat */}
            {user ? (
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={chatMsg}
                  onChange={e => setChat(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  style={{
                    flex:1, background:'var(--surface)', border:'1px solid var(--border)',
                    borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:13,
                  }}
                />
                <button onClick={sendMsg} disabled={!chatMsg.trim()||sendingMsg} style={{
                  width:40, height:40, borderRadius:12, border:'none', flexShrink:0,
                  background: chatMsg.trim() ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--surface2)',
                  cursor: chatMsg.trim() ? 'pointer' : 'default',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:15, color: chatMsg.trim() ? 'white' : 'var(--muted)',
                }}>➤</button>
              </div>
            ) : (
              <div className="card" style={{ padding:12, textAlign:'center', marginTop:12, fontSize:12 }}>
                Debes <a href="/auth" style={{ color:c, textDecoration:'underline' }}>iniciar sesión</a> para chatear.
              </div>
            )}
          </div>
        )}

        <div style={{ height:90 }}/>
      </div>
      <Navbar />

      {/* Modal póster */}
      {showPoster && ev && (
        <PosterModal event={ev} onClose={() => setShowPoster(false)} />
      )}
    </>
  )
}

export default function EventDetailClient() {
  return (
    <Suspense fallback={
      <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
        <div className="spinner"/>
      </div>
    }>
      <EventDetailInner />
    </Suspense>
  )
}
