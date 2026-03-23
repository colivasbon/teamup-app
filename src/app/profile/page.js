'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const TABS = ['Actividad','Karma']

export default function Profile() {
  const router          = useRouter()
  const { user, profile, setProfile } = useAuth()

  const [tab,     setTab]    = useState('Actividad')
  const [editBio, setEdit]   = useState(false)
  const [bioInput, setBioI]  = useState('')
  const [saving,  setSaving] = useState(false)
  const [myEvents, setMyEv]  = useState([])

  useEffect(() => {
    if (profile) setBioI(profile.bio || '')
  }, [profile])

  useEffect(() => {
    if (!user) return
    // Cargar eventos del usuario
    supabase.from('events').select('*').eq('creator_id', user.id).order('date', { ascending:false }).limit(10)
      .then(({data}) => { if (data) setMyEv(data) })
  }, [user])

  const saveBio = async () => {
    if (!user) return
    setSaving(true)
    const {data} = await supabase.from('profiles').update({bio: bioInput}).eq('id', user.id).select().single()
    if (data) setProfile(data)
    setSaving(false)
    setEdit(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  // Si no hay sesión, redirigir a auth
  if (!user) {
    return (
      <div className="app-shell" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', padding:'24px' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>👤</div>
        <h2 style={{ fontWeight:800, fontSize:22, marginBottom:8, letterSpacing:'-0.03em' }}>Inicia sesión</h2>
        <p style={{ fontSize:14, color:'var(--muted)', marginBottom:24, textAlign:'center' }}>Crea tu perfil y únete a eventos deportivos</p>
        <Link href="/auth" className="btn btn-primary" style={{ fontSize:15 }}>Entrar / Registrarse</Link>
      </div>
    )
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
  const username    = profile?.username  || user.email?.split('@')[0] || 'usuario'
  const bio         = profile?.bio       || 'Apasionado del deporte'
  const sports      = profile?.sports    || []
  const karma       = profile?.karma     || 5.0

  return (
    <>
      <div className="page-wrap-full">

        {/* Hero */}
        <div style={{ background:'var(--grad)', borderRadius:'0 0 30px 30px', padding:'58px 22px 30px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
          <button onClick={()=>{if(editBio)saveBio();else setEdit(true)}} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.20)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', fontSize:13, fontWeight:600, padding:'6px 14px', cursor:'pointer', fontFamily:'inherit' }}>
            {editBio ? (saving?'Guardando...':'Guardar') : 'Editar'}
          </button>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.22)', border:'3px solid rgba(255,255,255,0.55)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, boxShadow:'0 8px 32px rgba(0,0,0,0.22)' }}>
              {user.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="" style={{ width:84, height:84, borderRadius:'50%', objectFit:'cover' }}/>
                : '👤'}
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ color:'white', fontWeight:800, fontSize:22, letterSpacing:'-0.04em' }}>{displayName}</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginTop:2 }}>@{username}</div>
            </div>

            {editBio ? (
              <textarea value={bioInput} onChange={e=>setBioI(e.target.value)} style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, color:'white', fontSize:14, padding:'10px 14px', width:'100%', maxWidth:300, textAlign:'center', resize:'none', outline:'none', fontFamily:'inherit' }} rows={2}/>
            ) : (
              <div style={{ color:'rgba(255,255,255,0.88)', fontSize:14, textAlign:'center', maxWidth:280, lineHeight:1.5 }}>{bio}</div>
            )}

            {sports.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {sports.map(s=>(
                  <span key={s} style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:20, color:'white', fontSize:12, fontWeight:600, padding:'4px 12px' }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'20px 18px 0' }}>
          {[
            {label:'Karma',   value:karma.toFixed(1), icon:'⭐', color:'#f59e0b'},
            {label:'Creados', value:String(myEvents.length), icon:'📅', color:'#5b6ef5'},
            {label:'Email',   value:'✓', icon:'📧', color:'#06d6a0'},
          ].map(s=>(
            <div key={s.label} className="card anim-1" style={{ textAlign:'center', padding:'16px 8px' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', padding:'10px 18px 0' }}>
          <span style={{ fontSize:12, color:'var(--muted)' }}>
            {user.email} · Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES',{month:'long',year:'numeric'})}
          </span>
        </div>

        {/* Tabs */}
        <div style={{ padding:'20px 18px 0' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px 0', borderRadius:12, border:'none', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', background:tab===t?'var(--grad)':'transparent', color:tab===t?'white':'var(--muted)', transition:'all 0.18s ease' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab: Actividad */}
        {tab==='Actividad' && (
          <div style={{ padding:'16px 18px 0', display:'flex', flexDirection:'column', gap:10 }}>
            {myEvents.length===0 ? (
              <div className="card" style={{ padding:'32px 24px', textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📅</div>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>Sin eventos aún</div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:16 }}>Crea tu primer evento y comparte el deporte</div>
                <Link href="/create" className="btn btn-primary" style={{ fontSize:13 }}>+ Crear evento</Link>
              </div>
            ) : myEvents.map((ev, i) => (
              <Link key={ev.id} href={`/events/${ev.id}`} className={`card anim-${(i%6)+1}`} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderLeft:`3px solid ${{'running':'#5b6ef5','padel':'#06d6a0','senderismo':'#f59e0b','futbol':'#ef4444','gimnasio':'#8b5cf6'}[ev.sport]||'#5b6ef5'}` }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2, textTransform:'capitalize' }}>{ev.sport} · {new Date(ev.date+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:'#06d6a0', background:'rgba(6,214,160,0.12)', borderRadius:8, padding:'3px 9px', flexShrink:0 }}>Creado</span>
              </Link>
            ))}
          </div>
        )}

        {/* Tab: Karma */}
        {tab==='Karma' && (
          <div style={{ padding:'16px 18px 0' }}>
            <div className="card anim-1" style={{ padding:'24px 20px', textAlign:'center' }}>
              <div style={{ fontSize:56, fontWeight:900, lineHeight:1, background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{karma.toFixed(1)}</div>
              <div style={{ color:'var(--muted)', fontSize:13, marginTop:4 }}>Karma inicial · Se actualiza con valoraciones</div>
              <div style={{ display:'flex', justifyContent:'center', gap:3, marginTop:12 }}>
                {[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:22, color:s<=Math.round(karma)?'#f59e0b':'var(--border)' }}>★</span>)}
              </div>
              <p style={{ fontSize:13, color:'var(--muted)', marginTop:14, lineHeight:1.6 }}>
                El karma refleja tu reputación en la comunidad. Se calcula con las valoraciones de los participantes de tus eventos.
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
