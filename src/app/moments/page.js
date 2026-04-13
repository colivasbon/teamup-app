'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ThemeButton from '@/components/ThemeButton'

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
const PROVINCE_LABELS = {
  madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia', sevilla:'Sevilla',
  cordoba:'Córdoba', granada:'Granada', malaga:'Málaga', alicante:'Alicante',
  murcia:'Murcia', zaragoza:'Zaragoza', bilbao:'País Vasco', cadiz:'Cádiz',
  huelva:'Huelva', jaen:'Jaén', almeria:'Almería',
}

const DEMO_MOMENTS = [
  { id:'m1', author:'Carlos O.', username:'carlosO', user_id:'u1', avatar_url:null, sport:'running', province:'cordoba', event_title:'Running Matutino', event_id:'demo-1', created_at: new Date(Date.now()-900000).toISOString(), text:'Empezando el día con energía en la Alameda 🌅 Mejor compañía imposible.', likes:12, liked:false, image_url:null },
  { id:'m2', author:'María G.',  username:'mariaG',  user_id:'u2', avatar_url:null, sport:'padel',   province:'madrid',  event_title:'Torneo Pádel Nivel Medio', event_id:'demo-2', created_at: new Date(Date.now()-3600000).toISOString(), text:'Partido épico esta mañana. Ganamos en el tercer set 6-4 🎾', likes:24, liked:true, image_url:null },
  { id:'m3', author:'Javi M.',   username:'javiM',   user_id:'u3', avatar_url:null, sport:'senderismo', province:'madrid', event_title:'Senderismo Sierra Norte', event_id:'demo-3', created_at: new Date(Date.now()-10800000).toISOString(), text:'Las vistas desde los 2.800m no tienen precio 🥾✨', likes:41, liked:false, image_url:null },
]

const SPORT_FILTERS = [
  { id:'all', label:'Todos' }, { id:'running', label:'Running' }, { id:'padel', label:'Pádel' },
  { id:'senderismo', label:'Senderismo' }, { id:'futbol', label:'Fútbol' }, { id:'gimnasio', label:'Gimnasio' },
  { id:'natacion', label:'Natación' }, { id:'ciclismo', label:'Ciclismo' },
  { id:'yoga', label:'Yoga' }, { id:'baloncesto', label:'Baloncesto' },
]

function fmtTime(iso) {
  const d = new Date(iso); const now = new Date(); const diff = (now - d) / 1000
  if (diff < 60)    return 'Ahora mismo'
  if (diff < 3600)  return `Hace ${Math.round(diff/60)} min`
  if (diff < 86400) return `Hace ${Math.round(diff/3600)} h`
  return d.toLocaleDateString('es-ES', { day:'numeric', month:'short' })
}

