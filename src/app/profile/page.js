'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

const S_COLORS = {
  Running:    '#5b6ef5',
  Pádel:      '#06d6a0',
  Senderismo: '#f59e0b',
  Fútbol:     '#ef4444',
  Gimnasio:   '#8b5cf6',
}
const S_ICONS = { Running:'🏃', Pádel:'🎾', Senderismo:'🥾', Fútbol:'⚽', Gimnasio:'💪' }

const RECENT = [
  { id:1, title:'Running Matutino',   sport:'Running',    date:'20 Mar', role:'Asistente' },
  { id:2, title:'Ruta Sierra Nevada', sport:'Senderismo', date:'15 Mar', role:'Organizador' },
  { id:3, title:'Fútbol 7 tarde',     sport:'Fútbol',     date:'12 Mar', role:'Asistente' },
  { id:4, title:'Trail Urbano 5K',    sport:'Running',    date:'8 Mar',  role:'Asistente' },
]

const ACHIEVEMENTS = [
  { icon:'🏅', label:'Primer evento',  desc:'Asististe a tu primer evento',  earned:true  },
  { icon:'⭐', label:'Organizador',    desc:'Creaste tu primer evento',       earned:true  },
  { icon:'🔥', label:'Racha de 7',    desc:'7 eventos en 7 días',            earned:true  },
  { icon:'🤝', label:'Social',         desc:'Conociste a 10 personas',       earned:true  },
  { icon:'🏆', label:'Top Karma',      desc:'Karma por encima de 4.5',       earned:true  },
  { icon:'🌟', label:'Veterano',       desc:'50 eventos asistidos',          earned:false },
  { icon:'👑', label:'Leyenda',        desc:'100 eventos completados',       earned:false },
  { icon:'💎', label:'Élite',          desc:'Karma perfecto 1 mes',         earned:false },
]

const REVIEWS = [
  { author:'María G.',  avatar:'👩',     sport:'Running',    stars:5, text:'Carlos es un compañero increíble, siempre puntual y con muy buen rollo.',    date:'18 Mar' },
  { author:'Javi M.',   avatar:'👨',     sport:'Senderismo', stars:5, text:'Organizó la ruta perfectamente, con todos los detalles previstos.',           date:'10 Mar' },
  { author:'Lucía P.',  avatar:'👩‍🦱',    sport:'Fútbol',     stars:4, text:'Muy buen ambiente, repetiría sin dudarlo.',                                  date:'5 Mar'  },
]

const TABS = ['Actividad', 'Logros', 'Karma']

