'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

// Formas SVG orgánicas — blobs y círculos que se superponen
const BLOB_SHAPES = {
  // Ola en la esquina inferior
  wave: `<path d="M0 100 Q150 60 300 100 Q450 140 600 100 L600 160 L0 160Z" fill="rgba(255,255,255,0.12)"/>`,
  // Círculo grande descentrado
  circle: `<circle cx="480" cy="-20" r="140" fill="rgba(255,255,255,0.10)"/><circle cx="-40" cy="120" r="90" fill="rgba(255,255,255,0.07)"/>`,
  // Blob orgánico
  blob: `<path d="M520 20 Q580 80 540 140 Q500 200 420 160 Q340 120 380 60 Q420 0 520 20Z" fill="rgba(255,255,255,0.12)"/>`,
  // Ondas horizontales
  waves: `<path d="M0 80 Q100 50 200 80 Q300 110 400 80 Q500 50 600 80 L600 160 L0 160Z" fill="rgba(255,255,255,0.08)"/><path d="M0 100 Q100 70 200 100 Q300 130 400 100 Q500 70 600 100 L600 160 L0 160Z" fill="rgba(255,255,255,0.06)"/>`,
  // Diágonales
  diagonal: `<rect x="-20" y="-20" width="220" height="220" rx="40" transform="rotate(20 0 0) translate(300 -80)" fill="rgba(255,255,255,0.10)"/>`,
  // Puntos
  dots: `<circle cx="80" cy="30" r="40" fill="rgba(255,255,255,0.10)"/><circle cx="520" cy="130" r="60" fill="rgba(255,255,255,0.08)"/><circle cx="300" cy="80" r="25" fill="rgba(255,255,255,0.06)"/>`,
  // Arcos
  arcs: `<path d="M-40 120 A160 160 0 0 1 200 -40" stroke="rgba(255,255,255,0.18)" stroke-width="40" fill="none"/><path d="M400 200 A160 160 0 0 1 640 40" stroke="rgba(255,255,255,0.12)" stroke-width="30" fill="none"/>`,
}

const BANNERS = [
  { id:'grad-1',  bg:'#586875,#3f4f5a',    shape:'wave'     },
  { id:'grad-2',  bg:'#1a1a2e,#0f3460',    shape:'circle'   },
  { id:'grad-3',  bg:'#e96c1a,#f5a623',    shape:'blob'     },
  { id:'grad-4',  bg:'#00b09b,#96c93d',    shape:'waves'    },
  { id:'grad-5',  bg:'#8e44ad,#3498db',    shape:'diagonal' },
  { id:'grad-6',  bg:'#c0392b,#8e44ad',    shape:'dots'     },
  { id:'grad-7',  bg:'#c8a96e,#7a5230',    shape:'arcs'     },
  { id:'grad-8',  bg:'#2c3e50,#4ca1af',    shape:'wave'     },
  { id:'grad-9',  bg:'#11998e,#38ef7d',    shape:'circle'   },
  { id:'grad-10', bg:'#fc4a1a,#f7b733',    shape:'blob'     },
  { id:'grad-11', bg:'#373b44,#4286f4',    shape:'waves'    },
  { id:'grad-12', bg:'#ff6b6b,#feca57',    shape:'diagonal' },
  { id:'grad-13', bg:'#2d3436,#636e72',    shape:'dots'     },
  { id:'grad-14', bg:'#0093E9,#80D0C7',    shape:'arcs'     },
  { id:'grad-15', bg:'#667eea,#764ba2',    shape:'wave'     },
  { id:'grad-16', bg:'#f093fb,#f5576c',    shape:'circle'   },
  { id:'grad-17', bg:'#4facfe,#00f2fe',    shape:'blob'     },
  { id:'grad-18', bg:'#43e97b,#38f9d7',    shape:'waves'    },
  { id:'grad-19', bg:'#fa709a,#fee140',    shape:'diagonal' },
  { id:'grad-20', bg:'#30cfd0,#330867',    shape:'dots'     },
]

