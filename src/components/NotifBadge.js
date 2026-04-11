'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export function NotifBadge({ userId }) {
  const [count, setCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!userId) return;
    const supabase = getSupabase();
    const { data } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('read', false);
    setCount(data?.length ?? 0);
  }, [userId]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  if (!userId || count === 0) return null;

  return (
    <span
      aria-label={`${count} notificaciones sin leer`}
      style={{
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        background: '#ef4444',
        border: '2px solid var(--bg)',
        borderRadius: '50%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
