'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const S_COLORS = { Running:'#5b6ef5', Pádel:'#06d6a0', Senderismo:'#f59e0b', Fútbol:'#ef4444', Gimnasio:'#8b5cf6' }
const S_ICONS  = { Running:'🏃',       Pádel:'🎾',       Senderismo:'🥾',       Fútbol:'⚽',       Gimnasio:'💪' }

const DATA = {
  '1': {
    id:'1', title:'Running Matutino', sport:'Running', level:'Intermedio',
    fullDate:'Lunes 23 de Marzo, 07:30h', duration:'1h 15min',
    location:'Alameda de Córdoba', address:'Entrada principal junto al quiosco de música',
    maxP:10, p:7, price:'Gratis', waitlist:2,
    organizer:{ name:'Carlos O.', avatar:'🧔', karma:4.8 },
    description:'Ruta de running matutino por la Alameda y alrededores. Ritmo medio (5:00–5:30/km). Perfecto para empezar la semana con energía. Llevar agua y ropa cómoda.',
    tags:['Aire libre','Principiantes bienvenidos','Grupo pequeño'],
    participants:[
      { name:'Carlos O.',  avatar:'🧔',  karma:4.8, org:true  },
      { name:'María G.',   avatar:'👩',  karma:4.6, org:false },
      { name:'Javi M.',    avatar:'👨',  karma:4.9, org:false },
      { name:'Laura S.',   avatar:'👩‍🦰', karma:4.3, org:false },
      { name:'Diego R.',   avatar:'👦',  karma:4.7, org:false },
      { name:'Ana P.',     avatar:'👩‍🦱', karma:4.5, org:false },
      { name:'Marcos V.',  avatar:'🧑',  karma:4.2, org:false },
    ],
    chat:[
      { author:'Carlos O.',  avatar:'🧔', text:'Buenos días a todos! Nos vemos en la entrada principal 👋', time:'07:00' },
      { author:'María G.',   avatar:'👩', text:'Ahí estaré, llueve un poco pero nada que nos pare 💪',     time:'07:05' },
      { author:'Javi M.',    avatar:'👨', text:'Llego un poco antes para calentar',                       time:'07:12' },
    ],
  },
  '2': {
    id:'2', title:'Torneo Pádel Nivel Medio', sport:'Pádel', level:'Intermedio',
    fullDate:'Martes 24 de Marzo, 10:00h', duration:'2h',
    location:'Club Pádel Córdoba', address:'Av. del Brillante, 24 — Pista 3',
    maxP:8, p:6, price:'5€/persona', waitlist:1,
    organizer:{ name:'María G.', avatar:'👩', karma:4.6 },
    description:'Torneo amistoso de pádel para nivel medio. Se jugarán rondas de 20 minutos con rotación de parejas. Raquetas disponibles en el club si alguien no tiene.',
    tags:['Indoor','Mixto','Torneo'],
    participants:[
      { name:'María G.',  avatar:'👩',  karma:4.6, org:true  },
      { name:'Carlos O.', avatar:'🧔',  karma:4.8, org:false },
      { name:'Diego R.',  avatar:'👦',  karma:4.7, org:false },
      { name:'Ana P.',    avatar:'👩‍🦱', karma:4.5, org:false },
      { name:'Marcos V.', avatar:'🧑',  karma:4.2, org:false },
      { name:'Laura S.',  avatar:'👩‍🦰', karma:4.3, org:false },
    ],
    chat:[
      { author:'María G.', avatar:'👩', text:'Recordad que el club tiene parking gratuito 🚗', time:'09:00' },
      { author:'Diego R.', avatar:'👦', text:'¿Mi hermano puede apuntarse a la lista de espera?', time:'09:15' },
      { author:'María G.', avatar:'👩', text:'Claro, que se apunte por la app y le confirmo 👍', time:'09:18' },
    ],
  },
}

const TABS = ['Info','Participantes','Chat']

