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

const moments = [
  {
    id: 1,
    author: 'Carlos O.',
    avatar: '🧔',
    sport: 'Running',
    time: 'Hace 15 min',
    event: 'Running Matutino — Alameda',
    text: 'Empezando el día con energía en la Alameda 🌅 Mejor compañía imposible, gracias a todos los que se animaron.',
    emoji: '🏃‍♂️',
    likes: 12,
    comments: 3,
    liked: false,
    image: null,
    stats: { distancia: '5.2 km', tiempo: '28 min', ritmo: '5:23/km' },
  },
  {
    id: 2,
    author: 'María G.',
    avatar: '👩',
    sport: 'Pádel',
    time: 'Hace 1 h',
    event: 'Torneo Pádel Nivel Medio',
    text: 'Partido épico esta mañana. Ganamos en el tercer set 6-4, pero sobre todo disfrutamos mogollón 🎾',
    emoji: '🎾',
    likes: 24,
    comments: 8,
    liked: true,
    image: null,
    stats: null,
  },
  {
    id: 3,
    author: 'Javi M.',
    avatar: '👨',
    sport: 'Senderismo',
    time: 'Hace 3 h',
    event: 'Ruta Sierra Nevada',
    text: 'Las vistas desde los 2.800m no tienen precio. Ruta completada con éxito, todos llegamos y nadie se perdió 🥾✨',
    emoji: '🥾',
    likes: 41,
    comments: 12,
    liked: false,
    image: null,
    stats: { distancia: '14 km', desnivel: '+890 m', duración: '5h 20min' },
  },
  {
    id: 4,
    author: 'Laura S.',
    avatar: '👩‍🦰',
    sport: 'Gimnasio',
    time: 'Hace 5 h',
    event: 'Entreno Funcional Grupal',
    text: 'Sesión de funcional increíble hoy. El coach nos destruyó pero de la mejor manera posible 💪🔥',
    emoji: '💪',
    likes: 18,
    comments: 5,
    liked: false,
    image: null,
    stats: { series: '4 rondas', ejercicios: '8', descanso: '45 seg' },
  },
  {
    id: 5,
    author: 'Diego R.',
    avatar: '👦',
    sport: 'Fútbol',
    time: 'Ayer',
    event: 'Fútbol 7 — Polideportivo',
    text: 'Derrota 3-5 pero qué partido más divertido. Metí dos goles y el equipo luchó hasta el final ⚽',
    emoji: '⚽',
    likes: 33,
    comments: 15,
    liked: true,
    image: null,
    stats: { goles: '3 — 5', duración: '60 min', jugadores: '14' },
  },
];

const FILTERS = ['Todos', 'Running', 'Pádel', 'Senderismo', 'Fútbol', 'Gimnasio'];

export default function MomentsPage() {
  const [filter, setFilter] = useState('Todos');
  const [likedMap, setLikedMap] = useState({});
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');

  const toggleLike = (id) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = filter === 'Todos' ? moments : moments.filter(m => m.sport === filter);

  return (
    <div className="app-shell">
      <div className="page-wrap" style={{ paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{ padding: '52px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
                Momentos
              </h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 0' }}>
                Lo mejor de hoy en la comunidad
              </p>
            </div>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="btn-primary"
              style={{ padding: '10px 16px', fontSize: 13 }}
            >
              + Publicar
            </button>
          </div>
        </div>

        {/* Composer */}
        {showCompose && (
          <div className="card anim-1" style={{ margin: '16px 16px 0', padding: '16px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--grad)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                🧔
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={composeText}
                  onChange={e => setComposeText(e.target.value)}
                  placeholder="¿Qué tal fue el entreno de hoy?"
                  className="input"
                  style={{ resize: 'none', minHeight: 80, fontSize: 14, lineHeight: 1.5 }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                  <button className="btn-ghost" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setShowCompose(false)}>
                    Cancelar
                  </button>
                  <button className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros horizontales */}
        <div style={{ padding: '16px 0 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 8, paddingLeft: 16, paddingRight: 16, width: 'max-content' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? 'pill pill-active' : 'pill pill-inactive'}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((moment, i) => {
            const isLiked = likedMap[moment.id] !== undefined ? likedMap[moment.id] : moment.liked;
            const likeCount = moment.likes + (likedMap[moment.id] !== undefined
              ? (likedMap[moment.id] ? 1 : 0) - (moment.liked ? 1 : 0)
              : 0);

            return (
              <div key={moment.id} className={`card anim-${(i % 6) + 1}`} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Barra de color por deporte */}
                <div style={{ height: 3, background: SPORT_COLORS[moment.sport] }} />

                <div style={{ padding: '14px 16px 0' }}>
                  {/* Autor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `${SPORT_COLORS[moment.sport]}22`,
                      border: `2px solid ${SPORT_COLORS[moment.sport]}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {moment.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{moment.author}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {moment.event}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: SPORT_COLORS[moment.sport],
                        background: `${SPORT_COLORS[moment.sport]}18`,
                        borderRadius: 8,
                        padding: '3px 8px',
                      }}>
                        {moment.sport}
                      </span>
                    </div>
                  </div>

                  {/* Texto */}
                  <p style={{
                    fontSize: 14, color: 'var(--text)',
                    lineHeight: 1.55, margin: '0 0 12px',
                  }}>
                    {moment.text}
                  </p>

                  {/* Stats del entreno si existen */}
                  {moment.stats && (
                    <div style={{
                      display: 'flex', gap: 8,
                      background: 'var(--surface2)',
                      borderRadius: 12,
                      padding: '10px 12px',
                      marginBottom: 12,
                      border: '1px solid var(--border)',
                    }}>
                      {Object.entries(moment.stats).map(([key, val]) => (
                        <div key={key} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1, textTransform: 'capitalize' }}>{key}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  padding: '10px 16px 14px',
                  borderTop: '1px solid var(--border)',
                  gap: 16,
                }}>
                  <button
                    onClick={() => toggleLike(moment.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                      color: isLiked ? '#ef4444' : 'var(--muted)',
                      fontSize: 13, fontWeight: 600,
                      transition: 'all 0.15s',
                      transform: isLiked ? 'scale(1.08)' : 'scale(1)',
                      padding: 0,
                    }}
                  >
                    <span style={{ fontSize: 17 }}>{isLiked ? '❤️' : '🤍'}</span>
                    {likeCount}
                  </button>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                    color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                    padding: 0,
                  }}>
                    <span style={{ fontSize: 17 }}>💬</span>
                    {moment.comments}
                  </button>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                    color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                    marginLeft: 'auto',
                    padding: 0,
                  }}>
                    <span style={{ fontSize: 17 }}>↗️</span>
                  </button>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{moment.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer discreto */}
        <div style={{ textAlign: 'center', padding: '20px 0 0' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Has llegado al final del feed ✨</span>
        </div>

      </div>
      <Navbar active="moments" />
    </div>
  );
}
