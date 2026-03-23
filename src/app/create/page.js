'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const SPORTS = [
  { id:'running',    label:'Running',    icon:'🏃', color:'#5b6ef5' },
  { id:'padel',      label:'Pádel',      icon:'🎾', color:'#06d6a0' },
  { id:'senderismo', label:'Senderismo', icon:'🥾', color:'#f59e0b' },
  { id:'futbol',     label:'Fútbol',     icon:'⚽', color:'#ef4444' },
  { id:'gimnasio',   label:'Gimnasio',   icon:'💪', color:'#8b5cf6' },
  { id:'tenis',      label:'Tenis',      icon:'🎾', color:'#fbbf24' },
]

const LEVELS = [
  { id:'any',          label:'Todos',        icon:'🌍', desc:'Cualquier nivel bienvenido' },
  { id:'beginner',     label:'Principiante', icon:'🌱', desc:'Sin experiencia previa' },
  { id:'intermediate', label:'Intermedio',   icon:'⭐', desc:'Con algo de experiencia' },
  { id:'advanced',     label:'Avanzado',     icon:'🔥', desc:'Nivel alto requerido' },
]

const STEPS = ['Deporte', 'Detalles', 'Confirmar']

export default function Create() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    sport: '', level: 'any',
    title: '', description: '',
    date: '', time: '', location: '',
    maxPlayers: 10, price: '',
    thirdPlace: false,
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const selectedSport = SPORTS.find(s => s.id===form.sport)

  const submit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1400))
    setSaving(false)
    router.push('/events')
  }

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        {/* Header */}
        <header style={{ paddingTop:60, paddingBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.04em' }}>Crear evento</h1>
          <p style={{ fontSize:14, color:'var(--muted)' }}>
            {step===0 ? 'Elige el deporte' : step===1 ? 'Rellena los detalles' : 'Revisa y publica'}
          </p>
        </header>

        {/* Barra de pasos */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
              <div className="step-bar" style={{
                background: i<=step ? 'var(--grad)' : 'var(--border)',
                height: 4,
              }}/>
              <span style={{
                fontSize:11, fontWeight:600,
                color: i<=step ? 'var(--primary)' : 'var(--muted)',
              }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* ── PASO 0: Elegir deporte ── */}
        {step===0 && (
          <div className="anim-1">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {SPORTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => set('sport', s.id)}
                  style={{
                    background: form.sport===s.id
                      ? `linear-gradient(140deg,${s.color},${s.color}bb)`
                      : 'var(--glass)',
                    backdropFilter: 'blur(14px)',
                    border: form.sport===s.id ? 'none' : '1.5px solid var(--border)',
                    borderRadius:18, padding:'20px 16px',
                    cursor:'pointer', textAlign:'left',
                    boxShadow: form.sport===s.id ? `0 6px 22px ${s.color}40` : 'none',
                    transition:'all 0.20s cubic-bezier(.34,1.56,.64,1)',
                    transform: form.sport===s.id ? 'scale(1.03)' : '',
                    fontFamily:'inherit',
                  }}
                >
                  <div style={{ fontSize:30, marginBottom:8 }}>{s.icon}</div>
                  <div style={{
                    fontSize:14, fontWeight:700,
                    color: form.sport===s.id ? 'white' : 'var(--text)',
                  }}>
                    {s.label}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop:28 }}>
              <span className="label" style={{ marginBottom:14 }}>Nivel de los participantes</span>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {LEVELS.map(lv => (
                  <button
                    key={lv.id}
                    onClick={() => set('level', lv.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:14,
                      background: form.level===lv.id ? 'var(--surface)' : 'var(--glass)',
                      backdropFilter:'blur(14px)',
                      border: form.level===lv.id ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      borderRadius:14, padding:'14px 16px',
                      cursor:'pointer', textAlign:'left',
                      transition:'all 0.18s ease',
                      fontFamily:'inherit',
                    }}
                  >
                    <span style={{ fontSize:22 }}>{lv.icon}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{lv.label}</div>
                      <div style={{ fontSize:12, color:'var(--muted)' }}>{lv.desc}</div>
                    </div>
                    {form.level===lv.id && (
                      <div style={{ marginLeft:'auto', color:'var(--primary)', fontSize:18 }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width:'100%', marginTop:28, fontSize:16 }}
              onClick={() => setStep(1)}
              disabled={!form.sport}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 1: Detalles ── */}
        {step===1 && (
          <div className="anim-1" style={{ display:'flex', flexDirection:'column', gap:18 }}>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Título del evento</label>
              <input
                className="input" type="text"
                placeholder={`${selectedSport?.icon||''} Ej: Running matutino por la Alameda`}
                value={form.title}
                onChange={e=>set('title',e.target.value)}
              />
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Descripción</label>
              <textarea
                className="input" rows={3}
                placeholder="Cuéntales a los participantes qué pueden esperar..."
                value={form.description}
                onChange={e=>set('description',e.target.value)}
              />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Fecha</label>
                <input className="input" type="date" value={form.date} onChange={e=>set('date',e.target.value)}/>
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Hora</label>
                <input className="input" type="time" value={form.time} onChange={e=>set('time',e.target.value)}/>
              </div>
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Ubicación</label>
              <input
                className="input" type="text"
                placeholder="Parque, polideportivo, dirección..."
                value={form.location}
                onChange={e=>set('location',e.target.value)}
              />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Plazas máximas</label>
                <input
                  className="input" type="number" min={2} max={100}
                  value={form.maxPlayers}
                  onChange={e=>set('maxPlayers',parseInt(e.target.value)||10)}
                />
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Precio (€)</label>
                <input
                  className="input" type="text"
                  placeholder="Gratis / 5€ / ..."
                  value={form.price}
                  onChange={e=>set('price',e.target.value)}
                />
              </div>
            </div>

            {/* Tercer tiempo */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'var(--glass)', backdropFilter:'blur(14px)',
              border:'1px solid var(--border)', borderRadius:14, padding:'14px 18px',
            }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:'var(--text)' }}>🍺 Tercer tiempo</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Quedada post-evento</div>
              </div>
              <button
                onClick={()=>set('thirdPlace',!form.thirdPlace)}
                className="toggle"
                style={{ background: form.thirdPlace ? 'var(--primary)' : 'var(--border)' }}
              >
                <div className="toggle-thumb" style={{ left: form.thirdPlace ? '23px' : '3px' }}/>
              </button>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:8 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setStep(0)}>← Atrás</button>
              <button
                className="btn btn-primary"
                style={{ flex:2 }}
                onClick={()=>setStep(2)}
                disabled={!form.title||!form.date||!form.location}
              >
                Revisar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: Confirmar ── */}
        {step===2 && (
          <div className="anim-1">
            {/* Preview card */}
            <div className="card" style={{ overflow:'hidden', marginBottom:20 }}>
              <div style={{ height:4, background: selectedSport ? `linear-gradient(90deg,${selectedSport.color},${selectedSport.color}55)` : 'var(--grad)' }}/>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                  <div className="sport-icon" style={{
                    background: selectedSport ? `${selectedSport.color}20` : 'var(--surface)',
                    border: `1.5px solid ${selectedSport?.color||'var(--border)'}30`,
                    borderRadius:16, fontSize:22
                  }}>
                    {selectedSport?.icon||'🎯'}
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:2 }}>
                      {form.title||'Sin título'}
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>por Carlos O.</div>
                  </div>
                </div>
                {form.description && (
                  <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>{form.description}</p>
                )}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', fontSize:12, color:'var(--muted)' }}>
                  {form.date && <span>📅 {form.date}{form.time?` · ${form.time}`:''}</span>}
                  {form.location && <span>📍 {form.location}</span>}
                  <span>👥 Hasta {form.maxPlayers} personas</span>
                  {form.price && <span>💶 {form.price}</span>}
                  {form.thirdPlace && <span>🍺 Tercer tiempo</span>}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setStep(1)}>← Editar</button>
              <button
                className="btn btn-primary"
                style={{ flex:2 }}
                onClick={submit}
                disabled={saving}
              >
                {saving ? (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3"/>
                      <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Publicando...
                  </span>
                ) : '🚀 Publicar evento'}
              </button>
            </div>
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}
