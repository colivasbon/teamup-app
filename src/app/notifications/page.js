'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import ThemeButton from '@/components/ThemeButton'

const TYPE_ICONS = {
  joined:    '👥',
  left:      '🚪',
  message:   '💬',
  event_new: '🎯',
  event_full:'🔥',
  karma:     '⭐',
  like:      '❤️',
  comment:   '💬',
}

// Tipos de alta prioridad (eventos)
const HIGH_PRIORITY_TYPES = ['joined','left','message','event_new','event_full','karma']

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)    return 'hace un momento'
  if (diff < 3600)  return `hace ${Math.floor(diff/60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`
  return `hace ${Math.floor(diff/86400)} d`
}

export default function NotificationsPage() {
  const { user }  = useAuth()
  const router    = useRouter()
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = useCallback(async () => {
    if (!user) return
    try {
      const sb = getSupabase(); if (!sb) return
      const { data } = await sb.from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(60)
      if (data) setNotifs(data)
    } catch(_) {}
    setLoading(false)
  }, [user])

  useEffect(() => { fetchNotifs() }, [fetchNotifs])

  // Polling cada 30s
  useEffect(() => {
    const iv = setInterval(fetchNotifs, 30000)
    return () => clearInterval(iv)
  }, [fetchNotifs])

  const markAllRead = async () => {
    const sb = getSupabase(); if (!sb) return
    const unread = notifs.filter(n => !n.read).map(n => n.id)
    if (!unread.length) return
    await sb.from('notifications').update({ read: true }).in('id', unread)
    setNotifs(p => p.map(n => ({ ...n, read: true })))
  }

  const handleClick = async (notif) => {
    // Marcar como leída
    const sb = getSupabase()
    if (sb && !notif.read) {
      await sb.from('notifications').update({ read: true }).eq('id', notif.id)
      setNotifs(p => p.map(n => n.id === notif.id ? { ...n, read: true } : n))
    }

    // Navegar según el tipo
    if (notif.event_id) {
      if (notif.type === 'message') {
        // Ir directamente al chat del evento
        router.push(`/events/${notif.event_id}?tab=Chat`)
      } else {
        router.push(`/events/${notif.event_id}`)
      }
    }
  }

  const eventNotifs  = notifs.filter(n => HIGH_PRIORITY_TYPES.includes(n.type) || n.priority === 'high')
  const socialNotifs = notifs.filter(n => ['like','comment'].includes(n.type) || n.priority === 'low')
  const unreadCount  = notifs.filter(n => !n.read).length

  function NotifCard({ notif }) {
    const isHigh = HIGH_PRIORITY_TYPES.includes(notif.type) || notif.priority === 'high'
    return (
      <button
        onClick={() => handleClick(notif)}
        style={{
          display:'flex', alignItems:'flex-start', gap:12, width:'100%',
          background: notif.read ? 'transparent' : 'rgba(88,104,117,0.08)',
          border: notif.read ? '1px solid var(--border)' : '1px solid rgba(88,104,117,0.22)',
          borderRadius:16, padding:'14px 16px',
          cursor: notif.event_id ? 'pointer' : 'default',
          textAlign:'left', fontFamily:'inherit',
          transition:'all 0.15s ease',
        }}
      >
        {/* Icono */}
        <div style={{
          width:42, height:42, borderRadius:'50%', flexShrink:0,
          background: isHigh ? 'rgba(88,104,117,0.14)' : 'rgba(239,68,68,0.10)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:20, position:'relative',
        }}>
          {TYPE_ICONS[notif.type] || '🔔'}
          {!notif.read && (
            <div style={{
              position:'absolute', top:0, right:0, width:10, height:10,
              borderRadius:'50%', background:'#ef4444',
              border:'2px solid var(--bg)',
            }}/>
          )}
        </div>

        {/* Texto */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:'0 0 3px', fontSize:13, color:'var(--text)', lineHeight:1.5 }}>
            {notif.message}
          </p>
          <span style={{ fontSize:11, color:'var(--muted)' }}>{timeAgo(notif.created_at)}</span>
        </div>

        {/* Flecha si es clickable */}
        {notif.event_id && (
          <span style={{ fontSize:16, color:'var(--muted)', flexShrink:0, alignSelf:'center' }}>›</span>
        )}
      </button>
    )
  }

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>
        <header style={{ paddingTop:60, paddingBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 2px', letterSpacing:'-0.04em' }}>Notificaciones</h1>
            {unreadCount > 0 && (
              <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>{unreadCount} sin leer</p>
            )}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeButton />
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                background:'var(--glass)', border:'1px solid var(--border)',
                borderRadius:10, padding:'7px 12px', fontSize:12, fontWeight:600,
                color:'var(--primary)', cursor:'pointer', fontFamily:'inherit',
              }}>
                ✓ Marcar leídas
              </button>
            )}
          </div>
        </header>

        {loading && (
          <div style={{ padding:'40px 0', textAlign:'center' }}><div className="spinner"/></div>
        )}

        {!loading && notifs.length === 0 && (
          <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔔</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Sin notificaciones aún</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Cuando alguien se una a tus eventos o interactúe con tus momentos, aparecerá aquí</div>
          </div>
        )}

        {!loading && notifs.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

            {/* ── Sección Eventos (alta prioridad) ── */}
            {eventNotifs.length > 0 && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'var(--primary)', textTransform:'uppercase' }}>Eventos</span>
                  <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {eventNotifs.map(n => <NotifCard key={n.id} notif={n} />)}
                </div>
              </div>
            )}

            {/* ── Sección Actividad social (baja prioridad) ── */}
            {socialNotifs.length > 0 && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'var(--muted)', textTransform:'uppercase' }}>Actividad social</span>
                  <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {socialNotifs.map(n => <NotifCard key={n.id} notif={n} />)}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
      <Navbar />
    </>
  )
}