export default function EventDetail() {
  const { id } = useParams()
  const router  = useRouter()
  const ev      = DATA[id] || DATA['1']

  const [tab,     setTab]    = useState('Info')
  const [joined,  setJoined] = useState(false)
  const [chatMsg, setMsg]    = useState('')
  const [msgs,    setMsgs]   = useState(ev.chat)

  const c       = S_COLORS[ev.sport]
  const pct     = Math.round((ev.p/ev.maxP)*100)
  const free    = ev.maxP - ev.p

  const send = () => {
    if (!chatMsg.trim()) return
    setMsgs(p=>[...p,{
      author:'Carlos O.', avatar:'🧔', text:chatMsg.trim(),
      time: new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
    }])
    setMsg('')
  }

  return (
    <>
      <div className="page-wrap-full">

        {/* Hero */}
        <div style={{
          background:`linear-gradient(160deg,${c}ee,${c}88)`,
          padding:'58px 22px 28px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.10)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }}/>

          <button onClick={()=>router.back()} style={{
            position:'absolute', top:16, left:16,
            background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)',
            borderRadius:12, color:'white', width:38, height:38,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, cursor:'pointer',
          }}>←</button>

          <div style={{ position:'relative' }}>
            <div style={{ fontSize:54, marginBottom:12, filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.22))' }}>
              {S_ICONS[ev.sport]}
            </div>
            <div style={{ display:'inline-flex', gap:8, background:'rgba(255,255,255,0.20)', borderRadius:10, padding:'4px 12px', marginBottom:8 }}>
              <span style={{ color:'white', fontSize:12, fontWeight:700 }}>{ev.sport}</span>
              <span style={{ color:'rgba(255,255,255,0.6)' }}>·</span>
              <span style={{ color:'rgba(255,255,255,0.88)', fontSize:12 }}>{ev.level}</span>
            </div>
            <h1 style={{ color:'white', fontWeight:900, fontSize:26, margin:'0 0 6px', letterSpacing:'-0.05em', lineHeight:1.2 }}>{ev.title}</h1>
            <div style={{ color:'rgba(255,255,255,0.80)', fontSize:13 }}>Organizado por {ev.organizer.name} · ⭐ {ev.organizer.karma}</div>
          </div>
        </div>

        {/* Datos rápidos */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, padding:'16px 18px 0' }}>
          {[
            { icon:'📅', label:'Fecha',    value:ev.fullDate },
            { icon:'⏱️', label:'Duración', value:ev.duration },
            { icon:'📍', label:'Lugar',    value:ev.location },
            { icon:'💶', label:'Precio',   value:ev.price },
          ].map(item=>(
            <div key={item.label} className="card anim-1" style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <div style={{ minWidth:0 }}>
                <div className="label" style={{ marginBottom:2 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de plazas */}
        <div className="card anim-2" style={{ margin:'10px 18px 0', padding:'14px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Plazas ocupadas</span>
            <span style={{ fontSize:13, fontWeight:700, color:c }}>{ev.p}/{ev.maxP}</span>
          </div>
          <div className="pbar">
            <div className="pbar-fill" style={{ width:`${pct}%`, background:c }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            <span style={{ fontSize:11, color:'var(--muted)' }}>
              {free>0 ? `${free} plaza${free>1?'s':''} libre${free>1?'s':''}` : 'Completo'}
            </span>
            {ev.waitlist>0 && <span style={{ fontSize:11, color:'var(--muted)' }}>{ev.waitlist} en espera</span>}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'14px 18px 0' }}>
          {!joined ? (
            <button className="btn btn-primary" style={{ width:'100%', fontSize:16 }} onClick={()=>setJoined(true)}>
              {free>0 ? '✓ Unirme al evento' : '⏳ Lista de espera'}
            </button>
          ) : (
            <div style={{ background:'rgba(6,214,160,0.12)', border:'1.5px solid rgba(6,214,160,0.38)', borderRadius:'var(--radius)', padding:'16px', textAlign:'center' }}>
              <div style={{ fontSize:24, marginBottom:4 }}>✅</div>
              <div style={{ fontWeight:700, color:'#06d6a0', fontSize:15 }}>¡Estás apuntado!</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Te avisaremos si hay cambios</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:'10px 0', borderRadius:12, border:'none',
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                background: tab===t ? c : 'transparent',
                color: tab===t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* ── TAB: Info ── */}
        {tab==='Info' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card anim-1" style={{ padding:'16px 18px' }}>
              <div className="label" style={{ marginBottom:10 }}>Descripción</div>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65, margin:0 }}>{ev.description}</p>
            </div>

            <div className="card anim-2" style={{ padding:'16px 18px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📍</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{ev.location}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{ev.address}</div>
                <button style={{ marginTop:10, background:'none', border:'none', color:c, fontSize:12, fontWeight:700, cursor:'pointer', padding:0, fontFamily:'inherit' }}>
                  Ver en Google Maps →
                </button>
              </div>
            </div>

            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {ev.tags.map(tag=>(
                <span key={tag} style={{ background:`${c}14`, border:`1px solid ${c}30`, borderRadius:10, color:c, fontSize:12, fontWeight:600, padding:'5px 12px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Participantes ── */}
        {tab==='Participantes' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:8 }}>
            {ev.participants.map((p, i)=>(
              <div key={p.name} className={`card anim-${(i%6)+1}`} style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background: p.org?'var(--grad)':'var(--surface2)', border: p.org?'none':'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {p.avatar}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>⭐ {p.karma}</div>
                </div>
                {p.org && (
                  <span style={{ fontSize:10, fontWeight:800, color:'white', background:'var(--grad)', borderRadius:8, padding:'3px 9px', letterSpacing:'0.5px', textTransform:'uppercase' }}>Org</span>
                )}
              </div>
            ))}
            {ev.waitlist>0 && (
              <div style={{ textAlign:'center', marginTop:6 }}>
                <span style={{ fontSize:12, color:'var(--muted)' }}>+{ev.waitlist} en lista de espera</span>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Chat ── */}
        {tab==='Chat' && (
          <div style={{ padding:'16px 18px 0' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:14 }}>
              {msgs.map((m, i)=>{
                const me = m.author==='Carlos O.'
                return (
                  <div key={i} style={{ display:'flex', flexDirection:me?'row-reverse':'row', alignItems:'flex-end', gap:8 }}>
                    {!me && (
                      <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                        {m.avatar}
                      </div>
                    )}
                    <div style={{ maxWidth:'75%' }}>
                      {!me && <div style={{ fontSize:10, color:'var(--muted)', marginBottom:3, paddingLeft:4 }}>{m.author}</div>}
                      <div style={{
                        background: me ? c : 'var(--surface)',
                        border: me ? 'none' : '1px solid var(--border)',
                        borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding:'10px 14px',
                        color: me ? 'white' : 'var(--text)',
                        fontSize:13, lineHeight:1.45,
                        backdropFilter:'blur(12px)',
                      }}>{m.text}</div>
                      <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, textAlign:me?'right':'left', paddingLeft:4, paddingRight:4 }}>{m.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input chat */}
            <div style={{ display:'flex', gap:8, alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'6px 6px 6px 14px' }}>
              <input
                value={chatMsg} onChange={e=>setMsg(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Escribe un mensaje…"
                style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:14, fontFamily:'inherit' }}
              />
              <button onClick={send} style={{
                width:36, height:36, borderRadius:12, border:'none', flexShrink:0,
                background: chatMsg.trim() ? c : 'var(--surface2)',
                cursor: chatMsg.trim() ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:15, color: chatMsg.trim() ? 'white' : 'var(--muted)',
                transition:'all 0.15s ease',
              }}>
                ➤
              </button>
            </div>
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}
