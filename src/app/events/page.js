// src/app/events/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

// Demo data
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
    creator: 'Miguel R.'
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
    people: 2,
    maxPeople: 4,
    creator: 'Laura M.'
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
    creator: 'Carlos A.'
  }
]

export default function Events() {
  const [filter, setFilter] = useState('all')

  const filteredEvents = filter === 'all' 
    ? demoEvents 
    : demoEvents.filter(e => e.sport === filter)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold">Eventos cerca de ti</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-md mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
        {['all', 'running', 'padel', 'senderismo', 'futbol'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{event.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500">por {event.creator}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
              <span>📅 {event.date} {event.time}</span>
              <span>📍 {event.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${(event.people / event.maxPeople) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {event.people}/{event.maxPeople}
                </span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                Unirse
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t pb-safe">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/" className="text-gray-400">🏠</Link>
          <Link href="/events" className="text-blue-600">🔍</Link>
          <Link href="/create" className="text-gray-400">➕</Link>
          <Link href="/profile" className="text-gray-400">👤</Link>
        </div>
      </nav>
    </div>
  )
}