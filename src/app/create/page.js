'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SportIcon } from '@/components/SportIcon'

const SPORTS = [
  {id:'running',    label:'Running',    icon:'🏃', color:'#5b6ef5'},
  {id:'padel',      label:'Pádel',      icon:'🎾', color:'#06d6a0'},
  {id:'senderismo', label:'Senderismo', icon:'🥾', color:'#f59e0b'},
  {id:'futbol',     label:'Fútbol',     icon:'⚽', color:'#ef4444'},
  {id:'gimnasio',   label:'Gimnasio',   icon:'💪', color:'#8b5cf6'},
  {id:'tenis',      label:'Tenis',      icon:'🎾', color:'#fbbf24'},
  {id:'natacion',   label:'Natación',   icon:'🏊', color:'#0ea5e9'},
  {id:'ciclismo',   label:'Ciclismo',   icon:'🚴', color:'#f97316'},
  {id:'yoga',       label:'Yoga',       icon:'🧘', color:'#ec4899'},
  {id:'baloncesto', label:'Baloncesto', icon:'🏀', color:'#f59e0b'},
  {id:'voleibol',   label:'Voleibol',   icon:'🏐', color:'#06d6a0'},
  {id:'badminton',  label:'Bádminton',  icon:'🏸', color:'#8b5cf6'},
]

const LEVELS = [
  {id:'any',          label:'Todos',        icon:'🌍', desc:'Cualquier nivel bienvenido'},
  {id:'beginner',     label:'Principiante', icon:'🌱', desc:'Sin experiencia previa'},
  {id:'intermediate', label:'Intermedio',   icon:'⭐', desc:'Con algo de experiencia'},
  {id:'advanced',     label:'Avanzado',     icon:'🔥', desc:'Nivel alto requerido'},
]

const DURATIONS = [
  {value:30,  label:'30 min'},
  {value:45,  label:'45 min'},
  {value:60,  label:'1 h'},
  {value:90,  label:'1 h 30'},
  {value:120, label:'2 h'},
  {value:150, label:'2 h 30'},
  {value:180, label:'3 h'},
  {value:240, label:'4 h'},
  {value:300, label:'5 h'},
  {value:480, label:'Todo el día'},
]

