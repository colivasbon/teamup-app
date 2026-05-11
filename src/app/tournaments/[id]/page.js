'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORT_COLORS } from '@/components/SportIcon'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SPORT_ICONS = {
  padel:'🎾', tenis:'🎾', badminton:'🏸', voleibol:'🏐', futbol:'⚽',
  baloncesto:'🏀', running:'🏃', natacion:'🏊', ciclismo:'🚴',
  senderismo:'🥾', yoga:'🧘', gimnasio:'💪', escalada:'🧗', surf:'🏄', esgrima:'🤺',
}
const FORMAT_LABELS  = { single_elimination:'Eliminación directa', groups:'Grupos + eliminatoria' }
const STATUS_LABELS  = { open:'Inscripciones abiertas', in_progress:'En curso', finished:'Finalizado', cancelled:'Cancelado' }
const STATUS_COLORS  = { open:'#06d6a0', in_progress:'#f59e0b', finished:'var(--muted)', cancelled:'#ef4444' }

// ── Componente arrastrable ────────────────────────────────────────────────────
function SortablePair({ pair, index, color }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pair.id })
  return (
    <div ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.4 : 1,
        display:'flex', alignItems:'center', gap:12,
        padding:'13px 16px', borderRadius:14,
        border: isDragging ? `2px solid ${color}` : '1px solid var(--border)',
        background: isDragging ? `${color}10` : 'var(--surface)',
        cursor:'grab', touchAction:'none', userSelect:'none',
      }}
      {...attributes} {...listeners}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:`${color}20`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:12, fontWeight:800, color, flexShrink:0 }}>{index+1}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:13, color:'var(--text)',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {pair.player2_name && pair.pair_confirmed
            ? `${pair.player1_name} / ${pair.player2_name}`
            : pair.player1_name + (pair.seeking_partner ? ' (busca pareja)' : '')}
        </div>
        {pair.category_name && (
          <div style={{ fontSize:11, color, marginTop:2 }}>{pair.category_name}</div>
        )}
      </div>
      <div style={{ color:'var(--muted)', fontSize:18, flexShrink:0 }}>⋮⋮</div>
    </div>
  )
}

// ── Generar bracket ───────────────────────────────────────────────────────────
function generateBracket(pairs) {
  if (!pairs || pairs.length < 2) return []
  const size = Math.pow(2, Math.ceil(Math.log2(pairs.length)))
  const seeded = [...pairs]
  while (seeded.length < size) seeded.push(null)
  const rounds = []
  let current = seeded
  while (current.length > 1) {
    const matches = []
    for (let i = 0; i < current.length; i += 2) {
      matches.push({ p1: current[i], p2: current[i+1] || null, winner: null })
    }
    rounds.push(matches)
    current = matches.map(m => m.winner || null)
  }
  return rounds
}

function pairName(p) {
  if (!p) return 'BYE'
  if (p.player2_name && p.pair_confirmed) return `${p.player1_name} / ${p.player2_name}`
  if (p.seeking_partner) return `${p.player1_name} (busca pareja)`
  return p.player1_name || 'Participante'
}

