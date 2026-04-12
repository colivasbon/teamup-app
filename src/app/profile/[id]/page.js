'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const S_COLORS = { running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444', gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316', yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6' }
const S_ICONS  = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴', yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸' }
const S_LABELS = { running:'Running', padel:'Pádel', senderismo:'Senderismo', futbol:'Fútbol', gimnasio:'Gimnasio', tenis:'Tenis', natacion:'Natación', ciclismo:'Ciclismo', yoga:'Yoga', baloncesto:'Baloncesto', voleibol:'Voleibol', badminton:'Bádminton' }

function fmt(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const tom = new Date(today); tom.setDate(tom.getDate()+1)
  if (d.getTime() === today.getTime()) return 'Hoy'
  if (d.getTime() === tom.getTime())   return 'Mañana'
  return d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short' })
}

export default function PublicProfile() {
  const { id }     = useParams()
  const router     = useRouter()
  const { user }   = useAuth()

  // Aplicar el tema guardado (igual que ThemeButton)
  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const [profile,  setProfile]  = useState(null)
  const [events,   setEvents]   = useState([])
  const [moments,  setMoments]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('eventos')
  const [notFound, setNotFound] = useState(false)

  const isOwnProfile = user?.id === id

  useEffect(() => {
    if (!id) return
    // Si es el propio perfil, redirigir a /profile
    if (isOwnProfile) { router.replace('/profile'); return }

    const load = async () => {
      setLoading(true)
      const sb = getSupabase()
      if (!sb) { setLoading(false); return }

      // Perfil del usuario
      const { data: pData, error: pErr } = await sb
        .from('profiles')
        .select('id, full_name, username, bio, avatar_url, sports, karma, created_at')
        .eq('id', id)
        .single()

      if (pErr || !pData) { setNotFound(true); setLoading(false); return }
      setProfile(pData)

      // Eventos creados por este usuario
      const { data: evData } = await sb
        .from('events_with_counts')
        .select('id, title, sport, date, time, location, max_players, participant_count, price')
        .eq('creator_id', id)
        .order('date', { ascending: true })
        .limit(10)
      setEvents(evData || [])

      // Momentos del usuario
      const { data: mData } = await sb
        .from('moments')
        .select('id, text, sport, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(6)
      setMoments(mData || [])

      setLoading(false)
    }
    load()
  }, [id, isOwnProfile, router])

  if (loading) return (
    <div className="app-shell" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div className="spinner"/>
    </div>
  )

  if (notFound) return (
    <div className="app-shell" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', gap:16, padding:'0 24px' }}>
      <div style={{ fontSize:52 }}>🔍</div>
      <div style={{ fontWeight:700, fontSize:18, textAlign:'center' }}>Perfil no encontrado</div>
      <div style={{ fontSize:14, color:'var(--muted)', textAlign:'center' }}>Este usuario no existe o ha sido eliminado</div>
      <button className="btn btn-primary" onClick={()=>router.back()}>← Volver</button>
    </div>
  )

  const sports = Array.isArray(profile?.sports) ? profile.sports : []
  const joinYear = profile?.created_at ? new Date(profile.created_at).getFullYear() : null

  return (
    <>
      <div className="page-wrap-full">

        {/* Header con botón back */}
        <div style={{ position:'relative', padding:'58px 20px 0' }}>
          <button onClick={()=>router.back()} style={{
            position:'absolute', top:16, left:16,
            background:'var(--glass)', border:'1px solid var(--border)',
            borderRadius:12, color:'var(--text)', width:38, height:38,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, cursor:'pointer', backdropFilter:'blur(14px)',
          }}>←</button>
        </div>

        {/* Perfil */}
        <div style={{ padding:'16px 20px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
          {/* Avatar */}
          <div style={{
            width:86, height:86, borderRadius:'50%', overflow:'hidden',
            background:'var(--grad)', border:'3px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:36, marginBottom:14, boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : '👤'
            }
          </div>

          <h1 style={{ fontSize:22, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.03em' }}>
            {profile.full_name || 'Usuario'}
          </h1>
          {profile.username && (
            <div style={{ fontSize:14, color:'var(--muted)', marginBottom:10 }}>@{profile.username}</div>
          )}

          {/* Karma */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.3)',
            borderRadius:100, padding:'5px 14px', marginBottom:14,
          }}>
            <span style={{ fontSize:15 }}>⭐</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#f59e0b' }}>{profile.karma || 0} karma</span>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.6, maxWidth:320, margin:'0 0 16px' }}>
              {profile.bio}
            </p>
          )}

          {/* Info secundaria */}
          <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--muted)', marginBottom:16 }}>
            {joinYear && <span>📅 Desde {joinYear}</span>}
            <span>🎯 {events.length} evento{events.length!==1?'s':''} creado{events.length!==1?'s':''}</span>
          </div>

          {/* Deportes favoritos */}
          {sports.length > 0 && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
              {sports.map(s => {
                const c = S_COLORS[s] || '#5b6ef5'
                return (
                  <span key={s} style={{
                    background:`${c}18`, border:`1px solid ${c}30`,
                    color:c, borderRadius:100, padding:'4px 12px',
                    fontSize:12, fontWeight:700,
                  }}>
                    {S_ICONS[s]} {S_LABELS[s] || s}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ padding:'0 18px 16px' }}>
          <div style={{ display:'flex', gap:4, padding:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
            {[['eventos','Eventos'],['momentos','Momentos']].map(([key, label]) => (
              <button key={key} onClick={()=>setTab(key)} style={{
                flex:1, padding:'10px 0', borderRadius:12, border:'none',
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                background: tab===key ? 'var(--primary)' : 'transparent',
                color: tab===key ? 'white' : 'var(--muted)',
                transition:'all 0.18s ease',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Eventos ── */}
        {tab === 'eventos' && (
          <div style={{ padding:'0 18px', display:'flex', flexDirection:'column', gap:10 }}>
            {events.length === 0 ? (
              <div className="card" style={{ padding:'32px 20px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📅</div>
                <div style={{ fontSize:14, color:'var(--muted)' }}>Este usuario no ha creado eventos aún</div>
              </div>
            ) : events.map((ev, i) => {
              const c = S_COLORS[ev.sport] || '#5b6ef5'
              const pct = ev.max_players > 0 ? Math.round(((ev.participant_count||0)/ev.max_players)*100) : 0
              return (
                <a key={ev.id} href={`/events/${ev.id}`} className={`card anim-${(i%6)+1}`}
                  style={{ display:'flex', gap:12, padding:'14px 16px', alignItems:'center', textDecoration:'none', borderLeft:`3px solid ${c}` }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    {S_ICONS[ev.sport] || '🎯'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{ev.title}</div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {fmt(ev.date)} · {ev.time?.slice(0,5)} · {ev.location}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1 }}><div className="pbar"><div className="pbar-fill" style={{ width:`${pct}%`, background:c }}/></div></div>
                      <span style={{ fontSize:11, fontWeight:700, color:c, whiteSpace:'nowrap' }}>{ev.participant_count||0}/{ev.max_players}</span>
                    </div>
                  </div>
                  <span style={{ fontSize:16, color:'var(--muted)', flexShrink:0 }}>›</span>
                </a>
              )
            })}
          </div>
        )}

        {/* ── Tab: Momentos ── */}
        {tab === 'momentos' && (
          <div style={{ padding:'0 18px', display:'flex', flexDirection:'column', gap:10 }}>
            {moments.length === 0 ? (
              <div className="card" style={{ padding:'32px 20px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📸</div>
                <div style={{ fontSize:14, color:'var(--muted)' }}>Este usuario no ha publicado momentos aún</div>
              </div>
            ) : moments.map((m, i) => {
              const c = S_COLORS[m.sport] || '#5b6ef5'
              return (
                <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:c, background:`${c}18`, borderRadius:100, padding:'3px 10px' }}>
                      {S_ICONS[m.sport]} {S_LABELS[m.sport] || m.sport}
                    </span>
                    <span style={{ fontSize:11, color:'var(--muted)', marginLeft:'auto' }}>
                      {new Date(m.created_at).toLocaleDateString('es-ES', { day:'numeric', month:'short' })}
                    </span>
                  </div>
                  <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:0 }}>{m.text}</p>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ height:90 }}/>
      </div>
      <Navbar />
    </>
  )
}
