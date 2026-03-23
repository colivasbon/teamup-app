'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const provinces = [
  'Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona',
  'Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ceuta','Ciudad Real','Córdoba',
  'Cuenca','Girona','Granada','Guadalajara','Huelva','Huesca','Islas Baleares','Jaén',
  'La Coruña','La Rioja','Las Palmas','León','Lleida','Lugo','Madrid','Málaga',
  'Melilla','Murcia','Navarra','Ourense','Palencia','Pontevedra','Salamanca','Segovia',
  'Sevilla','Soria','Tarragona','Teruel','Toledo','Valencia','Valladolid','Vizcaya',
  'Zamora','Zaragoza',
]
const sports = [
  {id:'running',name:'Running',icon:'🏃',color:'#5b6ef5'},
  {id:'padel',name:'Pádel',icon:'🎾',color:'#06d6a0'},
  {id:'senderismo',name:'Senderismo',icon:'🥾',color:'#f59e0b'},
  {id:'futbol',name:'Fútbol',icon:'⚽',color:'#ef4444'},
  {id:'gimnasio',name:'Gimnasio',icon:'💪',color:'#8b5cf6'},
  {id:'tenis',name:'Tenis',icon:'🎾',color:'#fbbf24'},
]
const levels = [
  {id:'any',name:'Todos',icon:'🌍',desc:'Sin restricción'},
  {id:'beginner',name:'Principiante',icon:'🌱',desc:'Empezando'},
  {id:'intermediate',name:'Intermedio',icon:'⭐',desc:'Con experiencia'},
  {id:'advanced',name:'Avanzado',icon:'🔥',desc:'Alto nivel'},
]
const steps = ['Deporte','Detalles','Opciones']

const LabelInput = ({label, children}) => (
  <div style={{marginBottom:16}}>
    <div className="label" style={{marginBottom:8}}>{label}</div>
    {children}
  </div>
)

