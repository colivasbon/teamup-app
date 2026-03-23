// src/app/create/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const sports = [
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'padel', name: 'Pádel', icon: '🎾' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾' },
  { id: 'futbol', name: 'Fútbol', icon: '⚽' },
  { id: 'gimnasio', name: 'Gimnasio', icon: '💪' },
  { id: 'tenis', name: 'Tenis', icon: '🎾' },
]

export default function CreateEvent() {
  const router = useRouter()
  const [form, setForm] = useState({
    sport: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxPeople: 10
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Aquí ira la lógica de Supabase
    alert('Evento creado (demo)')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold">Crear evento</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Sport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deporte</label>
          <div className="grid grid-cols-3 gap-2">
            {sports.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm({ ...form, sport: s.id })}
                className={`p-3 rounded-lg border text-center transition-all ${
                  form.sport === s.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <div className="text-xs mt-1">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            placeholder="Partido de pádel tarde"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            placeholder="Nivel medio, jugadores/as mayores de 25 años..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg h-20"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            type="text"
            placeholder="Parque de la Ciudad, Pista 3"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          />
        </div>

        {/* Max People */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Máximo de personas: {form.maxPeople}
          </label>
          <input
            type="range"
            min="2"
            max="50"
            value={form.maxPeople}
            onChange={(e) => setForm({ ...form, maxPeople: e.target.value })}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold mt-4"
        >
          Crear evento
        </button>
      </form>
    </div>
  )
}