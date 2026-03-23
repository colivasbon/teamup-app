// src/app/events/[id]/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const eventsData = {
  1: {
    id: 1, sport: 'running', icon: '🏃',
    title: 'Running Dominguero',
    description: 'Ruta suave por el parque municipal. Perfecta para empezar la semana con energía. El ritmo será tranquilo para que todo el mundo pueda participar, sin importar el nivel. Nos encontramos en la entrada principal del parque.',
    date: 'Domingo 30 Mar', time: '10:00', duration: '~1h 30min',
    location: 'Parque de la Ciudad', province: 'Madrid',
    level: 'any', levelLabel: 'Todos los niveles', levelIcon: '🌍',
    thirdPlace: true, thirdPlaceLink: 'https://maps.google.com', thirdPlacePlace: 'Bar El Deportista',
    people: 8, maxPeople: 15, waitingList: 5,
    creator: 'Miguel R.', creatorAvatar: '🧑‍🦱', creatorKarma: 4.8,
    color: '#5b6ef5', status: 'open',
    participants: ['Ana G.', 'Pedro L.', 'Sara M.', 'Tomas V.', 'Lucia B.', 'Raul F.', 'Marta K.', 'David S.'],
    comments: [
      { user: 'Ana G.', avatar: '👩', text: '¿Llevamos geles energéticos?', time: 'Hace 2h' },
      { user: 'Miguel R.', avatar: '🧑‍🦱', text: 'No hace falta, es una ruta corta 😊', time: 'Hace 1h' },
    ]
  },
  2: {
    id: 2, sport: 'padel', icon: '🎾',
    title: 'Partido de Pádel',
    description: 'Buscamos 2 más para completar el cuadro. Nivel intermedio, buscamos gente que lleve jugando al menos 1 año. La pista está ya reservada, solo necesitamos completar el grupo.',
    date: 'Sábado 29 Mar', time: '18:00', duration: '~1h 30min',
    location: 'Club de Pádel Centro', province: 'Valencia',
    level: 'intermediate', levelLabel: 'Intermedio', levelIcon: '⭐',
    thirdPlace: false,
    people: 2, maxPeople: 4, waitingList: 2,
    creator: 'Laura M.', creatorAvatar: '👩‍🦳', creatorKarma: 4.9,
    color: '#06d6a0', status: 'open',
    participants: ['Laura M.', 'Carlos T.'],
    comments: [
      { user: 'Carlos T.', avatar: '👨', text: 'Llevo mis raquetas por si alguien necesita.', time: 'Hace 30min' },
    ]
  },
}

export default function EventDetail() {
  const { id } = useParams()
  const [joined, setJoined] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(eventsData[id]?.comments || [])

  const ev = eventsData[id]

  if (!ev) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-lg font-semibold">Evento no encontrado</h2>
          <Link href="/events" className="mt-4 block text-sm" style={{color: 'var(--primary)'}}>← Volver a eventos</Link>
        </div>
      </div>
    )
  }

  const pct = Math.round((ev.people / ev.maxPeople) * 100)

  const handleComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setComments([...comments, { user: 'Tú', avatar: '😊', text: comment, time: 'Ahora' }])
    setComment('')
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Back + Header */}
      <header className="px-6 pt-14 pb-4 flex items-center gap-3">
        <Link href="/events" className="w-9 h-9 glass rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight">{ev.title}</h1>
          <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>por {ev.creatorAvatar} {ev.creator}</p>
        </div>
      </header>

      {/* Hero card */}
      <div className="px-6 mb-5">
        <div className="rounded-2xl overflow-hidden relative"
          style={{background: `linear-gradient(135deg, ${ev.color}33, ${ev.color}11)`, border: `1px solid ${ev.color}33`}}>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{background: `${ev.color}22`, border: `1px solid ${ev.color}44`}}>
                {ev.icon}
              </div>
              <div>
                <h2 className="font-bold text-lg">{ev.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="level-badge text-xs" style={{background: `${ev.color}22`, color: ev.color}}>
                    {ev.levelIcon} {ev.levelLabel}
                  </span>
                  {ev.thirdPlace && (
                    <span className="level-badge text-xs" style={{background: 'rgba(251, 191, 36, 0.15)', color: '#f59e0b'}}>
                      🍺 3er tiempo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📅', label: 'Fecha', value: ev.date },
                { icon: '🕐', label: 'Hora', value: `${ev.time} · ${ev.duration}` },
                { icon: '📍', label: 'Lugar', value: ev.location },
                { icon: '🗺️', label: 'Provincia', value: ev.province },
              ].map((item) => (
                <div key={item.label} className="glass rounded-xl p-3">
                  <div className="text-xs mb-0.5" style={{color: 'var(--text-secondary)'}}>{item.icon} {item.label}</div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 mb-5">
        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold mb-2 text-sm" style={{color: 'var(--text-secondary)'}}>DESCRIPCIÓN</h3>
          <p className="text-sm leading-relaxed">{ev.description}</p>
        </div>
      </div>

      {/* Participants */}
      <div className="px-6 mb-5">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{color: 'var(--text-secondary)'}}>PARTICIPANTES</h3>
            <span className="text-sm font-medium" style={{color: 'var(--primary)'}}>{ev.people}/{ev.maxPeople}</span>
          </div>
          <div className="progress-bar mb-3">
            <div className="progress-fill" style={{width: `${pct}%`, background: ev.color}}/>
          </div>
          <div className="flex flex-wrap gap-2">
            {ev.participants.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{background: `${ev.color}15`, color: ev.color}}>
                {p}
              </div>
            ))}
          </div>
          {ev.waitingList > 0 && (
            <div className="mt-3 text-xs" style={{color: 'var(--text-secondary)'}}>
              + {ev.waitingList} persona{ev.waitingList > 1 ? 's' : ''} en lista de espera
            </div>
          )}
        </div>
      </div>

      {/* Third place */}
      {ev.thirdPlace && (
        <div className="px-6 mb-5">
          <a href={ev.thirdPlaceLink} target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-4 flex items-center gap-3 block hover:scale-[1.01] transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{background: 'rgba(251, 191, 36, 0.15)'}}>🍺</div>
            <div>
              <div className="font-semibold text-sm">Tercer tiempo</div>
              <div className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{ev.thirdPlacePlace} · Ver en Google Maps →</div>
            </div>
          </a>
        </div>
      )}

      {/* Chat */}
      <div className="px-6 mb-5">
        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-3" style={{color: 'var(--text-secondary)'}}>CHAT DEL EVENTO</h3>
          <div className="space-y-3 mb-3">
            {comments.map((c, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xl flex-shrink-0">{c.avatar}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{c.user}</span>
                    <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{c.time}</span>
                  </div>
                  <p className="text-sm mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-glass flex-1 text-sm py-2.5"
            />
            <button type="submit" className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 text-white"
              style={{background: ev.color}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Join CTA */}
      <div className="fixed bottom-20 left-6 right-6 z-40">
        <button
          onClick={() => setJoined(!joined)}
          className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: joined ? '#6b7280' : `linear-gradient(135deg, ${ev.color}, ${ev.color}cc)`,
            boxShadow: joined ? 'none' : `0 6px 24px ${ev.color}55`,
          }}
        >
          {joined ? '✓ Ya estás apuntado' : `Unirse al evento · ${ev.people}/${ev.maxPeople}`}
        </button>
      </div>
    </div>
  )
}
