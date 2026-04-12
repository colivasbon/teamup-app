'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import ThemeButton from '@/components/ThemeButton'

const EVENT_TYPES  = ['joined','left','message','event_new','event_full','karma']
const SOCIAL_TYPES = ['like','comment']

const TYPE_ICONS = {
  joined:    '👥', left:      '🚪', message:   '💬',
  event_new: '🎯', event_full:'🔥', karma:     '⭐',
  like:      '❤️', comment:   '💬',
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)    return 'ahora mismo'
  if (diff < 3600)  return `hace ${Math.floor(diff/60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`
  return `hace ${Math.floor(diff/86400)} d`
}

export default function NotificationsPage() {
  const { user }   = useAuth()
  const router     = useRouter()
  const [notifs,   setNotifs]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState('eventos') // 'eventos' | 'social'

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
  useEffect(() => {
    const iv = setInterval(fetchNotifs, 30000)
    return () => clearInterval(iv)
  }, [fetchNotifs])

  const markAllRead = async () => {
    const sb = getSupabase(); if (!sb) return
    const unread = visible.filter(n => !n.read).map(n => n.id)
    if (!unread.length) return
    await sb.from('notifications').update({ read: true }).in('id', unread)
    setNotifs(p => p.map(n => unread.includes(n.id) ? { ...n, read: true } : n))
  }

  const handleClick = async (notif) => {
    const sb = getSupabase()
    if (sb && !notif.read) {
      await sb.from('notifications').update({ read: true }).eq('id', notif.id)
      setNotifs(p => p.map(n => n.id === notif.id ? { ...n, read: true } : n))
    }
    if (notif.type === 'like' || notif.type === 'comment') {
      // Las notificaciones sociales guardan el moment_id en event_id
      router.push(`/moments`)
    } else if (notif.event_id) {
      if (notif.type === 'message') {
        router.push(`/events/${notif.event_id}?tab=Chat`)
      } else {
        router.push(`/events/${notif.event_id}`)
      }
    }
  }

  const eventNotifs  = notifs.filter(n => EVENT_TYPES.includes(n.type)  || (!SOCIAL_TYPES.includes(n.type) && n.priority !== 'low'))
  const socialNotifs = notifs.filter(n => SOCIAL_TYPES.includes(n.type) || n.priority === 'low')
  const visible      = activeTab === 'eventos' ? eventNotifs : socialNotifs
  const unreadVisible = visible.filter(n => !n.read).length
  const unreadEvents  = eventNotifs.filter(n => !n.read).length
  const unreadSocial  = socialNotifs.filter(n => !n.read).length

  return (
    <>
      <div className="page-wrap" style={{ paddingTop:0 }}>

        <header style={{ paddingTop:36, paddingBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, margin:'0 0 2px', letterSpacing:'-0.04em' }}>Notificaciones</h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeButton />
            {unreadVisible > 0 && (
              <button onClick={markAllRead} style={{
                background:'var(--glass)', border:'1px solid var(--border)',
                borderRadius:10, padding:'7px 12px', fontSize:12, fontWeight:600,
                color:'var(--primary)', cursor:'pointer', fontFamily:'inherit',
              }}>
                ✓ Leídas
              </button>
            )}
          </div>
        </header>

        {/* Toggle Eventos / Social */}
        <div style={{
          display:'flex', gap:0, background:'var(--surface)',
          border:'1px solid var(--border)', borderRadius:14,
          overflow:'hidden', marginBottom:20,
        }}>
          {[
            { id:'eventos', label:'Eventos', count: unreadEvents,  icon:'🎯' },
            { id:'social',  label:'Social',  count: unreadSocial,  icon:'❤️' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex:1, padding:'13px 0', border:'none', cursor:'pointer',
              fontFamily:'inherit', fontSize:14, fontWeight:700,
              background: activeTab===t.id ? '#586875' : 'transparent',
              color: activeTab===t.id ? '#f6eddc' : 'var(--muted)',
              transition:'all 0.18s ease',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              {t.label}
              {t.count > 0 && (
                <span style={{
                  background: activeTab===t.id ? 'rgba(246,237,220,0.25)' : 'rgba(88,104,117,0.15)',
                  color: activeTab===t.id ? '#f6eddc' : 'var(--primary)',
                  borderRadius:100, fontSize:11, fontWeight:800,
                  padding:'1px 7px', minWidth:20, textAlign:'center',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ padding:'40px 0', textAlign:'center' }}><div className="spinner"/></div>
        )}

        {!loading && visible.length === 0 && (
          <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>
              {activeTab === 'eventos' ? '🎯' : '❤️'}
            </div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>
              {activeTab === 'eventos' ? 'Sin novedades en tus eventos' : 'Sin actividad social aún'}
            </div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>
              {activeTab === 'eventos'
                ? 'Cuando alguien se una a tus eventos o escriba en el chat, aparecerá aquí'
                : 'Cuando alguien dé like o comente tus momentos, aparecerá aquí'}
            </div>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {visible.map(notif => {
              const isEvent = EVENT_TYPES.includes(notif.type)
              const accentColor = isEvent ? '#586875' : '#ef4444'
              return (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:12, width:'100%',
                    background: notif.read ? 'var(--glass)' : `rgba(${isEvent?'88,104,117':'239,68,68'},0.07)`,
                    border: notif.read ? '1px solid var(--border)' : `1px solid rgba(${isEvent?'88,104,117':'239,68,68'},0.20)`,
                    borderRadius:16, padding:'14px 16px',
                    cursor: (notif.event_id || notif.type === 'like' || notif.type === 'comment') ? 'pointer' : 'default',
                    textAlign:'left', fontFamily:'inherit',
                    transition:'all 0.15s ease',
                    backdropFilter:'blur(14px)',
                  }}
                >
                  <div style={{
                    width:44, height:44, borderRadius:'50%', flexShrink:0,
                    background: `rgba(${isEvent?'88,104,117':'239,68,68'},0.12)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:22, position:'relative',
                  }}>
                    {TYPE_ICONS[notif.type] || '🔔'}
                    {!notif.read && (
                      <div style={{
                        position:'absolute', top:1, right:1, width:10, height:10,
                        borderRadius:'50%', background: accentColor,
                        border:'2px solid var(--bg)',
                      }}/>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 4px', fontSize:14, color:'var(--text)', lineHeight:1.45, fontWeight: notif.read ? 400 : 600 }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>{timeAgo(notif.created_at)}</span>
                  </div>
                  {(notif.event_id || notif.type === 'like' || notif.type === 'comment') && (
                    <span style={{ fontSize:18, color:'var(--muted)', flexShrink:0, alignSelf:'center' }}>›</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <Navbar />
    </>
  )
}
