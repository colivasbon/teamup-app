'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORT_COLORS } from '@/components/SportIcon'

const SPORTS = [
  { id:'padel',      label:'Pádel',      icon:'🎾', pairs:true  },
  { id:'tenis',      label:'Tenis',      icon:'🎾', pairs:true  },
  { id:'badminton',  label:'Bádminton',  icon:'🏸', pairs:true  },
  { id:'voleibol',   label:'Voleibol',   icon:'🏐', pairs:false },
  { id:'futbol',     label:'Fútbol',     icon:'⚽', pairs:false },
  { id:'baloncesto', label:'Baloncesto', icon:'🏀', pairs:false },
  { id:'running',    label:'Running',    icon:'🏃', pairs:false },
  { id:'natacion',   label:'Natación',   icon:'🏊', pairs:false },
  { id:'ciclismo',   label:'Ciclismo',   icon:'🚴', pairs:false },
]

const FORMATS = [
  { id:'single_elimination', label:'Eliminación directa', desc:'Pierdes y te vas. El cuadro se genera automáticamente.' },
  { id:'groups',             label:'Fase de grupos + eliminatoria', desc:'Primero grupos, luego los mejores pasan a llaves.' },
]

export default function CreateTournament() {
  const router  = useRouter()
  const { user, profile } = useAuth()

  const [step,    setStep]    = useState(1) // 1: deporte, 2: detalles, 3: confirmar
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    sport:      '',
    title:      '',
    description:'',
    location:   '',
    date:       '',
    time:       '',
    price:      'Gratis',
    format:     'single_elimination',
    pair_mode:  true,
    max_pairs:  8,
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Solo cuentas business pueden crear torneos
  if (user && profile && profile.account_type !== 'business') {
    return (
      <>
        <div className="page-wrap" style={{ paddingTop:24 }}>
          <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🏆</div>
            <h2 style={{ fontWeight:800, fontSize:18, marginBottom:10 }}>Solo para clubs y negocios</h2>
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6, marginBottom:20 }}>
              La creación de torneos está disponible para perfiles de empresa verificados. Si gestionas un club o negocio deportivo, contáctanos para activar tu cuenta.
            </p>
            <a href="mailto:colivasbon@gmail.com?subject=TeamUp%20%E2%80%94%20Solicitud%20perfil%20empresa"
              className="btn btn-primary" style={{ display:'block', textAlign:'center' }}>
              Solicitar perfil de empresa
            </a>
            <Link href="/" style={{ display:'block', marginTop:16, fontSize:13, color:'var(--muted)' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
        <Navbar />
      </>
    )
  }

  const selectedSport = SPORTS.find(s => s.id === form.sport)
  const accent = SPORT_COLORS[form.sport] || '#586875'

  const handleSubmit = async () => {
    if (!form.title.trim())    { setError('Añade un título al torneo'); return }
    if (!form.location.trim()) { setError('Indica el lugar'); return }
    if (!form.date)            { setError('Selecciona una fecha'); return }

    setLoading(true); setError('')
    const sb = getSupabase()
    if (!sb) { setError('Error de conexión'); setLoading(false); return }

    const { data, error: err } = await sb.from('tournaments').insert({
      creator_id:  user.id,
      title:       form.title.trim(),
      description: form.description.trim() || null,
      sport:       form.sport,
      location:    form.location.trim(),
      date:        form.date,
      time:        form.time || null,
      price:       form.price.trim() || 'Gratis',
      format:      form.format,
      pair_mode:   selectedSport?.pairs ?? form.pair_mode,
      max_pairs:   form.max_pairs,
      status:      'open',
    }).select().single()

    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/tournaments/${data.id}`)
  }

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:16 }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
          <Link href="/" style={{ color:'var(--muted)', fontSize:20, textDecoration:'none' }}>←</Link>
          <div>
            <h1 style={{ fontWeight:900, fontSize:20, margin:0 }}>Crear torneo</h1>
            <p style={{ fontSize:12, color:'var(--muted)', margin:0 }}>Solo para perfiles verificados</p>
          </div>
        </header>

        {/* Pasos */}
        <div style={{ display:'flex', gap:0, marginBottom:28 }}>
          {['Deporte','Detalles','Confirmar'].map((s,i) => (
            <div key={s} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:3,
                background: step > i ? accent : step === i+1 ? accent : 'var(--border)',
                borderRadius:2, marginBottom:4,
                opacity: step === i+1 ? 1 : step > i ? 0.6 : 0.3,
              }}/>
              <span style={{ fontSize:11, color: step === i+1 ? 'var(--text)' : 'var(--muted)', fontWeight: step === i+1 ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:16, color:'#ef4444', fontSize:13 }}>
            {error}
          </div>
        )}

        {/* Paso 1: Deporte */}
        {step === 1 && (
          <div className="anim-1">
            <p className="label" style={{ marginBottom:14 }}>¿Qué deporte?</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => { set('sport', s.id); set('pair_mode', s.pairs) }}
                  style={{
                    padding:'14px 8px', borderRadius:16, border: form.sport===s.id ? `2px solid ${SPORT_COLORS[s.id]||'#586875'}` : '1.5px solid var(--border)',
                    background: form.sport===s.id ? `${SPORT_COLORS[s.id]||'#586875'}15` : 'var(--surface)',
                    cursor:'pointer', fontFamily:'inherit', textAlign:'center',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                  }}>
                  <span style={{ fontSize:26 }}>{s.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{s.label}</span>
                  {s.pairs && <span style={{ fontSize:10, color:'var(--muted)' }}>por parejas</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (!form.sport) { setError('Selecciona un deporte'); return } setError(''); setStep(2) }}
              className="btn btn-primary" style={{ width:'100%', marginTop:24 }}>
              Siguiente →
            </button>
          </div>
        )}

        {/* Paso 2: Detalles */}
        {step === 2 && (
          <div className="anim-1" style={{ display:'flex', flexDirection:'column', gap:16 }}>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Nombre del torneo</label>
              <input className="input" type="text"
                placeholder={`Ej: Torneo de ${selectedSport?.label} primavera 2026`}
                value={form.title} onChange={e => set('title', e.target.value)} />
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Descripción (opcional)</label>
              <textarea className="input" rows={3}
                placeholder="Información adicional, premios, patrocinadores..."
                value={form.description} onChange={e => set('description', e.target.value)}
                style={{ resize:'none', lineHeight:1.5 }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Fecha</label>
                <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Hora inicio</label>
                <input className="input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Lugar</label>
              <input className="input" type="text" placeholder="Club, pabellón, dirección..."
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Precio de inscripción</label>
              <input className="input" type="text" placeholder="Gratis / 10€ por pareja / ..."
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>

            <div>
              <label className="label" style={{ marginBottom:10 }}>Formato</label>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => set('format', f.id)}
                    style={{
                      padding:'13px 16px', borderRadius:14, textAlign:'left', cursor:'pointer', fontFamily:'inherit',
                      border: form.format===f.id ? `2px solid ${accent}` : '1.5px solid var(--border)',
                      background: form.format===f.id ? `${accent}10` : 'var(--surface)',
                    }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:3 }}>{f.label}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" style={{ marginBottom:10 }}>
                {selectedSport?.pairs ? 'Máximo de parejas' : 'Máximo de participantes'}
              </label>
              <div style={{ display:'flex', gap:8 }}>
                {[4,8,16,32].map(n => (
                  <button key={n} onClick={() => set('max_pairs', n)}
                    style={{
                      flex:1, padding:'11px 0', borderRadius:12, cursor:'pointer', fontFamily:'inherit',
                      border: form.max_pairs===n ? `2px solid ${accent}` : '1.5px solid var(--border)',
                      background: form.max_pairs===n ? `${accent}15` : 'var(--surface)',
                      fontWeight:700, fontSize:15, color:'var(--text)',
                    }}>{n}</button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex:1 }}>← Atrás</button>
              <button onClick={() => {
                if (!form.title.trim())    { setError('Añade un título'); return }
                if (!form.location.trim()) { setError('Indica el lugar'); return }
                if (!form.date)            { setError('Selecciona una fecha'); return }
                setError(''); setStep(3)
              }} className="btn btn-primary" style={{ flex:2 }}>Ver resumen →</button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmar */}
        {step === 3 && (
          <div className="anim-1">
            <div className="card" style={{ padding:'20px', marginBottom:16, borderTop:`3px solid ${accent}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
                <span style={{ fontSize:32 }}>{selectedSport?.icon}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:16 }}>{form.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{selectedSport?.label} · {form.location}</div>
                </div>
              </div>
              {[
                { label:'Fecha', val: form.date ? new Date(form.date+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}) + (form.time ? ` · ${form.time.slice(0,5)}h` : '') : '—' },
                { label:'Formato', val: FORMATS.find(f=>f.id===form.format)?.label },
                { label: selectedSport?.pairs ? 'Máx. parejas' : 'Máx. participantes', val: form.max_pairs },
                { label:'Inscripción', val: form.price || 'Gratis' },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontWeight:600, color:'var(--text)' }}>{r.val}</span>
                </div>
              ))}
              {selectedSport?.pairs && (
                <div style={{ marginTop:12, padding:'10px 14px', background:`${accent}10`, borderRadius:10, fontSize:12, color:'var(--muted)' }}>
                  🎾 Los usuarios pueden inscribirse solos (buscando pareja) o con su pareja confirmada.
                </div>
              )}
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:16, color:'#ef4444', fontSize:13 }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex:1 }}>← Atrás</button>
              <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex:2, background: accent }}>
                {loading ? 'Creando...' : '🏆 Crear torneo'}
              </button>
            </div>
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}
