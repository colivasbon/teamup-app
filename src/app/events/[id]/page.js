'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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

// Comprueba si el evento permite publicar momentos
// (ha empezado ya O empezó hace menos de 48h)
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
  const [mapCoords,    setMapCoords]    = useState(null) // { lat, lon }
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

  // Momentos
  const [moments,       setMoments]      = useState([])
  const [loadingMoments,setLoadMoments]  = useState(false)
  const [compose,       setCompose]      = useState(false)
  const [newMoment,     setNewMoment]    = useState({ text:'', imageFile: null, imagePreview: null })
  const [posting,       setPosting]      = useState(false)
  const [momentLikes,   setMomentLikes]  = useState({}) // { [id]: bool }
  const [momentCounts,  setMomentCounts] = useState({}) // { [id]: number }

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
          const { data, error } = await sb.from('events_with_counts').select('*').eq('id', id).single()
          if (!error && data) {
            setEv(data); setPCount(data.participant_count || 0)
            if (user) {
              const { data: ep } = await sb.from('event_participants')
                .select('id').eq('event_id', id).eq('user_id', user.id).maybeSingle()
              setJoined(!!ep)
              // Recargar el contador tras 1.5s para capturar el insert del creador
              setTimeout(async () => {
                const { data: fresh } = await sb.from('events_with_counts')
                  .select('participant_count').eq('id', id).single()
                if (fresh) setPCount(fresh.participant_count || 0)
              }, 1500)
            }
            setLoad(false)
            // Geocodificar la dirección para el mapa
            // Si Nominatim no encuentra nada, se deja mapCoords como null
            // y se muestra solo el boton de Google Maps
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
              // Intento 1: dirección completa
              const full = [data.location, data.province].filter(Boolean).join(', ')
              let coords = await tryGeocode(full)
              // Intento 2: solo el nombre del lugar sin dirección adicional
              if (!coords && data.location) coords = await tryGeocode(data.location)
              // Si encontró algo, usar—si no, mapCoords queda null y no se muestra el mapa
              if (coords) setMapCoords(coords)
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
        // Paso 1: obtener los user_ids de los participantes
        const { data: epData } = await sb.from('event_participants')
          .select('user_id')
          .eq('event_id', id)
        if (!epData || epData.length === 0) { setParticipants([]); return }
        // Paso 2: obtener sus perfiles por separado (evita bloqueos RLS en join)
        const uids = epData.map(e => e.user_id)
        const { data: pData } = await sb.from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', uids)
        setParticipants(pData || [])
      } catch(_) {}
    }
    loadP()
  }, [tab, id])

  // ── Momentos del evento ──────────────────────────────────
  const fetchMoments = useCallback(async () => {
    if (isDemo(id)) return
    setLoadMoments(true)
    try {
      const sb = getSupabase(); if (!sb) return
      const { data: mData, error } = await sb
        .from('moments')
        .select('id, text, image_url, created_at, user_id')
        .eq('event_id', id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error || !mData) return

      // Perfiles aparte
      const uids = [...new Set(mData.map(m => m.user_id))]
      let pMap = {}
      if (uids.length > 0) {
        const { data: pData } = await sb.from('profiles').select('id, full_name, avatar_url').in('id', uids)
        if (pData) pData.forEach(p => { pMap[p.id] = p })
      }

      // Likes aparte
      const mids = mData.map(m => m.id)
      const { data: lData } = await sb.from('moment_likes').select('moment_id, user_id').in('moment_id', mids)
      const counts = {}; const myL = {}
      for (const l of (lData || [])) {
        counts[l.moment_id] = (counts[l.moment_id] || 0) + 1
        if (l.user_id === user?.id) myL[l.moment_id] = true
      }

      setMoments(mData.map(m => ({
        id: m.id, user_id: m.user_id,
        author: pMap[m.user_id]?.full_name || 'Usuario',
        avatar: pMap[m.user_id]?.avatar_url || null,
        text: m.text, image_url: m.image_url,
        created_at: m.created_at,
      })))
      setMomentCounts(counts)
      setMomentLikes(prev => ({ ...myL, ...prev }))
    } catch(e) { console.error('fetchMoments:', e) }
    setLoadMoments(false)
  }, [id, user])

  useEffect(() => {
    if (tab === 'Momentos') fetchMoments()
  }, [tab, fetchMoments])

  // ── Publicar momento ─────────────────────────────────────
  const publishMoment = async () => {
    if (!newMoment.text.trim() || !user) return
    setPosting(true)
    try {
      const sb = getSupabase(); if (!sb) return

      let image_url = null

      // Subir imagen si hay
      if (newMoment.imageFile) {
        const ext  = newMoment.imageFile.name.split('.').pop()
        const path = `${user.id}/${id}/${Date.now()}.${ext}`
        const { error: upErr } = await sb.storage
          .from('moment-images')
          .upload(path, newMoment.imageFile, { contentType: newMoment.imageFile.type, upsert: false })
        if (!upErr) {
          const { data: urlData } = sb.storage.from('moment-images').getPublicUrl(path)
          image_url = urlData?.publicUrl || null
        }
      }

      const province = ev?.province
        ? ev.province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-')
        : null

      const { data, error } = await sb.from('moments').insert({
        user_id:  user.id,
        event_id: id,
        text:     newMoment.text.trim(),
        sport:    ev?.sport || 'running',
        province: province,
        image_url,
      }).select('id, text, image_url, created_at, user_id').single()

      if (!error && data) {
        const opt = {
          id: data.id, user_id: user.id,
          author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tú',
          avatar: null, text: data.text,
          image_url: data.image_url, created_at: data.created_at,
        }
        setMoments(p => [opt, ...p])
        setMomentCounts(p => ({ ...p, [data.id]: 0 }))
      }
    } catch(e) { console.error('publishMoment:', e) }
    setNewMoment({ text:'', imageFile: null, imagePreview: null })
    setCompose(false); setPosting(false)
  }

  // ── Like de momento ──────────────────────────────────────
  const toggleMomentLike = async (mid) => {
    const isL = !!momentLikes[mid]
    setMomentLikes(p => ({ ...p, [mid]: !isL }))
    setMomentCounts(p => ({ ...p, [mid]: Math.max(0, (p[mid]||0) + (isL ? -1 : 1)) }))
    if (!user) return
    try {
      const sb = getSupabase(); if (!sb) return
      if (isL) await sb.from('moment_likes').delete().eq('moment_id', mid).eq('user_id', user.id)
      else     await sb.from('moment_likes').insert({ moment_id: mid, user_id: user.id })
    } catch(_) {}
  }

  // ── Mensajes del chat ────────────────────────────────────
  const fetchMessages = useCallback(async (showSpinner = false) => {
    const sb = getSupabase()
    if (!sb || isDemo(id)) return
    if (showSpinner) setLoadChat(true)
    try {
      const { data: msgData, error } = await sb.from('event_messages')
        .select('id, user_id, text, created_at')
        .eq('event_id', id)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) { console.error('chat error:', error) }
      else if (msgData) {
        const uids = [...new Set(msgData.map(m => m.user_id))]
        let namesMap = {}
        if (uids.length > 0) {
          const { data: profiles } = await sb.from('profiles').select('id, full_name, avatar_url').in('id', uids)
          if (profiles) profiles.forEach(p => { namesMap[p.id] = p })
        }

        setMessages(prev => {
          const newIds = msgData.map(m => m.id).join(',')
          const oldReal = prev.filter(m => !m.id.startsWith('temp-')).map(m => m.id).join(',')
          if (newIds === oldReal) return prev

          // FIX DUPLICADOS: solo conservar temporales que son MÁS NUEVOS
          // que el último mensaje real — si ya hay un real con timestamp >= temp, descartar el temp
          const lastRealTs = msgData.length > 0
            ? new Date(msgData[msgData.length - 1].created_at).getTime()
            : 0

          const temps = prev.filter(m =>
            m.id.startsWith('temp-') &&
            new Date(m.created_at).getTime() > lastRealTs
          )

          const real = msgData.map(m => ({
            id: m.id, user_id: m.user_id,
            author: namesMap[m.user_id]?.full_name || 'Usuario',
            avatar: namesMap[m.user_id]?.avatar_url || null,
            text: m.text, created_at: m.created_at,
            me: m.user_id === user?.id,
          }))
          return [...real, ...temps]
        })
      }
    } catch(e) { console.error('fetchMessages exception:', e) }
    if (showSpinner) setLoadChat(false)
  }, [id, user])

  // ── Polling chat ─────────────────────────────────────────
  useEffect(() => {
    if (chatPollRef.current) { clearInterval(chatPollRef.current); chatPollRef.current = null }
    if (tab !== 'Chat' || !joined) return
    if (isDemo(id)) {
      setMessages([
        { id:'m1', user_id:'u1', author:'Carlos O.', avatar:null, text:'¡Quedan 3 plazas! Animaos 💪', created_at: new Date(Date.now()-3600000).toISOString(), me:false },
        { id:'m2', user_id:'u2', author:'Laura M.',  avatar:null, text:'Yo llevo raqueta de repuesto si alguien necesita', created_at: new Date(Date.now()-1800000).toISOString(), me:false },
      ]); return
    }
    fetchMessages(true)
    chatPollRef.current = setInterval(() => fetchMessages(false), 4000)
    return () => { if (chatPollRef.current) { clearInterval(chatPollRef.current); chatPollRef.current = null } }
  }, [tab, joined, id, fetchMessages])

  // ── Auto-scroll chat ─────────────────────────────────────
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
      prevMsgCount.current = messages.length
    }
  }, [messages])

  // ── Enviar mensaje ───────────────────────────────────────
  const sendMsg = async () => {
    if (!chatMsg.trim() || !user || !joined) return
    setSending(true); setChatError('')
    const text = chatMsg.trim(); setChat('')
    const tempId = 'temp-' + Date.now()
    const temp = {
      id: tempId, user_id: user.id,
      author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tú',
      avatar: null, text,
      created_at: new Date().toISOString(), me: true,
    }
    setMessages(p => [...p, temp])
    prevMsgCount.current += 1
    try {
      const sb = getSupabase()
      if (sb && !isDemo(id)) {
        const { error } = await sb.from('event_messages').insert({ event_id: id, user_id: user.id, text })
        if (error) {
          setChatError('No se pudo enviar. Comprueba tu conexión.')
          setMessages(p => p.filter(m => m.id !== tempId))
        } else {
          // Recargar inmediatamente para sustituir el temporal
          setTimeout(() => fetchMessages(false), 600)
        }
      }
    } catch(_) {
      setChatError('Error de conexión.')
      setMessages(p => p.filter(m => m.id !== tempId))
    }
    setSending(false)
  }

  // ── Seleccionar imagen ───────────────────────────────────
  // Comprimir imagen con Canvas (máx 1200px, calidad 0.75)
  const compressImage = (file) => new Promise((resolve) => {
    const MAX_PX  = 1200
    const QUALITY = 0.75
    const reader  = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const ratio  = Math.min(MAX_PX / img.width, MAX_PX / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
          'image/jpeg', QUALITY
        )
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview inmediato con el archivo original
    setNewMoment(p => ({ ...p, imageFile: file, imagePreview: URL.createObjectURL(file) }))
    // Comprimir en segundo plano y reemplazar el file antes de subir
    const compressed = await compressImage(file)
    setNewMoment(p => ({ ...p, imageFile: compressed }))
  }

  function fmtTime(iso) {
    const d = new Date(iso); const now = new Date(); const diffH = (now - d) / 3600000
    if (diffH < 1)  return `Hace ${Math.round((now-d)/60000)} min`
    if (diffH < 24) return `Hace ${Math.round(diffH)} h`
    return d.toLocaleDateString('es-ES', { day:'numeric', month:'short' })
  }

  if (loading) return (
    <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div className="spinner"/>
    </div>
  )
  if (!ev) return (
    <div className="app-shell" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', gap:16 }}>
      <div style={{ fontSize:48 }}>😕</div>
      <div style={{ fontWeight:700, fontSize:18 }}>Evento no encontrado</div>
      <button className="btn btn-primary" onClick={()=>router.push('/events')}>Ver todos los eventos</button>
    </div>
  )

  const c    = S_COLORS[ev.sport] || '#5b6ef5'
  const icon = S_ICONS[ev.sport]  || '🎯'
  const pct  = ev.max_players > 0 ? Math.round((pCount/ev.max_players)*100) : 0
  const free = ev.max_players - pCount
  const momentAllowed = canPostMoment(ev)

  return (
    <>
      <div className="page-wrap-full">

        {/* Hero */}
        <div style={{ background:`linear-gradient(160deg,${c}ee,${c}88)`, padding:'58px 22px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.10)', pointerEvents:'none' }}/>
          <button onClick={()=>router.back()} style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer' }}>←</button>
          {/* Botón editar (solo creador) — abajo a la izquierda del hero */}
          {user && (ev.creator_id === user.id || ev.creator_id === undefined) && !isDemo(id) && ev.creator_id && (
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/events/${id}/edit`) }}
              style={{ position:'absolute', bottom:16, right:16, background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5, zIndex:10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar evento
            </button>
          )}
          {/* Botón compartir — al lado derecho del botón volver, no interfiere con el tema (fixed top-right) */}
          <button onClick={()=>{
            const url  = window.location.href
            const text = `¡Úntete a "${ev.title}" en TeamUp! ${ev.date ? new Date(ev.date+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}) : ''} · ${ev.location}`
            if (navigator.share) { navigator.share({ title:'TeamUp', text, url }) }
            else { navigator.clipboard?.writeText(url); alert('Enlace copiado') }
          }} style={{ position:'absolute', top:16, left:64, background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:52, marginBottom:12, filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.22))' }}>{icon}</div>
            <div style={{ display:'inline-flex', gap:8, background:'rgba(255,255,255,0.20)', borderRadius:10, padding:'4px 12px', marginBottom:8 }}>
              <span style={{ color:'white', fontSize:12, fontWeight:700, textTransform:'capitalize' }}>{ev.sport}</span>
              {ev.level && ev.level!=='any' && <><span style={{ color:'rgba(255,255,255,0.6)' }}>·</span><span style={{ color:'rgba(255,255,255,0.88)', fontSize:12, textTransform:'capitalize' }}>{ev.level}</span></>}
            </div>
            <h1 style={{ color:'white', fontWeight:900, fontSize:26, margin:'0 0 6px', letterSpacing:'-0.05em', lineHeight:1.2 }}>{ev.title}</h1>
            <div style={{ color:'rgba(255,255,255,0.80)', fontSize:13 }}>
              por{' '}
              {ev.creator_id
                ? <a href={`/profile/${ev.creator_id}`} style={{ color:'white', fontWeight:700, textDecoration:'underline', textDecorationColor:'rgba(255,255,255,0.4)' }}>{ev.creator_name || 'Organizador'}</a>
                : <span>{ev.creator_name || 'Organizador'}</span>
              }
            </div>
          </div>
        </div>

        {/* Info rápida — scroll horizontal */}
        <div style={{ overflowX:'auto', padding:'16px 18px 0' }}>
          <div style={{ display:'flex', gap:10, minWidth:'max-content' }}>
            {[
              { icon:'📅', label:'Fecha',  value: fmt(ev.date) },
              { icon:'⏱️', label:'Hora',   value: (() => {
                if (!ev.time) return ''
                const base = ev.time.slice(0,5)
                if (!ev.duration_minutes) return base
                const [h,m] = ev.time.split(':').map(Number)
                const endMin = h*60+m+ev.duration_minutes
                return `${base} – ${String(Math.floor(endMin/60)%24).padStart(2,'0')}:${String(endMin%60).padStart(2,'0')}`
              })() },
              { icon:'⏳', label:'Duración', value: (() => {
                const min = ev.duration_minutes
                if (!min) return '—'
                if (min < 60) return `${min} min`
                const h = Math.floor(min/60), rest = min%60
                return rest ? `${h}h ${rest}min` : `${h}h`
              })() },
              { icon:'📍', label:'Lugar',  value: ev.location },
              { icon:'💶', label:'Precio', value: ev.price||'Gratis' },
            ].map(item=>(
              <div key={item.label} className="card" style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10, minWidth:130, maxWidth:190 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                <div style={{ minWidth:0 }}>
                  <div className="label" style={{ marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plazas */}
        <div className="card" style={{ margin:'10px 18px 0', padding:'14px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Plazas</span>
            <span style={{ fontSize:13, fontWeight:700, color:c }}>{pCount}/{ev.max_players}</span>
          </div>
          <div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:c }}/></div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>
            {free>0 ? `${free} plaza${free>1?'s':''} disponible${free>1?'s':''}` : 'Evento completo'}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'14px 18px 0' }}>
          <button className="btn btn-primary" style={{ width:'100%', fontSize:16, background: joined?'rgba(239,68,68,0.85)':undefined }} onClick={async () => {
            if (!user) { router.push('/auth'); return }
            setJoining(true)
            try {
              const sb = getSupabase()
              if (sb) {
                if (joined) {
                  await sb.from('event_participants').delete().eq('event_id', id).eq('user_id', user.id)
                  setJoined(false); setPCount(p => Math.max(0, p-1))
                } else {
                  const { error } = await sb.from('event_participants').insert({ event_id:id, user_id:user.id, status:'joined' })
                  if (!error) { setJoined(true); setPCount(p => p+1) }
                }
              }
            } catch(_) {}
            setJoining(false)
          }} disabled={joining}>
            {joining ? 'Procesando...' : joined ? '✗ Salir del evento' : free>0 ? '✓ Unirme al evento' : '⏳ Lista de espera'}
          </button>
          {!user && <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:8 }}>Necesitas <a href="/auth" style={{ color:'var(--primary)', fontWeight:600 }}>iniciar sesión</a> para unirte</p>}
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:3, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t => (
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:'9px 0', borderRadius:12, border:'none', fontSize:12, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit',
                background: tab===t ? c : 'transparent',
                color: tab===t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
              }}>
                {t === 'Chat'     && <span style={{ marginRight:3, fontSize:10 }}>{joined?'🔓':'🔒'}</span>}
                {t === 'Momentos' && moments.length > 0 && tab !== 'Momentos' && <span style={{ marginRight:3, fontSize:10, background:'#ef4444', borderRadius:100, padding:'0 4px', color:'white' }}>{moments.length}</span>}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Info ── */}
        {tab==='Info' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card" style={{ padding:'16px 18px' }}>
              <div className="label" style={{ marginBottom:10 }}>Descripción</div>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65, margin:0 }}>{ev.description || 'Sin descripción.'}</p>
            </div>
            <div className="card" style={{ overflow:'hidden' }}>
              {/* Mapa OSM si Nominatim encontró coordenadas, nada si no */}
              {mapCoords && (
                <iframe
                  key={`${mapCoords.lat},${mapCoords.lon}`}
                  title="Ubicación del evento"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lon-0.008},${mapCoords.lat-0.006},${mapCoords.lon+0.008},${mapCoords.lat+0.006}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lon}`}
                  style={{ width:'100%', height:190, border:'none', display:'block' }}
                  loading="lazy"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
              <div style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3" fill={c} fillOpacity="0.25"/>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{ev.location}</div>
                  {ev.province && <div style={{ fontSize:12, color:'var(--muted)' }}>{ev.province}</div>}
                </div>
                {/* Botón Google Maps — siempre visible, más grande si no hay mapa */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent([ev.location, ev.province].filter(Boolean).join(', '))}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    background: mapCoords ? 'transparent' : `${c}18`,
                    border: mapCoords ? 'none' : `1.5px solid ${c}40`,
                    borderRadius: mapCoords ? 0 : 10,
                    padding: mapCoords ? 0 : '7px 12px',
                    color:c, fontSize: mapCoords ? 12 : 13,
                    fontWeight:700, whiteSpace:'nowrap', flexShrink:0,
                  }}>
                  {!mapCoords && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>}
                  {mapCoords ? 'Maps' : 'Ver en Google Maps'}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
            {ev.tags?.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {ev.tags.map(tag=>(
                  <span key={tag} style={{ background:`${c}14`, border:`1px solid ${c}30`, borderRadius:10, color:c, fontSize:12, fontWeight:600, padding:'5px 12px' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Participantes ── */}
        {tab==='Participantes' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{pCount} persona{pCount!==1?'s':''} apuntada{pCount!==1?'s':''}</span>
              {!joined && user && <span style={{ fontSize:12, color:c, fontWeight:600 }}>Únete para ver más</span>}
            </div>
            {participants.length === 0 ? (
              <div className="card" style={{ padding:'28px 20px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>👥</div>
                <div style={{ fontSize:14, color:'var(--muted)' }}>Sé el primero en apuntarte</div>
              </div>
            ) : (
              participants.slice(0, joined ? undefined : 3).map((p, i) => (
                <a key={p.id} href={`/profile/${p.id}`} className={`card anim-${(i%6)+1}`}
                  style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                    {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{p.full_name || 'Usuario'}</div>
                    {p.username && <div style={{ fontSize:12, color:'var(--muted)' }}>@{p.username}</div>}
                  </div>
                  {p.id === user?.id ? <span style={{ fontSize:11, color:c, fontWeight:700, background:`${c}18`, borderRadius:8, padding:'3px 8px' }}>Tú ✓</span> : <span style={{ fontSize:16, color:'var(--muted)' }}>›</span>}
                </a>
              ))
            )}
            {!joined && participants.length > 3 && (
              <div className="card" style={{ padding:'16px 18px', textAlign:'center' }}>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:12 }}>+{participants.length - 3} participante{participants.length-3!==1?'s':''} más</div>
                <button className="btn btn-primary" style={{ fontSize:13, padding:'10px 20px' }} onClick={async () => {
                  if (!user) { router.push('/auth'); return }
                  setJoining(true)
                  const sb = getSupabase()
                  if (sb) {
                    const { error } = await sb.from('event_participants').insert({ event_id:id, user_id:user.id, status:'joined' })
                    if (!error) { setJoined(true); setPCount(p => p+1) }
                  }
                  setJoining(false)
                }} disabled={joining}>✓ Unirme al evento</button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Momentos ── */}
        {tab==='Momentos' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>

            {/* Compositor — solo participantes durante el evento */}
            {joined && momentAllowed && !compose && (
              <button onClick={()=>setCompose(true)} style={{
                display:'flex', alignItems:'center', gap:12, width:'100%',
                background:'var(--surface)', border:`1.5px dashed ${c}60`,
                borderRadius:16, padding:'14px 16px', cursor:'pointer',
                fontFamily:'inherit', transition:'all 0.15s ease',
              }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📸</div>
                <span style={{ fontSize:14, color:'var(--muted)', fontWeight:500 }}>Comparte cómo fue el evento…</span>
              </button>
            )}

            {/* Formulario compose */}
            {joined && momentAllowed && compose && (
              <div className="card" style={{ padding:'16px' }}>
                <textarea
                  value={newMoment.text}
                  onChange={e=>setNewMoment(p=>({...p,text:e.target.value}))}
                  placeholder="¿Cómo fue? Cuéntaselo a la comunidad..."
                  className="input"
                  style={{ resize:'none', minHeight:80, fontSize:14, lineHeight:1.5, marginBottom:10 }}
                  autoFocus
                />
                {/* Preview imagen */}
                {newMoment.imagePreview && (
                  <div style={{ position:'relative', marginBottom:10 }}>
                    <img src={newMoment.imagePreview} alt="" style={{ width:'100%', borderRadius:12, maxHeight:220, objectFit:'cover' }}/>
                    <button onClick={()=>setNewMoment(p=>({...p,imageFile:null,imagePreview:null}))} style={{
                      position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.6)', border:'none',
                      borderRadius:'50%', width:28, height:28, color:'white', fontSize:14, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>✕</button>
                  </div>
                )}
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <button onClick={()=>fileRef.current?.click()} style={{
                    background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10,
                    padding:'8px 12px', cursor:'pointer', fontSize:13, color:'var(--muted)',
                    fontFamily:'inherit', display:'flex', alignItems:'center', gap:6,
                  }}>
                    📷 Foto
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageSelect}/>
                  <div style={{ flex:1 }}/>
                  <button className="btn btn-ghost" style={{ fontSize:13, padding:'8px 12px' }} onClick={()=>{setCompose(false);setNewMoment({text:'',imageFile:null,imagePreview:null})}}>Cancelar</button>
                  <button className="btn btn-primary" style={{ fontSize:13, padding:'8px 16px' }} onClick={publishMoment} disabled={!newMoment.text.trim()||posting}>
                    {posting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            )}

            {/* Mensaje de tiempo */}
            {joined && !momentAllowed && (
              <div className="card" style={{ padding:'16px 18px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:4 }}>Los momentos se activan cuando empiece el evento</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>Podrás publicar desde el inicio hasta 48h después</div>
              </div>
            )}

            {/* CTA para no participantes */}
            {!joined && (
              <div style={{ background:`${c}10`, border:`1px solid ${c}25`, borderRadius:16, padding:'16px 18px', textAlign:'center' }}>
                <div style={{ fontSize:13, color:'var(--text2)', marginBottom:12, lineHeight:1.6 }}>
                  Los participantes comparten sus fotos y momentos aquí. Solo quien forma parte del evento puede publicar.
                </div>
                {!user
                  ? <a href="/auth" className="btn btn-primary" style={{ fontSize:13, display:'inline-block' }}>Entrar para unirte</a>
                  : <button className="btn btn-primary" style={{ fontSize:13 }} onClick={async () => {
                      if (!user) { router.push('/auth'); return }
                      setJoining(true)
                      const sb = getSupabase()
                      if (sb) {
                        const { error } = await sb.from('event_participants').insert({ event_id:id, user_id:user.id, status:'joined' })
                        if (!error) { setJoined(true); setPCount(p => p+1) }
                      }
                      setJoining(false)
                    }} disabled={joining}>
                      ✓ Unirme al evento
                    </button>
                }
              </div>
            )}

            {/* Feed de momentos */}
            {loadingMoments ? (
              <div style={{ textAlign:'center', padding:'24px 0' }}><div className="spinner"/></div>
            ) : moments.length === 0 ? (
              <div style={{ textAlign:'center', padding:'28px 0', color:'var(--muted)', fontSize:13 }}>
                {joined && momentAllowed ? 'Sé el primero en publicar un momento' : 'Aún no hay momentos de este evento'}
              </div>
            ) : moments.map((m, i) => (
              <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:0, overflow:'hidden' }}>
                <div style={{ height:3, background:`linear-gradient(90deg,${c},${c}55)` }}/>
                <div style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                    <a href={`/profile/${m.user_id}`}>
                      <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                        {m.avatar ? <img src={m.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                      </div>
                    </a>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{m.author}</div>
                      <div style={{ fontSize:11, color:'var(--muted)' }}>{fmtTime(m.created_at)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:'0 0 10px' }}>{m.text}</p>
                  {m.image_url && (
                    <img src={m.image_url} alt="" style={{ width:'100%', borderRadius:12, marginBottom:10, objectFit:'cover', maxHeight:280 }}/>
                  )}
                  <button onClick={()=>toggleMomentLike(m.id)} style={{
                    background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit',
                    display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600,
                    color: momentLikes[m.id] ? '#ef4444' : 'var(--muted)',
                    transition:'all 0.15s ease',
                  }}>
                    <span style={{ fontSize:16 }}>{momentLikes[m.id]?'❤️':'🤍'}</span>
                    {momentCounts[m.id] || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Chat ── */}
        {tab==='Chat' && (
          <div style={{ padding:'16px 0 0' }}>
            {!user ? (
              <div className="chat-locked">
                <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:8 }}>Chat privado</div>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:18, lineHeight:1.6 }}>El chat es exclusivo para los participantes.</p>
                <a href="/auth" className="btn btn-primary" style={{ fontSize:14, display:'inline-flex' }}>Entrar / Registrarse</a>
              </div>
            ) : !joined ? (
              <div className="chat-locked">
                <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
                <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:8 }}>Chat del evento</div>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:6, lineHeight:1.6 }}>
                  Los {pCount} participantes ya están coordinando.
                </p>
                <div style={{ display:'flex', gap:8, justifyContent:'center', margin:'12px 0 18px', flexWrap:'wrap' }}>
                  {['📍 Punto de encuentro','⏰ Hora exacta','👟 Qué llevar'].map(t=>(
                    <span key={t} style={{ fontSize:12, color:c, background:`${c}14`, border:`1px solid ${c}28`, borderRadius:100, padding:'4px 12px', fontWeight:600 }}>{t}</span>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ width:'100%', fontSize:14 }} onClick={async () => {
                  if (!user) { router.push('/auth'); return }
                  setJoining(true)
                  const sb = getSupabase()
                  if (sb) {
                    const { error } = await sb.from('event_participants').insert({ event_id:id, user_id:user.id, status:'joined' })
                    if (!error) { setJoined(true); setPCount(p => p+1) }
                  }
                  setJoining(false)
                }} disabled={joining}>
                  {joining ? 'Uniéndote...' : '✓ Unirme y acceder al chat'}
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', padding:'0 18px' }}>
                <div style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginBottom:14, padding:'6px 12px', background:'var(--surface2)', borderRadius:100, display:'inline-block', alignSelf:'center' }}>
                  🔒 Solo visible para participantes
                </div>
                <div ref={chatRef} style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:340, overflowY:'auto', marginBottom:14, padding:'12px 10px 12px 4px', background:'var(--surface2)', borderRadius:16, border:'1px solid var(--border)' }}>
                  {loadingChat ? (
                    <div style={{ textAlign:'center', padding:'20px 0' }}><div className="spinner" style={{ width:24, height:24, borderWidth:2 }}/></div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'30px 0', color:'var(--muted)', fontSize:13 }}>Ningún mensaje aún. ¡Sé el primero!</div>
                  ) : messages.map((m) => (
                    <div key={m.id} style={{ display:'flex', flexDirection: m.me?'row-reverse':'row', alignItems:'flex-end', gap:8 }}>
                      {!m.me && (
                        <div style={{ width:28, height:28, borderRadius:'50%', background:`${c}20`, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>
                          {m.avatar ? <img src={m.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                        </div>
                      )}
                      <div style={{ maxWidth:'72%' }}>
                        {!m.me && <div style={{ fontSize:10, color:'var(--muted)', marginBottom:3, marginLeft:4 }}>{m.author}</div>}
                        <div style={{
                          background: m.me ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--surface)',
                          border: m.me ? 'none' : '1px solid var(--border)',
                          borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          padding:'10px 14px', color: m.me ? 'white' : 'var(--text)',
                          fontSize:13, lineHeight:1.45,
                          opacity: m.id.startsWith('temp-') ? 0.6 : 1,
                        }}>{m.text}</div>
                        <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, textAlign: m.me?'right':'left' }}>
                          {m.id.startsWith('temp-') ? 'Enviando...' : fmtTime(m.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {chatError && (
                  <div style={{ fontSize:12, color:'#ef4444', background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'8px 12px', marginBottom:10 }}>{chatError}</div>
                )}
                <div style={{ display:'flex', gap:8, alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'6px 6px 6px 14px', marginBottom:4 }}>
                  <input value={chatMsg} onChange={e=>setChat(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()} }}
                    placeholder="Escribe un mensaje…"
                    style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:14, fontFamily:'inherit' }}
                  />
                  <button onClick={sendMsg} disabled={!chatMsg.trim()||sendingMsg} style={{
                    width:36, height:36, borderRadius:12, border:'none', flexShrink:0,
                    background: chatMsg.trim() ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--surface2)',
                    cursor: chatMsg.trim() ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:15, color: chatMsg.trim() ? 'white' : 'var(--muted)',
                  }}>➤</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ height:90 }}/>
      </div>
      <Navbar />
    </>
  )
}

export default function EventDetail() {
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
