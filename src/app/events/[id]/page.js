'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

const EVENTS_DATA = {
  '1': {
    id: '1',
    title: 'Running Matutino',
    sport: 'Running',
    level: 'Intermedio',
    date: 'Hoy, 07:30',
    fullDate: 'Lunes 23 de Marzo, 07:30h',
    duration: '1h 15min',
    location: 'Alameda de Córdoba',
    address: 'Entrada principal junto al quiosco de música',
    maxPlayers: 10,
    players: 7,
    price: 'Gratis',
    organizer: { name: 'Carlos O.', avatar: '🧔', karma: 4.8 },
    description: 'Ruta de running matutino por la Alameda y alrededores. Ritmo medio (5:00–5:30/km). Perfecto para empezar la semana con energía. Llevad agua y ropa cómoda.',
    tags: ['Aire libre', 'Principiantes bienvenidos', 'Grupo pequeño'],
    waitlist: 2,
    participants: [
      { name: 'Carlos O.', avatar: '🧔', karma: 4.8, role: 'org' },
      { name: 'María G.', avatar: '👩', karma: 4.6, role: 'asistente' },
      { name: 'Javi M.', avatar: '👨', karma: 4.9, role: 'asistente' },
      { name: 'Laura S.', avatar: '👩‍🦰', karma: 4.3, role: 'asistente' },
      { name: 'Diego R.', avatar: '👦', karma: 4.7, role: 'asistente' },
      { name: 'Ana P.', avatar: '👩‍🦱', karma: 4.5, role: 'asistente' },
      { name: 'Marcos V.', avatar: '🧑', karma: 4.2, role: 'asistente' },
    ],
    chat: [
      { author: 'Carlos O.', avatar: '🧔', text: 'Buenos días a todos! Nos vemos en la entrada principal 👋', time: '07:00' },
      { author: 'María G.', avatar: '👩', text: 'Ahí estaré, llueve un poco pero nada que nos pare 💪', time: '07:05' },
      { author: 'Javi M.', avatar: '👨', text: 'Perfecto, yo llego un poco antes para calentar', time: '07:12' },
    ],
  },
  '2': {
    id: '2',
    title: 'Torneo Pádel Nivel Medio',
    sport: 'Pádel',
    level: 'Intermedio',
    date: 'Mañana, 10:00',
    fullDate: 'Martes 24 de Marzo, 10:00h',
    duration: '2h',
    location: 'Club Pádel Córdoba',
    address: 'Av. del Brillante, 24 — Pista 3',
    maxPlayers: 8,
    players: 6,
    price: '5€/persona',
    organizer: { name: 'María G.', avatar: '👩', karma: 4.6 },
    description: 'Torneo amistoso de pádel para nivel medio. Se jugarán rondas de 20 minutos con rotación de parejas. Raquetas disponibles en el club si alguien no tiene.',
    tags: ['Indoor', 'Mixto', 'Torneo'],
    waitlist: 1,
    participants: [
      { name: 'María G.', avatar: '👩', karma: 4.6, role: 'org' },
      { name: 'Carlos O.', avatar: '🧔', karma: 4.8, role: 'asistente' },
      { name: 'Diego R.', avatar: '👦', karma: 4.7, role: 'asistente' },
      { name: 'Ana P.', avatar: '👩‍🦱', karma: 4.5, role: 'asistente' },
      { name: 'Marcos V.', avatar: '🧑', karma: 4.2, role: 'asistente' },
      { name: 'Laura S.', avatar: '👩‍🦰', karma: 4.3, role: 'asistente' },
    ],
    chat: [
      { author: 'María G.', avatar: '👩', text: 'Recordad que el club tiene parking gratuito 🚗', time: '09:00' },
      { author: 'Diego R.', avatar: '👦', text: 'Genial! Voy con mi hermano, ¿puede unirse a la lista de espera?', time: '09:15' },
      { author: 'María G.', avatar: '👩', text: 'Claro, que se apunte por la app y le confirmo 👍', time: '09:18' },
    ],
  },
};