// Renderizar banner con gradiente + forma SVG orgánica
function BannerBg({ bannerId, bannerUrl, height = 160, children }) {
  const b = BANNERS.find(x => x.id === bannerId) || BANNERS[0]
  const [c1, c2] = b.bg.split(',')
  const svgContent = BLOB_SHAPES[b.shape] || ''
  const svgBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 160'%3E${encodeURIComponent(svgContent)}%3C/svg%3E")`
  return (
    <div style={{
      height, width:'100%', position:'relative', overflow:'hidden',
      background: bannerUrl ? `url(${bannerUrl}) center/cover` : `linear-gradient(135deg, ${c1}, ${c2})`,
    }}>
      {!bannerUrl && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage: svgBg,
          backgroundSize:'cover', backgroundPosition:'center',
        }}/>
      )}
      {children}
    </div>
  )
}

const NOTIF_ICONS = {
  joined:    '👥',
  message:   '💬',
  karma:     '⭐',
  event_new: '🎯',
}

const TABS = ['Actividad', 'Deportes', 'Karma', 'Notificaciones']

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'ahora mismo'
  if (m < 60)  return `hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24)  return `hace ${h} h`
  const d = Math.floor(h / 24)
  if (d < 7)   return `hace ${d} d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day:'numeric', month:'short' })
}

