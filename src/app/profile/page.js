'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const ALL_SPORTS = [
  {id:'running',    label:'Running',    icon:'🏃'},
  {id:'padel',      label:'Pádel',      icon:'🎾'},
  {id:'senderismo', label:'Senderismo', icon:'🥾'},
  {id:'futbol',     label:'Fútbol',     icon:'⚽'},
  {id:'gimnasio',   label:'Gimnasio',   icon:'💪'},
  {id:'tenis',      label:'Tenis',      icon:'🎾'},
  {id:'natacion',   label:'Natación',   icon:'🏊'},
  {id:'ciclismo',   label:'Ciclismo',   icon:'🚴'},
  {id:'yoga',       label:'Yoga',       icon:'🧘'},
  {id:'baloncesto', label:'Baloncesto', icon:'🏀'},
  {id:'voleibol',   label:'Voleibol',   icon:'🏐'},
  {id:'badminton',  label:'Bádminton',  icon:'🏸'},
]

const SPORT_COLORS = {
  running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444',
  gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316',
  yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6',
}

const TABS = ['Actividad','Deportes','Karma']

export default function Profile() {
  const router = useRouter()
  const { user, profile, setProfile, loading: authLoading } = useAuth()
  const fileRef = useRef(null)

  const [tab,        setTab]       = useState('Actividad')
  const [editing,    setEditing]   = useState(false)
  const [saving,     setSaving]    = useState(false)
  const [uploadingImg, setUpload]  = useState(false)
  const [myCreated,  setCreated]   = useState([])
  const [myJoined,   setJoined]    = useState([])
  const [actTab,     setActTab]    = useState('creados')
  const [avatarUrl,  setAvatarUrl] = useState(null)

  const [form, setForm] = useState({ full_name:'', username:'', bio:'', sports:[] })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleSport = (id) => {
    set('sports', form.sports.includes(id)
      ? form.sports.filter(s => s !== id)
      : [...form.sports, id]
    )
  }

  // Inicializar form cuando llega el perfil
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username:  profile.username  || '',
        bio:       profile.bio       || '',
        sports:    profile.sports    || [],
      })
      setAvatarUrl(profile.avatar_url || null)
    }
  }, [profile])

  // Cargar eventos creados y apuntados
  useEffect(() => {
    if (!user) return
    const sb = getSupabase()
    if (!sb) return

    sb.from('events').select('*').eq('creator_id', user.id).order('date', { ascending:false }).limit(10)
      .then(({ data }) => { if (data) setCreated(data) })

    sb.from('event_participants').select('event_id, events(*)').eq('user_id', user.id).order('joined_at', { ascending:false }).limit(10)
      .then(({ data }) => { if (data) setJoined(data.map(d => d.events).filter(Boolean)) })
  }, [user])

  const saveProfile = async () => {
    if (!user) return
    const sb = getSupabase()
    if (!sb) return
    setSaving(true)
    const { data, error } = await sb.from('profiles')
      .update({
        full_name: form.full_name.trim(),
        username:  form.username.trim().toLowerCase().replace(/\s+/g, '_'),
        bio:       form.bio.trim(),
        sports:    form.sports,
      })
      .eq('id', user.id)
      .select().single()
    if (data) setProfile(data)
    setSaving(false)
    setEditing(false)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const sb = getSupabase()
    if (!sb) return
    setUpload(true)

    // Subir a Supabase Storage (bucket "avatars", que crearemos en el SQL)
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true })

    if (!upErr) {
      const { data: urlData } = sb.storage.from('avatars').getPublicUrl(path)
      const url = urlData?.publicUrl
      if (url) {
        const { data } = await sb.from('profiles').update({ avatar_url: url }).eq('id', user.id).select().single()
        if (data) { setProfile(data); setAvatarUrl(url) }
      }
    }
    setUpload(false)
  }

  const handleSignOut = async () => {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
    router.replace('/auth')
  }

  if (authLoading) return (
    <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div className="spinner"/>
    </div>
  )

  if (!user) return (
    <div className="app-shell" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', padding:'24px' }}>
      <div style={{ fontSize:52, marginBottom:16 }}>👤</div>
      <h2 style={{ fontWeight:800, fontSize:22, marginBottom:8, letterSpacing:'-0.03em' }}>Inicia sesión</h2>
      <p style={{ fontSize:14, color:'var(--muted)', marginBottom:24, textAlign:'center' }}>Crea tu perfil y únete a eventos deportivos</p>
      <Link href="/auth" className="btn btn-primary" style={{ fontSize:15 }}>Entrar / Registrarse</Link>
    </div>
  )

  const displayName = form.full_name || profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
  const username    = form.username  || profile?.username  || user.email?.split('@')[0] || 'usuario'
  const karma       = profile?.karma || 5.0
  const allEvents   = actTab === 'creados' ? myCreated : myJoined

  return (
    <>
      <div className="page-wrap-full">

        {/* Hero */}
        <div style={{ background:'var(--grad)', borderRadius:'0 0 30px 30px', padding:'58px 22px 30px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>

          {/* Botón editar / guardar */}
          <button onClick={()=> editing ? saveProfile() : setEditing(true)} style={{
            position:'absolute', top:16, right:16,
            background:'rgba(255,255,255,0.20)', border:'1px solid rgba(255,255,255,0.32)',
            borderRadius:12, color:'white', fontSize:13, fontWeight:600,
            padding:'6px 14px', cursor:'pointer', fontFamily:'inherit',
          }}>
            {editing ? (saving ? 'Guardando...' : '✓ Guardar') : '✏️ Editar'}
          </button>
          {editing && (
            <button onClick={()=>setEditing(false)} style={{
              position:'absolute', top:16, left:16,
              background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)',
              borderRadius:12, color:'white', fontSize:13, fontWeight:600,
              padding:'6px 14px', cursor:'pointer', fontFamily:'inherit',
            }}>✕ Cancelar</button>
          )}

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>

            {/* Avatar */}
            <div className="avatar-wrap" style={{ cursor: editing ? 'pointer' : 'default' }}
              onClick={() => editing && fileRef.current?.click()}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,0.55)', boxShadow:'0 8px 32px rgba(0,0,0,0.22)' }}/>
                : <div className="avatar-placeholder" style={{ width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.22)', border:'3px solid rgba(255,255,255,0.55)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, boxShadow:'0 8px 32px rgba(0,0,0,0.22)' }}>👤</div>
              }
              {editing && (
                <div className="avatar-edit-btn">
                  {uploadingImg ? '⏳' : '📷'}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
            </div>

            {/* Nombre */}
            {editing ? (
              <div style={{ width:'100%', maxWidth:300, display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
                <input value={form.full_name} onChange={e=>set('full_name',e.target.value)}
                  placeholder="Tu nombre"
                  style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', fontSize:16, fontWeight:700, padding:'8px 14px', width:'100%', textAlign:'center', outline:'none', fontFamily:'inherit' }}/>
                <input value={form.username} onChange={e=>set('username',e.target.value)}
                  placeholder="nombre_usuario"
                  style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:10, color:'rgba(255,255,255,0.85)', fontSize:13, padding:'6px 12px', width:'100%', textAlign:'center', outline:'none', fontFamily:'inherit' }}/>
              </div>
            ) : (
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'white', fontWeight:800, fontSize:22, letterSpacing:'-0.04em' }}>{displayName}</div>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginTop:2 }}>@{username}</div>
              </div>
            )}

            {/* Bio */}
            {editing ? (
              <textarea value={form.bio} onChange={e=>set('bio',e.target.value)}
                placeholder="Cuéntanos algo sobre ti..."
                style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', fontSize:14, padding:'10px 14px', width:'100%', maxWidth:300, textAlign:'center', resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.5 }} rows={2}/>
            ) : (
              <div style={{ color:'rgba(255,255,255,0.88)', fontSize:14, textAlign:'center', maxWidth:280, lineHeight:1.5 }}>
                {profile?.bio || 'Sin bio aún'}
              </div>
            )}

            {/* Sports badges (modo vista) */}
            {!editing && (profile?.sports || []).length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {(profile.sports).map(s => {
                  const sp = ALL_SPORTS.find(a => a.id === s)
                  return sp ? (
                    <span key={s} style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:20, color:'white', fontSize:12, fontWeight:600, padding:'4px 12px' }}>
                      {sp.icon} {sp.label}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'20px 18px 0' }}>
          {[
            {label:'Karma',    value:karma.toFixed(1),        icon:'⭐', color:'#f59e0b'},
            {label:'Creados',  value:String(myCreated.length), icon:'📅', color:'#5b6ef5'},
            {label:'Apuntado', value:String(myJoined.length),  icon:'✓',  color:'#06d6a0'},
          ].map(s=>(
            <div key={s.label} className="card anim-1" style={{ textAlign:'center', padding:'16px 8px' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', padding:'8px 18px 0' }}>
          <span style={{ fontSize:11, color:'var(--muted)' }}>
            {user.email} · Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES',{month:'long',year:'numeric'})}
          </span>
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:'10px 0', borderRadius:12, border:'none', fontSize:13, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit',
                background: tab===t ? 'var(--grad)' : 'transparent',
                color: tab===t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab: Actividad */}
        {tab==='Actividad' && (
          <div style={{ padding:'16px 18px 0' }}>
            {/* Sub-tabs */}
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {['creados','apuntado'].map(t=>(
                <button key={t} onClick={()=>setActTab(t)}
                  className={`pill ${actTab===t?'pill-active':'pill-inactive'}`}>
                  {t==='creados' ? `📅 Mis eventos (${myCreated.length})` : `✓ Apuntado (${myJoined.length})`}
                </button>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {allEvents.length === 0 ? (
                <div className="card" style={{ padding:'32px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:40, marginBottom:10 }}>{actTab==='creados'?'📅':'🎯'}</div>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>
                    {actTab==='creados' ? 'Sin eventos creados' : 'No te has apuntado a ningún evento'}
                  </div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>
                    {actTab==='creados' ? 'Crea tu primer evento y comparte el deporte' : 'Explora eventos y únete a uno'}
                  </div>
                  <Link href={actTab==='creados'?'/create':'/events'} className="btn btn-primary" style={{ fontSize:13 }}>
                    {actTab==='creados' ? '+ Crear evento' : 'Explorar eventos'}
                  </Link>
                </div>
              ) : allEvents.map((ev, i) => {
                const c = SPORT_COLORS[ev?.sport] || '#5b6ef5'
                return ev ? (
                  <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${(i%6)+1}`}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderLeft:`3px solid ${c}` }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:2, textTransform:'capitalize' }}>
                        {ev.sport} · {new Date(ev.date+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}
                      </div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color: actTab==='creados'?'#5b6ef5':'#06d6a0', background: actTab==='creados'?'rgba(91,110,245,0.12)':'rgba(6,214,160,0.12)', borderRadius:8, padding:'3px 9px', flexShrink:0 }}>
                      {actTab==='creados' ? 'Creado' : 'Apuntado'}
                    </span>
                  </Link>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Tab: Deportes favoritos */}
        {tab==='Deportes' && (
          <div style={{ padding:'16px 18px 0' }}>
            {editing ? (
              <>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}>Selecciona los deportes que practicas</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ALL_SPORTS.map(s => {
                    const sel = form.sports.includes(s.id)
                    const c   = SPORT_COLORS[s.id] || '#5b6ef5'
                    return (
                      <button key={s.id} onClick={()=>toggleSport(s.id)} style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        padding:'8px 16px', borderRadius:100, fontSize:13, fontWeight:600,
                        cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s ease',
                        background: sel ? `linear-gradient(135deg,${c},${c}bb)` : 'var(--glass)',
                        backdropFilter:'blur(12px)',
                        border: sel ? 'none' : '1.5px solid var(--border)',
                        color: sel ? 'white' : 'var(--muted)',
                        boxShadow: sel ? `0 3px 14px ${c}44` : 'none',
                      }}>
                        {s.icon} {s.label}
                      </button>
                    )
                  })}
                </div>
                <button className="btn btn-primary" style={{ width:'100%', marginTop:20 }} onClick={saveProfile} disabled={saving}>
                  {saving ? 'Guardando...' : '✓ Guardar deportes'}
                </button>
              </>
            ) : (
              <div>
                {(profile?.sports || []).length === 0 ? (
                  <div className="card" style={{ padding:'32px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:40, marginBottom:10 }}>🏅</div>
                    <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>Sin deportes seleccionados</div>
                    <div style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>Añade tus deportes favoritos a tu perfil</div>
                    <button className="btn btn-primary" style={{ fontSize:13 }} onClick={()=>{ setEditing(true); setTab('Deportes') }}>
                      + Añadir deportes
                    </button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {(profile.sports).map(s => {
                      const sp = ALL_SPORTS.find(a=>a.id===s)
                      const c  = SPORT_COLORS[s] || '#5b6ef5'
                      return sp ? (
                        <div key={s} style={{ display:'flex', alignItems:'center', gap:8, background:`${c}14`, border:`1.5px solid ${c}30`, borderRadius:100, padding:'8px 16px' }}>
                          <span style={{ fontSize:18 }}>{sp.icon}</span>
                          <span style={{ fontSize:13, fontWeight:700, color:c }}>{sp.label}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Karma */}
        {tab==='Karma' && (
          <div style={{ padding:'16px 18px 0' }}>
            <div className="card anim-1" style={{ padding:'24px 20px', textAlign:'center' }}>
              <div style={{ fontSize:56, fontWeight:900, lineHeight:1, background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {karma.toFixed(1)}
              </div>
              <div style={{ color:'var(--muted)', fontSize:13, marginTop:4 }}>Tu karma en la comunidad</div>
              <div style={{ display:'flex', justifyContent:'center', gap:3, marginTop:12 }}>
                {[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:22, color:s<=Math.round(karma)?'#f59e0b':'var(--border)' }}>★</span>)}
              </div>
              <p style={{ fontSize:13, color:'var(--muted)', marginTop:14, lineHeight:1.6 }}>
                El karma refleja tu reputación en la comunidad. Se calcula a partir de las valoraciones que recibes de otros participantes después de cada evento.
              </p>
            </div>
          </div>
        )}

        {/* Cerrar sesión */}
        <div style={{ padding:'24px 18px 8px' }}>
          <button onClick={handleSignOut} className="btn btn-ghost" style={{ width:'100%', color:'#ef4444', borderColor:'rgba(239,68,68,0.25)' }}>
            Cerrar sesión
          </button>
        </div>

      </div>
      <Navbar />
    </>
  )
}
