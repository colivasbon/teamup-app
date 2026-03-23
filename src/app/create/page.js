'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const SPORTS = [
  {id:'running',    label:'Running',    icon:'🏃', color:'#5b6ef5'},
  {id:'padel',      label:'Pádel',      icon:'🎾', color:'#06d6a0'},
  {id:'senderismo', label:'Senderismo', icon:'🥾', color:'#f59e0b'},
  {id:'futbol',     label:'Fútbol',     icon:'⚽', color:'#ef4444'},
  {id:'gimnasio',   label:'Gimnasio',   icon:'💪', color:'#8b5cf6'},
  {id:'tenis',      label:'Tenis',      icon:'🎾', color:'#fbbf24'},
]

const LEVELS = [
  {id:'any',          label:'Todos',        icon:'🌍', desc:'Cualquier nivel bienvenido'},
  {id:'beginner',     label:'Principiante', icon:'🌱', desc:'Sin experiencia previa'},
  {id:'intermediate', label:'Intermedio',   icon:'⭐', desc:'Con algo de experiencia'},
  {id:'advanced',     label:'Avanzado',     icon:'🔥', desc:'Nivel alto requerido'},
]

// Provincias y sus municipios principales
const PROVINCIA_MUNICIPIOS = {
  'Álava':            ['Vitoria-Gasteiz','Llodio','Amurrio','Salvatierra','Laudio'],
  'Albacete':         ['Albacete','Hellín','Almansa','Villarrobledo','La Roda'],
  'Alicante':         ['Alicante','Elche','Torrevieja','Benidorm','Orihuela','Elda','Alcoy','Villajoyosa','Denia','Petrer'],
  'Almería':          ['Almería','El Ejido','Roquetas de Mar','Adra','Vícar','Níjar'],
  'Asturias':         ['Oviedo','Gijón','Avilés','Siero','Langreo','Mieres','Castrillón','Corvera'],
  'Ávila':            ['Ávila','Arenas de San Pedro','Sotillo de la Adrada','Candeleda'],
  'Badajoz':          ['Badajoz','Mérida','Don Benito','Almendralejo','Villanueva de la Serena'],
  'Barcelona':        ['Barcelona','Badalona','Terrassa','Sabadell','Hospitalet de Llobregat','Mataró','Santa Coloma de Gramenet','Cornellà','Sant Boi','Rubí','Manresa','Vilanova'],
  'Burgos':           ['Burgos','Miranda de Ebro','Aranda de Duero','Briviesca'],
  'Cáceres':          ['Cáceres','Plasencia','Coria','Moraleja','Navalmoral'],
  'Cádiz':            ['Cádiz','Jerez de la Frontera','Algeciras','San Fernando','El Puerto de Santa María','Chiclana','La Línea','Sanlúcar','Rota'],
  'Cantabria':        ['Santander','Torrelavega','Castro-Urdiales','Piélagos','Camargo'],
  'Castellón':        ['Castellón de la Plana','Vila-real','Burriana','Vinaròs','Benicàssim','Oropesa'],
  'Ciudad Real':      ['Ciudad Real','Puertollano','Tomelloso','Alcázar de San Juan','Valdepeñas','Manzanares'],
  'Córdoba':          ['Córdoba','Lucena','Montilla','Priego de Córdoba','Cabra','Palma del Río','Peñarroya','Pozoblanco','Rute'],
  'Cuenca':           ['Cuenca','Tarancón','Motilla del Palancar','San Clemente'],
  'Girona':           ['Girona','Blanes','Lloret de Mar','Figueres','Roses','Platja d\'Aro','Olot','Salt'],
  'Granada':          ['Granada','Motril','Almuñécar','Maracena','Armilla','Loja','Guadix','Baza','Salobreña'],
  'Guadalajara':      ['Guadalajara','Azuqueca de Henares','Alovera','Cabanillas del Campo'],
  'Guipúzcoa':        ['San Sebastián','Irun','Errenteria','Zarautz','Eibar','Mondragón','Tolosa'],
  'Huelva':           ['Huelva','Almonte','Lepe','Moguer','Isla Cristina','Ayamonte','Nerva'],
  'Huesca':           ['Huesca','Barbastro','Monzón','Fraga','Sabiñánigo','Jaca'],
  'Illes Balears':    ['Palma','Calvià','Manacor','Llucmajor','Ibiza','Maó','Ciutadella'],
  'Jaén':             ['Jaén','Linares','Andújar','Úbeda','Baeza','Martos','Alcalá la Real'],
  'La Rioja':         ['Logroño','Calahorra','Arnedo','Haro','Nájera','Alfaro'],
  'Las Palmas':       ['Las Palmas de Gran Canaria','Telde','Arucas','Arrecife','Santa Lucía','Puerto del Rosario'],
  'León':             ['León','Ponferrada','San Andrés del Rabanedo','Astorga'],
  'Lleida':           ['Lleida','Balaguer','Mollerussa','Tàrrega','Igualada'],
  'Lugo':             ['Lugo','Monforte de Lemos','Sarria','Viveiro','Vilalba'],
  'Madrid':           ['Madrid','Móstoles','Alcalá de Henares','Fuenlabrada','Leganés','Getafe','Alcorcón','Torrejón de Ardoz','Parla','Alcobendas','Rivas-Vaciamadrid','Las Rozas','Majadahonda','Pozuelo','Tres Cantos'],
  'Málaga':           ['Málaga','Marbella','Fuengirola','Vélez-Málaga','Torremolinos','Benalmádena','Mijas','Estepona','Ronda','Antequera','Nerja'],
  'Murcia':           ['Murcia','Cartagena','Lorca','Molina de Segura','Alcantarilla','Totana','Yecla','Mazarrón','San Javier','Torre-Pacheco'],
  'Navarra':          ['Pamplona','Tudela','Barañáin','Burlada','Estella','Sarriguren'],
  'Ourense':          ['Ourense','Verín','O Barco de Valdeorras','Xinzo de Limia'],
  'Palencia':         ['Palencia','Aguilar de Campoo','Guardo','Venta de Baños'],
  'Pontevedra':       ['Vigo','Pontevedra','Vilagarcía de Arousa','Redondela','Marín','Moaña','Cangas'],
  'Salamanca':        ['Salamanca','Béjar','Ciudad Rodrigo','Santa Marta de Tormes'],
  'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife','La Laguna','Arona','Adeje','Granadilla','Los Realejos','Puerto de la Cruz','La Orotava'],
  'Segovia':          ['Segovia','Cuéllar','El Espinar','Las Navas de la Asunción'],
  'Sevilla':          ['Sevilla','Dos Hermanas','Alcalá de Guadaíra','Mairena del Aljarafe','Utrera','Camas','San Juan de Aznalfarache','La Rinconada','Écija','Carmona'],
  'Soria':            ['Soria','Ágreda','El Burgo de Osma','Almazán'],
  'Tarragona':        ['Tarragona','Reus','Cambrils','Salou','Tortosa','Valls','El Vendrell'],
  'Teruel':           ['Teruel','Alcañiz','Andorra','Utrillas','Calamocha'],
  'Toledo':           ['Toledo','Talavera de la Reina','Illescas','Seseña','Torrijos','Madridejos'],
  'Valencia':         ['Valencia','Torrent','Gandía','Paterna','Sagunto','Mislata','Burjassot','Alzira','Cullera','Sueca','Manises','Xirivella'],
  'Valladolid':       ['Valladolid','Medina del Campo','Arroyo de la Encomienda','Laguna de Duero','Peñafiel'],
  'Vizcaya':          ['Bilbao','Barakaldo','Getxo','Basauri','Leioa','Sestao','Santurtzi','Portugalete','Amorebieta'],
  'Zamora':           ['Zamora','Benavente','Toro','Puebla de Sanabria'],
  'Zaragoza':         ['Zaragoza','Calatayud','Ejea de los Caballeros','Utebo','Cuarte de Huerva','Tarazona'],
}

