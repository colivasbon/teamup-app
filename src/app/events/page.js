// src/app/events/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

const demoEvents = [
  {
    id: 1,
    sport: 'running',
    icon: '🏃',
    title: 'Running Dominguero',
    description: 'Ruta suave por el parque. Todos los niveles bienvenidos.',
    date: 'Dom 30 Mar',
    time: '10:00',
    location: 'Parque de la Ciudad',
    province: 'madrid',
    level: 'any',
    levelLabel: 'Todos',
    levelIcon: '🌍',
    thirdPlace: true,
    thirdPlaceLink: 'https://maps.google.com',
    people: 8,
    maxPeople: 15,
    waitingList: 5,
    creator: 'Miguel R.',
    creatorAvatar: '🧑‍🦱',
    color: '#5b6ef5',
    status: 'open',
  },
  {
    id: 2,
    sport: 'padel',
    icon: '🎾',
    title: 'Partido de Pádel',
    description: 'Buscamos 2 más para completar el cuadro. Nivel intermedio.',
    date: 'Sáb 29 Mar',
    time: '18:00',
    location: 'Club de Pádel Centro',
    province: 'valencia',
    level: 'intermediate',
    levelLabel: 'Intermedio',
    levelIcon: '⭐',
    thirdPlace: false,
    people: 2,
    maxPeople: 4,
    waitingList: 2,
    creator: 'Laura M.',
    creatorAvatar: '👩‍🦳',
    color: '#06d6a0',
    status: 'open',
  },
  {
    id: 3,
    sport: 'senderismo',
    icon: '🥾',
    title: 'Senderismo Sierra Norte',
    description: 'Ruta de 12 km, dificultad media. Llevar agua y calzado cómodo.',
    date: 'Dom 30 Mar',
    time: '09:00',
    location: 'Plaza del Pueblo',
    province: 'madrid',
    level: 'advanced',
    levelLabel: 'Avanzado',
    levelIcon: '🔥',
    thirdPlace: true,
    thirdPlaceLink: 'https://maps.google.com',
    people: 12,
    maxPeople: 20,
    waitingList: 8,
    creator: 'Carlos A.',
    creatorAvatar: '🧔',
    color: '#f59e0b',
    status: 'open',
  },
  {
    id: 4,
    sport: 'futbol',
    icon: '⚽',
    title: 'Fútbol 7 tarde',
    description: 'Partido amistoso, buscamos gente de cualquier nivel para pasar un buen rato.',
    date: 'Vie 28 Mar',
    time: '20:00',
    location: 'Polideportivo Municipal',
    province: 'sevilla',
    level: 'any',
    levelLabel: 'Todos',
    levelIcon: '🌍',
    thirdPlace: true,
    thirdPlaceLink: 'https://maps.google.com',
    people: 11,
    maxPeople: 14,
    waitingList: 3,
    creator: 'Javi P.',
    creatorAvatar: '👨‍🦲',
    color: '#ef4444',
    status: 'open',
  },
]

const sportFilters = [
  { id: 'all',        label: 'Todos',       icon: '✨' },
  { id: 'running',    label: 'Running',     icon: '🏃' },
  { id: 'padel',      label: 'Pádel',       icon: '🎾' },
  { id: 'senderismo', label: 'Senderismo',  icon: '🥾' },
  { id: 'futbol',     label: 'Fútbol',      icon: '⚽' },
  { id: 'gimnasio',   label: 'Gimnasio',    icon: '💪' },
]

const levelFilters = [
  { id: 'all',          label: 'Todos',        icon: '🌍' },
  { id: 'beginner',     label: 'Principiante', icon: '🌱' },
  { id: 'intermediate', label: 'Intermedio',   icon: '⭐' },
  { id: 'advanced',     label: 'Avanzado',     icon: '🔥' },
]

