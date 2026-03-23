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
    description: 'Ruta suave por el parque. Todos los niveles bienvenidos!',
    date: 'Domingo 30',
    time: '10:00',
    location: 'Parque de la Ciudad',
    province: 'madrid',
    level: 'any',
    levelIcon: '🌍',
    thirdPlace: true,
    people: 8,
    maxPeople: 15,
    waitingList: 5,
    creator: 'Miguel R.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 2,
    sport: 'padel',
    icon: '🎾',
    title: 'Partido de Pádel',
    description: 'Buscamos 2 más para completar. Nivel intermedio.',
    date: 'Sábado 29',
    time: '18:00',
    location: 'Club de Padel Centro',
    province: 'valencia',
    level: 'intermediate',
    levelIcon: '⭐',
    thirdPlace: false,
    people: 2,
    maxPeople: 4,
    waitingList: 2,
    creator: 'Laura M.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 3,
    sport: 'senderismo',
    icon: '🥾',
    title: 'Senderismo Sierra Norte',
    description: 'Ruta de 12km, dificultad media. Llevar agua y calzado cómodo.',
    date: 'Domingo 30',
    time: '09:00',
    location: 'Plaza del Pueblo',
    province: 'madrid',
    level: 'advanced',
    levelIcon: '🔥',
    thirdPlace: true,
    people: 12,
    maxPeople: 20,
    waitingList: 8,
    creator: 'Carlos A.',
    color: 'from-amber-500 to-orange-600'
  }
]

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'running', label: '🏃 Running' },
  { id: 'padel', label: '🎾 Pádel' },
  { id: 'senderismo', label: '🥾 Senderismo' },
  { id: 'futbol', label: '⚽ Fútbol' },
]

const levelFilters = [
  { id: 'all', name: 'Todos', icon: '🌍' },
  { id: 'any', name: 'Abierto', icon: '🌍' },
  { id: 'beginner', name: '🌱', icon: '🌱' },
  { id: 'intermediate', name: '⭐', icon: '⭐' },
  { id: 'advanced', name: '🔥', icon: '🔥' },
]

const provinces = [
  { id: 'all', name: 'Todas' },
  { id: 'madrid', name: 'Madrid' },
  { id: 'valencia', name: 'Valencia' },
  { id: 'barcelona', name: 'Barcelona' },
  { id: 'sevilla', name: 'Sevilla' },
]

export default function Events() {
  const [filter, setFilter] = useState('all')
  const [province, setProvince] = useState('all')
  const [level, setLevel] = useState('all')

  const filteredEvents = demoEvents.filter(e => {
    const sportMatch = filter === 'all' || e.sport === filter
    const provinceMatch = province === 'all' || e.province === province
    const levelMatch = level === 'all' || e.level === level || e.level === 'any'
    return sportMatch && provinceMatch && levelMatch
  })

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] pb-24 pt-safe">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Eventos cerca de ti</h1>
        <p className="text-slate-400 text-sm mt-1">Únete a la próxima actividad</p>
      </header>

      {/* Province Filter */}
      <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
        {provinces.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvince(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
              province === p.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sport Filter */}
      <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Level Filter */}
      <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
        {levelFilters.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
              level === l.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span>{l.icon}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="px-6 space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all">
            <div className="flex items-start gap-4 mb-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-2xl`}>
                {event.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-slate-400">por {event.creator}</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-4">{event.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1">📅 {event.date} • {event.time}</span>
              <span className="flex items-center gap-1">📍 {event.location}</span>
              <span className="flex items-center gap-1">{event.levelIcon}</span>
              {event.thirdPlace && (
                <span className="flex items-center gap-1">🍺 3er tiempo</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-28 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(event.people / event.maxPeople) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400">
                  {event.people}/{event.maxPeople}
                  {event.waitingList > 0 && <span className="text-xs text-violet-400 ml-1">+{event.waitingList} espera</span>}
                </span>
              </div>
              <button className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-all">
                Unirse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}