export default function Moments() {
  const { user, profile } = useAuth()
  const pollRef = useRef(null)

  const [sportFilter, setSportFilter] = useState('all')
  const [localFilter, setLocalFilter] = useState('all')
  const [moments,     setMoments]     = useState([])
  const [liked,       setLiked]       = useState({})
  const [likeCounts,  setLikeCounts]  = useState({})
  const [fromDB,      setFromDB]      = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [myProvince,  setMyProvince]  = useState(null)

  // Likers modal
  const [likersModal, setLikersModal] = useState(null)
  const [likers,      setLikers]      = useState([])

  // Comments
  const [openComments, setOpenComments] = useState({})
  const [comments,      setComments]      = useState({})
  const [commentCounts, setCommentCounts] = useState({}) // conteo desde BD sin cargar el detalle
  const [commentText,   setCommentText]   = useState({})

  // Detectar provincia del perfil
  useEffect(() => {
    if (profile?.location) {
      const loc = profile.location.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      const found = Object.keys(PROVINCE_LABELS).find(k => loc.includes(k))
      if (found) { setMyProvince(found); setLocalFilter(found) }
    }
  }, [profile])

  // ── Fetch ────────────────────────────────────────────────
  const fetchMoments = useCallback(async (showSpinner = false) => {
    try {
      const sb = getSupabase(); if (!sb) throw new Error('no client')
      if (showSpinner) setLoading(true)

      // Momentos sin join para evitar bloqueos RLS
      const { data: mData, error } = await sb
        .from('moments')
        .select('id, text, sport, image_url, created_at, user_id, province, event_id')
        .order('created_at', { ascending: false })
        .limit(50)

      // Error real de BD → caer al demo
      if (error) throw new Error('db error')
      // Tabla válida pero sin momentos aún → mostrar estado vacío real, no demo
      if (!mData || mData.length === 0) {
        setMoments([]); setFromDB(true)
        if (showSpinner) setLoading(false)
        return
      }

      // Perfiles aparte
      const uids = [...new Set(mData.map(m => m.user_id))]
      let pMap = {}
      if (uids.length > 0) {
        const { data: pData } = await sb.from('profiles').select('id, full_name, username, avatar_url').in('id', uids)
        if (pData) pData.forEach(p => { pMap[p.id] = p })
      }

      // Títulos de eventos aparte
      const eids = [...new Set(mData.map(m => m.event_id).filter(Boolean))]
      let eMap = {}
      if (eids.length > 0) {
        const { data: eData } = await sb.from('events').select('id, title').in('id', eids)
        if (eData) eData.forEach(e => { eMap[e.id] = e.title })
      }

      // Likes aparte
      const mids = mData.map(m => m.id)
      const { data: lData } = await sb.from('moment_likes').select('moment_id, user_id').in('moment_id', mids)
      const counts = {}; const myL = {}
      for (const l of (lData || [])) {
        counts[l.moment_id] = (counts[l.moment_id] || 0) + 1
        if (l.user_id === user?.id) myL[l.moment_id] = true
      }

      // Conteo de comentarios aparte — para mostrar el número aunque no se hayan cargado
      const { data: cData } = await sb.from('moment_comments').select('moment_id').in('moment_id', mids)
      const cCounts = {}
      for (const c of (cData || [])) {
        cCounts[c.moment_id] = (cCounts[c.moment_id] || 0) + 1
      }
      setCommentCounts(cCounts)

      setMoments(mData.map(m => ({
        id: m.id, user_id: m.user_id,
        author:      pMap[m.user_id]?.full_name  || 'Usuario',
        username:    pMap[m.user_id]?.username   || 'usuario',
        avatar_url:  pMap[m.user_id]?.avatar_url || null,
        sport: m.sport, province: m.province,
        event_id: m.event_id,
        event_title: m.event_id ? (eMap[m.event_id] || 'Evento') : null,
        text: m.text, image_url: m.image_url, created_at: m.created_at,
      })))
      setLikeCounts(counts)
      if (user) setLiked(prev => ({ ...myL, ...prev }))
      setFromDB(true)
      if (showSpinner) setLoading(false)
      return
    } catch(_) {}

    if (showSpinner) {
      const counts = {}; const lk = {}
      DEMO_MOMENTS.forEach(m => { counts[m.id] = m.likes; lk[m.id] = m.liked })
      setMoments(DEMO_MOMENTS); setLikeCounts(counts); setLiked(lk)
      setFromDB(false); setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchMoments(true)
    pollRef.current = setInterval(async () => {
      await fetchMoments(false)
      // Recargar comentarios de los momentos que estén abiertos
      setOpenComments(prev => {
        Object.keys(prev).forEach(mid => {
          if (prev[mid]) loadComments(mid)
        })
        return prev
      })
    }, 15000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchMoments])

  // ── Likers ───────────────────────────────────────────────
  const loadLikers = async (momentId) => {
    const sb = getSupabase(); if (!sb) return
    const { data } = await sb.from('moment_likes')
      .select('user_id, profiles(full_name, username, avatar_url)')
      .eq('moment_id', momentId)
      .limit(50)
    setLikers(data?.map(d => d.profiles).filter(Boolean) || [])
    setLikersModal(momentId)
  }

  // ── Comments ─────────────────────────────────────────────
  const loadComments = async (momentId) => {
    const sb = getSupabase(); if (!sb) return
    const { data } = await sb.from('moment_comments')
      .select('id, text, created_at, user_id, profiles(full_name, username, avatar_url)')
      .eq('moment_id', momentId)
      .order('created_at', {ascending:true})
      .limit(20)
    if (data) setComments(p => ({...p, [momentId]: data.map(c => ({
      id: c.id,
      text: c.text,
      created_at: c.created_at,
      author: c.profiles?.full_name || 'Usuario',
      username: c.profiles?.username,
      avatar: c.profiles?.avatar_url,
      me: c.user_id === user?.id,
    }))}))
  }

  const sendComment = async (momentId) => {
    const text = (commentText[momentId]||'').trim()
    if (!text || !user) return
    setCommentText(p => ({...p, [momentId]: ''}))
    const sb = getSupabase(); if (!sb) return
    const { data, error } = await sb.from('moment_comments').insert({
      moment_id: momentId,
      user_id: user.id,
      text,
    }).select('id, text, created_at, user_id').single()
    if (!error && data) {
      const newComment = {
        id: data.id, text: data.text, created_at: data.created_at,
        author: profile?.full_name || 'Tú',
        username: profile?.username,
        avatar: profile?.avatar_url,
        me: true,
      }
      setComments(p => ({...p, [momentId]: [...(p[momentId]||[]), newComment]}))
      setCommentCounts(p => ({...p, [momentId]: (p[momentId]||0) + 1}))
    }
  }

  // ── Like ─────────────────────────────────────────────────
  const toggleLike = async (mid) => {
    const isL = !!liked[mid]
    setLiked(p  => ({ ...p, [mid]: !isL }))
    setLikeCounts(p => ({ ...p, [mid]: Math.max(0, (p[mid]||0) + (isL ? -1 : 1)) }))
    if (!fromDB || !user) return
    try {
      const sb = getSupabase(); if (!sb) return
      if (isL) await sb.from('moment_likes').delete().eq('moment_id', mid).eq('user_id', user.id)
      else     await sb.from('moment_likes').insert({ moment_id: mid, user_id: user.id })
    } catch(_) {}
  }

  const feed = moments.filter(m => {
    const bySport = sportFilter === 'all' || m.sport === sportFilter
    const byLocal = localFilter === 'all' || m.province === localFilter
    return bySport && byLocal
  })

  const availableProvinces = [...new Set(moments.map(m => m.province).filter(Boolean))]

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        <header style={{ paddingTop:16, paddingBottom:16, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.04em' }}>Momentos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>
              {localFilter !== 'all'
                ? `${PROVINCE_LABELS[localFilter] || localFilter} · comunidad local`
                : 'Lo que ha pasado hoy en la comunidad'}
            </p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeButton />
            {user && (
              <Link href="/events" className="btn btn-primary" style={{ fontSize:12, padding:'8px 14px', whiteSpace:'nowrap' }}>
                + Publicar
              </Link>
            )}
          </div>
        </header>

        {/* CTA para publicar — redirige a eventos */}
        {user && (
          <div className="card" style={{ padding:'14px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>📸</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:2 }}>¿Participaste en un evento hoy?</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Comparte el momento desde el panel del evento</div>
            </div>
            <Link href="/events" className="btn btn-primary" style={{ fontSize:12, padding:'8px 14px', flexShrink:0, whiteSpace:'nowrap' }}>
              Mis eventos
            </Link>
          </div>
        )}

        {!user && (
          <div className="card" style={{ padding:'14px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>✍️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:2 }}>Únete y comparte tus momentos</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Apúntate a eventos para poder publicar</div>
            </div>
            <a href="/auth" className="btn btn-primary" style={{ fontSize:12, padding:'8px 14px', flexShrink:0 }}>Entrar</a>
          </div>
        )}

        {/* Filtro localidad */}
        {(availableProvinces.length > 0 || fromDB) && (
          <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:10 }}>
            <button onClick={()=>setLocalFilter('all')}
              className={`pill ${localFilter==='all'?'pill-active':'pill-inactive'}`}
              style={localFilter==='all'?{background:'linear-gradient(135deg,#06d6a0,#0ea5e9)'}:{}}>
              📍 Toda España
            </button>
            {myProvince && (
              <button onClick={()=>setLocalFilter(myProvince)}
                className={`pill ${localFilter===myProvince?'pill-active':'pill-inactive'}`}
                style={localFilter===myProvince?{background:'linear-gradient(135deg,#06d6a0,#0ea5e9)'}:{}}>
                ⭐ {PROVINCE_LABELS[myProvince] || myProvince}
              </button>
            )}
            {availableProvinces.filter(p => p !== myProvince).map(p => (
              <button key={p} onClick={()=>setLocalFilter(p)}
                className={`pill ${localFilter===p?'pill-active':'pill-inactive'}`}>
                {PROVINCE_LABELS[p] || p}
              </button>
            ))}
          </div>
        )}

        {/* Filtro deporte */}
        <div className="scroll-x" style={{ display:'flex', gap:8, paddingBottom:14 }}>
          {SPORT_FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setSportFilter(f.id)}
              className={`pill ${sportFilter===f.id?'pill-active':'pill-inactive'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ padding:'40px 0', textAlign:'center' }}>
            <div className="spinner"/>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:12 }}>Cargando momentos...</p>
          </div>
        )}

        {!loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {feed.length === 0 ? (
              <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                <div style={{ fontSize:44, marginBottom:12 }}>🏅</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>
                  {localFilter !== 'all' ? `Nada en ${PROVINCE_LABELS[localFilter]||localFilter} aún` : 'Sin momentos aún'}
                </div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom: localFilter!=='all'?16:0 }}>
                  {localFilter !== 'all' ? 'Sé el primero de tu zona' : 'Los momentos aparecen tras los eventos'}
                </div>
                {localFilter !== 'all' && (
                  <button className="btn btn-ghost" style={{ fontSize:13 }} onClick={()=>setLocalFilter('all')}>Ver toda España</button>
                )}
              </div>
            ) : feed.map((m, i) => {
              const isLiked    = !!liked[m.id]
              const likeCount  = likeCounts[m.id] || 0
              const c          = S_COLORS[m.sport] || '#5b6ef5'
              const sportLabel = SPORT_LABELS[m.sport] || m.sport

              return (
                <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:0, overflow:'hidden' }}>
                  {/* Contexto del evento */}
                  {m.event_title && (
                    <Link href={`/events/${m.event_id}`} style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'8px 14px', borderBottom:'1px solid var(--border)',
                      textDecoration:'none', background:'var(--surface2)',
                    }}>
                      <span style={{ fontSize:11, color:c, fontWeight:700, background:`${c}18`, borderRadius:100, padding:'2px 8px' }}>{sportLabel}</span>
                      <span style={{ fontSize:12, color:'var(--muted)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        📅 {m.event_title}
                      </span>
                      {m.province && PROVINCE_LABELS[m.province] && (
                        <span style={{ fontSize:11, color:'var(--muted)', whiteSpace:'nowrap' }}>📍 {PROVINCE_LABELS[m.province]}</span>
                      )}
                    </Link>
                  )}
                  <div style={{ height:3, background:`linear-gradient(90deg,${c},${c}44)` }}/>
                  <div style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <a href={`/profile/${m.user_id}`} style={{ textDecoration:'none', flexShrink:0 }}>
                        <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', background:`${c}20`, border:`2px solid ${c}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                          {m.avatar_url ? <img src={m.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                        </div>
                      </a>
                      <div style={{ flex:1, minWidth:0 }}>
                        <a href={`/profile/${m.user_id}`} style={{ textDecoration:'none' }}>
                          <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{m.author}</div>
                        </a>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>@{m.username} · {fmtTime(m.created_at)}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:'0 0 10px' }}>{m.text}</p>
                    {m.image_url && (
                      <img src={m.image_url} alt="" style={{ width:'100%', borderRadius:12, marginBottom:10, objectFit:'cover', maxHeight:280 }}/>
                    )}
                  </div>
                  {openComments[m.id] && (
                    <div style={{padding:'0 16px 12px', borderTop:'1px solid var(--border)'}}>
                      <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:10, marginTop:12}}>
                        {(comments[m.id]||[]).map(c => (
                          <div key={c.id} style={{display:'flex', gap:8, alignItems:'flex-start'}}>
                            <div style={{width:28,height:28,borderRadius:'50%',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,overflow:'hidden',flexShrink:0}}>
                              {c.avatar ? <img src={c.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '👤'}
                            </div>
                            <div style={{flex:1, background:'var(--surface2)', borderRadius:'4px 12px 12px 12px', padding:'8px 12px'}}>
                              <span style={{fontWeight:700,fontSize:12,color:'var(--primary)'}}>{c.author} </span>
                              <span style={{fontSize:13,color:'var(--text)'}}>{c.text}</span>
                            </div>
                          </div>
                        ))}
                        {(comments[m.id]||[]).length === 0 && (
                          <div style={{fontSize:13,color:'var(--muted)',textAlign:'center',padding:'8px 0'}}>
                            Sé el primero en comentar
                          </div>
                        )}
                      </div>
                      {user && (
                        <div style={{display:'flex', gap:8, alignItems:'center'}}>
                          <input
                            value={commentText[m.id]||''}
                            onChange={e => setCommentText(p => ({...p, [m.id]: e.target.value}))}
                            onKeyDown={e => { if(e.key==='Enter') sendComment(m.id) }}
                            placeholder="Escribe un comentario..."
                            maxLength={280}
                            style={{flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'8px 14px', fontSize:13, color:'var(--text)', outline:'none', fontFamily:'inherit'}}
                          />
                          <button onClick={() => sendComment(m.id)} disabled={!(commentText[m.id]||'').trim()} style={{
                            background:'#586875', color:'#f6eddc', border:'none', borderRadius:'50%',
                            width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', fontSize:14, flexShrink:0,
                          }}>➤</button>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display:'flex', alignItems:'center', padding:'8px 14px 12px', borderTop:'1px solid var(--border)', gap:16 }}>
                    <button onClick={()=>toggleLike(m.id)} style={{
                      background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit',
                      display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600,
                      color: isLiked ? '#ef4444' : 'var(--muted)',
                      transition:'all 0.15s ease', transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize:16 }}>{isLiked?'❤️':'🤍'}</span>
                    </button>
                    <button onClick={() => loadLikers(m.id)} style={{
                      background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit',
                      fontSize:13, fontWeight:600, color: isLiked ? '#ef4444' : 'var(--muted)',
                    }}>
                      {likeCount > 0 ? likeCount : ''}
                    </button>
                    <button onClick={() => {
                      const isOpen = openComments[m.id]
                      setOpenComments(p => ({...p, [m.id]: !isOpen}))
                      if (!isOpen && !comments[m.id]) loadComments(m.id)
                    }} style={{
                      background:'none', border:'none', cursor:'pointer', padding:0,
                      display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600,
                      color: openComments[m.id] ? 'var(--primary)' : 'var(--muted)',
                      fontFamily:'inherit',
                    }}>
                      <span style={{fontSize:16}}>💬</span>
                      {/* Mostrar conteo real si hay comentarios cargados, si no el conteo de BD */}
                      {comments[m.id]?.length > 0
                        ? comments[m.id].length
                        : (commentCounts[m.id] || '')}
                    </button>
                    {m.event_id && (
                      <Link href={`/events/${m.event_id}`} style={{
                        marginLeft:'auto', color:'var(--muted)', fontSize:12, fontWeight:600,
                        textDecoration:'none', display:'flex', alignItems:'center', gap:4,
                      }}>
                        Ver evento →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
            {feed.length > 0 && (
              <div style={{ textAlign:'center', padding:'10px 0' }}>
                <span style={{ fontSize:12, color:'var(--muted)' }}>Has llegado al final ✨</span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal likers */}
      {likersModal && (
        <div onClick={() => setLikersModal(null)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
          zIndex:1000, display:'flex', alignItems:'flex-end',
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'var(--solid)', borderRadius:'24px 24px 0 0',
            padding:'20px 20px 40px', width:'100%', maxHeight:'60vh',
            overflowY:'auto',
          }}>
            <div style={{fontWeight:700, fontSize:16, marginBottom:16}}>
              ❤️ {likers.length} {likers.length===1?'persona':'personas'} dieron like
            </div>
            {likers.length === 0 ? (
              <div style={{color:'var(--muted)', fontSize:14}}>Nadie aún</div>
            ) : likers.map((p,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,overflow:'hidden',flexShrink:0}}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '👤'}
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{p.full_name||'Usuario'}</div>
                  {p.username && <div style={{fontSize:12,color:'var(--muted)'}}>@{p.username}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Navbar />
    </>
  )
}
