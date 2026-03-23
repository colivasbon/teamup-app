'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const sports = [
  { id: 'running', name: 'Running', icon: '🏃', color: 'from-orange-500 to-red-500' },
  { id: 'padel', name: 'Pádel', icon: '🎾', color: 'from-green-500 to-emerald-600' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾', color: 'from-amber-500 to-orange-600' },
  { id: 'futbol', name: 'Fútbol', icon: '⚽', color: 'from-blue-500 to-indigo-600' },
  { id: 'gimnasio', name: 'Gimnasio', icon: '💪', color: 'from-purple-500 to-pink-600' },
  { id: 'tenis', name: 'Tenis', icon: '🎳', color: 'from-yellow-500 to-amber-500' },
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
    alert('Evento creado (demo)')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Crear evento</h1>
        <p className="text-slate-400 text-sm mt-1">Organiza tu próxima actividad</p>
      </header>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Sport */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Deporte</label>
          <div className="grid grid-cols-3 gap-3">
            {sports.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm({ ...form, sport: s.id })}
                className={`p-3 rounded-xl border transition-all ${
                  form.sport === s.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <span className="text-xs text-slate-300">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
          <input
            type="text"
            placeholder="Partido de pádel tarde"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
          <textarea
            placeholder="Nivel medio, jugadores/as mayores de 25 años..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 h-24 focus:border-purple-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Hora</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Ubicación</label>
          <input
            type="text"
            placeholder="Parque de la Ciudad, Pista 3"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Max People */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Máximo de personas: <span className="text-purple-400">{form.maxPeople}</span>
          </label>
          <input
            type="range"
            min="2"
            max="50"
            value={form.maxPeople}
            onChange={(e) => setForm({ ...form, maxPeople: e.target.value })}
            className="w-full accent-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-4 rounded-xl font-semibold mt-4 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          Crear evento
        </button>
      </form>
    </div>
  )
}