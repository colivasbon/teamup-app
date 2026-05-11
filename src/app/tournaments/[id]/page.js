'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORT_COLORS } from '@/components/SportIcon'

const SPORT_ICONS = { padel:'🎾', tenis:'🎾', badminton:'🏸', voleibol:'🏐', futbol:'⚽', baloncesto:'🏀', running:'🏃', natacion:'🏊', ciclismo:'🚴' }
const FORMAT_LABELS = { single_elimination:'Eliminación directa', groups:'Grupos + eliminatoria' }
const STATUS_LABELS = { open:'Inscripciones abiertas', in_progress:'En curso', finished:'Finalizado', cancelled:'Cancelado' }
const STATUS_COLORS = { open:'#06d6a0', in_progress:'#f59e0b', finished:'var(--muted)', cancelled:'#ef4444' }

// Generar cuadro de llaves para eliminación directa
function generateBracket(pairs) {
  if (!pairs || pairs.length < 2) return []
  const n = pairs.length
  // Rellenar hasta potencia de 2
  const size = Math.pow(2, Math.ceil(Math.log2(n)))
  const seeded = [...pairs]
  while (seeded.length < size) seeded.push(null) // bye
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

// Nombre de la pareja
function pairName(p) {
  if (!p) return 'BYE'
  if (p.player2_name && p.pair_confirmed) return `${p.player1_name} / ${p.player2_name}`
  if (p.seeking_partner) return `${p.player1_name} (busca pareja)`
  return p.player1_name || 'Pareja'
}

export default function TournamentDetail() {
  const { id }         = useParams()
  const router         = useRouter()
  const { user, profile } = useAuth()

  const [tournament,    setTournament]   = useState(null)
  const [participants,  setParticipants] = useState([])
  const [loading,       setLoading]      = useState(true)
  const [tab,           setTab]          = useState('Info') // Info | Cuadro | Participantes
  const [bracket,       setBracket]      = useState([])

  // Inscripción
  const [showJoin,      setShowJoin]     = useState(false)
  const [partnerSearch, setPartnerSearch]= useState('')
  const [partnerResult, setPartnerResult]= useState(null)
  const [seekingPartner,setSeekingPartner]=useState(false)
  const [joining,       setJoining]      = useState(false)
  const [joinError,     setJoinError]    = useState('')
  const [joined,        setJoined]       = useState(false)
  const [myEntry,       setMyEntry]      = useState(null)

  const isCreator  = user && tournament?.creator_id === user.id
  const isOpen     = tournament?.status === 'open'
  const pairMode   = tournament?.pair_mode

  // Carga datos
  const load = useCallback(async () => {
    setLoading(true)
    const sb = getSupabase()
    if (!sb) { setLoading(false); return }

    const { data: t } = await sb.from('tournaments').select('*').eq('id', id).single()
    if (!t) { router.push('/tournaments'); return }
    setTournament(t)

    // Participantes
    const { data: pData } = await sb.from('tournament_participants')
      .select('*').eq('tournament_id', id).order('created_at', { ascending: true })

    if (pData) {
      // Enriquecer con nombres de perfil
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

      // Estado del usuario actual
      if (user) {
        const mine = enriched.find(p => p.player1_id === user.id || p.player2_id === user.id)
        setMyEntry(mine || null)
        setJoined(!!mine)
      }

      // Generar cuadro si hay bracket guardado o generar desde participantes confirmados
      if (t.bracket) {
        setBracket(t.bracket)
      } else if (t.status !== 'open') {
        const confirmed = enriched.filter(p => !pairMode || p.pair_confirmed || !p.player2_id)
        setBracket(generateBracket(confirmed))
      }
    }
    setLoading(false)
  }, [id, user])

  useEffect(() => { load() }, [load])

  // Buscar pareja por username
  const searchPartner = async () => {
    if (!partnerSearch.trim()) return
    const sb = getSupabase()
    const { data } = await sb.from('profiles')
      .select('id, full_name, username, avatar_url')
      .ilike('username', `%${partnerSearch.trim()}%`)
      .neq('id', user.id)
      .limit(5)
    setPartnerResult(data || [])
  }

  // Inscribirse
  const handleJoin = async (partner) => {
    if (!user) { router.push('/auth'); return }
    setJoining(true); setJoinError('')
    const sb = getSupabase()
    if (!sb) { setJoining(false); return }

    const { error } = await sb.from('tournament_participants').insert({
      tournament_id:   id,
      player1_id:      user.id,
      player1_name:    profile?.full_name || profile?.username || 'Jugador',
      player2_id:      partner?.id || null,
      player2_name:    partner ? (partner.full_name || partner.username) : null,
      pair_confirmed:  !pairMode || !partner, // individual o buscando pareja = confirmed automáticamente
      seeking_partner: pairMode && !partner,
    })

    if (error) { setJoinError(error.message); setJoining(false); return }

    setShowJoin(false)
    setJoining(false)
    load()
  }

  // Confirmar como pareja (cuando te invitan)
  const confirmPartner = async () => {
    if (!myEntry) return
    const sb = getSupabase()
    await sb.from('tournament_participants')
      .update({ pair_confirmed: true })
      .eq('id', myEntry.id)
    load()
  }

  // Cancelar inscripción
  const handleLeave = async () => {
    if (!myEntry) return
    const sb = getSupabase()
    await sb.from('tournament_participants').delete().eq('id', myEntry.id)
    setJoined(false); setMyEntry(null); load()
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
  const pct      = tournament.max_pairs > 0 ? Math.round((participants.length / tournament.max_pairs) * 100) : 0
  const isFull   = participants.length >= tournament.max_pairs

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
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.05em',
              background:`${STATUS_COLORS[tournament.status]}22`, color: STATUS_COLORS[tournament.status],
              border:`1px solid ${STATUS_COLORS[tournament.status]}40`,
              borderRadius:20, padding:'4px 12px' }}>
              {STATUS_LABELS[tournament.status]}
            </span>
          </div>

          <div style={{ fontSize:52, marginBottom:10 }}>{icon}</div>
          <h1 style={{ color:'white', fontWeight:900, fontSize:24, margin:'0 0 6px', letterSpacing:'-0.04em', lineHeight:1.2 }}>
            {tournament.title}
          </h1>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>
            🏢 {tournament.creator_name || 'Organizador'} · {FORMAT_LABELS[tournament.format]}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'2px solid var(--border)', background:'var(--bg)' }}>
          {['Info','Cuadro','Participantes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'12px 0', border:'none', background:'none', cursor:'pointer',
              fontFamily:'inherit', fontSize:13, fontWeight: tab===t ? 700 : 500,
              color: tab===t ? color : 'var(--muted)',
              borderBottom: tab===t ? `2px solid ${color}` : '2px solid transparent',
              marginBottom:-2, transition:'all 0.15s ease',
            }}>{t}</button>
          ))}
        </div>

        <div className="page-wrap" style={{ paddingTop:20 }}>

          {/* ── TAB INFO ── */}
          {tab === 'Info' && (
            <div className="anim-1">
              {tournament.description && (
                <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6, marginBottom:20 }}>
                  {tournament.description}
                </p>
              )}

              {/* Datos clave */}
              <div className="card" style={{ padding:'16px 18px', marginBottom:16 }}>
                {[
                  { icon:'📅', label: tournament.date ? new Date(tournament.date+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}) + (tournament.time ? ` · ${tournament.time.slice(0,5)}h` : '') : 'Fecha por confirmar' },
                  { icon:'📍', label: tournament.location },
                  { icon:'👥', label: `${participants.length} / ${tournament.max_pairs} ${pairMode ? 'parejas' : 'participantes'}` },
                  { icon:'🎮', label: FORMAT_LABELS[tournament.format] },
                  { icon:'💶', label: tournament.price || 'Gratis' },
                  { icon: pairMode ? '🎾' : '👤', label: pairMode ? 'Inscripción por parejas' : 'Inscripción individual' },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0',
                    borderBottom: i<5 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize:18, width:24, textAlign:'center' }}>{r.icon}</span>
                    <span style={{ fontSize:13, color:'var(--text)' }}>{r.label}</span>
                  </div>
                ))}
              </div>

              {/* Barra de ocupación */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--muted)', marginBottom:6 }}>
                  <span>{pairMode ? 'Parejas inscritas' : 'Participantes'}</span>
                  <span style={{ fontWeight:700, color: pct>=90?'#ef4444':pct>=70?'#f59e0b':color }}>
                    {participants.length}/{tournament.max_pairs}
                  </span>
                </div>
                <div style={{ height:6, background:'var(--border)', borderRadius:8, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct>=90?'#ef4444':pct>=70?'#f59e0b':color,
                    borderRadius:8, transition:'width 0.6s ease' }}/>
                </div>
              </div>

              {/* Estado de mi inscripción */}
              {joined && myEntry && (
                <div className="card" style={{ padding:'16px 18px', marginBottom:16,
                  border:`1px solid ${color}40`, background:`${color}08` }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color }}>
                    ✓ Inscrito
                  </div>
                  {pairMode && (
                    myEntry.player1_id === user?.id ? (
                      myEntry.player2_name
                        ? <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>
                            Pareja: {myEntry.player2_name} {myEntry.pair_confirmed ? '· Confirmada ✓' : '· Pendiente de confirmar'}
                          </p>
                        : <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Buscando pareja</p>
                    ) : (
                      !myEntry.pair_confirmed && (
                        <div>
                          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:10 }}>
                            {myEntry.player1_name} te ha invitado como pareja. ¿Confirmas?
                          </p>
                          <button onClick={confirmPartner} className="btn btn-primary"
                            style={{ width:'100%', fontSize:13, background:color }}>
                            Confirmar inscripción
                          </button>
                        </div>
                      )
                    )
                  )}
                  <button onClick={handleLeave}
                    style={{ marginTop:10, width:'100%', background:'none', border:'1px solid rgba(239,68,68,0.3)',
                      color:'#ef4444', borderRadius:10, padding:'8px 0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                    Cancelar inscripción
                  </button>
                </div>
              )}

              {/* Botón inscribirse */}
              {!joined && isOpen && !isFull && user && (
                <button onClick={() => setShowJoin(true)}
                  className="btn btn-primary" style={{ width:'100%', background:color, marginBottom:12 }}>
                  {pairMode ? '🎾 Inscribirme con pareja' : '✓ Inscribirme'}
                </button>
              )}
              {!joined && isFull && (
                <div style={{ textAlign:'center', fontSize:13, color:'#ef4444', marginBottom:12 }}>
                  El torneo está completo
                </div>
              )}
              {!user && (
                <Link href="/auth" className="btn btn-primary" style={{ display:'block', textAlign:'center', background:color, marginBottom:12 }}>
                  Entra para inscribirte
                </Link>
              )}
            </div>
          )}

          {/* ── TAB CUADRO ── */}
          {tab === 'Cuadro' && (
            <div className="anim-1">
              {bracket.length === 0 ? (
                <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>Cuadro no disponible aún</div>
                  <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>
                    El cuadro de llaves se genera cuando el organizador cierra las inscripciones y el torneo comienza.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX:'auto', paddingBottom:16 }}>
                  <div style={{ display:'flex', gap:0, minWidth: bracket.length * 180 }}>
                    {bracket.map((round, ri) => (
                      <div key={ri} style={{ flex:1, display:'flex', flexDirection:'column',
                        justifyContent:'space-around', minWidth:160 }}>
                        <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', textAlign:'center',
                          padding:'8px 0', letterSpacing:'0.05em', textTransform:'uppercase',
                          borderBottom:'1px solid var(--border)', marginBottom:8 }}>
                          {ri === bracket.length-1 ? 'Final' : ri === bracket.length-2 ? 'Semifinal' : `Ronda ${ri+1}`}
                        </div>
                        {round.map((match, mi) => (
                          <div key={mi} style={{ margin:'8px 6px' }}>
                            {[match.p1, match.p2].map((p, pi) => (
                              <div key={pi} style={{
                                padding:'9px 12px', borderRadius: pi===0 ? '10px 10px 0 0' : '0 0 10px 10px',
                                background: !p ? 'var(--surface)' : match.winner === p ? `${color}20` : 'var(--surface)',
                                border:`1px solid ${!p ? 'var(--border)' : match.winner === p ? color+'60' : 'var(--border)'}`,
                                borderBottom: pi===0 ? '1px dashed var(--border)' : undefined,
                                fontSize:12, fontWeight: match.winner === p ? 700 : 400,
                                color: !p ? 'var(--muted)' : match.winner === p ? color : 'var(--text)',
                                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                              }}>
                                {match.winner === p && '🏆 '}
                                {p ? pairName(p) : 'BYE'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer: generar cuadro */}
              {isCreator && tournament.status === 'open' && participants.length >= 2 && (
                <button onClick={async () => {
                  const confirmed = participants.filter(p => !pairMode || p.pair_confirmed || p.seeking_partner)
                  const br = generateBracket(confirmed)
                  const sb = getSupabase()
                  await sb.from('tournaments').update({ bracket: br, status:'in_progress' }).eq('id', id)
                  setBracket(br)
                  setTournament(prev => ({...prev, status:'in_progress', bracket: br}))
                }} className="btn btn-primary" style={{ width:'100%', marginTop:16, background:color }}>
                  🏆 Cerrar inscripciones y generar cuadro ({participants.length} inscritos)
                </button>
              )}
            </div>
          )}

          {/* ── TAB PARTICIPANTES ── */}
          {tab === 'Participantes' && (
            <div className="anim-1">
              {participants.length === 0 ? (
                <div className="card" style={{ padding:'40px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
                  <p style={{ fontSize:14, color:'var(--muted)' }}>Aún no hay inscritos. ¡Sé el primero!</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {participants.map((p, i) => (
                    <div key={p.id} className="card" style={{ padding:'13px 16px', display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:`${color}20`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:12, fontWeight:800, color, flexShrink:0 }}>
                        {i+1}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>
                          {pairMode ? pairName(p) : p.player1_name}
                        </div>
                        {pairMode && (
                          <div style={{ fontSize:11, color: p.pair_confirmed ? '#06d6a0' : p.seeking_partner ? '#f59e0b' : 'var(--muted)' }}>
                            {p.pair_confirmed ? '✓ Pareja confirmada' : p.seeking_partner ? '⏳ Buscando pareja' : '⏳ Pendiente de confirmar'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Modal inscripción por parejas */}
      {showJoin && (
        <div style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.7)',
          backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:'var(--bg)', borderRadius:'24px 24px 0 0', padding:'28px 20px 40px',
            width:'100%', maxWidth:480 }}>
            <h3 style={{ fontWeight:800, fontSize:18, marginBottom:6 }}>
              {pairMode ? '¿Con quién juegas?' : 'Confirmar inscripción'}
            </h3>
            {pairMode ? (
              <>
                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, marginBottom:20 }}>
                  Si ya tienes pareja, búscala por su nombre de usuario. Si no, te apuntamos como buscando pareja y otros jugadores podrán proponer emparejarse contigo.
                </p>

                {!seekingPartner && (
                  <>
                    <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                      <input className="input" style={{ flex:1 }}
                        placeholder="Buscar por @usuario..."
                        value={partnerSearch}
                        onChange={e => { setPartnerSearch(e.target.value); setPartnerResult(null) }}
                        onKeyDown={e => e.key === 'Enter' && searchPartner()} />
                      <button onClick={searchPartner} className="btn btn-primary" style={{ padding:'0 16px' }}>Buscar</button>
                    </div>
                    {partnerResult && (
                      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
                        {partnerResult.length === 0 ? (
                          <p style={{ fontSize:13, color:'var(--muted)', textAlign:'center', padding:'8px 0' }}>
                            No se encontró ningún usuario
                          </p>
                        ) : partnerResult.map(p => (
                          <button key={p.id} onClick={() => handleJoin(p)}
                            style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                              background:'var(--surface)', border:'1px solid var(--border)',
                              borderRadius:12, cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>
                            <div style={{ width:36, height:36, borderRadius:'50%', background:`${color}20`,
                              display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                              {p.avatar_url ? <img src={p.avatar_url} style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover' }}/> : '👤'}
                            </div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13 }}>{p.full_name || p.username}</div>
                              <div style={{ fontSize:11, color:'var(--muted)' }}>@{p.username}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {joinError && (
                  <p style={{ fontSize:13, color:'#ef4444', marginBottom:8 }}>{joinError}</p>
                )}

                <button onClick={() => handleJoin(null)} disabled={joining}
                  className="btn btn-primary" style={{ width:'100%', marginBottom:10, background:color }}>
                  {joining ? 'Inscribiendo...' : '🔍 Inscribirme buscando pareja'}
                </button>
                <button onClick={() => setShowJoin(false)} className="btn btn-ghost" style={{ width:'100%' }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:20 }}>
                  Te inscribirás individualmente en el torneo.
                </p>
                {joinError && <p style={{ fontSize:13, color:'#ef4444', marginBottom:8 }}>{joinError}</p>}
                <button onClick={() => handleJoin(null)} disabled={joining}
                  className="btn btn-primary" style={{ width:'100%', marginBottom:10, background:color }}>
                  {joining ? 'Inscribiendo...' : '✓ Confirmar inscripción'}
                </button>
                <button onClick={() => setShowJoin(false)} className="btn btn-ghost" style={{ width:'100%' }}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Navbar />
    </>
  )
}