const PROVINCIA_MUNICIPIOS = {
  'Álava':['Vitoria-Gasteiz','Llodio','Amurrio'],'Albacete':['Albacete','Hellín','Almansa','Villarrobledo','La Roda'],'Alicante':['Alicante','Elche','Torrevieja','Benidorm','Orihuela','Elda','Alcoy','Villajoyosa','Denia','Petrer'],'Almería':['Almería','El Ejido','Roquetas de Mar','Adra'],'Asturias':['Oviedo','Gijón','Avilés','Siero','Langreo','Mieres'],'Ávila':['Ávila','Arenas de San Pedro'],'Badajoz':['Badajoz','Mérida','Don Benito','Almendralejo'],'Barcelona':['Barcelona','Badalona','Terrassa','Sabadell','Hospitalet de Llobregat','Mataró','Cornellà','Manresa'],'Burgos':['Burgos','Miranda de Ebro','Aranda de Duero'],'Cáceres':['Cáceres','Plasencia'],'Cádiz':['Cádiz','Jerez de la Frontera','Algeciras','San Fernando','El Puerto de Santa María','Chiclana','La Línea'],'Cantabria':['Santander','Torrelavega','Castro-Urdiales'],'Castellón':['Castellón de la Plana','Vila-real','Burriana','Vinaròs'],'Ciudad Real':['Ciudad Real','Puertollano','Tomelloso','Alcázar de San Juan'],'Córdoba':['Córdoba','Lucena','Montilla','Priego de Córdoba','Cabra','Palma del Río','Pozoblanco'],'Cuenca':['Cuenca','Tarancón'],'Girona':['Girona','Blanes','Lloret de Mar','Figueres','Roses','Olot'],'Granada':['Granada','Motril','Almuñécar','Loja','Guadix','Baza'],'Guadalajara':['Guadalajara','Azuqueca de Henares'],'Guipúzcoa':['San Sebastián','Irun','Errenteria','Zarautz','Eibar'],'Huelva':['Huelva','Almonte','Lepe','Moguer','Isla Cristina'],'Huesca':['Huesca','Barbastro','Monzón','Jaca'],'Illes Balears':['Palma','Calvià','Manacor','Ibiza','Maó'],'Jaén':['Jaén','Linares','Andújar','Úbeda','Baeza'],'La Rioja':['Logroño','Calahorra','Haro'],'Las Palmas':['Las Palmas de Gran Canaria','Telde','Arrecife'],'León':['León','Ponferrada'],'Lleida':['Lleida','Balaguer'],'Lugo':['Lugo','Monforte de Lemos'],'Madrid':['Madrid','Móstoles','Alcalá de Henares','Fuenlabrada','Leganés','Getafe','Alcorcón','Torrejón de Ardoz','Parla','Alcobendas','Las Rozas','Majadahonda','Pozuelo'],'Málaga':['Málaga','Marbella','Fuengirola','Vélez-Málaga','Torremolinos','Benalmádena','Mijas','Estepona','Ronda','Nerja'],'Murcia':['Murcia','Cartagena','Lorca','Molina de Segura','Alcantarilla'],'Navarra':['Pamplona','Tudela','Barañáin','Estella'],'Ourense':['Ourense','Verín'],'Palencia':['Palencia','Aguilar de Campoo'],'Pontevedra':['Vigo','Pontevedra','Vilagarcía de Arousa','Redondela'],'Salamanca':['Salamanca','Béjar','Ciudad Rodrigo'],'Santa Cruz de Tenerife':['Santa Cruz de Tenerife','La Laguna','Arona','Adeje','Puerto de la Cruz'],'Segovia':['Segovia','Cuéllar'],'Sevilla':['Sevilla','Dos Hermanas','Alcalá de Guadaíra','Mairena del Aljarafe','Utrera','Écija','Carmona'],'Soria':['Soria','Almazán'],'Tarragona':['Tarragona','Reus','Cambrils','Salou','Tortosa'],'Teruel':['Teruel','Alcañiz'],'Toledo':['Toledo','Talavera de la Reina','Illescas'],'Valencia':['Valencia','Torrent','Gandía','Paterna','Sagunto','Alzira','Manises'],'Valladolid':['Valladolid','Medina del Campo','Arroyo de la Encomienda'],'Vizcaya':['Bilbao','Barakaldo','Getxo','Basauri','Leioa','Sestao','Santurtzi','Portugalete'],'Zamora':['Zamora','Benavente'],'Zaragoza':['Zaragoza','Calatayud','Ejea de los Caballeros','Utebo'],
}

const PROVINCES_LIST = Object.keys(PROVINCIA_MUNICIPIOS).sort()
const STEPS = ['Deporte','Detalles','Confirmar']

