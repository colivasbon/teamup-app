'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const SPORT_COLORS = {
  Running: '#5b6ef5',
  Pádel: '#06d6a0',
  Senderismo: '#f59e0b',
  Fútbol: '#ef4444',
  Gimnasio: '#8b5cf6',
  Tenis: '#fbbf24',
};

const SPORT_ICONS = {
  Running: '🏃',
  Pádel: '🎾',
  Senderismo: '🥾',
  Fútbol: '⚽',
  Gimnasio: '💪',
  Tenis: '🎾',
};

const TABS = ['Actividad', 'Logros', 'Karma'];

const recentEvents = [
  { id: 1, title: 'Running Matutino', sport: 'Running', date: '20 Mar', role: 'Asistente', result: 'Completado' },
  { id: 2, title: 'Ruta Sierra Nevada', sport: 'Senderismo', date: '15 Mar', role: 'Organizador', result: 'Completado' },
  { id: 3, title: 'Fútbol 7 Miércoles', sport: 'Fútbol', date: '12 Mar', role: 'Asistente', result: 'Completado' },
  { id: 4, title: 'Trail Urbano 5K', sport: 'Running', date: '8 Mar', role: 'Asistente', result: 'Completado' },
];

const achievements = [
  { icon: '🏅', label: 'Primer evento', desc: 'Asististe a tu primer evento', earned: true },
  { icon: '⭐', label: 'Organizador', desc: 'Creaste tu primer evento', earned: true },
  { icon: '🔥', label: 'Racha de 7', desc: '7 eventos en 7 días', earned: true },
  { icon: '🤝', label: 'Social', desc: '10 personas conocidas', earned: true },
  { icon: '🏆', label: 'Top Karma', desc: 'Karma por encima de 4.5', earned: true },
  { icon: '🌟', label: 'Veterano', desc: '50 eventos asistidos', earned: false },
  { icon: '👑', label: 'Leyenda', desc: '100 eventos completados', earned: false },
  { icon: '💎', label: 'Élite', desc: 'Karma perfecto durante 1 mes', earned: false },
];

const reviews = [
  { author: 'María G.', avatar: '👩', sport: 'Running', stars: 5, text: 'Carlos es un compañero increíble, siempre puntual y con muy buen rollo.', date: '18 Mar' },
  { author: 'Javi M.', avatar: '👨', sport: 'Senderismo', stars: 5, text: 'Organizó la ruta perfectamente, con todos los detalles previstos.', date: '10 Mar' },
  { author: 'Lucía P.', avatar: '👩‍🦱', sport: 'Fútbol', stars: 4, text: 'Muy buen ambiente, repetiría sin dudarlo.', date: '5 Mar' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Actividad');
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('Apasionado del running y el senderismo. Córdoba 📍');
  const [bioInput, setBioInput] = useState(bio);

  const userSports = ['Running', 'Senderismo', 'Fútbol'];

  return (
    <div className="app-shell">
      <div className="page-wrap" style={{ paddingTop: '0', paddingBottom: '100px' }}>

        {/* Header con gradiente */}
        <div style={{
          background: 'var(--grad)',
          borderRadius: '0 0 28px 28px',
          padding: '52px 24px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, left: -20,
            width: 120, height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />

          {/* Botón editar */}
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            {editMode ? 'Guardar' : 'Editar'}
          </button>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative' }}>
            <div style={{
              width: 88, height: 88,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}>
              🧔
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.3px' }}>
                Carlos Olivas
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 2 }}>
                @colivasbon
              </div>
            </div>

            {/* Bio */}
            {editMode ? (
              <textarea
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                onBlur={() => { setBio(bioInput); setEditMode(false); }}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'center',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                rows={2}
              />
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, textAlign: 'center', maxWidth: 280 }}>
                {bio}
              </div>
            )}

            {/* Deportes */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {userSports.map(s => (
                <span key={s} style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  borderRadius: 20,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 12px',
                }}>
                  {SPORT_ICONS[s]} {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 10, padding: '20px 16px 0',
        }}>
          {[
            { label: 'Karma', value: '4.8', icon: '⭐', color: '#f59e0b' },
            { label: 'Organizados', value: '7', icon: '📅', color: '#5b6ef5' },
            { label: 'Asistidos', value: '31', icon: '🎯', color: '#06d6a0' },
          ].map(stat => (
            <div key={stat.label} className="card anim-1" style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Miembro desde */}
        <div style={{ padding: '12px 16px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Miembro desde Marzo 2025</span>
        </div>

        {/* Tabs */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{
            display: 'flex', gap: 6,
            background: 'var(--surface)',
            borderRadius: 14,
            padding: 4,
            border: '1px solid var(--border)',
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  background: activeTab === tab ? 'var(--grad)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--muted)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Actividad */}
        {activeTab === 'Actividad' && (
          <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentEvents.map((ev, i) => (
              <div key={ev.id} className={`card anim-${i + 1}`} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderLeft: `3px solid ${SPORT_COLORS[ev.sport]}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${SPORT_COLORS[ev.sport]}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {SPORT_ICONS[ev.sport]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {ev.date} · {ev.role}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: '#06d6a0',
                  background: 'rgba(6,214,160,0.12)',
                  borderRadius: 8,
                  padding: '3px 8px',
                  flexShrink: 0,
                }}>
                  {ev.result}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Logros */}
        {activeTab === 'Logros' && (
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              {achievements.map((ach, i) => (
                <div key={ach.label} className={`card anim-${(i % 6) + 1}`} style={{
                  padding: '16px 14px',
                  opacity: ach.earned ? 1 : 0.4,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {ach.earned && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#06d6a0',
                      boxShadow: '0 0 6px #06d6a0',
                    }} />
                  )}
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{ach.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{ach.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{ach.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
              5 de 8 logros desbloqueados
            </div>
          </div>
        )}

        {/* Tab: Karma */}
        {activeTab === 'Karma' && (
          <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Resumen karma */}
            <div className="card anim-1" style={{ padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                4.8
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>24 valoraciones</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 10 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize: 22, color: s <= 5 ? '#f59e0b' : 'var(--border)' }}>★</span>
                ))}
              </div>
              {/* Barras de distribución */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { stars: 5, pct: 80 },
                  { stars: 4, pct: 15 },
                  { stars: 3, pct: 5 },
                  { stars: 2, pct: 0 },
                  { stars: 1, pct: 0 },
                ].map(row => (
                  <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)', width: 10, textAlign: 'right' }}>{row.stars}</span>
                    <span style={{ fontSize: 11, color: '#f59e0b' }}>★</span>
                    <div className="pbar" style={{ flex: 1 }}>
                      <div className="pbar-fill" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', width: 28, textAlign: 'right' }}>{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {reviews.map((rev, i) => (
              <div key={rev.author} className={`card anim-${i + 2}`} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {rev.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{rev.author}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{rev.sport} · {rev.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize: 13, color: s <= rev.stars ? '#f59e0b' : 'var(--border)' }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{rev.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Botón cerrar sesión */}
        <div style={{ padding: '24px 16px 0' }}>
          <button className="btn-ghost" style={{
            width: '100%',
            color: '#ef4444',
            borderColor: 'rgba(239,68,68,0.25)',
          }}>
            Cerrar sesión
          </button>
        </div>

      </div>
      <Navbar active="profile" />
    </div>
  );
}