// ── Mapa simple via iframe OSM ────────────────────────────────────────────────
function SimpleMap({ location }) {
  const q = encodeURIComponent(location + ', España')
  return (
    <div style={{ borderRadius:16, overflow:'hidden', height:160, marginBottom:16 }}>
      <iframe
        title="Ubicación"
        width="100%" height="160"
        style={{ border:'none', display:'block' }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=-9,35,5,44&layer=mapnik&marker=${q}`}
        loading="lazy"
      />
    </div>
  )
}

export default function TournamentDetail() {
  const { id }             = useParams()
  const router             = useRouter()
  const { user, profile }  = useAuth()

  const [tournament,   setTournament]   = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [tab,          setTab]          = useState('Info')
  const [bracket,      setBracket]      = useState({}) // { catId: rounds[] } o { _all: rounds[] }

  // Seeding
  const [showSeeding,  setShowSeeding]  = useState(false)
  const [seedCat,      setSeedCat]      = useState(null) // categoría que se está ordenando
  const [seedOrder,    setSeedOrder]    = useState([])
  const [activeId,     setActiveId]     = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint:{ distance:5 } }),
    useSensor(TouchSensor,   { activationConstraint:{ delay:100, tolerance:5 } })
  )

  // Inscripción
  const [showJoin,      setShowJoin]     = useState(false)
  const [selectedCat,   setSelectedCat] = useState(null)
  const [partnerSearch, setPartnerSearch]= useState('')
  const [partnerResult, setPartnerResult]= useState(null)
  const [joining,       setJoining]      = useState(false)
  const [joinError,     setJoinError]    = useState('')
  const [joined,        setJoined]       = useState(false)
  const [myEntry,       setMyEntry]      = useState(null)

  // Cuadro — categoría activa
  const [bracketCat,   setBracketCat]   = useState(null)

  const isCreator = user && tournament?.creator_id === user.id
  const isOpen    = tournament?.status === 'open'
  const pairMode  = tournament?.pair_mode
  const cats      = tournament?.categories || []
  const hasCats   = cats.length > 0

  // Carga datos
  const load = useCallback(async () => {
    setLoading(true)
    const sb = getSupabase()
    if (!sb) { setLoading(false); return }

    const { data: t } = await sb.from('tournaments').select('*').eq('id', id).single()
    if (!t) { router.push('/tournaments'); return }
    setTournament(t)
    if (t.bracket) setBracket(t.bracket)

    const cats = t.categories || []
    if (cats.length > 0 && !bracketCat) setBracketCat(cats[0].id)

    const { data: pData } = await sb.from('tournament_participants')
      .select('*').eq('tournament_id', id).order('created_at', { ascending:true })

    if (pData) {
      const uids = [...new Set([...pData.map(p=>p.player1_id), ...pData.map(p=>p.player2_id)].filter(Boolean))]
      let pMap = {}
      if (uids.length > 0) {
        const { data: prData } = await sb.from('profiles').select('id, full_name, username, avatar_url').in('id', uids)
        if (prData) prData.forEach(p => { pMap[p.id] = p })
      }
      const enriched = pData.map(p => ({
        ...p,
        player1_name: pMap[p.player1_id]?.full_name || pMap[p.player1_id]?.username || 'Jugador',
        player2_name: p.player2_id ? (pMap[p.player2_id]?.full_name || pMap[p.player2_id]?.username || 'Jugador') : null,
      }))
      setParticipants(enriched)
      if (user) {
        const mine = enriched.find(p => p.player1_id === user.id || p.player2_id === user.id)
        setMyEntry(mine || null)
        setJoined(!!mine)
      }
      if (t.bracket) setBracket(t.bracket)
      else if (t.status !== 'open') {
        const br = {}
        if (cats.length > 0) {
          cats.forEach(c => {
            const cp = enriched.filter(p => p.category_id === c.id)
            br[c.id] = generateBracket(cp)
          })
        } else {
          br._all = generateBracket(enriched)
        }
        setBracket(br)
      }
    }
    setLoading(false)
  }, [id, user])

  useEffect(() => { load() }, [load])

  // Buscar pareja
  const searchPartner = async () => {
    if (!partnerSearch.trim()) return
    const sb = getSupabase()
    const { data } = await sb.from('profiles')
      .select('id, full_name, username, avatar_url')
      .ilike('username', `%${partnerSearch.trim()}%`)
      .neq('id', user.id).limit(5)
    setPartnerResult(data || [])
  }

  // Inscribirse
  const handleJoin = async (partner) => {
    if (!user) { router.push('/auth'); return }
    setJoining(true); setJoinError('')
    const sb = getSupabase()
    const cat = hasCats ? cats.find(c => c.id === selectedCat) : null
    const { error } = await sb.from('tournament_participants').insert({
      tournament_id:   id,
      player1_id:      user.id,
      player1_name:    profile?.full_name || profile?.username || 'Jugador',
      player2_id:      partner?.id || null,
      player2_name:    partner ? (partner.full_name || partner.username) : null,
      pair_confirmed:  !pairMode || !partner,
      seeking_partner: pairMode && !partner,
      category_id:     cat?.id || null,
      category_name:   cat?.name || null,
    })
    if (error) { setJoinError(error.message); setJoining(false); return }
    setShowJoin(false); setJoining(false); load()
  }

  // Confirmar pareja
  const confirmPartner = async () => {
    if (!myEntry) return
    const sb = getSupabase()
    await sb.from('tournament_participants').update({ pair_confirmed:true }).eq('id', myEntry.id)
    load()
  }

  // Cambiar categoría de un inscrito (organizador)
  const changeCategory = async (participantId, catId, catName) => {
    const sb = getSupabase()
    await sb.from('tournament_participants').update({ category_id:catId, category_name:catName }).eq('id', participantId)
    load()
  }

  // Cancelar inscripción
  const handleLeave = async () => {
    if (!myEntry) return
    const sb = getSupabase()
    await sb.from('tournament_participants').delete().eq('id', myEntry.id)
    setJoined(false); setMyEntry(null); load()
  }

  // Abrir seeding para una categoría
  const openSeeding = (catId) => {
    const catPairs = catId
      ? participants.filter(p => p.category_id === catId)
      : participants
    setSeedCat(catId)
    setSeedOrder(catPairs)
    setShowSeeding(true)
  }

  // Confirmar seeding y generar bracket
  const confirmSeeding = async () => {
    const newBracket = { ...bracket }
    const key = seedCat || '_all'
    newBracket[key] = generateBracket(seedOrder)

    // Si es la primera vez que se genera, cambiar status a in_progress
    const allCatsDone = hasCats
      ? cats.every(c => newBracket[c.id]?.length > 0)
      : !!newBracket._all?.length

    const sb = getSupabase()
    await sb.from('tournaments').update({
      bracket: newBracket,
      ...(allCatsDone ? { status:'in_progress' } : {}),
    }).eq('id', id)

    setBracket(newBracket)
    if (allCatsDone) setTournament(prev => ({...prev, status:'in_progress', bracket:newBracket}))
    setShowSeeding(false)
    setTab('Cuadro')
    if (seedCat) setBracketCat(seedCat)
  }

  // Compartir
  const share = () => {
    const url = `${window.location.origin}/tournaments/${id}`
    const text = `🏆 ${tournament?.title} — Torneo de ${tournament?.sport} en TeamUp. ¡Inscríbete!`
    if (navigator.share) navigator.share({ title:'TeamUp', text, url })
    else { navigator.clipboard?.writeText(url); alert('Enlace copiado') }
  }

  if (loading) return (
    <>
      <div className="page-wrap" style={{ display:'flex', justifyContent:'center', paddingTop:80 }}>
        <div className="spinner"/>
      </div>
      <Navbar />
    </>
  )
  if (!tournament) return null

  const color    = SPORT_COLORS[tournament.sport] || '#586875'
  const icon     = SPORT_ICONS[tournament.sport]  || '🏅'
  const pct      = tournament.max_pairs > 0 ? Math.round((participants.length / (tournament.max_pairs * Math.max(cats.length,1))) * 100) : 0
  const isFull   = hasCats
    ? cats.every(c => participants.filter(p => p.category_id === c.id).length >= tournament.max_pairs)
    : participants.length >= tournament.max_pairs

  const activeBracket = bracket[bracketCat || '_all'] || []

  return (
    <>
      <div style={{ maxWidth:480, margin:'0 auto' }}>

        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg, ${color}, ${color}99)`, padding:'24px 20px 28px', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <button onClick={() => router.back()}
              style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12,
                color:'white', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              ←
            </button>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {/* Botón compartir */}
              <button onClick={share}
                style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12,
                  color:'white', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16 }}>
                🔗
              </button>
              <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.05em',
                background:`${STATUS_COLORS[tournament.status]}22`, color:STATUS_COLORS[tournament.status],
                border:`1px solid ${STATUS_COLORS[tournament.status]}40`, borderRadius:20, padding:'4px 12px' }}>
                {STATUS_LABELS[tournament.status]}
              </span>
            </div>
          </div>

          <div style={{ fontSize:52, marginBottom:10 }}>{icon}</div>
          <h1 style={{ color:'white', fontWeight:900, fontSize:24, margin:'0 0 6px', letterSpacing:'-0.04em', lineHeight:1.2 }}>
            {tournament.title}
          </h1>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>
            🏢 {tournament.creator_name || 'Organizador'} · {FORMAT_LABELS[tournament.format]}
          </div>
          {tournament.prize_enabled && (
            <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(255,255,255,0.22)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:700, color:'white' }}>
              🏅 {tournament.prize_description || 'Con premio'}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'2px solid var(--border)', background:'var(--bg)' }}>
          {['Info','Cuadro','Participantes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'12px 0', border:'none', background:'none', cursor:'pointer',
              fontFamily:'inherit', fontSize:13, fontWeight:tab===t?700:500,
              color:tab===t?color:'var(--muted)',
              borderBottom:tab===t?`2px solid ${color}`:'2px solid transparent',
              marginBottom:-2, transition:'all 0.15s ease',
            }}>{t}</button>
          ))}
        </div>

        <div className="page-wrap" style={{ paddingTop:20, paddingBottom:110 }}>

          {/* ── TAB INFO ── */}
          {tab === 'Info' && (
            <div className="anim-1">
              {tournament.description && (
                <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6, marginBottom:16 }}>
                  {tournament.description}
                </p>
              )}

              {/* Datos clave */}
              <div className="card" style={{ padding:'16px 18px', marginBottom:16 }}>
                {[
                  { icon:'📅', label: tournament.date ? new Date(tournament.date+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}) + (tournament.time ? ` · ${tournament.time.slice(0,5)}h` : '') : 'Fecha por confirmar' },
                  { icon:'📍', label: tournament.location },
                  ...(tournament.province ? [{ icon:'🗺', label: tournament.province }] : []),
                  { icon:'👥', label: `${participants.length} / ${tournament.max_pairs * Math.max(cats.length,1)} ${pairMode ? 'parejas' : 'participantes'}` },
                  { icon:'🎮', label: FORMAT_LABELS[tournament.format] },
                  { icon: pairMode ? '👥' : '👤', label: pairMode ? 'Inscripción por parejas' : 'Inscripción individual' },
                  { icon:'💶', label: tournament.price || 'Gratis' },
                  ...(tournament.prize_enabled ? [{ icon:'🏅', label: tournament.prize_description || 'Hay premio' }] : []),
                ].map((r,i,arr) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0',
                    borderBottom:i<arr.length-1?'1px solid var(--border)':'none' }}>
                    <span style={{ fontSize:18, width:24, textAlign:'center' }}>{r.icon}</span>
                    <span style={{ fontSize:13, color:'var(--text)' }}>{r.label}</span>
                  </div>
                ))}
              </div>

              {/* Categorías */}
              {hasCats && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Categorías</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {cats.map((c, i) => {
                      const catCount = participants.filter(p => p.category_id === c.id).length
                      const catFull  = catCount >= tournament.max_pairs
                      const catPct   = Math.round((catCount / tournament.max_pairs) * 100)
                      return (
                        <div key={c.id} className="card" style={{ padding:'13px 16px' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                            <span style={{ fontWeight:700, fontSize:13 }}>{i+1}. {c.name}</span>
                            <span style={{ fontSize:12, fontWeight:700,
                              color: catFull ? '#ef4444' : color }}>
                              {catCount}/{tournament.max_pairs}
                            </span>
                          </div>
                          <div style={{ height:4, background:'var(--border)', borderRadius:8, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${catPct}%`,
                              background: catFull ? '#ef4444' : color,
                              borderRadius:8, transition:'width 0.4s ease' }}/>
                          </div>
                          {catFull && <div style={{ fontSize:11, color:'#ef4444', marginTop:4 }}>Categoría completa</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mapa */}
              {tournament.location && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Ubicación</div>
                  <SimpleMap location={tournament.location} />
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(tournament.location)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display:'block', textAlign:'center', fontSize:13, color:color, fontWeight:600, marginTop:4 }}>
                    Ver en Google Maps →
                  </a>
                </div>
              )}

              {/* Estado inscripción propia */}
              {joined && myEntry && (
                <div className="card" style={{ padding:'16px 18px', marginBottom:16,
                  border:`1px solid ${color}40`, background:`${color}08` }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color }}>✓ Inscrito</div>
                  {myEntry.category_name && (
                    <div style={{ fontSize:13, color:'var(--muted)', marginBottom:6 }}>
                      Categoría: <strong style={{ color }}>{myEntry.category_name}</strong>
                    </div>
                  )}
                  {pairMode && myEntry.player1_id === user?.id && myEntry.player2_name && (
                    <p style={{ fontSize:13, color:'var(--muted)', margin:'0 0 8px' }}>
                      Pareja: {myEntry.player2_name} {myEntry.pair_confirmed ? '· Confirmada ✓' : '· Pendiente'}
                    </p>
                  )}
                  {pairMode && myEntry.player2_id === user?.id && !myEntry.pair_confirmed && (
                    <button onClick={confirmPartner} className="btn btn-primary"
                      style={{ width:'100%', fontSize:13, background:color, marginBottom:8 }}>
                      Confirmar inscripción como pareja
                    </button>
                  )}
                  <button onClick={handleLeave}
                    style={{ width:'100%', background:'none', border:'1px solid rgba(239,68,68,0.3)',
                      color:'#ef4444', borderRadius:10, padding:'8px 0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                    Cancelar inscripción
                  </button>
                </div>
              )}

              {/* Botón inscribirse */}
              {!joined && isOpen && !isFull && user && (
                <button onClick={() => {
                  if (hasCats) setSelectedCat(cats[0].id)
                  setShowJoin(true)
                }} className="btn btn-primary" style={{ width:'100%', background:color, marginBottom:12 }}>
                  {pairMode ? '🎾 Inscribirme' : '✓ Inscribirme'}
                </button>
              )}
              {!joined && isFull && (
                <div style={{ textAlign:'center', fontSize:13, color:'#ef4444', marginBottom:12 }}>
                  El torneo está completo
                </div>
              )}
              {!user && (
                <a href="/auth" className="btn btn-primary"
                  style={{ display:'block', textAlign:'center', background:color, marginBottom:12, borderRadius:14, padding:'14px', textDecoration:'none', color:'white', fontWeight:700 }}>
                  Entra para inscribirte
                </a>
              )}

              {/* Botones organizador */}
              {isCreator && isOpen && participants.length >= 2 && (
                <div style={{ marginTop:8 }}>
                  {hasCats ? (
                    cats.map(c => {
                      const cp = participants.filter(p => p.category_id === c.id)
                      if (cp.length < 2) return null
                      return (
                        <button key={c.id} onClick={() => openSeeding(c.id)}
                          className="btn btn-primary"
                          style={{ width:'100%', marginBottom:8, background:color, fontSize:13 }}>
                          🏆 Ordenar y generar cuadro — {c.name} ({cp.length} inscritos)
                        </button>
                      )
                    })
                  ) : (
                    <button onClick={() => openSeeding(null)}
                      className="btn btn-primary" style={{ width:'100%', background:color }}>
                      🏆 Cerrar inscripciones y ordenar cuadro ({participants.length} inscritos)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TAB CUADRO ── */}
          {tab === 'Cuadro' && (() => {
            // Cuadro provisional: si no hay bracket guardado pero hay inscritos,
            // el organizador ve cómo quedaría con los inscritos actuales
            const previewBracket = (() => {
              if (activeBracket.length > 0) return activeBracket
              if (!isCreator) return []
              const key = bracketCat || '_all'
              const catParts = bracketCat
                ? participants.filter(p => p.category_id === bracketCat)
                : participants
              if (catParts.length < 2) return []
              return generateBracket(catParts)
            })()
            const isPreview = activeBracket.length === 0 && previewBracket.length > 0

            return (
            <div className="anim-1">
              {/* Selector de categoría */}
              {hasCats && (
                <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
                  {cats.map(c => (
                    <button key={c.id} onClick={() => setBracketCat(c.id)}
                      className={`pill ${bracketCat===c.id ? 'pill-active' : 'pill-inactive'}`}
                      style={{ whiteSpace:'nowrap', flexShrink:0 }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Banner preview */}
              {isPreview && (
                <div style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)',
                  borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:12,
                  color:'var(--text)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>👁</span>
                  <span>Vista previa para el organizador — cuadro provisional con los inscritos actuales. Aún no es definitivo.</span>
                </div>
              )}

              {previewBracket.length === 0 ? (
                <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>
                    {isCreator ? 'Sin inscritos suficientes' : 'Cuadro no disponible aún'}
                  </div>
                  <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>
                    {isCreator
                      ? 'Necesitas al menos 2 inscritos en esta categoría para ver el cuadro provisional.'
                      : 'El cuadro se genera cuando el organizador cierra las inscripciones.'}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX:'auto', paddingBottom:16 }}>
                  <div style={{ display:'flex', gap:0, minWidth: previewBracket.length * 180 }}>
                    {previewBracket.map((round, ri) => (
                      <div key={ri} style={{ flex:1, display:'flex', flexDirection:'column',
                        justifyContent:'space-around', minWidth:160 }}>
                        <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', textAlign:'center',
                          padding:'8px 0', letterSpacing:'0.05em', textTransform:'uppercase',
                          borderBottom:'1px solid var(--border)', marginBottom:8 }}>
                          {ri===previewBracket.length-1 ? 'Final' : ri===previewBracket.length-2 ? 'Semifinal' : `Ronda ${ri+1}`}
                        </div>
                        {round.map((match, mi) => (
                          <div key={mi} style={{ margin:'8px 6px' }}>
                            {[match.p1, match.p2].map((p, pi) => (
                              <div key={pi} style={{
                                padding:'9px 12px',
                                borderRadius: pi===0 ? '10px 10px 0 0' : '0 0 10px 10px',
                                background: !p ? 'var(--surface)' : match.winner===p ? `${color}20` : 'var(--surface)',
                                border: `1px solid ${!p ? 'var(--border)' : match.winner===p ? color+'60' : 'var(--border)'}`,
                                borderBottom: pi===0 ? '1px dashed var(--border)' : undefined,
                                fontSize:12, fontWeight:match.winner===p ? 700 : 400,
                                color: !p ? 'var(--muted)' : match.winner===p ? color : 'var(--text)',
                                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                              }}>
                                {match.winner===p && '🏆 '}{p ? pairName(p) : 'BYE'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )
          })()}

          {/* ── TAB PARTICIPANTES ── */}
          {tab === 'Participantes' && (
            <div className="anim-1">
              {/* Filtro por categoría */}
              {hasCats && (
                <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
                  <button onClick={() => setBracketCat(null)}
                    className={`pill ${!bracketCat ? 'pill-active' : 'pill-inactive'}`}
                    style={{ whiteSpace:'nowrap', flexShrink:0 }}>Todos</button>
                  {cats.map(c => (
                    <button key={c.id} onClick={() => setBracketCat(c.id)}
                      className={`pill ${bracketCat===c.id ? 'pill-active' : 'pill-inactive'}`}
                      style={{ whiteSpace:'nowrap', flexShrink:0 }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              {(() => {
                const filtered = bracketCat && hasCats
                  ? participants.filter(p => p.category_id === bracketCat)
                  : participants
                return filtered.length === 0 ? (
                  <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
                    <p style={{ fontSize:14, color:'var(--muted)' }}>Aún no hay inscritos.</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {filtered.map((p, i) => (
                      <div key={p.id} className="card" style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:`${color}20`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:12, fontWeight:800, color, flexShrink:0 }}>{i+1}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:13 }}>
                              {pairMode ? pairName(p) : p.player1_name}
                            </div>
                            <div style={{ display:'flex', gap:8, marginTop:2, flexWrap:'wrap' }}>
                              {p.category_name && (
                                <span style={{ fontSize:11, color, fontWeight:600 }}>{p.category_name}</span>
                              )}
                              {pairMode && (
                                <span style={{ fontSize:11, color: p.pair_confirmed ? '#06d6a0' : '#f59e0b' }}>
                                  {p.pair_confirmed ? '✓ Confirmada' : p.seeking_partner ? 'Busca pareja' : 'Pendiente'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Organizador: cambiar categoría */}
                        {isCreator && hasCats && isOpen && (
                          <div style={{ marginTop:10 }}>
                            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>Cambiar categoría:</div>
                            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                              {cats.map(c => (
                                <button key={c.id} onClick={() => changeCategory(p.id, c.id, c.name)}
                                  style={{
                                    fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                                    cursor:'pointer', fontFamily:'inherit',
                                    background: p.category_id === c.id ? color : 'var(--glass)',
                                    color: p.category_id === c.id ? 'white' : 'var(--muted)',
                                    border: p.category_id === c.id ? 'none' : '1px solid var(--border)',
                                  }}>{c.name}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}

        </div>
      </div>

      {/* ── Modal seeding ── */}
      {showSeeding && (
        <div style={{ position:'fixed', inset:0, zIndex:600,
          background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
          display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ background:'var(--bg)', flex:1, maxWidth:480, width:'100%', margin:'0 auto',
            padding:'24px 18px 140px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <h2 style={{ fontWeight:900, fontSize:20, margin:0 }}>Ordenar el cuadro</h2>
                {seedCat && cats.length > 0 && (
                  <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>
                    Categoría: {cats.find(c=>c.id===seedCat)?.name}
                  </div>
                )}
              </div>
              <button onClick={() => setShowSeeding(false)}
                style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:50,
                  width:36, height:36, cursor:'pointer', color:'var(--text)', fontSize:18,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, marginBottom:20 }}>
              Arrastra las parejas para decidir su posición en el cuadro. Posición 1 contra 2, 3 contra 4, etc.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter}
              onDragStart={({ active }) => setActiveId(active.id)}
              onDragEnd={({ active, over }) => {
                setActiveId(null)
                if (!over || active.id === over.id) return
                setSeedOrder(prev => {
                  const oi = prev.findIndex(p => p.id === active.id)
                  const ni = prev.findIndex(p => p.id === over.id)
                  return arrayMove(prev, oi, ni)
                })
              }}>
              <SortableContext items={seedOrder.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {seedOrder.map((pair, i) => (
                    <SortablePair key={pair.id} pair={pair} index={i} color={color} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId ? (() => {
                  const pair = seedOrder.find(p => p.id === activeId)
                  if (!pair) return null
                  return (
                    <div style={{ padding:'13px 16px', borderRadius:14, display:'flex', alignItems:'center', gap:12,
                      border:`2px solid ${color}`, background:'var(--bg)',
                      boxShadow:'0 8px 32px rgba(0,0,0,0.25)' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:`${color}20`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color }}>
                        {seedOrder.findIndex(p => p.id === activeId)+1}
                      </div>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>
                        {pairName(pair)}
                      </div>
                    </div>
                  )
                })() : null}
              </DragOverlay>
            </DndContext>

            <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
              width:'100%', maxWidth:480, padding:'16px 18px 32px', background:'var(--bg)',
              borderTop:'1px solid var(--border)', display:'flex', gap:10 }}>
              <button onClick={() => setShowSeeding(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancelar</button>
              <button onClick={confirmSeeding} className="btn btn-primary" style={{ flex:2, background:color }}>
                🏆 Confirmar y generar cuadro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal inscripción ── */}
      {showJoin && (
        <div style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.7)',
          backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:'var(--bg)', borderRadius:'24px 24px 0 0', padding:'28px 20px 40px',
            width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto' }}>
            <h3 style={{ fontWeight:800, fontSize:18, marginBottom:6 }}>Inscribirse</h3>

            {/* Selector de categoría */}
            {hasCats && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:10 }}>¿En qué categoría?</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {cats.map(c => {
                    const catCount = participants.filter(p => p.category_id === c.id).length
                    const catFull  = catCount >= tournament.max_pairs
                    return (
                      <button key={c.id} onClick={() => !catFull && setSelectedCat(c.id)}
                        disabled={catFull}
                        style={{
                          padding:'13px 16px', borderRadius:14, textAlign:'left', cursor: catFull ? 'default' : 'pointer',
                          fontFamily:'inherit', opacity: catFull ? 0.5 : 1,
                          border: selectedCat===c.id ? `2px solid ${color}` : '1.5px solid var(--border)',
                          background: selectedCat===c.id ? `${color}10` : 'var(--surface)',
                        }}>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontWeight:700, fontSize:14 }}>{c.name}</span>
                          <span style={{ fontSize:12, color: catFull ? '#ef4444' : 'var(--muted)' }}>
                            {catCount}/{tournament.max_pairs} {catFull ? '· Completa' : ''}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pareja */}
            {pairMode ? (
              <>
                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, marginBottom:16 }}>
                  Busca a tu pareja por username, o apúntate buscando pareja.
                </p>
                <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                  <input className="input" style={{ flex:1 }}
                    placeholder="Buscar por @usuario..."
                    value={partnerSearch}
                    onChange={e => { setPartnerSearch(e.target.value); setPartnerResult(null) }}
                    onKeyDown={e => e.key==='Enter' && searchPartner()} />
                  <button onClick={searchPartner} className="btn btn-primary" style={{ padding:'0 14px' }}>Buscar</button>
                </div>
                {partnerResult && (
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
                    {partnerResult.length===0 ? (
                      <p style={{ fontSize:13, color:'var(--muted)', textAlign:'center', padding:'8px 0' }}>No encontrado</p>
                    ) : partnerResult.map(p => (
                      <button key={p.id} onClick={() => handleJoin(p)}
                        style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                          background:'var(--surface)', border:'1px solid var(--border)',
                          borderRadius:12, cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:`${color}20`,
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                          {p.avatar_url ? <img src={p.avatar_url} style={{ width:36,height:36,borderRadius:'50%',objectFit:'cover' }}/> : '👤'}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13 }}>{p.full_name || p.username}</div>
                          <div style={{ fontSize:11, color:'var(--muted)' }}>@{p.username}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {joinError && <p style={{ fontSize:13, color:'#ef4444', marginBottom:8 }}>{joinError}</p>}
                <button onClick={() => handleJoin(null)} disabled={joining}
                  className="btn btn-primary" style={{ width:'100%', marginBottom:10, background:color }}>
                  {joining ? 'Inscribiendo...' : '🔍 Inscribirme buscando pareja'}
                </button>
              </>
            ) : (
              <>
                {joinError && <p style={{ fontSize:13, color:'#ef4444', marginBottom:8 }}>{joinError}</p>}
                <button onClick={() => handleJoin(null)} disabled={joining}
                  className="btn btn-primary" style={{ width:'100%', marginBottom:10, background:color }}>
                  {joining ? 'Inscribiendo...' : '✓ Confirmar inscripción'}
                </button>
              </>
            )}
            <button onClick={() => setShowJoin(false)} className="btn btn-ghost" style={{ width:'100%' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </>
  )
}
