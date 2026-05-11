'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORT_COLORS } from '@/components/SportIcon'
import ThemeButton from '@/components/ThemeButton'

const SPORT_ICONS = {
  padel:'🎾', tenis:'🎾', badminton:'🏸', voleibol:'🏐',
  futbol:'⚽', baloncesto:'🏀', running:'🏃', natacion:'🏊', ciclismo:'🚴',
}
const FORMAT_LABELS = {
  single_elimination: 'Eliminación directa',
  groups: 'Grupos + eliminatoria',
}
const STATUS_LABELS = {
  open:        { label:'Inscripciones abiertas', color:'#06d6a0' },
  in_progress: { label:'En curso',               color:'#f59e0b' },
  finished:    { label:'Finalizado',             color:'var(--muted)' },
  cancelled:   { label:'Cancelado',              color:'#ef4444' },
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60)   return 'ahora mismo'
  if (diff < 3600) return `hace ${Math.floor(diff/60)} min`
  if (diff < 86400)return `hace ${Math.floor(diff/3600)} h`
  return `hace ${Math.floor(diff/86400)} d`
}

export default function TournamentsPage() {
  const { user, profile } = useAuth()
  const [tournaments, setTournaments] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [sportFilter, setSportFilter] = useState('all')
  const [statusFilter,setStatusFilter]= useState('open')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const sb = getSupabase()
      if (!sb) { setLoading(false); return }

      let q = sb.from('tournaments').select('*').order('date', { ascending: true })
      if (statusFilter !== 'all') q = q.eq('status', statusFilter)
      if (sportFilter  !== 'all') q = q.eq('sport',  sportFilter)

      const { data } = await q
      if (data) {
        // Cargar nombres de creadores
        const uids = [...new Set(data.map(t => t.creator_id).filter(Boolean))]
        let pMap = {}
        if (uids.length > 0) {
          const { data: pData } = await sb.from('profiles')
            .select('id, full_name, username, account_type').in('id', uids)
          if (pData) pData.forEach(p => { pMap[p.id] = p })
        }
        // Contar participantes por torneo
        const tids = data.map(t => t.id)
        let countMap = {}
        if (tids.length > 0) {
          const { data: cData } = await sb.from('tournament_participants')
            .select('tournament_id').in('tournament_id', tids)
          if (cData) cData.forEach(c => { countMap[c.tournament_id] = (countMap[c.tournament_id] || 0) + 1 })
        }
        setTournaments(data.map(t => ({
          ...t,
          creator_name:    pMap[t.creator_id]?.full_name || 'Organizador',
          creator_verified: pMap[t.creator_id]?.account_type === 'business',
          pair_count:      countMap[t.id] || 0,
        })))
      }
      setLoading(false)
    }
    load()
  }, [sportFilter, statusFilter])

  const isMyBusiness = profile?.account_type === 'business'
  const now = new Date().toISOString()

  return (
    <>
      <div className="page-wrap">
        <header style={{ paddingTop:16, paddingBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontWeight:900, fontSize:22, margin:0, letterSpacing:'-0.04em' }}>Torneos</h1>
            <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Compite con la comunidad</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeButton />
            {isMyBusiness && (
              <Link href="/create/tournament" className="btn btn-primary" style={{ fontSize:13, padding:'8px 14px' }}>
                + Crear
              </Link>
            )}
          </div>
        </header>

        {/* Toggle Eventos / Torneos */}
        <div style={{ display:'flex', gap:0, background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:14, overflow:'hidden', marginBottom:16 }}>
          <Link href="/events" style={{ flex:1, padding:'11px 0', textAlign:'center', textDecoration:'none',
            fontWeight:600, fontSize:13, color:'var(--muted)' }}>
            🗓 Eventos
          </Link>
          <Link href="/tournaments" style={{ flex:1, padding:'11px 0', textAlign:'center', textDecoration:'none',
            fontWeight:700, fontSize:13, background:'#586875', color:'#f6eddc' }}>
            🏆 Torneos
          </Link>
        </div>

        {/* Filtro estado */}
        <div style={{ display:'flex', gap:6, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
          {[
            { id:'open',        label:'Abiertos'  },
            { id:'in_progress', label:'En curso'  },
            { id:'finished',    label:'Finalizados'},
            { id:'all',         label:'Todos'     },
          ].map(f => (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              className={`pill ${statusFilter===f.id?'pill-active':'pill-inactive'}`}
              style={{ whiteSpace:'nowrap', flexShrink:0 }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtro deporte */}
        <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
          {[{id:'all',icon:'✨',label:'Todos'},{id:'padel',icon:'🎾',label:'Pádel'},{id:'tenis',icon:'🎾',label:'Tenis'},
            {id:'badminton',icon:'🏸',label:'Bádminton'},{id:'futbol',icon:'⚽',label:'Fútbol'},
            {id:'baloncesto',icon:'🏀',label:'Baloncesto'},{id:'voleibol',icon:'🏐',label:'Vóley'}].map(s => (
            <button key={s.id} onClick={() => setSportFilter(s.id)}
              className={`pill ${sportFilter===s.id?'pill-active':'pill-inactive'}`}
              style={{ whiteSpace:'nowrap', flexShrink:0 }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}><div className="spinner"/></div>
        ) : tournaments.length === 0 ? (
          <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>No hay torneos disponibles</div>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>
              Aún no hay torneos en esta categoría. Los clubs y negocios deportivos pueden crear torneos desde su perfil verificado.
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {tournaments.map((t, i) => {
              const color    = SPORT_COLORS[t.sport] || '#586875'
              const icon     = SPORT_ICONS[t.sport]  || '🏅'
              const status   = STATUS_LABELS[t.status] || STATUS_LABELS.open
              const pct      = t.max_pairs > 0 ? Math.round((t.pair_count / t.max_pairs) * 100) : 0
              const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : color
              const isFeatured = t.featured_until && t.featured_until > now

              return (
                <Link key={t.id} href={`/tournaments/${t.id}`}
                  className={`card anim-${Math.min(i+1,6)}`}
                  style={{ display:'block', overflow:'hidden',
                    ...(isFeatured ? { boxShadow:`0 0 0 2px ${color}55, 0 4px 18px ${color}22` } : {}) }}>

                  {/* Barra superior */}
                  <div style={{ height: isFeatured ? 4 : 3, background:`linear-gradient(90deg,${color},${color}55)`, position:'relative' }}>
                    {isFeatured && (
                      <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%) translateY(4px)',
                        fontSize:10, fontWeight:800, letterSpacing:'0.05em',
                        background:color, color:'white', borderRadius:20, padding:'2px 9px' }}>DESTACADO</span>
                    )}
                  </div>

                  <div style={{ padding:'16px 18px' }}>
                    <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:10 }}>
                      {/* Icono */}
                      <div style={{ background:`${color}18`, border:`1.5px solid ${color}30`, borderRadius:16,
                        width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:26 }}>{icon}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                          <h3 style={{ fontSize:15, fontWeight:700, margin:0, letterSpacing:'-0.02em', lineHeight:1.3, color:'var(--text)' }}>
                            {t.title}
                          </h3>
                          <span style={{ fontSize:11, fontWeight:700, color:status.color, flexShrink:0,
                            background:`${status.color}15`, borderRadius:20, padding:'2px 9px', border:`1px solid ${status.color}30` }}>
                            {status.label}
                          </span>
                        </div>
                        <div style={{ fontSize:12, color:'var(--muted)', marginTop:3, display:'flex', alignItems:'center', gap:4 }}>
                          por {t.creator_name}
                          {t.creator_verified && (
                            <span style={{ fontSize:9, fontWeight:800, background:'#586875', color:'#f6eddc',
                              borderRadius:20, padding:'1px 7px' }}>✓</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                      {t.date && (
                        <span style={{ fontSize:12, color:'var(--muted)', background:'var(--glass)', borderRadius:8, padding:'3px 9px' }}>
                          📅 {new Date(t.date+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short'})}
                          {t.time ? ` · ${t.time.slice(0,5)}h` : ''}
                        </span>
                      )}
                      <span style={{ fontSize:12, color:'var(--muted)', background:'var(--glass)', borderRadius:8, padding:'3px 9px' }}>
                        📍 {t.location}
                      </span>
                      <span style={{ fontSize:12, color, background:`${color}12`, borderRadius:8, padding:'3px 9px', fontWeight:600 }}>
                        {t.pair_mode ? '👥 Parejas' : '👤 Individual'} · {FORMAT_LABELS[t.format]}
                      </span>
                      {t.price && t.price !== 'Gratis' && (
                        <span style={{ fontSize:12, color:'var(--muted)', background:'var(--glass)', borderRadius:8, padding:'3px 9px' }}>
                          💶 {t.price}
                        </span>
                      )}
                    </div>

                    {/* Barra de ocupación */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                      <div style={{ flex:1, height:5, background:'var(--border)', borderRadius:8, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:8, transition:'width 0.4s ease' }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color: pct>=90?'#ef4444': pct>=70?'#f59e0b': color, flexShrink:0 }}>
                        {t.pair_count}/{t.max_pairs}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <Navbar />
    </>
  )
}
