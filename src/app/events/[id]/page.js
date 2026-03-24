'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const S_COLORS = { running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444', gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316', yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6' }
const S_ICONS  = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴', yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸' }

const DEMO = {
  'demo-1': { id:'demo-1', title:'Running Matutino',         sport:'running',    level:'any',          date:'2026-03-30', time:'07:30:00', location:'Alameda de Córdoba',      province:'Córdoba',  max_players:10, price:'Gratis',     third_place:false, description:'Ruta de running matutino por la Alameda. Ritmo medio 5:00–5:30/km. Todos los niveles bienvenidos. Llevar agua.',             creator_name:'Carlos O.', participant_count:7,  tags:['Aire libre','Todos los niveles','Grupo pequeño'] },
  'demo-2': { id:'demo-2', title:'Torneo Pádel Nivel Medio', sport:'padel',      level:'intermediate', date:'2026-03-29', time:'18:00:00', location:'Club de Pádel Centro',    province:'Valencia', max_players:4,  price:'5€/persona', third_place:true,  description:'Torneo amistoso con rotación de parejas. Raquetas disponibles en el club.',                                              creator_name:'Laura M.', participant_count:2,  tags:['Indoor','Mixto','Torneo'] },
  'demo-3': { id:'demo-3', title:'Senderismo Sierra Norte',  sport:'senderismo', level:'advanced',     date:'2026-03-30', time:'09:00:00', location:'Plaza del Pueblo',         province:'Madrid',   max_players:20, price:'Gratis',     third_place:true,  description:'Ruta de 12 km por la Sierra Norte. Imprescindible calzado de montaña y llevar mínimo 2 litros de agua.',               creator_name:'Javi M.', participant_count:12, tags:['Montaña','Natural','Tercer tiempo'] },
  'demo-4': { id:'demo-4', title:'Fútbol 7 tarde',           sport:'futbol',     level:'any',          date:'2026-03-28', time:'20:00:00', location:'Polideportivo Municipal',  province:'Sevilla',  max_players:14, price:'Gratis',     third_place:true,  description:'Partido amistoso de fútbol 7. Todos los niveles bienvenidos. Tercer tiempo en el bar de al lado.',                     creator_name:'Diego R.', participant_count:11, tags:['Fútbol 7','Casual','Tercer tiempo'] },
  'demo-5': { id:'demo-5', title:'Entreno Funcional Grupal', sport:'gimnasio',   level:'intermediate', date:'2026-03-25', time:'19:00:00', location:'Box CrossFit Sur',         province:'Madrid',   max_players:12, price:'Gratis',     third_place:false, description:'4 rondas de ejercicios funcionales: sentadillas, burpees, dominadas y carrera. Duración ~50 minutos.',                creator_name:'Laura S.', participant_count:8,  tags:['HIIT','Fuerza','Grupo'] },
  'demo-6': { id:'demo-6', title:'Dobles Tenis Casual',      sport:'tenis',      level:'beginner',     date:'2026-04-01', time:'10:00:00', location:'Club de Tenis Parque Sur', province:'Málaga',   max_players:8,  price:'Gratis',     third_place:false, description:'Partidos de dobles de tenis para todos los niveles. Ambiente muy relajado.',                                            creator_name:'Ana G.',   participant_count:3,  tags:['Pista dura','Casual','Principiantes'] },
  '1': { id:'demo-1', title:'Running Matutino', sport:'running', level:'any', date:'2026-03-30', time:'07:30:00', location:'Alameda de Córdoba', province:'Córdoba', max_players:10, price:'Gratis', third_place:false, description:'Ruta matutina.', creator_name:'Carlos O.', participant_count:7, tags:[] },
  '2': { id:'demo-2', title:'Torneo Pádel',     sport:'padel',   level:'intermediate', date:'2026-03-29', time:'18:00:00', location:'Club Pádel', province:'Valencia', max_players:4, price:'5€', third_place:true, description:'Torneo.', creator_name:'Laura M.', participant_count:2, tags:[] },
}

const TABS = ['Info','Participantes','Chat']

