// src/app/create/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const provinces = [
  { id: 'alava', name: 'Álava' },
  { id: 'albacete', name: 'Albacete' },
  { id: 'alicante', name: 'Alicante' },
  { id: 'almeria', name: 'Almería' },
  { id: 'asturias', name: 'Asturias' },
  { id: 'avila', name: 'Ávila' },
  { id: 'badajoz', name: 'Badajoz' },
  { id: 'barcelona', name: 'Barcelona' },
  { id: 'burgos', name: 'Burgos' },
  { id: 'caceres', name: 'Cáceres' },
  { id: 'cadiz', name: 'Cádiz' },
  { id: 'cantabria', name: 'Cantabria' },
  { id: 'castellon', name: 'Castellón' },
  { id: 'ceuta', name: 'Ceuta' },
  { id: 'ciudadreal', name: 'Ciudad Real' },
  { id: 'cordoba', name: 'Córdoba' },
  { id: 'cuenca', name: 'Cuenca' },
  { id: 'girona', name: 'Girona' },
  { id: 'granada', name: 'Granada' },
  { id: 'guadalajara', name: 'Guadalajara' },
  { id: 'huelva', name: 'Huelva' },
  { id: 'huesca', name: 'Huesca' },
  { id: 'islasbaleares', name: 'Islas Baleares' },
  { id: 'jaen', name: 'Jaén' },
  { id: 'lacoruna', name: 'La Coruña' },
  { id: 'larioja', name: 'La Rioja' },
  { id: 'laspalmas', name: 'Las Palmas' },
  { id: 'leon', name: 'León' },
  { id: 'lleida', name: 'Lleida' },
  { id: 'lugo', name: 'Lugo' },
  { id: 'madrid', name: 'Madrid' },
  { id: 'malaga', name: 'Málaga' },
  { id: 'melilla', name: 'Melilla' },
  { id: 'murcia', name: 'Murcia' },
  { id: 'navarra', name: 'Navarra' },
  { id: 'ourense', name: 'Ourense' },
  { id: 'palencia', name: 'Palencia' },
  { id: 'pontevedra', name: 'Pontevedra' },
  { id: 'salamanca', name: 'Salamanca' },
  { id: 'segovia', name: 'Segovia' },
  { id: 'sevilla', name: 'Sevilla' },
  { id: 'soria', name: 'Soria' },
  { id: 'tarragona', name: 'Tarragona' },
  { id: 'teruel', name: 'Teruel' },
  { id: 'toledo', name: 'Toledo' },
  { id: 'valencia', name: 'Valencia' },
  { id: 'valladolid', name: 'Valladolid' },
  { id: 'vizcaya', name: 'Vizcaya' },
  { id: 'zamora', name: 'Zamora' },
  { id: 'zaragoza', name: 'Zaragoza' },
]

const sports = [
  { id: 'running', name: 'Running', icon: '🏃', color: 'from-blue-500 to-indigo-600' },
  { id: 'padel', name: 'Pádel', icon: '🎾', color: 'from-green-500 to-emerald-600' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾', color: 'from-amber-500 to-orange-600' },
  { id: 'futbol', name: 'Fútbol', icon: '⚽', color: 'from-red-500 to-rose-600' },
  { id: 'gimnasio', name: 'Gimnasio', icon: '💪', color: 'from-purple-500 to-pink-600' },
  { id: 'tenis', name: 'Tenis', icon: '🎳', color: 'from-yellow-500 to-amber-600' },
]

const levels = [
  { id: 'any', name: 'Todos', icon: '🌍' },
  { id: 'beginner', name: 'Principiante', icon: '🌱' },
  { id: 'intermediate', name: 'Intermedio', icon: '⭐' },
  { id: 'advanced', name: 'Avanzado', icon: '🔥' },
]

export default function CreateEvent() {
  const router = useRouter()
  const [form, setForm] = useState({
    sport: '',
    level: 'any',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    province: '',
    thirdPlace: false,
    thirdPlaceLink: '',
    maxPeople: 10,
    waitingList: 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert('Evento creado (demo)')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-text pb-24 pt-safe">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Crear evento</h1>
        <p className="text-text-secondary text-sm mt-1">Organiza tu próxima actividad</p>
      </header>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Sport */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Deporte</label>
          <div className="grid grid-cols-3 gap-3">
            {sports.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm({ ...form, sport: s.id })}
                className={`p-3 rounded-xl border transition-all ${
                  form.sport === s.id
                    ? 'border-primary bg-primary/20 shadow-sm hover:shadow-md'
                    : 'border-border bg-surface hover:border-border/75 hover:bg-surface/75'
                }`}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <span className="text-xs text-text-secondary">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Título</label>
          <input
            type="text"
            placeholder="Partido de pádel tarde"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text placeholder-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Descripción</label>
          <textarea
            placeholder="Nivel medio, jugadores/as mayores de 25 años..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text placeholder-text-secondary h-24 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm hover:shadow-md"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-4 bg-surface border border-border rounded-xl text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Hora</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full p-4 bg-surface border border-border rounded-xl text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md">
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Ubicación</label>
          <input
            type="text"
            placeholder="Parque de la Ciudad, Pista 3"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text placeholder-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md"
            required
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Provincia</label>
          <select
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md"
            required
          >
            <option value="">Selecciona provincia</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Nivel requerido</label>
          <div className="grid grid-cols-4 gap-2">
            {levels.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setForm({ ...form, level: l.id })}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                  form.level === l.id
                    ? 'border-primary bg-primary/20 shadow-sm'
                    : 'border-border bg-surface hover:border-border/75'
                }`}
              >
                <span className="text-xl">{l.icon}</span>
                <span className="text-xs text-text-secondary">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Third Place (Tercer Tiempo) */}
        <div className="bg-surface p-4 rounded-xl border border-border">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium">🍺 Tercer tiempo</span>
              <p className="text-xs text-text-secondary">Añadir ubicación para después del evento</p>
            </div>
            <input
              type="checkbox"
              checked={form.thirdPlace}
              onChange={(e) => setForm({ ...form, thirdPlace: e.target.checked })}
              className="w-5 h-5 accent-primary"
            />
          </label>
          {form.thirdPlace && (
            <input
              type="text"
              placeholder="Link de Google Maps (opcional)"
              value={form.thirdPlaceLink}
              onChange={(e) => setForm({ ...form, thirdPlaceLink: e.target.value })}
              className="w-full p-3 mt-3 bg-background border border-border rounded-lg text-sm"
            />
          )}
        </div>

        {/* Waiting List */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Lista de espera: <span className="text-primary">{form.waitingList} plazas</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={form.waitingList}
            onChange={(e) => setForm({ ...form, waitingList: e.target.value })}
            className="w-full accent-primary"
          />
          <p className="text-xs text-text-secondary mt-1">Personas que pueden apuntarse si se llena</p>
        </div>

        {/* Max People */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Máximo de personas: <span className="text-primary">{form.maxPeople}</span>
          </label>
          <input
            type="range"
            min="2"
            max="50"
            value={form.maxPeople}
            onChange={(e) => setForm({ ...form, maxPeople: e.target.value })}
            className="w-full accent-primary shadow-sm hover:shadow-md transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold mt-4 hover:bg-primary-hover shadow-sm hover:shadow-md transition-all">
          Crear evento
        </button>
      </form>
    </div>
  )
}