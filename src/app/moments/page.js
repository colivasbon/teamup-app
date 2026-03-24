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

const DEMO_MOMENTS = [
  { id:'m1', author:'Carlos O.', username:'carlosO', avatar_url:null, sport:'running',    province:'cordoba',  created_at: new Date(Date.now()-900000).toISOString(),   text:'Empezando el día con energía en la Alameda 🌅 Mejor compañía imposible.', likes:12, liked:false },
  { id:'m2', author:'María G.',  username:'mariaG',  avatar_url:null, sport:'padel',      province:'madrid',   created_at: new Date(Date.now()-3600000).toISOString(),  text:'Partido épico esta mañana. Ganamos en el tercer set 6-4 🎾', likes:24, liked:true  },
  { id:'m3', author:'Javi M.',   username:'javiM',   avatar_url:null, sport:'senderismo', province:'madrid',   created_at: new Date(Date.now()-10800000).toISOString(), text:'Las vistas desde los 2.800m no tienen precio 🥾✨', likes:41, liked:false },
  { id:'m4', author:'Laura S.',  username:'lauraS',  avatar_url:null, sport:'gimnasio',   province:'sevilla',  created_at: new Date(Date.now()-18000000).toISOString(), text:'Sesión de funcional increíble hoy 💪🔥', likes:18, liked:false },
  { id:'m5', author:'Diego R.',  username:'diegoR',  avatar_url:null, sport:'futbol',     province:'valencia', created_at: new Date(Date.now()-86400000).toISOString(), text:'Derrota 3-5 pero qué partido más divertido ⚽', likes:33, liked:true  },
]

const SPORT_FILTERS = [
  { id:'all', label:'Todos' }, { id:'running', label:'Running' }, { id:'padel', label:'Pádel' },
  { id:'senderismo', label:'Senderismo' }, { id:'futbol', label:'Fútbol' }, { id:'gimnasio', label:'Gimnasio' },
  { id:'natacion', label:'Natación' }, { id:'ciclismo', label:'Ciclismo' },
  { id:'yoga', label:'Yoga' }, { id:'baloncesto', label:'Baloncesto' },
  { id:'voleibol', label:'Voleibol' }, { id:'badminton', label:'Bádminton' },
]

const SPORTS_SELECT = [
  { id:'running', label:'Running 🏃' }, { id:'padel', label:'Pádel 🎾' },
  { id:'senderismo', label:'Senderismo 🥾' }, { id:'futbol', label:'Fútbol ⚽' },
  { id:'gimnasio', label:'Gimnasio 💪' }, { id:'tenis', label:'Tenis 🎾' },
  { id:'natacion', label:'Natación 🏊' }, { id:'ciclismo', label:'Ciclismo 🚴' },
  { id:'yoga', label:'Yoga 🧘' }, { id:'baloncesto', label:'Baloncesto 🏀' },
  { id:'voleibol', label:'Voleibol 🏐' }, { id:'badminton', label:'Bádminton 🏸' },
]