export default function Create() {
  const router    = useRouter()
  const { user }  = useAuth()

  const [step,   setStep]   = useState(0)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [sportDetails, setSportDetails] = useState({})
  const setSD = (k, v) => setSportDetails(p => ({...p, [k]: v}))
  const [form,   setForm]   = useState({
    sport:'', level:'any',
    title:'', description:'',
    date:'', time:'', duration_minutes: 60,
    location:'', province:'', municipio:'',
    maxPlayers:10, price:'Gratis',
    thirdPlace: false,
  })
  const set = (k, v) => setForm(p=>({...p,[k]:v}))
  const selectedSport = SPORTS.find(s=>s.id===form.sport)

  const municipios = form.province ? (PROVINCIA_MUNICIPIOS[form.province] || []) : []

  const toSlug = str => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,'-')
    .replace(/[^a-z0-9-]/g,'')

  const submit = async () => {
    if (!user) { router.push('/auth'); return }
    setSaving(true); setError('')

    const sb = getSupabase()
    if (!sb) { setError('Error de conexión.'); setSaving(false); return }

    const fullLocation = form.municipio
      ? `${form.location ? form.location + ', ' : ''}${form.municipio}`
      : form.location

    const { error: err } = await sb.from('events').insert({
      creator_id:       user.id,
      title:            form.title,
      description:      form.description,
      sport:            form.sport,
      level:            form.level,
      date:             form.date,
      time:             form.time,
      duration_minutes: form.duration_minutes,
      location:         fullLocation,
      province:         toSlug(form.province),
      max_players:      parseInt(form.maxPlayers),
      price:            form.price || 'Gratis',
      third_place:      form.thirdPlace,
      sport_details:    JSON.stringify(sportDetails),
    })

    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      const { data: newEv } = await sb
        .from('events')
        .select('id')
        .eq('creator_id', user.id)
        .eq('title', form.title)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const eventId = newEv?.id

      if (eventId) {
        await sb.from('event_participants').insert({
          event_id: eventId, user_id: user.id, status: 'joined',
        })
        router.push(`/events/${eventId}`)
      } else {
        router.push('/events')
      }
    }
  }

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>
        <header style={{ paddingTop:36, paddingBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.04em' }}>Crear evento</h1>
          <p style={{ fontSize:13, color:'var(--muted)' }}>
            {step===0?'Elige el deporte':step===1?'Rellena los detalles':'Revisa y publica'}
          </p>
        </header>

        {/* Barra de pasos */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4, borderRadius:100, marginBottom:6, background:i<=step?'#586875':'var(--border)', transition:'background 0.3s' }}/>
              <span style={{ fontSize:11, fontWeight:600, color:i<=step?'var(--primary)':'var(--muted)' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* ── PASO 0: Deporte ── */}
        {step===0 && (
          <div className="anim-1" style={{ paddingBottom:40 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
              {SPORTS.map(s=>(
                <button key={s.id} onClick={()=>set('sport',s.id)} style={{
                  background: form.sport===s.id?`linear-gradient(140deg,${s.color},${s.color}bb)`:'var(--glass)',
                  backdropFilter:'blur(14px)',
                  border: form.sport===s.id?'none':'1.5px solid var(--border)',
                  borderRadius:18, padding:'20px 16px', cursor:'pointer', textAlign:'left',
                  boxShadow: form.sport===s.id?`0 6px 22px ${s.color}40`:'none',
                  transition:'all 0.20s cubic-bezier(.34,1.56,.64,1)',
                  transform: form.sport===s.id?'scale(1.03)':'',
                  fontFamily:'inherit',
                }}>
                  <SportIcon sport={s.id} size={42} />
                  <div style={{ fontSize:14, fontWeight:700, color:form.sport===s.id?'white':'var(--text)' }}>{s.label}</div>
                </button>
              ))}
            </div>

            <span className="label" style={{ marginBottom:14, display:'block' }}>Nivel de los participantes</span>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
              {LEVELS.map(lv=>(
                <button key={lv.id} onClick={()=>set('level',lv.id)} style={{
                  display:'flex', alignItems:'center', gap:14,
                  background: form.level===lv.id?'var(--surface)':'var(--glass)',
                  backdropFilter:'blur(14px)',
                  border: form.level===lv.id?'2px solid var(--primary)':'1.5px solid var(--border)',
                  borderRadius:14, padding:'14px 16px', cursor:'pointer', textAlign:'left',
                  transition:'all 0.18s ease', fontFamily:'inherit',
                }}>
                  <span style={{ fontSize:22 }}>{lv.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{lv.label}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{lv.desc}</div>
                  </div>
                  {form.level===lv.id && <div style={{ color:'var(--primary)', fontSize:18 }}>✓</div>}
                </button>
              ))}
            </div>

            {form.sport && (
              <div className="card anim-1" style={{ padding:'16px 18px', marginBottom:16 }}>
                <div className="label" style={{ marginBottom:12 }}>
                  Detalles de {SPORTS.find(s=>s.id===form.sport)?.label}
                </div>

                {/* PADEL */}
                {form.sport === 'padel' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Puntuación Playtomic</label>
                      <input className="input" type="text" placeholder="Ej: 4.5 (opcional)"
                        value={sportDetails.playtomic_score||''}
                        onChange={e=>setSD('playtomic_score',e.target.value)}/>
                    </div>
                    <button onClick={()=>setSD('has_spare_racket',!sportDetails.has_spare_racket)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', background:'none', border:'none', cursor:'pointer',
                      fontFamily:'inherit', padding:'8px 0', color:'var(--text)',
                    }}>
                      <span style={{fontSize:14}}>¿Tienes raqueta de repuesto para prestar?</span>
                      <div style={{
                        width:44, height:26, borderRadius:100, position:'relative',
                        background: sportDetails.has_spare_racket ? '#586875' : 'var(--border)',
                        transition:'background 0.2s',
                      }}>
                        <div style={{
                          width:20, height:20, background:'white', borderRadius:'50%',
                          position:'absolute', top:3,
                          left: sportDetails.has_spare_racket ? 21 : 3,
                          transition:'left 0.2s cubic-bezier(.34,1.56,.64,1)',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                        }}/>
                      </div>
                    </button>
                  </>
                )}

                {/* TENIS */}
                {form.sport === 'tenis' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Nivel RFET/RPT</label>
                      <input className="input" type="text" placeholder="Ej: 2.1 (opcional)"
                        value={sportDetails.rfet_level||''}
                        onChange={e=>setSD('rfet_level',e.target.value)}/>
                    </div>
                    <button onClick={()=>setSD('has_spare_racket',!sportDetails.has_spare_racket)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', background:'none', border:'none', cursor:'pointer',
                      fontFamily:'inherit', padding:'8px 0', color:'var(--text)',
                    }}>
                      <span style={{fontSize:14}}>¿Tienes raqueta de repuesto?</span>
                      <div style={{
                        width:44, height:26, borderRadius:100, position:'relative',
                        background: sportDetails.has_spare_racket ? '#586875' : 'var(--border)',
                        transition:'background 0.2s',
                      }}>
                        <div style={{
                          width:20, height:20, background:'white', borderRadius:'50%',
                          position:'absolute', top:3,
                          left: sportDetails.has_spare_racket ? 21 : 3,
                          transition:'left 0.2s cubic-bezier(.34,1.56,.64,1)',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                        }}/>
                      </div>
                    </button>
                  </>
                )}

                {/* RUNNING */}
                {form.sport === 'running' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Ritmo medio</label>
                      <select className="input" value={sportDetails.pace||''} onChange={e=>setSD('pace',e.target.value)}>
                        <option value="">Selecciona un ritmo</option>
                        <option value="lt430">&lt; 4:30 min/km</option>
                        <option value="430_530">4:30 – 5:30 min/km</option>
                        <option value="530_700">5:30 – 7:00 min/km</option>
                        <option value="gt700">&gt; 7:00 min/km</option>
                        <option value="none">Sin preferencia</option>
                      </select>
                    </div>
                    <button onClick={()=>setSD('adapt_pace',!sportDetails.adapt_pace)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', background:'none', border:'none', cursor:'pointer',
                      fontFamily:'inherit', padding:'8px 0', color:'var(--text)',
                    }}>
                      <span style={{fontSize:14}}>Me adapto al ritmo del grupo 🤝</span>
                      <div style={{
                        width:44, height:26, borderRadius:100, position:'relative',
                        background: sportDetails.adapt_pace ? '#586875' : 'var(--border)',
                        transition:'background 0.2s',
                      }}>
                        <div style={{
                          width:20, height:20, background:'white', borderRadius:'50%',
                          position:'absolute', top:3,
                          left: sportDetails.adapt_pace ? 21 : 3,
                          transition:'left 0.2s cubic-bezier(.34,1.56,.64,1)',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                        }}/>
                      </div>
                    </button>
                  </>
                )}

                {/* SENDERISMO */}
                {form.sport === 'senderismo' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Duración</label>
                      <select className="input" value={sportDetails.duration||''} onChange={e=>setSD('duration',e.target.value)}>
                        <option value="">Selecciona duración</option>
                        <option value="1d">1 día</option>
                        <option value="2d">2 días</option>
                        <option value="3d">3 días</option>
                        <option value="3d_plus">Más de 3 días</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Terreno</label>
                      <select className="input" value={sportDetails.terrain||''} onChange={e=>setSD('terrain',e.target.value)}>
                        <option value="">Selecciona terreno</option>
                        <option value="marked">Sendero marcado</option>
                        <option value="mid_mountain">Montaña media</option>
                        <option value="high_mountain">Alta montaña</option>
                      </select>
                    </div>
                  </>
                )}

                {/* CICLISMO */}
                {form.sport === 'ciclismo' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Tipo de bici</label>
                      <select className="input" value={sportDetails.bike_type||''} onChange={e=>setSD('bike_type',e.target.value)}>
                        <option value="">Selecciona tipo</option>
                        <option value="road">Carretera</option>
                        <option value="mtb">Montaña (MTB)</option>
                        <option value="gravel">Mixta/Gravel</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Distancia estimada (km)</label>
                      <input className="input" type="number" min={1} max={500}
                        placeholder="Ej: 60"
                        value={sportDetails.distance_km||''}
                        onChange={e=>setSD('distance_km',e.target.value)}/>
                    </div>
                  </>
                )}

                {/* NATACION */}
                {form.sport === 'natacion' && (
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Modalidad</label>
                      <select className="input" value={sportDetails.modality||''} onChange={e=>setSD('modality',e.target.value)}>
                        <option value="">Selecciona modalidad</option>
                        <option value="pool">Piscina</option>
                        <option value="open_water">Aguas abiertas</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" style={{ marginBottom:6, fontSize:12 }}>Nivel técnico</label>
                      <select className="input" value={sportDetails.tech_level||''} onChange={e=>setSD('tech_level',e.target.value)}>
                        <option value="">Selecciona nivel</option>
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    </div>
                  </>
                )}

                {/* GIMNASIO */}
                {form.sport === 'gimnasio' && (
                  <div>
                    <label className="label" style={{ marginBottom:6, fontSize:12 }}>Tipo de entreno</label>
                    <select className="input" value={sportDetails.workout_type||''} onChange={e=>setSD('workout_type',e.target.value)}>
                      <option value="">Selecciona tipo</option>
                      <option value="crossfit">Funcional/CrossFit</option>
                      <option value="strength">Fuerza</option>
                      <option value="cardio">Cardio</option>
                      <option value="mixed">Mixto</option>
                    </select>
                  </div>
                )}

                {/* YOGA */}
                {form.sport === 'yoga' && (
                  <div>
                    <label className="label" style={{ marginBottom:6, fontSize:12 }}>Estilo</label>
                    <select className="input" value={sportDetails.yoga_style||''} onChange={e=>setSD('yoga_style',e.target.value)}>
                      <option value="">Selecciona estilo</option>
                      <option value="hatha">Hatha</option>
                      <option value="vinyasa">Vinyasa</option>
                      <option value="yin">Yin Yoga</option>
                      <option value="beginners">Para principiantes</option>
                      <option value="meditation">Meditación</option>
                    </select>
                  </div>
                )}

                {/* FUTBOL / BALONCESTO / VOLEIBOL */}
                {(form.sport === 'futbol' || form.sport === 'baloncesto' || form.sport === 'voleibol') && (
                  <>
                    <button onClick={()=>setSD('has_locker_rooms',!sportDetails.has_locker_rooms)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', background:'none', border:'none', cursor:'pointer',
                      fontFamily:'inherit', padding:'8px 0', color:'var(--text)',
                    }}>
                      <span style={{fontSize:14}}>¿Hay vestuarios disponibles?</span>
                      <div style={{
                        width:44, height:26, borderRadius:100, position:'relative',
                        background: sportDetails.has_locker_rooms ? '#586875' : 'var(--border)',
                        transition:'background 0.2s',
                      }}>
                        <div style={{
                          width:20, height:20, background:'white', borderRadius:'50%',
                          position:'absolute', top:3,
                          left: sportDetails.has_locker_rooms ? 21 : 3,
                          transition:'left 0.2s cubic-bezier(.34,1.56,.64,1)',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                        }}/>
                      </div>
                    </button>
                    <button onClick={()=>setSD('has_referee',!sportDetails.has_referee)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', background:'none', border:'none', cursor:'pointer',
                      fontFamily:'inherit', padding:'8px 0', color:'var(--text)',
                    }}>
                      <span style={{fontSize:14}}>¿Hay árbitro?</span>
                      <div style={{
                        width:44, height:26, borderRadius:100, position:'relative',
                        background: sportDetails.has_referee ? '#586875' : 'var(--border)',
                        transition:'background 0.2s',
                      }}>
                        <div style={{
                          width:20, height:20, background:'white', borderRadius:'50%',
                          position:'absolute', top:3,
                          left: sportDetails.has_referee ? 21 : 3,
                          transition:'left 0.2s cubic-bezier(.34,1.56,.64,1)',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                        }}/>
                      </div>
                    </button>
                  </>
                )}

                {/* BADMINTON */}
                {form.sport === 'badminton' && (
                  <div>
                    <label className="label" style={{ marginBottom:6, fontSize:12 }}>Modalidad</label>
                    <select className="input" value={sportDetails.badminton_modality||''} onChange={e=>setSD('badminton_modality',e.target.value)}>
                      <option value="">Selecciona modalidad</option>
                      <option value="singles">Individual</option>
                      <option value="doubles">Dobles</option>
                      <option value="mixed">Mixto</option>
                    </select>
                  </div>
                )}

              </div>
            )}

            <button className="btn btn-primary" style={{ width:'100%', fontSize:16 }}
              onClick={()=>setStep(1)} disabled={!form.sport}>
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 1: Detalles ── */}
        {step===1 && (
          <div className="anim-1" style={{ display:'flex', flexDirection:'column', gap:16, paddingBottom:40 }}>
            <div>
              <label className="label" style={{ marginBottom:8 }}>Título del evento</label>
              <input className="input" type="text"
                placeholder={`${selectedSport?.icon||''} Ej: Partido de ${selectedSport?.label||'deporte'} en el parque`}
                value={form.title} onChange={e=>set('title',e.target.value)}/>
            </div>
            <div>
              <label className="label" style={{ marginBottom:8 }}>Descripción</label>
              <textarea className="input" rows={3}
                placeholder="Cuéntales a los participantes qué pueden esperar..."
                value={form.description} onChange={e=>set('description',e.target.value)}/>
            </div>

            {/* Fecha, hora y duración */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Fecha</label>
                <input className="input" type="date" value={form.date} onChange={e=>set('date',e.target.value)}/>
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Hora inicio</label>
                <input className="input" type="time" value={form.time} onChange={e=>set('time',e.target.value)}/>
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="label" style={{ marginBottom:10 }}>Duración estimada</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {DURATIONS.map(d=>(
                  <button key={d.value} onClick={()=>set('duration_minutes',d.value)} style={{
                    padding:'8px 14px', borderRadius:100,
                    border: form.duration_minutes===d.value ? 'none' : '1.5px solid var(--border)',
                    background: form.duration_minutes===d.value ? '#586875' : 'var(--glass)',
                    color: form.duration_minutes===d.value ? '#f6eddc' : 'var(--text)',
                    fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                    transition:'all 0.15s ease',
                    boxShadow: form.duration_minutes===d.value ? '0 3px 12px rgba(88,104,117,0.30)' : 'none',
                  }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Provincia → Municipio */}
            <div>
              <label className="label" style={{ marginBottom:8 }}>Provincia</label>
              <select className="input" value={form.province}
                onChange={e=>{ set('province',e.target.value); set('municipio','') }}>
                <option value="">Selecciona tu provincia</option>
                {PROVINCES_LIST.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {form.province && (
              <div className="anim-1">
                <label className="label" style={{ marginBottom:8 }}>Municipio</label>
                <select className="input" value={form.municipio} onChange={e=>set('municipio',e.target.value)}>
                  <option value="">Selecciona el municipio</option>
                  {municipios.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="label" style={{ marginBottom:8 }}>Lugar / Dirección exacta</label>
              <input className="input" type="text"
                placeholder="Parque, polideportivo, calle..."
                value={form.location} onChange={e=>set('location',e.target.value)}/>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Plazas máximas</label>
                <input className="input" type="number" min={2} max={200}
                  value={form.maxPlayers} onChange={e=>set('maxPlayers',e.target.value)}/>
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Precio</label>
                <input className="input" type="text" placeholder="Gratis / 5€ / ..."
                  value={form.price} onChange={e=>set('price',e.target.value)}/>
              </div>
            </div>

            {/* Tercer tiempo */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--glass)', backdropFilter:'blur(14px)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 18px' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:'var(--text)' }}>🍺 Tercer tiempo</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Quedada post-evento</div>
              </div>
              <button onClick={()=>set('thirdPlace',!form.thirdPlace)} style={{
                width:48, height:28, borderRadius:100, border:'none',
                background: form.thirdPlace?'var(--primary)':'var(--border)',
                cursor:'pointer', position:'relative', transition:'background 0.22s', flexShrink:0,
              }}>
                <div style={{ width:22, height:22, background:'white', borderRadius:'50%', position:'absolute', top:3, left: form.thirdPlace?'23px':'3px', transition:'left 0.22s cubic-bezier(.34,1.56,.64,1)', boxShadow:'0 1px 6px rgba(0,0,0,0.22)' }}/>
              </button>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:8 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setStep(0)}>← Atrás</button>
              <button className="btn btn-primary" style={{ flex:2 }}
                onClick={()=>setStep(2)}
                disabled={!form.title||!form.date||!form.time||!form.province}>
                Revisar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: Confirmar ── */}
        {step===2 && (
          <div className="anim-1" style={{ paddingBottom:40 }}>
            {!user && (
              <div style={{ background:'rgba(88,104,117,0.10)', border:'1px solid rgba(88,104,117,0.25)', borderRadius:14, padding:'16px 18px', marginBottom:16, textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:8 }}>Necesitas iniciar sesión para publicar</div>
                <Link href="/auth" className="btn btn-primary" style={{ fontSize:13, padding:'10px 20px' }}>Entrar / Registrarse</Link>
              </div>
            )}

            <div className="card" style={{ overflow:'hidden', marginBottom:20 }}>
              <div style={{ height:4, background:selectedSport?`linear-gradient(90deg,${selectedSport.color},${selectedSport.color}55)`:'var(--grad)' }}/>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ width:52, height:52, background:`${selectedSport?.color||'var(--primary)'}20`, border:`1.5px solid ${selectedSport?.color||'var(--primary)'}30`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SportIcon sport={form.sport} size={36} />
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{form.title}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{selectedSport?.label} · {LEVELS.find(l=>l.id===form.level)?.label}</div>
                  </div>
                </div>
                {form.description && <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>{form.description}</p>}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', fontSize:12, color:'var(--muted)' }}>
                  {form.date && <span>📅 {form.date}{form.time?` · ${form.time}`:''}</span>}
                  {form.duration_minutes && <span>⏱ {DURATIONS.find(d=>d.value===form.duration_minutes)?.label||`${form.duration_minutes} min`}</span>}
                  {(form.location || form.municipio) && (
                    <span>📍 {[form.location, form.municipio, form.province].filter(Boolean).join(', ')}</span>
                  )}
                  <span>👥 Hasta {form.maxPlayers} personas</span>
                  {form.price && <span>💶 {form.price}</span>}
                  {form.thirdPlace && <span>🍺 Tercer tiempo</span>}
                </div>
              </div>
            </div>

            {error && <div className="error-msg" style={{ marginBottom:16 }}>{error}</div>}

            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setStep(1)}>← Editar</button>
              <button className="btn btn-primary" style={{ flex:2 }} onClick={submit} disabled={saving||!user}>
                {saving?(
                  <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
                      <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Publicando...
                  </span>
                ):'🚀 Publicar evento'}
              </button>
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </>
  )
}