export default function Profile() {
  const [tab, setTab]       = useState('Actividad')
  const [editBio, setEdit]  = useState(false)
  const [bio, setBio]       = useState('Apasionado del running y el senderismo. Córdoba 📍')
  const [bioInput, setBioI] = useState(bio)

  return (
    <>
      <div className="page-wrap-full">

        {/* ── Hero de perfil ── */}
        <div style={{
          background: 'var(--grad)',
          borderRadius: '0 0 30px 30px',
          padding: '58px 22px 30px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decoración fondo */}
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-30, left:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }}/>

          {/* Botón editar */}
          <button
            onClick={() => { if(editBio){ setBio(bioInput) }; setEdit(!editBio) }}
            style={{
              position:'absolute', top:16, right:16,
              background:'rgba(255,255,255,0.20)', border:'1px solid rgba(255,255,255,0.32)',
              borderRadius:12, color:'white', fontSize:13, fontWeight:600,
              padding:'6px 14px', cursor:'pointer', fontFamily:'inherit',
            }}
          >
            {editBio ? 'Guardar' : 'Editar'}
          </button>

          {/* Avatar + datos */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{
              width:90, height:90, borderRadius:'50%',
              background:'rgba(255,255,255,0.22)',
              border:'3px solid rgba(255,255,255,0.55)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:42, boxShadow:'0 8px 32px rgba(0,0,0,0.22)',
            }}>🧔</div>

            <div style={{ textAlign:'center' }}>
              <div style={{ color:'white', fontWeight:800, fontSize:22, letterSpacing:'-0.04em' }}>Carlos Olivas</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginTop:2 }}>@colivasbon</div>
            </div>

            {editBio ? (
              <textarea
                value={bioInput}
                onChange={e=>setBioI(e.target.value)}
                style={{
                  background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.32)',
                  borderRadius:12, color:'white', fontSize:14, padding:'10px 14px',
                  width:'100%', maxWidth:300, textAlign:'center', resize:'none', outline:'none',
                  fontFamily:'inherit',
                }}
                rows={2}
              />
            ) : (
              <div style={{ color:'rgba(255,255,255,0.88)', fontSize:14, textAlign:'center', maxWidth:280, lineHeight:1.5 }}>{bio}</div>
            )}

            {/* Tags deporte */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
              {['Running','Senderismo','Fútbol'].map(s=>(
                <span key={s} style={{
                  background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.28)',
                  borderRadius:20, color:'white', fontSize:12, fontWeight:600,
                  padding:'4px 12px',
                }}>
                  {S_ICONS[s]} {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'20px 18px 0' }}>
          {[
            { label:'Karma',      value:'4.8', icon:'⭐', color:'#f59e0b' },
            { label:'Creados',    value:'7',   icon:'📅', color:'#5b6ef5' },
            { label:'Asistidos',  value:'31',  icon:'🎯', color:'#06d6a0' },
          ].map(s=>(
            <div key={s.label} className="card anim-1" style={{ textAlign:'center', padding:'16px 8px' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', padding:'10px 18px 0' }}>
          <span style={{ fontSize:12, color:'var(--muted)' }}>Miembro desde Marzo 2025</span>
        </div>

        {/* ── Tabs ── */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{
            display:'flex', gap:4, padding:4,
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:16,
          }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:'10px 0', borderRadius:12, border:'none',
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                background: tab===t ? 'var(--grad)' : 'transparent',
                color: tab===t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB: Actividad ── */}
        {tab==='Actividad' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:10 }}>
            {RECENT.map((ev, i)=>(
              <div key={ev.id} className={`card anim-${i+1}`} style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                borderLeft:`3px solid ${S_COLORS[ev.sport]}`,
              }}>
                <div style={{
                  width:40, height:40, borderRadius:12, flexShrink:0,
                  background:`${S_COLORS[ev.sport]}20`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                }}>
                  {S_ICONS[ev.sport]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{ev.date} · {ev.role}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:'#06d6a0', background:'rgba(6,214,160,0.12)', borderRadius:8, padding:'3px 9px', flexShrink:0 }}>
                  ✓
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Logros ── */}
        {tab==='Logros' && (
          <div style={{ padding:'16px 18px 0' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {ACHIEVEMENTS.map((a, i)=>(
                <div key={a.label} className={`card anim-${(i%6)+1}`} style={{
                  padding:'16px 14px', textAlign:'center',
                  opacity: a.earned ? 1 : 0.38, position:'relative', overflow:'hidden',
                }}>
                  {a.earned && (
                    <div style={{ position:'absolute', top:9, right:9, width:8, height:8, borderRadius:'50%', background:'#06d6a0', boxShadow:'0 0 7px #06d6a0' }}/>
                  )}
                  <div style={{ fontSize:28, marginBottom:6 }}>{a.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{a.label}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', marginTop:3, lineHeight:1.4 }}>{a.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:16, padding:'0 0 4px' }}>
              <span style={{ fontSize:12, color:'var(--muted)' }}>5 de 8 logros desbloqueados</span>
            </div>
          </div>
        )}

        {/* ── TAB: Karma ── */}
        {tab==='Karma' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card anim-1" style={{ padding:'22px 20px', textAlign:'center' }}>
              <div style={{
                fontSize:52, fontWeight:900, lineHeight:1,
                background:'var(--grad)', WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>4.8</div>
              <div style={{ color:'var(--muted)', fontSize:13, marginTop:4 }}>24 valoraciones</div>
              <div style={{ display:'flex', justifyContent:'center', gap:3, marginTop:10 }}>
                {[1,2,3,4,5].map(s=>(
                  <span key={s} style={{ fontSize:22, color:'#f59e0b' }}>★</span>
                ))}
              </div>
              <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
                {[[5,80],[4,15],[3,5],[2,0],[1,0]].map(([stars,pct])=>(
                  <div key={stars} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, color:'var(--muted)', width:10, textAlign:'right' }}>{stars}</span>
                    <span style={{ fontSize:11, color:'#f59e0b' }}>★</span>
                    <div className="pbar" style={{ flex:1 }}>
                      <div className="pbar-fill" style={{ width:`${pct}%`, background:'#f59e0b' }}/>
                    </div>
                    <span style={{ fontSize:11, color:'var(--muted)', width:28, textAlign:'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {REVIEWS.map((r, i)=>(
              <div key={r.author} className={`card anim-${i+2}`} style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                    {r.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{r.author}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{r.sport} · {r.date}</div>
                  </div>
                  <div style={{ display:'flex', gap:1 }}>
                    {[1,2,3,4,5].map(s=>(
                      <span key={s} style={{ fontSize:13, color: s<=r.stars ? '#f59e0b' : 'var(--border2)' }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, margin:0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cerrar sesión */}
        <div style={{ padding:'24px 18px 0' }}>
          <button className="btn btn-ghost" style={{ width:'100%', color:'#ef4444', borderColor:'rgba(239,68,68,0.25)' }}>
            Cerrar sesión
          </button>
        </div>

      </div>
      <Navbar />
    </>
  )
}