// Provincias para el filtro de localidad
const PROVINCE_LABELS = {
  madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia', sevilla:'Sevilla',
  cordoba:'Córdoba', granada:'Granada', malaga:'Málaga', alicante:'Alicante',
  murcia:'Murcia', zaragoza:'Zaragoza', bilbao:'País Vasco', cadiz:'Cádiz',
  huelva:'Huelva', jaen:'Jaén', almeria:'Almería',
}

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
  const [localFilter, setLocalFilter] = useState('all')  // provincia o 'all'
  const [moments,     setMoments]     = useState([])
  const [liked,       setLiked]       = useState({})
  const [likeCounts,  setLikeCounts]  = useState({})
  const [fromDB,      setFromDB]      = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [compose,     setCompose]     = useState(false)
  const [posting,     setPosting]     = useState(false)
  const [myProvince,  setMyProvince]  = useState(null)  // provincia detectada por geoloc
  const [newPost,     setNewPost]     = useState({ text:'', sport:'running' })
  const setP = (k, v) => setNewPost(p => ({ ...p, [k]: v }))

  // ── Geolocalización para sugerir provincia ───────────────
  useEffect(() => {
    if (profile?.location) {
      // Intentar extraer provincia del perfil
      const loc = profile.location.toLowerCase()
      const found = Object.keys(PROVINCE_LABELS).find(k => loc.includes(k))
      if (found) { setMyProvince(found); setLocalFilter(found) }
    }
  }, [profile])

  // ── Fetch del feed (queries separadas para evitar RLS join) ──
  const fetchMoments = useCallback(async (showSpinner = false) => {
    try {
      const sb = getSupabase()
      if (!sb) throw new Error('no client')
      if (showSpinner) setLoading(true)

      // 1. Traer momentos SIN join — evita bloqueos RLS en foreign key joins
      const { data: mData, error: mErr } = await sb
        .from('moments')
        .select('id, text, sport, image_url, created_at, user_id, province')
        .order('created_at', { ascending: false })
        .limit(50)

      if (mErr) { console.error('moments error:', mErr); throw new Error('moments error') }
      if (!mData || mData.length === 0) throw new Error('no moments')

      // 2. Traer perfiles de los autores por separado
      const userIds = [...new Set(mData.map(m => m.user_id))]
      let profilesMap = {}
      if (userIds.length > 0) {
        const { data: pData } = await sb
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds)
        if (pData) pData.forEach(p => { profilesMap[p.id] = p })
      }

      // 3. Traer likes
      const momentIds = mData.map(m => m.id)
      const { data: likesData } = await sb
        .from('moment_likes')
        .select('moment_id, user_id')
        .in('moment_id', momentIds)

      const countsMap = {}; const myLikesMap = {}
      for (const l of (likesData || [])) {
        countsMap[l.moment_id] = (countsMap[l.moment_id] || 0) + 1
        if (l.user_id === user?.id) myLikesMap[l.moment_id] = true
      }

      const formatted = mData.map(m => ({
        id:         m.id,
        author:     profilesMap[m.user_id]?.full_name || 'Usuario',
        username:   profilesMap[m.user_id]?.username  || 'usuario',
        avatar_url: profilesMap[m.user_id]?.avatar_url || null,
        user_id:    m.user_id,
        sport:      m.sport,
        province:   m.province || null,
        text:       m.text,
        image_url:  m.image_url,
        created_at: m.created_at,
      }))

      setMoments(formatted)
      setLikeCounts(countsMap)
      if (user) {
        setLiked(prev => ({ ...myLikesMap, ...prev }))
      }
      setFromDB(true)
      if (showSpinner) setLoading(false)
      return

    } catch(e) {
      console.error('fetchMoments failed:', e)
    }

    if (showSpinner) {
      const counts = {}; const lk = {}
      DEMO_MOMENTS.forEach(m => { counts[m.id] = m.likes; lk[m.id] = m.liked })
      setMoments(DEMO_MOMENTS); setLikeCounts(counts); setLiked(lk)
      setFromDB(false); setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchMoments(true)
    pollRef.current = setInterval(() => fetchMoments(false), 15000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchMoments])

  // ── Like ─────────────────────────────────────────────────
  const toggleLike = async (momentId) => {
    const isLiked = !!liked[momentId]
    setLiked(p  => ({ ...p, [momentId]: !isLiked }))
    setLikeCounts(p => ({ ...p, [momentId]: Math.max(0, (p[momentId]||0) + (isLiked ? -1 : 1)) }))
    if (!fromDB || !user) return
    try {
      const sb = getSupabase(); if (!sb) return
      if (isLiked) {
        await sb.from('moment_likes').delete().eq('moment_id', momentId).eq('user_id', user.id)
      } else {
        await sb.from('moment_likes').insert({ moment_id: momentId, user_id: user.id })
      }
    } catch(_) {}
  }

  // ── Publicar ─────────────────────────────────────────────
  const publish = async () => {
    if (!newPost.text.trim() || !user) return
    setPosting(true)
    try {
      const sb = getSupabase()
      // Provincia del usuario para el momento
      const province = profile?.location
        ? Object.keys(PROVINCE_LABELS).find(k => profile.location.toLowerCase().includes(k)) || null
        : null

      if (sb && fromDB) {
        const { data, error } = await sb.from('moments').insert({
          user_id: user.id,
          text: newPost.text.trim(),
          sport: newPost.sport,
          province: province,
        }).select('id, text, sport, image_url, created_at, user_id, province').single()

        if (!error && data) {
          const optimistic = {
            id: data.id, user_id: user.id,
            author: profile?.full_name || user.email?.split('@')[0] || 'Tú',
            username: profile?.username || 'tú',
            avatar_url: profile?.avatar_url || null,
            sport: data.sport, province: data.province,
            text: data.text, image_url: null,
            created_at: data.created_at,
          }
          setMoments(p => [optimistic, ...p])
          setLikeCounts(p => ({ ...p, [data.id]: 0 }))
          setTimeout(() => fetchMoments(false), 1500)
        } else {
          console.error('publish error:', error)
        }
      } else {
        const optimistic = {
          id: 'local-' + Date.now(), user_id: user.id,
          author: profile?.full_name || user.email?.split('@')[0] || 'Tú',
          username: profile?.username || 'tú', avatar_url: profile?.avatar_url || null,
          sport: newPost.sport, province: province,
          text: newPost.text.trim(), image_url: null, created_at: new Date().toISOString(),
        }
        setMoments(p => [optimistic, ...p])
        setLikeCounts(p => ({ ...p, [optimistic.id]: 0 }))
      }
    } catch(e) { console.error('publish exception:', e) }
    setNewPost({ text:'', sport:'running' }); setCompose(false); setPosting(false)
  }

  // ── Filtrado ─────────────────────────────────────────────
  const feed = moments.filter(m => {
    const bySport = sportFilter === 'all' || m.sport === sportFilter
    const byLocal = localFilter === 'all' || m.province === localFilter
    return bySport && byLocal
  })

  // Provincias disponibles en el feed actual (solo las que tienen momentos)
  const availableProvinces = [...new Set(moments.map(m => m.province).filter(Boolean))]

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        <header style={{ paddingTop:60, paddingBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.04em' }}>Momentos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>
              {localFilter !== 'all'
                ? `${PROVINCE_LABELS[localFilter] || localFilter} · comunidad local`
                : 'Lo mejor de hoy en la comunidad'}
            </p>
          </div>
          {user && (
            <button onClick={()=>setCompose(!compose)} className="btn btn-primary" style={{ padding:'10px 16px', fontSize:13 }}>
              {compose ? '✕' : '+ Publicar'}
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
                  {localFilter !== 'all' ? `Nada en ${PROVINCE_LABELS[localFilter] || localFilter} aún` : 'Sin momentos aún'}
                </div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom: localFilter!=='all'?16:0 }}>
                  {localFilter !== 'all' ? 'Sé el primero de tu zona en publicar algo' : 'Sé el primero en publicar algo'}
                </div>
                {localFilter !== 'all' && (
                  <button className="btn btn-ghost" style={{ fontSize:13 }} onClick={()=>setLocalFilter('all')}>
                    Ver toda España
                  </button>
                )}
              </div>
            ) : feed.map((m, i) => {
              const isLiked    = !!liked[m.id]
              const likeCount  = likeCounts[m.id] || 0
              const c          = S_COLORS[m.sport] || '#5b6ef5'
              const sportLabel = SPORT_LABELS[m.sport] || m.sport

              return (
                <div key={m.id} className={`card anim-${(i%6)+1}`} style={{ padding:0, overflow:'hidden' }}>
                  <div style={{ height:3, background:`linear-gradient(90deg,${c},${c}66)` }}/>
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                      <a href={`/profile/${m.user_id}`} style={{ textDecoration:'none', flexShrink:0 }}>
                        <div style={{ width:40, height:40, borderRadius:'50%', overflow:'hidden', background:`${c}20`, border:`2px solid ${c}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                          {m.avatar_url ? <img src={m.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '👤'}
                        </div>
                      </a>
                      <div style={{ flex:1, minWidth:0 }}>
                        <a href={`/profile/${m.user_id}`} style={{ textDecoration:'none' }}>
                          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{m.author}</div>
                        </a>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>
                          @{m.username} · {fmtTime(m.created_at)}
                          {m.province && PROVINCE_LABELS[m.province] && (
                            <span style={{ marginLeft:4 }}>· 📍 {PROVINCE_LABELS[m.province]}</span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:c, background:`${c}18`, borderRadius:100, padding:'3px 10px', flexShrink:0 }}>
                        {sportLabel}
                      </span>
                    </div>
                    <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, margin:'0 0 12px' }}>{m.text}</p>
                    {m.image_url && (
                      <img src={m.image_url} alt="" style={{ width:'100%', borderRadius:12, marginBottom:12, objectFit:'cover', maxHeight:260 }}/>
                    )}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', padding:'10px 16px 14px', borderTop:'1px solid var(--border)', gap:20 }}>
                    <button onClick={()=>toggleLike(m.id)} style={{
                      background:'none', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:5,
                      color: isLiked ? '#ef4444' : 'var(--muted)',
                      fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit',
                      transition:'all 0.15s ease', transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize:17 }}>{isLiked?'❤️':'🤍'}</span> {likeCount}
                    </button>
                    <button
                      onClick={()=>{ if(navigator.share) navigator.share({ title:'TeamUp', text:m.text, url: window.location.origin }) }}
                      style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontWeight:600, padding:0, fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:15 }}>↗</span> Compartir
                    </button>
                  </div>
                </div>
              )
            })}
            {feed.length > 0 && (
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
