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
    people: 8,
    maxPeople: 15,
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
    time: &18:00',
    location: 'Club de Padel Centro',
    people: 2,
    maxPeople: 4,
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
    people: 12,
    maxPeople: 20,
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

export default function Events() {
  const [filter, setFilter] = useState('all')

  const filteredEvents = filter === 'all' 
    ? demoEvents 
    : demoEvents.filter(e => e.sport === filter)

  return (
    <div className="min-h-screen bg-background text-text pb-24 pt-safe">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Eventos cerca de ti</h1>
        <p className="text-text-secondary text-sm mt-1">Únete a la próxima actividad</p>
      </header>

      {/* Filters */}
      <div className="px-6 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-primary text-white animate-pulse'
                : 'bg-surface/50 text-text-secondary hover:bg-surface/75 hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="px-6 space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-surface rounded-2xl p-5 border border-border/50 shadow-sm transition-all hover:shadow-md animate-fadeInUp">
            <div className="flex items-start gap-4 mb-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-2xl animate-slideInLeft`}>
                {event.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-text-secondary">por {event.creator}</p>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary mb-4">{event.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
              <span className="flex items-center gap-1">📅 {event.date} • {event.time}</span>
              <span className="flex items-center gap-1">📍 {event.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-28 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-width"
                    style={{ width: `${(event.people / event.maxPeople) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary">
                  {event.people}/{event.maxPeople}
                </span>
              </div>
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-hover shadow-sm hover:shadow-md transition-all animate-pulse">
                Unirse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}