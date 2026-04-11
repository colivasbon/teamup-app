'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const TYPE_ICONS = {
  joined: '👥',
  left: '🚪',
  event_full: '🔥',
  karma: '⭐',
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabase();
    const { data } = await supabase
      .from('notifications')
      .select('*, profiles(full_name, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    if (data) setNotifs(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  const markAllRead = async () => {
    if (!user) return;
    const supabase = getSupabase();
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      const supabase = getSupabase();
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notif.id);
      setNotifs((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.event_id) {
      router.push(`/events/${notif.event_id}`);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Inicia sesión para ver tus notificaciones
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Necesitas una cuenta para recibir notificaciones de tus eventos.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/login')}
          >
            Iniciar sesión
          </button>
        </div>
        <Navbar />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Notificaciones</h1>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
          onClick={markAllRead}
        >
          Marcar todas leídas
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 0 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <span className="spinner" />
          </div>
        ) : notifs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '72px 24px',
              color: 'var(--muted)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <p style={{ fontSize: 16 }}>No tienes notificaciones aún</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {notifs.map((notif) => {
              const actor = notif.profiles;
              const icon = TYPE_ICONS[notif.type] || '🔔';
              return (
                <li
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '14px 20px',
                    cursor: notif.event_id ? 'pointer' : 'default',
                    background: notif.read ? 'transparent' : 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Avatar / icon */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {actor?.avatar_url ? (
                      <img
                        src={actor.avatar_url}
                        alt={actor.full_name || ''}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--border)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: 'var(--surface2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                        }}
                      >
                        {icon}
                      </div>
                    )}
                    {/* Unread dot */}
                    {!notif.read && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 10,
                          height: 10,
                          background: '#3b82f6',
                          borderRadius: '50%',
                          border: '2px solid var(--bg)',
                        }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 14,
                        lineHeight: 1.4,
                        fontWeight: notif.read ? 400 : 600,
                        color: 'var(--text)',
                      }}
                    >
                      {notif.message}
                    </p>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {timeAgo(notif.created_at)}
                    </span>
                  </div>

                  {/* Type icon badge (if actor has avatar) */}
                  {actor?.avatar_url && (
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Navbar />
    </div>
  );
}