const isDemo = (id) => String(id).startsWith('demo-') || !!DEMO[id]

function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})
}

export default function EventDetail() {
  const { id }   = useParams()
  const router   = useRouter()
  const { user } = useAuth()
  const chatRef  = useRef(null)
  const chatPollRef = useRef(null)

  const [ev,           setEv]       = useState(null)
  const [pCount,       setPCount]   = useState(0)
  const [participants, setParticipants] = useState([])
  const [loading,      setLoad]     = useState(true)
  const [tab,          setTab]      = useState('Info')
  const [joined,       setJoined]   = useState(false)
  const [joining,      setJoining]  = useState(false)
  const [messages,     setMessages] = useState([])
  const [chatMsg,      setChat]     = useState('')
  const [sendingMsg,   setSending]  = useState(false)
  const [loadingChat,  setLoadChat] = useState(false)
  const [lastMsgId,    setLastMsgId] = useState(null)

  // ── Carga inicial del evento ──────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (isDemo(id)) {
        const d = DEMO[id]
        if (d) { setEv(d); setPCount(d.participant_count || 0) }
        setLoad(false)
        return
      }
      try {
        const sb = getSupabase()
        if (sb) {
          const { data, error } = await sb.from('events_with_counts').select('*').eq('id', id).single()
          if (!error && data) {
            setEv(data)
            setPCount(data.participant_count || 0)
            if (user) {
              const { data: ep } = await sb.from('event_participants').select('id').eq('event_id', id).eq('user_id', user.id).single()
              setJoined(!!ep)
            }
            setLoad(false)
            return
          }
        }
      } catch(_) {}
      const fallback = DEMO[id] || DEMO['demo-1']
      setEv(fallback)
      setPCount(fallback?.participant_count || 7)
      setLoad(false)
    }
    load()
  }, [id, user])

  // ── Participantes (carga al entrar en pestaña) ────────────
  useEffect(() => {
    if (tab !== 'Participantes') return
    const loadParticipants = async () => {
      const sb = getSupabase()
      if (!sb || isDemo(id)) {
        setParticipants([
          { id:'p1', full_name:'Carlos O.', username:'carlosO', avatar_url:null },
          { id:'p2', full_name:'Laura M.',  username:'lauraM',  avatar_url:null },
          { id:'p3', full_name:'Javi R.',   username:'javiR',   avatar_url:null },
        ])
        return
      }
      try {
        // status puede ser 'joined' o 'confirmed' — buscamos ambos
        const { data } = await sb.from('event_participants')
          .select('user_id, profiles(id, full_name, username, avatar_url)')
          .eq('event_id', id)
          .in('status', ['joined', 'confirmed'])
        if (data) setParticipants(data.map(d => d.profiles).filter(Boolean))
      } catch(_) {}
    }
    loadParticipants()
  }, [tab, id])

  // ── Chat: función de carga de mensajes ────────────────────
  const fetchMessages = useCallback(async (showSpinner = false) => {
    const sb = getSupabase()
    if (!sb || isDemo(id)) return

    if (showSpinner) setLoadChat(true)
    try {
      const { data } = await sb.from('event_messages')
        .select('id, user_id, text, created_at, profiles(full_name)')
        .eq('event_id', id)
        .order('created_at', { ascending: true })
        .limit(100)

      if (data) {
        setMessages(prev => {
          // Evitar re-renders innecesarios si no hay cambios
          const newIds = data.map(m => m.id).join(',')
          const oldIds = prev.filter(m => !m.id.startsWith('temp-')).map(m => m.id).join(',')
          if (newIds === oldIds) return prev

          // Conservar mensajes temporales (optimistic) que aún no llegaron de BD
          const realIds = new Set(data.map(m => m.id))
          const temps   = prev.filter(m => m.id.startsWith('temp-') && !realIds.has(m.id))

          const real = data.map(m => ({
            id:         m.id,
            user_id:    m.user_id,
            author:     m.profiles?.full_name || 'Usuario',
            text:       m.text,
            created_at: m.created_at,
            me:         m.user_id === user?.id,
          }))
          return [...real, ...temps]
        })
        if (data.length > 0) setLastMsgId(data[data.length - 1].id)
      }
    } catch(_) {}
    if (showSpinner) setLoadChat(false)
  }, [id, user])

  // ── Chat: demo cuando es evento de muestra ────────────────
  const loadDemoChat = useCallback(() => {
    setMessages([
      { id:'m1', user_id:'u1', author:'Carlos O.', text:'¡Quedan 3 plazas! Animaos 💪', created_at: new Date(Date.now()-3600000).toISOString(), me:false },
      { id:'m2', user_id:'u2', author:'Laura M.',  text:'Yo llevo raqueta de repuesto si alguien necesita', created_at: new Date(Date.now()-1800000).toISOString(), me:false },
    ])
  }, [])

  // ── Chat: activar/desactivar polling según pestaña ────────
  useEffect(() => {
    // Limpiar intervalo anterior siempre
    if (chatPollRef.current) {
      clearInterval(chatPollRef.current)
      chatPollRef.current = null
    }

    if (tab !== 'Chat' || !joined) return

    if (isDemo(id)) {
      loadDemoChat()
      return
    }

    // Primera carga con spinner
    fetchMessages(true)

    // Polling cada 4 segundos mientras el chat está abierto
    chatPollRef.current = setInterval(() => {
      fetchMessages(false)
    }, 4000)

    return () => {
      if (chatPollRef.current) {
        clearInterval(chatPollRef.current)
        chatPollRef.current = null
      }
    }
  }, [tab, joined, id, fetchMessages, loadDemoChat])

  // ── Auto-scroll al final solo cuando hay mensajes nuevos ──
  const prevMsgCount = useRef(0)
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
      prevMsgCount.current = messages.length
    }
  }, [messages])

  // ── Unirse / salir ────────────────────────────────────────
  const handleJoin = async () => {
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
  }

  // ── Enviar mensaje ────────────────────────────────────────
  const sendMsg = async () => {
    if (!chatMsg.trim() || !user || !joined) return
    setSending(true)
    const text = chatMsg.trim()
    setChat('')

    // Optimistic: añadir el mensaje al instante
    const temp = {
      id: 'temp-' + Date.now(),
      user_id: user.id,
      author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tú',
      text,
      created_at: new Date().toISOString(),
      me: true,
    }
    setMessages(p => [...p, temp])
    prevMsgCount.current += 1

    try {
      const sb = getSupabase()
      if (sb && !isDemo(id)) {
        await sb.from('event_messages').insert({ event_id: id, user_id: user.id, text })
        // Recargar inmediatamente tras enviar para sustituir el temporal
        fetchMessages(false)
      }
    } catch(_) {}
    setSending(false)
  }

  function fmtTime(iso) {
    const d = new Date(iso)
    const now = new Date()
    const diffH = (now - d) / 3600000
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

  return (
    <>
      <div className="page-wrap-full">

        {/* Hero */}
        <div style={{ background:`linear-gradient(160deg,${c}ee,${c}88)`, padding:'58px 22px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.10)', pointerEvents:'none' }}/>
          <button onClick={()=>router.back()} style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer' }}>←</button>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:52, marginBottom:12, filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.22))' }}>{icon}</div>
            <div style={{ display:'inline-flex', gap:8, background:'rgba(255,255,255,0.20)', borderRadius:10, padding:'4px 12px', marginBottom:8 }}>
              <span style={{ color:'white', fontSize:12, fontWeight:700, textTransform:'capitalize' }}>{ev.sport}</span>
              {ev.level && ev.level!=='any' && <><span style={{ color:'rgba(255,255,255,0.6)' }}>·</span><span style={{ color:'rgba(255,255,255,0.88)', fontSize:12, textTransform:'capitalize' }}>{ev.level}</span></>}
            </div>
            <h1 style={{ color:'white', fontWeight:900, fontSize:26, margin:'0 0 6px', letterSpacing:'-0.05em', lineHeight:1.2 }}>{ev.title}</h1>
            <div style={{ color:'rgba(255,255,255,0.80)', fontSize:13 }}>por {ev.creator_name || 'Organizador'}</div>
          </div>
        </div>

        {/* Info rápida */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, padding:'16px 18px 0' }}>
          {[
            { icon:'📅', label:'Fecha',  value:fmt(ev.date) },
            { icon:'⏱️', label:'Hora',   value:ev.time?.slice(0,5)||'' },
            { icon:'📍', label:'Lugar',  value:ev.location },
            { icon:'💶', label:'Precio', value:ev.price||'Gratis' },
          ].map(item=>(
            <div key={item.label} className="card anim-1" style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <div style={{ minWidth:0 }}>
                <div className="label" style={{ marginBottom:2 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plazas */}
        <div className="card anim-2" style={{ margin:'10px 18px 0', padding:'14px 18px' }}>
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
          <button className="btn btn-primary" style={{ width:'100%', fontSize:16, background: joined?'rgba(239,68,68,0.85)':undefined }} onClick={handleJoin} disabled={joining}>
            {joining ? 'Procesando...' : joined ? '✗ Salir del evento' : free>0 ? '✓ Unirme al evento' : '⏳ Lista de espera'}
          </button>
          {!user && <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:8 }}>Necesitas <a href="/auth" style={{ color:'var(--primary)', fontWeight:600 }}>iniciar sesión</a> para unirte</p>}
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t => (
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:'10px 0', borderRadius:12, border:'none', fontSize:13, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit',
                background: tab===t ? c : 'transparent',
                color: tab===t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
                position:'relative',
              }}>
                {t}
                {t==='Chat' && <span style={{ marginLeft:4, fontSize:10, background: joined?c:'var(--muted)', color:'white', borderRadius:100, padding:'1px 5px', opacity: joined?1:0.6 }}>{joined?'🔓':'🔒'}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Info ── */}
        {tab==='Info' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card anim-1" style={{ padding:'16px 18px' }}>
              <div className="label" style={{ marginBottom:10 }}>Descripción</div>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65, margin:0 }}>{ev.description || 'Sin descripción.'}</p>
            </div>
            <div className="card anim-2" style={{ padding:'16px 18px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📍</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{ev.location}</div>
                {ev.province && <div style={{ fontSize:12, color:'var(--muted)', marginTop:3, textTransform:'capitalize' }}>{ev.province}</div>}
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.location)}`} target="_blank" rel="noreferrer"
                  style={{ display:'inline-block', marginTop:10, color:c, fontSize:12, fontWeight:700 }}>
                  Ver en Google Maps →
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
              <span style={{ fontSize:13, color:'var(--muted)' }}>
                {pCount} persona{pCount!==1?'s':''} apuntada{pCount!==1?'s':''}
              </span>
              {!joined && user && (
                <span style={{ fontSize:12, color:c, fontWeight:600 }}>Únete para ver más</span>
              )}
            </div>

            {participants.length === 0 ? (
              <div className="card" style={{ padding:'28px 20px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>👥</div>
                <div style={{ fontSize:14, color:'var(--muted)' }}>Sé el primero en apuntarte</div>
              </div>
            ) : (
              participants.slice(0, joined ? undefined : 3).map((p, i) => (
                <div key={p.id} className={`card anim-${(i%6)+1}`} style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                    {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{p.full_name || 'Usuario'}</div>
                    {p.username && <div style={{ fontSize:12, color:'var(--muted)' }}>@{p.username}</div>}
                  </div>
                  {p.id === user?.id && <span style={{ fontSize:11, color:c, fontWeight:700, background:`${c}18`, borderRadius:8, padding:'3px 8px' }}>Tú ✓</span>}
                </div>
              ))
            )}

            {!joined && participants.length > 3 && (
              <div className="card" style={{ padding:'16px 18px', textAlign:'center' }}>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:12 }}>
                  +{participants.length - 3} participante{participants.length-3!==1?'s':''} más. Únete para ver la lista completa.
                </div>
                <button className="btn btn-primary" style={{ fontSize:13, padding:'10px 20px' }} onClick={handleJoin} disabled={joining}>
                  ✓ Unirme al evento
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Chat ── */}
        {tab==='Chat' && (
          <div style={{ padding:'16px 0 0' }}>
            {!user ? (
              <div className="chat-locked">
                <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:8 }}>Chat privado</div>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:18, lineHeight:1.6 }}>
                  El chat es exclusivo para los participantes del evento. Inicia sesión y únete para acceder.
                </p>
                <a href="/auth" className="btn btn-primary" style={{ fontSize:14, display:'inline-flex' }}>Entrar / Registrarse</a>
              </div>
            ) : !joined ? (
              <div className="chat-locked">
                <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
                <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:8 }}>Chat del evento</div>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:6, lineHeight:1.6 }}>
                  Los {pCount} participantes ya están coordinando. Horarios, puntos de encuentro, equipación...
                </p>
                <div style={{ display:'flex', gap:8, justifyContent:'center', margin:'12px 0 18px', flexWrap:'wrap' }}>
                  {['📍 Punto de encuentro','⏰ Hora exacta','👟 Qué llevar'].map(t=>(
                    <span key={t} style={{ fontSize:12, color:c, background:`${c}14`, border:`1px solid ${c}28`, borderRadius:100, padding:'4px 12px', fontWeight:600 }}>{t}</span>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ width:'100%', fontSize:14 }} onClick={handleJoin} disabled={joining}>
                  {joining ? 'Uniéndote...' : `✓ Unirme y acceder al chat`}
                </button>
                {free === 0 && (
                  <p style={{ fontSize:12, color:'var(--muted)', marginTop:10 }}>El evento está lleno — puedes apuntarte a la lista de espera</p>
                )}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', padding:'0 18px' }}>
                <div style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginBottom:14, padding:'6px 12px', background:'var(--surface2)', borderRadius:100, display:'inline-block', alignSelf:'center' }}>
                  🔒 Solo visible para participantes · se actualiza cada 4s
                </div>

                {/* Mensajes */}
                <div ref={chatRef} style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:340, overflowY:'auto', marginBottom:14, paddingRight:2 }}>
                  {loadingChat ? (
                    <div style={{ textAlign:'center', padding:'20px 0' }}><div className="spinner" style={{ width:24, height:24, borderWidth:2 }}/></div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'30px 0', color:'var(--muted)', fontSize:13 }}>
                      Ningún mensaje aún. ¡Sé el primero en escribir!
                    </div>
                  ) : messages.map((m, i) => (
                    <div key={m.id} style={{ display:'flex', flexDirection: m.me?'row-reverse':'row', alignItems:'flex-end', gap:8 }}>
                      {!m.me && (
                        <div style={{ width:28, height:28, borderRadius:'50%', background:`${c}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>👤</div>
                      )}
                      <div style={{ maxWidth:'72%' }}>
                        {!m.me && <div style={{ fontSize:10, color:'var(--muted)', marginBottom:3, marginLeft:4 }}>{m.author}</div>}
                        <div style={{
                          background: m.me ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--surface)',
                          border: m.me ? 'none' : '1px solid var(--border)',
                          borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          padding:'10px 14px',
                          color: m.me ? 'white' : 'var(--text)',
                          fontSize:13, lineHeight:1.45,
                          opacity: m.id.startsWith('temp-') ? 0.65 : 1,
                        }}>{m.text}</div>
                        <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, textAlign: m.me?'right':'left' }}>
                          {m.id.startsWith('temp-') ? 'Enviando...' : fmtTime(m.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div style={{ display:'flex', gap:8, alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'6px 6px 6px 14px', marginBottom:4 }}>
                  <input
                    value={chatMsg}
                    onChange={e=>setChat(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMsg() } }}
                    placeholder="Escribe un mensaje…"
                    style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:14, fontFamily:'inherit' }}
                  />
                  <button onClick={sendMsg} disabled={!chatMsg.trim() || sendingMsg} style={{
                    width:36, height:36, borderRadius:12, border:'none', flexShrink:0,
                    background: chatMsg.trim() ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--surface2)',
                    cursor: chatMsg.trim() ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:15, color: chatMsg.trim() ? 'white' : 'var(--muted)',
                    transition:'all 0.15s ease',
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
