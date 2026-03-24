'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const S_COLORS = {
  running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444',
  gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316',
  yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6',
}

const SPORT_LABELS = {
  running:'Running', padel:'Pádel', senderismo:'Senderismo', futbol:'Fútbol',
  gimnasio:'Gimnasio', tenis:'Tenis', natacion:'Natación', ciclismo:'Ciclismo',
  yoga:'Yoga', baloncesto:'Baloncesto', voleibol:'Voleibol', badminton:'Bádminton',
}

// Demo feed para cuando no hay BD
const DEMO_MOMENTS = [
  { id:'m1', author:'Carlos O.', username:'carlosO', avatar_url:null, sport:'running',    created_at: new Date(Date.now()-900000).toISOString(),   text:'Empezando el día con energía en la Alameda 🌅 Mejor compañía imposible, gracias a todos los que se animaron.', likes:12, liked:false, image_url:null },
  { id:'m2', author:'María G.', username:'mariaG',  avatar_url:null, sport:'padel',      created_at: new Date(Date.now()-3600000).toISOString(),  text:'Partido épico esta mañana. Ganamos en el tercer set 6-4, pero sobre todo disfrutamos mogollón 🎾', likes:24, liked:true, image_url:null },
  { id:'m3', author:'Javi M.',  username:'javiM',   avatar_url:null, sport:'senderismo', created_at: new Date(Date.now()-10800000).toISOString(), text:'Las vistas desde los 2.800m no tienen precio. Ruta completada con éxito 🥾✨', likes:41, liked:false, image_url:null },
  { id:'m4', author:'Laura S.', username:'lauraS',  avatar_url:null, sport:'gimnasio',   created_at: new Date(Date.now()-18000000).toISOString(), text:'Sesión de funcional increíble hoy. El coach nos destruyó pero de la mejor manera 💪🔥', likes:18, liked:false, image_url:null },
  { id:'m5', author:'Diego R.', username:'diegoR',  avatar_url:null, sport:'futbol',     created_at: new Date(Date.now()-86400000).toISOString(), text:'Derrota 3-5 pero qué partido más divertido. Metí dos goles y el equipo luchó hasta el final ⚽', likes:33, liked:true, image_url:null },
]

const FILTERS = [
  { id:'all', label:'Todos' },
  { id:'running', label:'Running' },
  { id:'padel', label:'Pádel' },
  { id:'senderismo', label:'Senderismo' },
  { id:'futbol', label:'Fútbol' },
  { id:'gimnasio', label:'Gimnasio' },
  { id:'natacion', label:'Natación' },
  { id:'ciclismo', label:'Ciclismo' },
  { id:'yoga', label:'Yoga' },
  { id:'baloncesto', label:'Baloncesto' },
  { id:'voleibol', label:'Voleibol' },
  { id:'badminton', label:'Bádminton' },
]

const SPORTS_SELECT = [
  { id:'running',    label:'Running 🏃' },
  { id:'padel',      label:'Pádel 🎾' },
  { id:'senderismo', label:'Senderismo 🥾' },
  { id:'futbol',     label:'Fútbol ⚽' },
  { id:'gimnasio',   label:'Gimnasio 💪' },
  { id:'tenis',      label:'Tenis 🎾' },
  { id:'natacion',   label:'Natación 🏊' },
  { id:'ciclismo',   label:'Ciclismo 🚴' },
  { id:'yoga',       label:'Yoga 🧘' },
  { id:'baloncesto', label:'Baloncesto 🏀' },
  { id:'voleibol',   label:'Voleibol 🏐' },
  { id:'badminton',  label:'Bádminton 🏸' },
]

function fmtTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60)   return 'Ahora mismo'
  if (diff < 3600) return `Hace ${Math.round(diff/60)} min`
  if (diff < 86400) return `Hace ${Math.round(diff/3600)} h`
  return d.toLocaleDateString('es-ES', { day:'numeric', month:'short' })
}