const provinces = [
  { id: 'all',      name: 'Todas' },
  { id: 'madrid',   name: 'Madrid' },
  { id: 'barcelona',name: 'Barcelona' },
  { id: 'valencia', name: 'Valencia' },
  { id: 'sevilla',  name: 'Sevilla' },
  { id: 'malaga',   name: 'Málaga' },
  { id: 'alicante', name: 'Alicante' },
  { id: 'murcia',   name: 'Murcia' },
  { id: 'vizcaya',  name: 'Vizcaya' },
  { id: 'cordoba',  name: 'Córdoba' },
  { id: 'zaragoza', name: 'Zaragoza' },
]

export default function Events() {
  const [sport, setSport] = useState('all')
  const [province, setProvince] = useState('all')
  const [level, setLevel] = useState('all')

  const filtered = demoEvents.filter(e => {
    const sportMatch   = sport === 'all'    || e.sport === sport
    const provinceMatch = province === 'all' || e.province === province
    const levelMatch   = level === 'all'    || e.level === level || e.level === 'any'
    return sportMatch && provinceMatch && levelMatch
  })

  const fillPct = (ev) => Math.round((ev.people / ev.maxPeople) * 100)
  const fillColor = (pct) => pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : 'var(--primary)'

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <h1 className="text-xl font-bold">Eventos</h1>
        <p className="text-sm mt-0.5" style={{color: 'var(--text-secondary)'}}>
          {filtered.length} evento{filtered.length !== 1 ? 's' : ''} disponibles
        </p>
      </header>

      {/* Province filter */}
      <div className="px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {provinces.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvince(p.id)}
            className={`sport-pill ${province === p.id ? 'active' : 'inactive'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sport filter */}
      <div className="px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {sportFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSport(f.id)}
            className={`sport-pill ${sport === f.id ? 'active' : 'inactive'}`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="px-6 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {levelFilters.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`sport-pill ${level === l.id ? 'active' : 'inactive'}`}
            style={level === l.id ? {background: 'var(--secondary)', boxShadow: '0 2px 12px rgba(139, 92, 246, 0.35)'} : {}}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="px-6 space-y-4">
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium">Sin resultados</div>
            <div className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Prueba con otros filtros</div>
          </div>
        )}

        {filtered.map((ev, i) => {
          const pct = fillPct(ev)
          const barColor = fillColor(pct)
          return (
            <Link
              href={`/events/${ev.id}`}
              key={ev.id}
              className={`glass rounded-2xl p-5 block transition-all hover:scale-[1.01] active:scale-[0.99] animate-fade-in-up delay-${Math.min(i + 1, 6)}`}
              style={{textDecoration: 'none'}}
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `${ev.color}22`,
                    border: `1px solid ${ev.color}44`,
                    width: '52px',
                    height: '52px',
                  }}
                >
                  {ev.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base leading-tight">{ev.title}</h3>
                    {ev.thirdPlace && (
                      <span className="level-badge flex-shrink-0" style={{background: 'rgba(251, 191, 36, 0.15)', color: '#f59e0b'}}>
                        🍺
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>
                    {ev.creatorAvatar} {ev.creator}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm mb-3 leading-relaxed" style={{color: 'var(--text-secondary)'}}>{ev.description}</p>

              {/* Meta info */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs" style={{color: 'var(--text-secondary)'}}>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {ev.date} · {ev.time}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {ev.location}
                </span>
                <span className="level-badge" style={{background: `${ev.color}22`, color: ev.color, padding: '2px 8px'}}>
                  {ev.levelIcon} {ev.levelLabel}
                </span>
              </div>

              {/* People progress */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 max-w-32">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${pct}%`, background: barColor}}/>
                    </div>
                  </div>
                  <span className="text-xs" style={{color: barColor}}>
                    {ev.people}/{ev.maxPeople} personas
                    {ev.waitingList > 0 && (
                      <span style={{color: 'var(--secondary)'}}> · +{ev.waitingList} espera</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="ml-3 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${ev.color}, ${ev.color}cc)`,
                    boxShadow: `0 2px 10px ${ev.color}44`,
                  }}
                >
                  Unirse
                </button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