const PROVINCES_LIST = Object.keys(PROVINCIA_MUNICIPIOS).sort()

const STEPS = ['Deporte','Detalles','Confirmar']

export default function Create() {
  const router    = useRouter()
  const { user }  = useAuth()

  const [step,   setStep]   = useState(0)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [form,   setForm]   = useState({
    sport:'', level:'any',
    title:'', description:'',
    date:'', time:'', location:'', province:'', municipio:'',
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
    setSaving(true)
    setError('')

    const sb = getSupabase()
    if (!sb) { setError('Error de conexión.'); setSaving(false); return }

    const fullLocation = form.municipio
      ? `${form.location ? form.location + ', ' : ''}${form.municipio}`
      : form.location

    const { error: err } = await sb.from('events').insert({
      creator_id:  user.id,
      title:       form.title,
      description: form.description,
      sport:       form.sport,
      level:       form.level,
      date:        form.date,
      time:        form.time,
      location:    fullLocation,
      province:    toSlug(form.province),
      max_players: parseInt(form.maxPlayers),
      price:       form.price || 'Gratis',
      third_place: form.thirdPlace,
    })

    if (err) {
      if (err.code === 'PGRST205' || err.message?.includes('schema cache') || err.message?.includes('relation')) {
        setError('La base de datos aún no está configurada. Ejecuta el SQL del archivo teamup-supabase-setup.sql en tu panel de Supabase.')
      } else {
        setError(err.message)
      }
      setSaving(false)
    } else {
      router.push('/events')
    }
  }

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>
        <header style={{ paddingTop:60, paddingBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.04em' }}>Crear evento</h1>
          <p style={{ fontSize:13, color:'var(--muted)' }}>
            {step===0?'Elige el deporte':step===1?'Rellena los detalles':'Revisa y publica'}
          </p>
        </header>

        {/* Barra de pasos */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4, borderRadius:100, marginBottom:6, background:i<=step?'var(--grad)':'var(--border)', transition:'background 0.3s' }}/>
              <span style={{ fontSize:11, fontWeight:600, color:i<=step?'var(--primary)':'var(--muted)' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* ── PASO 0: Deporte ── */}
        {step===0 && (
          <div className="anim-1">
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
                  <div style={{ fontSize:30, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:form.sport===s.id?'white':'var(--text)' }}>{s.label}</div>
                </button>
              ))}
            </div>

            <span className="label" style={{ marginBottom:14, display:'block' }}>Nivel de los participantes</span>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
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

            <button className="btn btn-primary" style={{ width:'100%', marginTop:28, fontSize:16 }}
              onClick={()=>setStep(1)} disabled={!form.sport}>
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 1: Detalles ── */}
        {step===1 && (
          <div className="anim-1" style={{ display:'flex', flexDirection:'column', gap:16 }}>
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
                cursor:'pointer', position:'relative', transition:'background 0.22s',
                flexShrink:0,
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
          <div className="anim-1">
            {!user && (
              <div style={{ background:'rgba(91,110,245,0.10)', border:'1px solid rgba(91,110,245,0.25)', borderRadius:14, padding:'16px 18px', marginBottom:16, textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:8 }}>Necesitas iniciar sesión para publicar</div>
                <Link href="/auth" className="btn btn-primary" style={{ fontSize:13, padding:'10px 20px' }}>Entrar / Registrarse</Link>
              </div>
            )}

            <div className="card" style={{ overflow:'hidden', marginBottom:20 }}>
              <div style={{ height:4, background:selectedSport?`linear-gradient(90deg,${selectedSport.color},${selectedSport.color}55)`:'var(--grad)' }}/>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                  <div className="sport-icon" style={{ background:`${selectedSport?.color||'var(--primary)'}20`, border:`1.5px solid ${selectedSport?.color||'var(--primary)'}30`, borderRadius:16, fontSize:22 }}>
                    {selectedSport?.icon||'🎯'}
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{form.title}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{selectedSport?.label} · {LEVELS.find(l=>l.id===form.level)?.label}</div>
                  </div>
                </div>
                {form.description && <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>{form.description}</p>}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', fontSize:12, color:'var(--muted)' }}>
                  {form.date && <span>📅 {form.date}{form.time?` · ${form.time}`:''}</span>}
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