const TABS = ['Info', 'Participantes', 'Chat'];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id || '1';
  const event = EVENTS_DATA[eventId] || EVENTS_DATA['1'];

  const [activeTab, setActiveTab] = useState('Info');
  const [joined, setJoined] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMsgs, setChatMsgs] = useState(event.chat);

  const spotsLeft = event.maxPlayers - event.players;
  const accentColor = SPORT_COLORS[event.sport];
  const fillPct = Math.round((event.players / event.maxPlayers) * 100);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setChatMsgs(prev => [...prev, {
      author: 'Carlos O.', avatar: '🧔',
      text: chatMsg.trim(),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatMsg('');
  };

  return (
    <div className="app-shell">
      <div className="page-wrap" style={{ paddingBottom: '100px' }}>

        {/* Hero */}
        <div style={{
          background: `linear-gradient(160deg, ${accentColor}dd, ${accentColor}88)`,
          padding: '52px 20px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decoración */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 160, height: 160, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -20,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />

          {/* Botón volver */}
          <button
            onClick={() => router.back()}
            style={{
              position: 'absolute', top: 16, left: 16,
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              color: '#fff', fontSize: 20,
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ←
          </button>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 52, marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
              {SPORT_ICONS[event.sport]}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 10, padding: '4px 10px',
              marginBottom: 8,
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{event.sport}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>·</span>
              <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12 }}>{event.level}</span>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 26, margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              {event.title}
            </h1>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              Organizado por {event.organizer.name} · ⭐ {event.organizer.karma}
            </div>
          </div>
        </div>

        {/* Datos rápidos */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
          gap: 10, padding: '16px 16px 0',
        }}>
          {[
            { icon: '📅', label: 'Fecha', value: event.fullDate },
            { icon: '⏱️', label: 'Duración', value: event.duration },
            { icon: '📍', label: 'Lugar', value: event.location },
            { icon: '💶', label: 'Precio', value: event.price },
          ].map(item => (
            <div key={item.label} className="card anim-1" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plazas */}
        <div className="card anim-2" style={{ margin: '10px 16px 0', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              Plazas ocupadas
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>
              {event.players}/{event.maxPlayers}
            </span>
          </div>
          <div className="pbar">
            <div className="pbar-fill" style={{ width: `${fillPct}%`, background: accentColor }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {spotsLeft > 0 ? `${spotsLeft} plaza${spotsLeft > 1 ? 's' : ''} libre${spotsLeft > 1 ? 's' : ''}` : 'Completo'}
            </span>
            {event.waitlist > 0 && (
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {event.waitlist} en lista de espera
              </span>
            )}
          </div>
        </div>

        {/* CTA principal */}
        <div style={{ padding: '14px 16px 0' }}>
          {!joined ? (
            <button
              className="btn-primary"
              style={{ width: '100%', fontSize: 16 }}
              onClick={() => setJoined(true)}
            >
              {spotsLeft > 0 ? '✓ Unirme al evento' : '⏳ Apuntarme a lista de espera'}
            </button>
          ) : (
            <div style={{
              background: 'rgba(6,214,160,0.12)',
              border: '1.5px solid rgba(6,214,160,0.4)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
              <div style={{ fontWeight: 700, color: '#06d6a0', fontSize: 15 }}>¡Estás apuntado!</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Te avisaremos si hay cambios en el evento</div>
            </div>
          )}
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
                  background: activeTab === tab ? accentColor : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--muted)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Info */}
        {activeTab === 'Info' && (
          <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Descripción */}
            <div className="card anim-1" style={{ padding: '16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Descripción
              </div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                {event.description}
              </p>
            </div>

            {/* Dirección */}
            <div className="card anim-2" style={{ padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${accentColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                📍
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{event.location}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{event.address}</div>
                <button style={{
                  marginTop: 8, background: 'none', border: 'none',
                  color: accentColor, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', padding: 0,
                }}>
                  Ver en Google Maps →
                </button>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {event.tags.map(tag => (
                <span key={tag} style={{
                  background: `${accentColor}14`,
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 10,
                  color: accentColor,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '5px 12px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Participantes */}
        {activeTab === 'Participantes' && (
          <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {event.participants.map((p, i) => (
              <div key={p.name} className={`card anim-${(i % 6) + 1}`} style={{
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: p.role === 'org' ? 'var(--grad)' : 'var(--surface2)',
                  border: p.role === 'org' ? 'none' : '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {p.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>⭐ {p.karma}</div>
                </div>
                {p.role === 'org' && (
                  <span style={{
                    fontSize: 10, fontWeight: 800,
                    color: '#fff',
                    background: 'var(--grad)',
                    borderRadius: 8,
                    padding: '3px 8px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    Org
                  </span>
                )}
              </div>
            ))}
            {event.waitlist > 0 && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  + {event.waitlist} persona{event.waitlist > 1 ? 's' : ''} en lista de espera
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab: Chat */}
        {activeTab === 'Chat' && (
          <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Mensajes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMsgs.map((msg, i) => {
                const isMe = msg.author === 'Carlos O.';
                return (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: isMe ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}>
                    {!isMe && (
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>
                        {msg.avatar}
                      </div>
                    )}
                    <div style={{ maxWidth: '75%' }}>
                      {!isMe && (
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 3, paddingLeft: 4 }}>
                          {msg.author}
                        </div>
                      )}
                      <div style={{
                        background: isMe ? accentColor : 'var(--surface)',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: '10px 14px',
                        color: isMe ? '#fff' : 'var(--text)',
                        fontSize: 13,
                        lineHeight: 1.45,
                        backdropFilter: 'blur(12px)',
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: 4, paddingRight: 4 }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input de chat */}
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '6px 6px 6px 14px',
              marginTop: 4,
            }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Escribe un mensaje…"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <button
                onClick={sendMsg}
                style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: chatMsg.trim() ? accentColor : 'var(--surface2)',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: chatMsg.trim() ? 'pointer' : 'default',
                  fontSize: 16,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

      </div>
      <Navbar active="events" />
    </div>
  );
}
