'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORT_COLORS } from '@/components/SportIcon'

// mode: 'pair' = puede ser parejas o individual | 'team' = por equipos | 'individual' = solo individual
const SPORTS = [
  { id:'padel',      label:'Pádel',      icon:'🎾', mode:'pair'       },
  { id:'tenis',      label:'Tenis',      icon:'🎾', mode:'pair'       },
  { id:'badminton',  label:'Bádminton',  icon:'🏸', mode:'pair'       },
  { id:'voleibol',   label:'Voleibol',   icon:'🏐', mode:'team'       },
  { id:'futbol',     label:'Fútbol',     icon:'⚽',     mode:'team'       },
  { id:'baloncesto', label:'Baloncesto', icon:'🏀', mode:'team'       },
  { id:'running',    label:'Running',    icon:'🏃', mode:'individual' },
  { id:'natacion',   label:'Natación',   icon:'🏊', mode:'individual' },
  { id:'ciclismo',   label:'Ciclismo',   icon:'🚴', mode:'individual' },
  { id:'senderismo', label:'Senderismo', icon:'🥾', mode:'individual' },
  { id:'yoga',       label:'Yoga',       icon:'🧘', mode:'individual' },
  { id:'gimnasio',   label:'Gimnasio',   icon:'💪', mode:'individual' },
  { id:'escalada',   label:'Escalada',   icon:'🧗', mode:'individual' },
  { id:'surf',       label:'Surf',       icon:'🏄', mode:'individual' },
  { id:'esgrima',    label:'Esgrima',    icon:'🤺', mode:'pair'       },
]

const FORMATS = [
  { id:'single_elimination', label:'Eliminación directa', desc:'Pierdes y te vas. El cuadro se genera automáticamente.' },
  { id:'groups',             label:'Fase de grupos + eliminatoria', desc:'Primero grupos, luego los mejores pasan a llaves.' },
]

const PROVINCES = [
  'Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona',
  'Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba',
  'Cuenca','Girona','Granada','Guadalajara','Guipúzcoa','Huelva','Huesca',
  'Islas Baleares','Jaén','La Coruña','La Rioja','Las Palmas','León','Lleida',
  'Lugo','Madrid','Málaga','Murcia','Navarra','Ourense','Palencia','Pontevedra',
  'Salamanca','Santa Cruz de Tenerife','Segovia','Sevilla','Soria','Tarragona',
  'Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza',
]

