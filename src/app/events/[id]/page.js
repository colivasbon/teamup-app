'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const S_COLORS = { running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444', gimnasio:'#8b5cf6', tenis:'#fbbf24' }
const S_ICONS  = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾' }

// Demo data fallback
const DEMO = {
  '1': { id:'1', title:'Running Matutino', sport:'running', level:'any', date:'2026-03-30', time:'07:30:00', location:'Alameda de Córdoba', province:'cordoba', max_players:10, price:'Gratis', third_place:false, description:'Ruta de running matutino por la Alameda y alrededores. Ritmo medio 5:00–5:30/km. Perfecto para empezar la semana con energía. Llevar agua.', creator_name:'Carlos O.', participant_count:7, tags:['Aire libre','Todos los niveles','Grupo pequeño'] },
  '2': { id:'2', title:'Torneo Pádel Nivel Medio', sport:'padel', level:'intermediate', date:'2026-03-29', time:'18:00:00', location:'Club de Pádel Centro', province:'valencia', max_players:4, price:'5€/persona', third_place:true, description:'Torneo amistoso con rotación de parejas. Raquetas disponibles en el club.', creator_name:'Laura M.', participant_count:2, tags:['Indoor','Mixto','Torneo'] },
}

const TABS = ['Info','Participantes','Chat']

function fmt(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr+'T00:00:00')
  return d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})
}

export default function EventDetail() {
  const { id }    = useParams()
  const router    = useRouter()
  const { user }  = useAuth()

  const [ev,      setEv]     = useState(null)
  const [pCount,  setPCount] = useState(0)
  const [loading, setLoad]   = useState(true)
  const [tab,     setTab]    = useState('Info')
  const [joined,  setJoined] = useState(false)
  const [joining, setJoining]= useState(false)
  const [msgs,    setMsgs]   = useState([])
  const [chatMsg, setChat]   = useState('')

  useEffect(()=>{
    const load = async () => {
      // Intentar de Supabase
      const {data, error} = await supabase
        .from('events_with_counts').select('*').eq('id', id).single()

      if (!error && data) {
        setEv(data)
        setPCount(data.participant_count || 0)
        if (user) {
          const {data: ep} = await supabase
            .from('event_participants').select('id')
            .eq('event_id', id).eq('user_id', user.id).single()
          setJoined(!!ep)
        }
      } else {
        // Fallback demo
        setEv(DEMO[id] || DEMO['1'])
        setPCount(DEMO[id]?.participant_count || 7)
      }
      setLoad(false)
    }
    load()
  }, [id, user])

  const handleJoin = async () => {
    if (!user) { router.push('/auth'); return }
    setJoining(true)
    if (joined) {
      await supabase.from('event_participants').delete().eq('event_id', id).eq('user_id', user.id)
      setJoined(false)
      setPCount(p => Math.max(0,p-1))
    } else {
      const {error} = await supabase.from('event_participants').insert({ event_id:id, user_id:user.id })
      if (!error) { setJoined(true); setPCount(p=>p+1) }
    }
    setJoining(false)
  }

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMsgs(p=>[...p,{
      author: user ? (user.user_metadata?.full_name || user.email?.split('@')[0]) : 'Tú',
      text: chatMsg.trim(),
      time: new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
      me: true,
    }])
    setChat('')
  }

  if (loading) return (
    <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div className="spinner"/>
    </div>
  )

  if (!ev) return null

  const c    = S_COLORS[ev.sport] || '#5b6ef5'
  const icon = S_ICONS[ev.sport]  || '🎯'
  const pct  = ev.max_players>0 ? Math.round((pCount/ev.max_players)*100) : 0
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

        {/* Datos rápidos */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, padding:'16px 18px 0' }}>
          {[
            {icon:'📅', label:'Fecha',    value:`${fmt(ev.date)}`},
            {icon:'⏱️', label:'Hora',     value:ev.time?.slice(0,5)||''},
            {icon:'📍', label:'Lugar',    value:ev.location},
            {icon:'💶', label:'Precio',   value:ev.price||'Gratis'},
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

        {/* Barra plazas */}
        <div className="card anim-2" style={{ margin:'10px 18px 0', padding:'14px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Plazas</span>
            <span style={{ fontSize:13, fontWeight:700, color:c }}>{pCount}/{ev.max_players}</span>
          </div>
          <div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:c }}/></div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>
            {free>0?`${free} plaza${free>1?'s':''} disponible${free>1?'s':''}`:'Evento completo'}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'14px 18px 0' }}>
          <button
            className="btn btn-primary"
            style={{ width:'100%', fontSize:16, background: joined?'rgba(239,68,68,0.85)':undefined }}
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? 'Procesando...' : joined ? '✗ Salir del evento' : free>0 ? '✓ Unirme al evento' : '⏳ Lista de espera'}
          </button>
          {!user && <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:8 }}>Necesitas <Link href="/auth" style={{ color:'var(--primary)', fontWeight:600 }}>iniciar sesión</Link> para unirte</p>}
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px 0', borderRadius:12, border:'none', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', background:tab===t?c:'transparent', color:tab===t?'white':'var(--muted)', transition:'all 0.18s ease' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab: Info */}
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
            {ev.tags?.length>0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {ev.tags.map(tag=>(
                  <span key={tag} style={{ background:`${c}14`, border:`1px solid ${c}30`, borderRadius:10, color:c, fontSize:12, fontWeight:600, padding:'5px 12px' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Participantes */}
        {tab==='Participantes' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ textAlign:'center', padding:'20px', color:'var(--muted)', fontSize:13 }}>
              {pCount > 0 ? `${pCount} persona${pCount>1?'s':''} apuntada${pCount>1?'s':''}` : 'Sé el primero en apuntarte'}
            </div>
            {joined && (
              <div className="card" style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>👤</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{user?.user_metadata?.full_name || 'Tú'}</div>
                  <div style={{ fontSize:11, color:'var(--primary)' }}>Apuntado ✓</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Chat */}
        {tab==='Chat' && (
          <div style={{ padding:'16px 18px 0' }}>
            {msgs.length===0 && (
              <div style={{ textAlign:'center', padding:'30px 0', color:'var(--muted)', fontSize:13 }}>Sin mensajes aún. ¡Sé el primero!</div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:14 }}>
              {msgs.map((m,i)=>(
                <div key={i} style={{ display:'flex', flexDirection:m.me?'row-reverse':'row', alignItems:'flex-end', gap:8 }}>
                  <div style={{ maxWidth:'75%' }}>
                    <div style={{ background:m.me?c:'var(--surface)', border:m.me?'none':'1px solid var(--border)', borderRadius:m.me?'16px 16px 4px 16px':'16px 16px 16px 4px', padding:'10px 14px', color:m.me?'white':'var(--text)', fontSize:13, lineHeight:1.45 }}>{m.text}</div>
                    <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, textAlign:m.me?'right':'left' }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {user ? (
              <div style={{ display:'flex', gap:8, alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'6px 6px 6px 14px' }}>
                <input value={chatMsg} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()}
                  placeholder="Escribe un mensaje…"
                  style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:14, fontFamily:'inherit' }}/>
                <button onClick={sendMsg} style={{ width:36, height:36, borderRadius:12, border:'none', flexShrink:0, background:chatMsg.trim()?c:'var(--surface2)', cursor:chatMsg.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:chatMsg.trim()?'white':'var(--muted)', transition:'all 0.15s ease' }}>➤</button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'12px 0' }}>
                <Link href="/auth" style={{ color:'var(--primary)', fontSize:13, fontWeight:600 }}>Inicia sesión para chatear →</Link>
              </div>
            )}
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}