export default function Moments() {
  const { user, profile } = useAuth()
  const pollRef = useRef(null)

  const [filter,    setFilter]  = useState('all')
  const [moments,   setMoments] = useState([])
  const [liked,     setLiked]   = useState({})
  const [fromDB,    setFromDB]  = useState(false)
  const [loading,   setLoading] = useState(true)
  const [compose,   setCompose] = useState(false)
  const [posting,   setPosting] = useState(false)

  const [newPost, setNewPost] = useState({ text:'', sport:'running', image_url:'' })
  const setP = (k, v) => setNewPost(p => ({ ...p, [k]: v }))

  // ── Función de carga/refresco del feed ───────────────────
  const fetchMoments = useCallback(async (showSpinner = false) => {
    try {
      const sb = getSupabase()
      if (!sb) throw new Error('no sb')

      if (showSpinner) setLoading(true)

      const { data, error } = await sb
        .from('moments')
        .select('id, text, sport, image_url, created_at, user_id, profiles(full_name, username, avatar_url), moment_likes(count)')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data && data.length > 0) {
        setMoments(prev => {
          // Mantener estado de likes locales para IDs que ya existen
          return data.map(m => {
            const existing = prev.find(p => p.id === m.id)
            return {
              id:         m.id,
              author:     m.profiles?.full_name || 'Usuario',
              username:   m.profiles?.username  || 'usuario',
              avatar_url: m.profiles?.avatar_url || null,
              sport:      m.sport,
              text:       m.text,
              image_url:  m.image_url,
              created_at: m.created_at,
              likes:      m.moment_likes?.[0]?.count || 0,
              liked:      existing?.liked ?? false,
              user_id:    m.user_id,
            }
          })
        })
        setFromDB(true)
        if (showSpinner) setLoading(false)
        return
      }
    } catch(_) {}

    // Fallback demo (solo la primera vez)
    if (showSpinner) {
      setMoments(DEMO_MOMENTS)
      setFromDB(false)
      setLoading(false)
    }
  }, [])

  // ── Primera carga + polling cada 15 segundos ─────────────
  useEffect(() => {
    fetchMoments(true)

    pollRef.current = setInterval(() => {
      fetchMoments(false)
    }, 15000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchMoments])

  // ── Like ─────────────────────────────────────────────────
  const toggleLike = async (momentId) => {
    const isCurrentlyLiked = liked[momentId] !== undefined ? liked[momentId] : moments.find(m=>m.id===momentId)?.liked
    setLiked(p => ({ ...p, [momentId]: !isCurrentlyLiked }))

    if (!fromDB || !user) return
    try {
      const sb = getSupabase()
      if (!sb) return
      if (isCurrentlyLiked) {
        await sb.from('moment_likes').delete().eq('moment_id', momentId).eq('user_id', user.id)
      } else {
        await sb.from('moment_likes').insert({ moment_id: momentId, user_id: user.id })
      }
    } catch(_) {}
  }

  // ── Publicar momento ─────────────────────────────────────
  const publish = async () => {
    if (!newPost.text.trim() || !user) return
    setPosting(true)
    try {
      const sb = getSupabase()
      if (sb && fromDB) {
        const { data, error } = await sb.from('moments').insert({
          user_id:   user.id,
          text:      newPost.text.trim(),
          sport:     newPost.sport,
          image_url: newPost.image_url || null,
        }).select('id, text, sport, image_url, created_at, user_id').single()

        if (!error && data) {
          const optimistic = {
            id:         data.id,
            author:     profile?.full_name || user.email?.split('@')[0] || 'Tú',
            username:   profile?.username  || 'tú',
            avatar_url: profile?.avatar_url || null,
            sport:      data.sport,
            text:       data.text,
            image_url:  data.image_url,
            created_at: data.created_at,
            likes:      0,
            liked:      false,
            user_id:    user.id,
          }
          setMoments(p => [optimistic, ...p])
          // Refrescar el feed tras publicar para obtener datos reales
          setTimeout(() => fetchMoments(false), 1000)
        }
      } else {
        // Sin BD — optimistic al demo
        const optimistic = {
          id:         'local-' + Date.now(),
          author:     profile?.full_name || user.email?.split('@')[0] || 'Tú',
          username:   profile?.username  || 'tú',
          avatar_url: profile?.avatar_url || null,
          sport:      newPost.sport,
          text:       newPost.text.trim(),
          image_url:  null,
          created_at: new Date().toISOString(),
          likes:      0,
          liked:      false,
          user_id:    user.id,
        }
        setMoments(p => [optimistic, ...p])
      }
    } catch(_) {}
    setNewPost({ text:'', sport:'running', image_url:'' })
    setCompose(false)
    setPosting(false)
  }

  const feed = filter === 'all' ? moments : moments.filter(m => m.sport === filter)

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        {/* Header */}
        <header style={{ paddingTop:60, paddingBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.04em' }}>Momentos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Lo mejor de hoy en la comunidad</p>
          </div>
          {user && (
            <button onClick={()=>setCompose(!compose)} className="btn btn-primary" style={{ padding:'10px 16px', fontSize:13 }}>
              + Publicar
            </button>
          )}
        </header>

        {/* Composer */}
        {compose && user && (
          <div className="card anim-1" style={{ padding:'16px', marginBottom:16 }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                <textarea
                  value={newPost.text}
                  onChange={e=>setP('text',e.target.value)}
                  placeholder="¿Qué tal fue el entreno de hoy? Cuéntaselo a la comunidad..."
                  className="input"
                  style={{ resize:'none', minHeight:80, fontSize:14, lineHeight:1.5 }}
                  autoFocus
                />
                <select className="input" value={newPost.sport} onChange={e=>setP('sport',e.target.value)} style={{ fontSize:13 }}>
                  {SPORTS_SELECT.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button className="btn btn-ghost" style={{ fontSize:13, padding:'8px 14px' }} onClick={()=>setCompose(false)}>Cancelar</button>
                  <button className="btn btn-primary" style={{ fontSize:13, padding:'8px 16px' }} onClick={publish} disabled={!newPost.text.trim()||posting}>
                    {posting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA login si no hay sesión */}
        {!user && (
          <div className="card anim-1" style={{ padding:'16px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:32 }}>✍️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:3 }}>Comparte tu momento</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Inicia sesión para publicar en el feed</div>
            </div>
            <a href="/auth" className="btn btn-primary" style={{ fontSize:13, padding:'9px 16px', flexShrink:0 }}>Entrar</a>
          </div>
        )}

        {/* Filtros */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:14 }}>
          {FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} className={`pill ${filter===f.id?'pill-active':'pill-inactive'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding:'40px 0', textAlign:'center' }}>
            <div className="spinner"/>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:12 }}>Cargando momentos...</p>
          </div>
        )}

        {/* Feed */}
        {!loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {feed.length === 0 ? (
              <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                <div style={{ fontSize:44, marginBottom:12 }}>🏅</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Sin momentos aún</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Sé el primero en publicar algo</div>
              </div>
            ) : feed.map((m, i) => {
              const isLiked   = liked[m.id] !== undefined ? liked[m.id] : m.liked
              const likeCount = m.likes + (liked[m.id] !== undefined ? (liked[m.id]?1:0)-(m.liked?1:0) : 0)
              const c         = S_COLORS[m.sport] || '#5b6ef5'
              const sportLabel = SPORT_LABELS[m.sport] || m.sport

              return (
                <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:0, overflow:'hidden' }}>
                  <div style={{ height:3, background:`linear-gradient(90deg,${c},${c}66)` }}/>

                  <div style={{ padding:'14px 16px' }}>
                    {/* Autor */}
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', overflow:'hidden', background:`${c}20`, border:`2px solid ${c}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                        {m.avatar_url ? <img src={m.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{m.author}</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>@{m.username} · {fmtTime(m.created_at)}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:c, background:`${c}18`, borderRadius:100, padding:'3px 10px', flexShrink:0 }}>
                        {sportLabel}
                      </span>
                    </div>

                    {/* Texto */}
                    <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:'0 0 12px' }}>{m.text}</p>

                    {/* Imagen */}
                    {m.image_url && (
                      <img src={m.image_url} alt="" style={{ width:'100%', borderRadius:12, marginBottom:12, objectFit:'cover', maxHeight:260 }}/>
                    )}
                  </div>

                  {/* Acciones */}
                  <div style={{ display:'flex', alignItems:'center', padding:'10px 16px 14px', borderTop:'1px solid var(--border)', gap:20 }}>
                    <button onClick={()=>toggleLike(m.id)} style={{
                      background:'none', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:5,
                      color: isLiked ? '#ef4444' : 'var(--muted)',
                      fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit',
                      transition:'all 0.15s ease',
                      transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize:17 }}>{isLiked?'❤️':'🤍'}</span> {likeCount}
                    </button>

                    <button
                      onClick={()=>{ if(navigator.share){ navigator.share({ title:'TeamUp', text:m.text, url: window.location.origin }) } }}
                      style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:15 }}>↗</span> Compartir
                    </button>
                  </div>
                </div>
              )
            })}

            {!loading && feed.length > 0 && (
              <div style={{ textAlign:'center', padding:'10px 0' }}>
                <span style={{ fontSize:12, color:'var(--muted)' }}>Has llegado al final del feed ✨</span>
              </div>
            )}
          </div>
        )}

      </div>
      <Navbar />
    </>
  )
}