export default function CreateEvent() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    sport:'',level:'any',title:'',description:'',
    date:'',time:'',location:'',province:'',
    thirdPlace:false,thirdPlaceLink:'',maxPeople:10,waitingList:0,
  })
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  const canNext = step===0 ? !!form.sport
    : step===1 ? !!(form.title&&form.date&&form.location&&form.province)
    : true

  const sel = sports.find(s=>s.id===form.sport)

  return (
    <div style={{ paddingBottom:100 }}>
      <div className="page-wrap" style={{ padding:'0 20px' }}>

        {/* Header */}
        <header style={{ paddingTop:56, paddingBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <button className="btn-icon" onClick={()=>step>0?setStep(s=>s-1):router.back()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, margin:0, letterSpacing:'-0.03em' }}>Crear evento</h1>
              <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Paso {step+1}/{steps.length} · {steps[step]}</p>
            </div>
          </div>
          {/* Progress */}
          <div style={{ display:'flex', gap:6 }}>
            {steps.map((_,i)=>(
              <div key={i} className="step-bar" style={{ flex:1, background: i<=step?'var(--primary)':'var(--border)' }}/>
            ))}
          </div>
        </header>

        <form onSubmit={e=>{e.preventDefault();alert('¡Evento creado! (demo)');router.push('/')}}>

          {/* STEP 0 */}
          {step===0 && (
            <div className="fade-in">
              <p style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>¿Qué deporte vais a practicar?</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {sports.map(s=>(
                  <button key={s.id} type="button" onClick={()=>set('sport',s.id)}
                    style={{
                      padding:'18px 14px', borderRadius:18, textAlign:'left',
                      border:`2px solid ${form.sport===s.id?s.color:'var(--border)'}`,
                      background: form.sport===s.id?`${s.color}14`:'var(--glass)',
                      backdropFilter:'blur(12px)',
                      cursor:'pointer', position:'relative',
                      transition:'all 0.15s ease',
                    }}>
                    <div style={{ fontSize:28, marginBottom:8, lineHeight:1 }}>{s.icon}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{s.name}</div>
                    {form.sport===s.id && (
                      <div style={{ position:'absolute', top:10, right:10, width:20, height:20, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step===1 && (
            <div className="fade-in" style={{ display:'flex', flexDirection:'column', gap:0 }}>
              <LabelInput label="Título del evento">
                <input className="input" type="text" placeholder={`Ej: ${sel?.name||'Deporte'} tarde relajado`}
                  value={form.title} onChange={e=>set('title',e.target.value)} required/>
              </LabelInput>
              <LabelInput label="Descripción (opcional)">
                <textarea className="input" placeholder="Nivel, requisitos, qué llevar..." rows={3}
                  value={form.description} onChange={e=>set('description',e.target.value)}/>
              </LabelInput>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div>
                  <div className="label" style={{marginBottom:8}}>Fecha</div>
                  <input className="input" type="date" value={form.date} onChange={e=>set('date',e.target.value)} required/>
                </div>
                <div>
                  <div className="label" style={{marginBottom:8}}>Hora</div>
                  <input className="input" type="time" value={form.time} onChange={e=>set('time',e.target.value)}/>
                </div>
              </div>
              <LabelInput label="Ubicación">
                <input className="input" type="text" placeholder="Nombre del lugar o dirección"
                  value={form.location} onChange={e=>set('location',e.target.value)} required/>
              </LabelInput>
              <LabelInput label="Provincia">
                <select className="input" value={form.province} onChange={e=>set('province',e.target.value)} required>
                  <option value="">Selecciona...</option>
                  {provinces.map(p=><option key={p} value={p.toLowerCase().replace(/\s/g,'')}>{p}</option>)}
                </select>
              </LabelInput>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div className="fade-in">
              {/* Level */}
              <div className="label" style={{marginBottom:12}}>Nivel requerido</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                {levels.map(l=>(
                  <button key={l.id} type="button" onClick={()=>set('level',l.id)}
                    style={{
                      padding:'14px 12px', borderRadius:16, textAlign:'left',
                      border:`2px solid ${form.level===l.id?'var(--primary)':'var(--border)'}`,
                      background: form.level===l.id?'rgba(var(--primary-rgb),0.10)':'var(--glass)',
                      backdropFilter:'blur(12px)', cursor:'pointer', transition:'all 0.15s ease',
                    }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{l.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{l.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{l.desc}</div>
                  </button>
                ))}
              </div>

              {/* Sliders */}
              {[
                {key:'maxPeople',label:'Máximo de personas',min:2,max:50,color:'var(--primary)'},
                {key:'waitingList',label:'Lista de espera',min:0,max:20,color:'var(--violet)'},
              ].map(({key,label,min,max,color})=>(
                <div key={key} className="card" style={{ padding:'16px 18px', marginBottom:12, borderRadius:'var(--radius-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ fontSize:14, fontWeight:600 }}>{label}</div>
                    <div style={{ fontSize:20, fontWeight:800, color, letterSpacing:'-0.02em' }}>{form[key]}</div>
                  </div>
                  <input type="range" min={min} max={max} value={form[key]}
                    onChange={e=>set(key,parseInt(e.target.value))}
                    style={{ width:'100%', accentColor:color }}/>
                </div>
              ))}

              {/* Third place */}
              <div className="card" style={{ padding:'16px 18px', borderRadius:'var(--radius-sm)', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>🍺 Tercer tiempo</div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>¿Quedáis después?</div>
                  </div>
                  <div className="toggle" onClick={()=>set('thirdPlace',!form.thirdPlace)}
                    style={{ background: form.thirdPlace?'var(--primary)':'var(--border2)' }}>
                    <div className="toggle-thumb" style={{ left: form.thirdPlace?'23px':'3px' }}/>
                  </div>
                </div>
                {form.thirdPlace && (
                  <input className="input" type="text" placeholder="Link Google Maps (opcional)"
                    value={form.thirdPlaceLink} onChange={e=>set('thirdPlaceLink',e.target.value)}
                    style={{ marginTop:12 }}/>
                )}
              </div>

              {/* Summary */}
              <div className="card" style={{ padding:'16px 18px', borderRadius:'var(--radius-sm)' }}>
                <div className="label" style={{marginBottom:12}}>Resumen</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                  {sel && <div style={{display:'flex',gap:8}}><span>{sel.icon}</span><span>{sel.name}</span></div>}
                  {form.title && <div style={{display:'flex',gap:8}}><span>📌</span><span style={{fontWeight:600}}>{form.title}</span></div>}
                  {form.date && <div style={{display:'flex',gap:8}}><span>📅</span><span>{form.date} {form.time}</span></div>}
                  {form.location && <div style={{display:'flex',gap:8}}><span>📍</span><span>{form.location}</span></div>}
                  <div style={{display:'flex',gap:8}}><span>👥</span><span>Hasta {form.maxPeople} personas</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ position:'fixed', bottom:76, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 40px)', maxWidth:440, zIndex:50 }}>
            {step<2 ? (
              <button type="button" onClick={()=>canNext&&setStep(s=>s+1)}
                disabled={!canNext}
                className="btn-primary" style={{ width:'100%' }}>
                Siguiente →
              </button>
            ):(
              <button type="submit" className="btn-primary" style={{ width:'100%' }}>
                ✓ Publicar evento
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