export default function CreateTournament() {
  const router  = useRouter()
  const { user, profile } = useAuth()

  const [step,    setStep]    = useState(1) // 1: deporte, 2: detalles, 3: categorías, 4: confirmar
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    sport:             '',
    title:             '',
    description:       '',
    location:          '',
    province:          '',
    date:              '',
    time:              '',
    price:             'Gratis',
    format:            'single_elimination',
    pair_mode:         true,
    max_pairs:         8,
    prize_enabled:     false,
    prize_description: '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Categorías — array de {id, name}
  const [categories, setCategories] = useState([])
  const [catInput,   setCatInput]   = useState('')

  const addCategory = () => {
    const name = catInput.trim()
    if (!name || categories.length >= 5) return
    setCategories(prev => [...prev, { id: `cat${Date.now()}`, name }])
    setCatInput('')
  }
  const removeCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id))

  // Solo cuentas business
  if (user && profile && profile.account_type !== 'business') {
    return (
      <>
        <div className="page-wrap" style={{ paddingTop:24 }}>
          <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🏆</div>
            <h2 style={{ fontWeight:800, fontSize:18, marginBottom:10 }}>Solo para clubs y negocios</h2>
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6, marginBottom:20 }}>
              La creación de torneos está disponible para perfiles de empresa verificados.
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
    setLoading(true); setError('')
    const sb = getSupabase()
    if (!sb) { setError('Error de conexión'); setLoading(false); return }

    const { data, error: err } = await sb.from('tournaments').insert({
      creator_id:        user.id,
      title:             form.title.trim(),
      description:       form.description.trim() || null,
      sport:             form.sport,
      location:          form.location.trim(),
      province:          form.province || null,
      date:              form.date,
      time:              form.time || null,
      price:             form.price.trim() || 'Gratis',
      format:            form.format,
      pair_mode:         selectedSport?.mode === 'pair' ? form.pair_mode : false,
      // sport_mode se deduce del deporte al mostrar la ficha
      max_pairs:         form.max_pairs,
      prize_enabled:     form.prize_enabled,
      prize_description: form.prize_enabled ? form.prize_description.trim() : null,
      categories:        categories.length > 0 ? categories : [],
      status:            'open',
    }).select().single()

    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/tournaments/${data.id}`)
  }

  const STEPS = ['Deporte','Detalles','Categorías','Confirmar']

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:16, paddingBottom:100 }}>

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
          {STEPS.map((s,i) => (
            <div key={s} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:3,
                background: step > i ? accent : step === i+1 ? accent : 'var(--border)',
                borderRadius:2, marginBottom:4,
                opacity: step === i+1 ? 1 : step > i ? 0.6 : 0.3,
              }}/>
              <span style={{ fontSize:10, color: step === i+1 ? 'var(--text)' : 'var(--muted)', fontWeight: step === i+1 ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:16, color:'#ef4444', fontSize:13 }}>
            {error}
          </div>
        )}

        {/* ── PASO 1: Deporte ── */}
        {step === 1 && (
          <div className="anim-1">
            <p className="label" style={{ marginBottom:14 }}>¿Qué deporte?</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, paddingBottom:8 }}>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => set('sport', s.id)}
                  style={{
                    padding:'14px 8px', borderRadius:16,
                    border: form.sport===s.id ? `2px solid ${SPORT_COLORS[s.id]||'#586875'}` : '1.5px solid var(--border)',
                    background: form.sport===s.id ? `${SPORT_COLORS[s.id]||'#586875'}15` : 'var(--surface)',
                    cursor:'pointer', fontFamily:'inherit', textAlign:'center',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                  }}>
                  <span style={{ fontSize:26 }}>{s.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{s.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { if (!form.sport) { setError('Selecciona un deporte'); return } setError(''); setStep(2) }}
              className="btn btn-primary" style={{ width:'100%', marginTop:24 }}>
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 2: Detalles ── */}
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
                placeholder="Información adicional, patrocinadores, reglas especiales..."
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
              <label className="label" style={{ marginBottom:8 }}>Provincia</label>
              <select className="input" value={form.province} onChange={e => set('province', e.target.value)}>
                <option value="">Selecciona provincia</option>
                {PROVINCES.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="label" style={{ marginBottom:8 }}>Precio de inscripción</label>
              <input className="input" type="text" placeholder="Gratis / 10€ por pareja / ..."
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>

            {/* Premio */}
            <div className="card" style={{ padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: form.prize_enabled ? 12 : 0 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>🏅 ¿Hay premio?</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>Trofeo, dinero, productos...</div>
                </div>
                <button onClick={() => set('prize_enabled', !form.prize_enabled)}
                  style={{
                    width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
                    background: form.prize_enabled ? accent : 'var(--border)',
                    position:'relative', transition:'background 0.2s ease',
                  }}>
                  <div style={{
                    width:18, height:18, borderRadius:'50%', background:'white',
                    position:'absolute', top:3,
                    left: form.prize_enabled ? 23 : 3,
                    transition:'left 0.2s ease',
                    boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
                  }}/>
                </button>
              </div>
              {form.prize_enabled && (
                <input className="input" type="text"
                  placeholder="Ej: Trofeo + 200€ al ganador, jamón ibérico..."
                  value={form.prize_description}
                  onChange={e => set('prize_description', e.target.value)} />
              )}
            </div>

            {/* Modalidad — según el tipo de deporte */}
            {(() => {
              const sportMode = selectedSport?.mode || 'pair'
              if (sportMode === 'team') {
                // Fútbol, baloncesto, voleibol: siempre por equipos
                if (form.pair_mode !== false) set('pair_mode', false) // asegurar que no es pair
                return (
                  <div className="card" style={{ padding:'14px 16px', background:`${accent}08`, border:`1px solid ${accent}30` }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:22 }}>👟</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>Inscripción por equipos</div>
                        <div style={{ fontSize:12, color:'var(--muted)' }}>Cada equipo se inscribe como una unidad. El máximo indica el número de equipos por categoría.</div>
                      </div>
                    </div>
                  </div>
                )
              }
              if (sportMode === 'individual') {
                // Running, ciclismo, etc: siempre individual
                if (form.pair_mode !== false) set('pair_mode', false)
                return (
                  <div className="card" style={{ padding:'14px 16px', background:`${accent}08`, border:`1px solid ${accent}30` }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:22 }}>👤</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>Inscripción individual</div>
                        <div style={{ fontSize:12, color:'var(--muted)' }}>Cada participante se inscribe por su cuenta.</div>
                      </div>
                    </div>
                  </div>
                )
              }
              // Deportes de pareja: mostrar toggle
              return (
                <div>
                  <label className="label" style={{ marginBottom:10 }}>Modalidad de inscripción</label>
                  <div style={{ display:'flex', gap:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                    <button onClick={() => set('pair_mode', true)}
                      style={{ flex:1, padding:'13px 0', border:'none', cursor:'pointer', fontFamily:'inherit',
                        fontSize:13, fontWeight:700, transition:'all 0.15s ease',
                        background: form.pair_mode ? accent : 'transparent',
                        color: form.pair_mode ? '#f6eddc' : 'var(--muted)' }}>
                      👥 Por parejas
                    </button>
                    <button onClick={() => set('pair_mode', false)}
                      style={{ flex:1, padding:'13px 0', border:'none', cursor:'pointer', fontFamily:'inherit',
                        fontSize:13, fontWeight:700, transition:'all 0.15s ease',
                        background: !form.pair_mode ? accent : 'transparent',
                        color: !form.pair_mode ? '#f6eddc' : 'var(--muted)' }}>
                      👤 Individual
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Formato */}
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

            {/* Máximo */}
            <div>
              <label className="label" style={{ marginBottom:10 }}>
                {selectedSport?.mode === 'team' ? 'Máximo de equipos por categoría'
                  : form.pair_mode ? 'Máximo de parejas por categoría'
                  : 'Máximo de participantes por categoría'}
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
              }} className="btn btn-primary" style={{ flex:2 }}>Categorías →</button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Categorías ── */}
        {step === 3 && (
          <div className="anim-1" style={{ display:'flex', flexDirection:'column', gap:16 }}>

            <div className="card" style={{ padding:'16px 18px', background:`${accent}08`, border:`1px solid ${accent}30` }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>¿Cómo funcionan las categorías?</div>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, margin:0 }}>
                Cada categoría es un grupo independiente con su propio cuadro de llaves. Los participantes eligen su categoría al inscribirse. Puedes crear hasta 5 categorías con el nombre que quieras: "Nivel 1", "Amateur", "Sub-18", "Senior"...
              </p>
            </div>

            {/* Añadir categoría */}
            <div>
              <label className="label" style={{ marginBottom:8 }}>
                Categorías del torneo {categories.length > 0 ? `(${categories.length}/5)` : '(opcional — sin categorías = tablón único)'}
              </label>
              <div style={{ display:'flex', gap:8 }}>
                <input className="input" style={{ flex:1 }}
                  placeholder='Ej: "Nivel 1", "Amateur", "Sub-18"...'
                  value={catInput}
                  onChange={e => setCatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCategory()}
                  maxLength={30} />
                <button onClick={addCategory} disabled={!catInput.trim() || categories.length >= 5}
                  className="btn btn-primary" style={{ padding:'0 16px', flexShrink:0, background: accent }}>
                  + Añadir
                </button>
              </div>
            </div>

            {/* Lista de categorías */}
            {categories.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {categories.map((cat, i) => (
                  <div key={cat.id} className="card" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:26, height:26, borderRadius:'50%', background:`${accent}20`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:800, color: accent, flexShrink:0 }}>
                      {i+1}
                    </div>
                    <span style={{ flex:1, fontWeight:700, fontSize:14 }}>{cat.name}</span>
                    <button onClick={() => removeCategory(cat.id)}
                      style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer',
                        fontSize:18, padding:'0 4px' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {categories.length === 0 && (
              <div style={{ textAlign:'center', padding:'20px', color:'var(--muted)', fontSize:13 }}>
                Sin categorías — todos los inscritos van al mismo cuadro
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex:1 }}>← Atrás</button>
              <button onClick={() => { setError(''); setStep(4) }}
                className="btn btn-primary" style={{ flex:2, background: accent }}>
                Ver resumen →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 4: Confirmar ── */}
        {step === 4 && (
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
                { label:'Provincia', val: form.province || '—' },
                { label:'Modalidad', val: form.pair_mode ? 'Por parejas' : 'Individual' },
                { label:'Formato', val: FORMATS.find(f=>f.id===form.format)?.label },
                { label: form.pair_mode ? 'Máx. parejas/cat.' : 'Máx. part./cat.', val: form.max_pairs },
                { label:'Inscripción', val: form.price || 'Gratis' },
                ...(form.prize_enabled ? [{ label:'Premio', val: form.prize_description || 'Sí (sin especificar)' }] : []),
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontWeight:600, color:'var(--text)', textAlign:'right', maxWidth:'60%' }}>{r.val}</span>
                </div>
              ))}

              {categories.length > 0 && (
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>Categorías:</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {categories.map((c,i) => (
                      <span key={c.id} style={{ fontSize:12, fontWeight:700, background:`${accent}15`,
                        color: accent, borderRadius:20, padding:'3px 10px', border:`1px solid ${accent}30` }}>
                        {i+1}. {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:16, color:'#ef4444', fontSize:13 }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(3)} className="btn btn-ghost" style={{ flex:1 }}>← Atrás</button>
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