export default function Profile() {
  const router = useRouter()
  const { user, profile, setProfile, loading: authLoading } = useAuth()
  const fileRef   = useRef(null)
  const bannerRef = useRef(null)

  const [tab,          setTab]        = useState('Actividad')
  const [editing,      setEditing]    = useState(false)
  const [saving,       setSaving]     = useState(false)
  const [uploadingImg, setUpload]     = useState(false)
  const [uploadingBanner, setUploadBanner] = useState(false)
  const [myCreated,    setCreated]    = useState([])
  const [myJoined,     setJoined]     = useState([])
  const [actTab,       setActTab]     = useState('creados')
  const [avatarUrl,    setAvatarUrl]  = useState(null)
  const [banner,       setBanner]     = useState('grad-1')
  const [bannerUrl,    setBannerUrl]  = useState(null)
  const [skinTone,     setSkinTone]   = useState('default')

  // Notificaciones
  const [notifs,       setNotifs]     = useState([])
  const [notifsLoading, setNotifsLoading] = useState(false)
  const pollRef = useRef(null)

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
      setBanner(profile.banner_color || 'grad-1')
      setBannerUrl(profile.banner_url || null)
      setSkinTone(profile.skin_tone || 'default')
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

  // Cargar notificaciones
  const loadNotifs = useCallback(async () => {
    if (!user) return
    const sb = getSupabase()
    if (!sb) return
    setNotifsLoading(true)
    const { data } = await sb
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) setNotifs(data)
    setNotifsLoading(false)
  }, [user])

  // Polling cada 30s cuando la pestaña Notificaciones está activa
  useEffect(() => {
    if (tab === 'Notificaciones') {
      loadNotifs()
      pollRef.current = setInterval(loadNotifs, 30000)
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [tab, loadNotifs])

  const markAllRead = async () => {
    if (!user) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      const sb = getSupabase()
      if (sb) {
        await sb.from('notifications').update({ read: true }).eq('id', notif.id)
        setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
      }
    }
    if (notif.event_id) {
      router.push(`/events/${notif.event_id}`)
    }
  }

  const saveProfile = async () => {
    if (!user) return
    const sb = getSupabase()
    if (!sb) return
    setSaving(true)
    const { data, error } = await sb.from('profiles')
      .update({
        full_name:    form.full_name.trim(),
        username:     form.username.trim().toLowerCase().replace(/\s+/g, '_'),
        bio:          form.bio.trim(),
        sports:       form.sports,
        banner_color: banner,
        banner_url:   bannerUrl,
        skin_tone:    skinTone,
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

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const sb = getSupabase()
    if (!sb) return
    setUploadBanner(true)

    const path = `${user.id}/banner.jpg`
    const { error: upErr } = await sb.storage.from('banners').upload(path, file, { upsert: true })

    if (!upErr) {
      const { data: urlData } = sb.storage.from('banners').getPublicUrl(path)
      const url = urlData?.publicUrl
      if (url) {
        setBannerUrl(url)
      }
    }
    setUploadBanner(false)
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
  const unreadCount = notifs.filter(n => !n.read).length

  // bannerId actual
  const activeBannerId = banner || 'grad-1'

  return (
    <>
      <div className="page-wrap-full">

        {/* Banner + Avatar hero */}
        <div style={{ position:'relative', marginBottom:52 }}>

          {/* Banner con forma orgánica */}
          <BannerBg bannerId={activeBannerId} bannerUrl={bannerUrl} height={160}>
          <div style={{ borderRadius:'0 0 24px 24px', overflow:'hidden', position:'relative', height:'100%' }}>
            {/* Botón editar / guardar */}
            <button onClick={() => editing ? saveProfile() : setEditing(true)} style={{
              position:'absolute', top:14, right:14,
              background:'rgba(0,0,0,0.35)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.28)',
              borderRadius:12, color:'white', fontSize:13, fontWeight:600,
              padding:'6px 14px', cursor:'pointer', fontFamily:'inherit', zIndex:2,
            }}>
              {editing ? (saving ? 'Guardando...' : '✓ Guardar') : '✏️ Editar'}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} style={{
                position:'absolute', top:14, left:14,
                background:'rgba(0,0,0,0.30)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(255,255,255,0.22)',
                borderRadius:12, color:'white', fontSize:13, fontWeight:600,
                padding:'6px 14px', cursor:'pointer', fontFamily:'inherit', zIndex:2,
              }}>✕ Cancelar</button>
            )}

            {/* Sin selector aquí — va debajo del avatar */}
          </div>
          </BannerBg>

          {/* Avatar flotante */}
          <div style={{
            position:'absolute', bottom:0, left:'50%',
            transform:'translate(-50%, 50%)',
            zIndex:3,
          }}>
            <div className="avatar-wrap" style={{ cursor: editing ? 'pointer' : 'default' }}
              onClick={() => editing && fileRef.current?.click()}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" style={{ width:88, height:88, borderRadius:'50%', objectFit:'cover', border:'3px solid white', boxShadow:'0 6px 24px rgba(0,0,0,0.22)' }}/>
                : <div className="avatar-placeholder" style={{ width:88, height:88, borderRadius:'50%', background:'#c8c0b4', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, boxShadow:'0 6px 24px rgba(0,0,0,0.18)' }}>👤</div>
              }
              {editing && (
                <div className="avatar-edit-btn">
                  {uploadingImg ? '⏳' : '📷'}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
            </div>
          </div>
        </div>

        {/* Selector de banner — debajo del banner, en scroll horizontal, no solapa avatar */}
        {editing && (
          <div style={{ marginTop:52, padding:'0 18px 4px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'var(--muted)', textTransform:'uppercase', marginBottom:10 }}>Color de portada</div>
            <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:4 }}>
              {BANNERS.map(b => {
                const [c1,c2] = b.bg.split(',')
                return (
                <button key={b.id} onClick={() => { setBanner(b.id); setBannerUrl(null) }} style={{
                  width:36, height:36, borderRadius:10, flexShrink:0,
                  background: `linear-gradient(135deg,${c1},${c2})`,
                  border: banner === b.id && !bannerUrl ? '3px solid var(--primary)' : '2px solid var(--border)',
                  cursor:'pointer',
                  boxShadow: banner === b.id && !bannerUrl ? '0 0 0 2px rgba(88,104,117,0.35)' : 'none',
                  transition:'all 0.15s ease',
                  outline:'none',
                }}/>
                )
              })}
              {/* cierre del map */}
              {/* Subir foto propia */}
              <button onClick={() => bannerRef.current?.click()} style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background: bannerUrl ? 'var(--primary)' : 'var(--surface)',
                border: bannerUrl ? '3px solid var(--primary)' : '2px solid var(--border)',
                cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                color: bannerUrl ? 'white' : 'var(--muted)',
              }}>
                {uploadingBanner ? '⏳' : '🖼️'}
              </button>
              <input ref={bannerRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleBannerChange}/>
            </div>

            {/* Selector tono de piel */}
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'var(--muted)', textTransform:'uppercase', marginBottom:10 }}>Tono de piel</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {[
                  { id:'default',     color:'#FFCC22', label:'Amarillo'     },
                  { id:'light',       color:'#FDDBB4', label:'Muy claro'    },
                  { id:'medium-light',color:'#E8B88A', label:'Claro'        },
                  { id:'medium',      color:'#C68642', label:'Medio'        },
                  { id:'medium-dark', color:'#8D5524', label:'Oscuro medio' },
                  { id:'dark',        color:'#4A2912', label:'Oscuro'       },
                ].map(t => (
                  <button key={t.id} onClick={() => setSkinTone(t.id)}
                    title={t.label}
                    style={{
                      width:36, height:36, borderRadius:'50%', flexShrink:0,
                      background: t.color,
                      border: skinTone === t.id ? '3px solid var(--primary)' : '2px solid var(--border)',
                      cursor:'pointer',
                      boxShadow: skinTone === t.id ? '0 0 0 2px rgba(88,104,117,0.35)' : 'none',
                      transition:'all 0.15s ease',
                      position:'relative', overflow:'hidden',
                    }}>
                    {skinTone === t.id && (
                      <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:8 }}>
                Vista previa: <span style={{ fontSize:20 }}>{['running','natacion','ciclismo','yoga','gimnasio'].map(s => {
                  const PERSON = { running:'🏃', gimnasio:'💪', natacion:'🏊', ciclismo:'🚴', yoga:'🧘' }
                  const mods = { default:'', light:'\u{1F3FB}', 'medium-light':'\u{1F3FC}', medium:'\u{1F3FD}', 'medium-dark':'\u{1F3FE}', dark:'\u{1F3FF}' }
                  return PERSON[s] + (mods[skinTone] || '')
                }).join(' ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* SQL: la columna skin_tone se añade con el SQL de v10.5 */}

        {/* Nombre, username, bio */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 22px 4px' }}>
          {editing ? (
            <div style={{ width:'100%', maxWidth:300, display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
              <input value={form.full_name} onChange={e => set('full_name', e.target.value)}
                placeholder="Tu nombre"
                style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:12, color:'var(--text)', fontSize:16, fontWeight:700, padding:'8px 14px', width:'100%', textAlign:'center', outline:'none', fontFamily:'inherit' }}/>
              <input value={form.username} onChange={e => set('username', e.target.value)}
                placeholder="nombre_usuario"
                style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:10, color:'var(--muted)', fontSize:13, padding:'6px 12px', width:'100%', textAlign:'center', outline:'none', fontFamily:'inherit' }}/>
            </div>
          ) : (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontWeight:800, fontSize:22, letterSpacing:'-0.04em', color:'var(--text)' }}>{displayName}</div>
              <div style={{ color:'var(--muted)', fontSize:14, marginTop:2 }}>@{username}</div>
            </div>
          )}

          {editing ? (
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
              placeholder="Cuéntanos algo sobre ti..."
              style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:12, color:'var(--text)', fontSize:14, padding:'10px 14px', width:'100%', maxWidth:300, textAlign:'center', resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.5 }} rows={2}/>
          ) : (
            <div style={{ color:'var(--muted)', fontSize:14, textAlign:'center', maxWidth:280, lineHeight:1.5 }}>
              {profile?.bio || 'Sin bio aún'}
            </div>
          )}

          {/* Sports badges (modo vista) */}
          {!editing && (profile?.sports || []).length > 0 && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
              {(profile.sports).map(s => {
                const sp = ALL_SPORTS.find(a => a.id === s)
                return sp ? (
                  <span key={s} style={{ background:'rgba(88,104,117,0.12)', border:'1px solid rgba(88,104,117,0.22)', borderRadius:20, color:'#586875', fontSize:12, fontWeight:600, padding:'4px 12px' }}>
                    {sp.icon} {sp.label}
                  </span>
                ) : null
              })}
            </div>
          )}
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
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflowX:'auto' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1, padding:'10px 6px', borderRadius:12, border:'none', fontSize:12, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', position:'relative',
                background: tab === t ? 'var(--grad)' : 'transparent',
                color: tab === t ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
                minWidth: t === 'Notificaciones' ? 106 : 'auto',
              }}>
                {t}
                {t === 'Notificaciones' && unreadCount > 0 && (
                  <span style={{
                    position:'absolute', top:6, right:6,
                    width:8, height:8, borderRadius:'50%',
                    background:'#0ea5e9',
                    border:'1.5px solid white',
                  }}/>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Actividad */}
        {tab === 'Actividad' && (
          <div style={{ padding:'16px 18px 0' }}>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {['creados','apuntado'].map(t=>(
                <button key={t} onClick={() => setActTab(t)}
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
        {tab === 'Deportes' && (
          <div style={{ padding:'16px 18px 0' }}>
            {editing ? (
              <>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}>Selecciona los deportes que practicas</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ALL_SPORTS.map(s => {
                    const sel = form.sports.includes(s.id)
                    const c   = SPORT_COLORS[s.id] || '#5b6ef5'
                    return (
                      <button key={s.id} onClick={() => toggleSport(s.id)} style={{
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
                    <button className="btn btn-primary" style={{ fontSize:13 }} onClick={() => { setEditing(true); setTab('Deportes') }}>
                      + Añadir deportes
                    </button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {(profile.sports).map(s => {
                      const sp = ALL_SPORTS.find(a => a.id === s)
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
        {tab === 'Karma' && (
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

        {/* Tab: Notificaciones */}
        {tab === 'Notificaciones' && (
          <div style={{ padding:'16px 18px 0' }}>

            {/* Cabecera */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>
                Notificaciones
                {unreadCount > 0 && (
                  <span style={{ marginLeft:8, background:'#0ea5e9', color:'white', borderRadius:20, fontSize:11, fontWeight:700, padding:'2px 8px' }}>
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{
                  background:'none', border:'1px solid var(--border)', borderRadius:10,
                  color:'var(--muted)', fontSize:12, fontWeight:600, padding:'5px 12px',
                  cursor:'pointer', fontFamily:'inherit',
                }}>
                  Marcar todas leídas
                </button>
              )}
            </div>

            {/* Lista */}
            {notifsLoading && notifs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div className="spinner"/>
              </div>
            ) : notifs.length === 0 ? (
              <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                <div style={{ fontSize:44, marginBottom:12 }}>🔔</div>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>No tienes notificaciones aún 🔔</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Te avisaremos cuando haya novedades en tus eventos</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {notifs.map((notif, i) => {
                  const icon = NOTIF_ICONS[notif.type] || '🔔'
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      style={{
                        display:'flex', alignItems:'flex-start', gap:12,
                        padding:'14px 14px',
                        background: notif.read ? 'var(--surface)' : 'rgba(14,165,233,0.07)',
                        border: notif.read ? '1px solid var(--border)' : '1px solid rgba(14,165,233,0.22)',
                        borderRadius:16,
                        cursor: notif.event_id ? 'pointer' : 'default',
                        fontFamily:'inherit',
                        textAlign:'left',
                        width:'100%',
                        transition:'background 0.15s ease',
                        position:'relative',
                      }}
                    >
                      {/* Punto no leído */}
                      {!notif.read && (
                        <span style={{
                          position:'absolute', top:10, right:12,
                          width:8, height:8, borderRadius:'50%',
                          background:'#0ea5e9', flexShrink:0,
                        }}/>
                      )}

                      {/* Icono */}
                      <div style={{
                        width:38, height:38, borderRadius:12, flexShrink:0,
                        background: notif.read ? 'var(--glass)' : 'rgba(14,165,233,0.12)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:18, border:'1px solid var(--border)',
                      }}>
                        {icon}
                      </div>

                      {/* Contenido */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{
                          fontSize:13, fontWeight: notif.read ? 500 : 700,
                          color:'var(--text)', lineHeight:1.45,
                          overflow:'hidden', textOverflow:'ellipsis',
                          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                        }}>
                          {notif.message || notif.body || 'Nueva notificación'}
                        </div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>
                          {timeAgo(notif.created_at)}
                        </div>
                      </div>

                      {/* Flecha si tiene evento */}
                      {notif.event_id && (
                        <div style={{ color:'var(--muted)', fontSize:14, flexShrink:0, alignSelf:'center' }}>›</div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Cerrar sesión */}
        <div style={{ padding:'32px 18px 40px' }}>
          <button onClick={handleSignOut} className="btn btn-ghost" style={{ width:'100%', color:'#ef4444', borderColor:'rgba(239,68,68,0.25)' }}>
            Cerrar sesión
          </button>
        </div>

      </div>
      <Navbar />
    </>
  )
}
