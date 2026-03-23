// src/app/create/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const provinces = [
  'Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona',
  'Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ceuta','Ciudad Real','Córdoba',
  'Cuenca','Girona','Granada','Guadalajara','Huelva','Huesca','Islas Baleares','Jaén',
  'La Coruña','La Rioja','Las Palmas','León','Lleida','Lugo','Madrid','Málaga',
  'Melilla','Murcia','Navarra','Ourense','Palencia','Pontevedra','Salamanca','Segovia',
  'Sevilla','Soria','Tarragona','Teruel','Toledo','Valencia','Valladolid','Vizcaya',
  'Zamora','Zaragoza',
]

const sports = [
  { id: 'running',    name: 'Running',    icon: '🏃', color: '#5b6ef5' },
  { id: 'padel',      name: 'Pádel',      icon: '🎾', color: '#06d6a0' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾', color: '#f59e0b' },
  { id: 'futbol',     name: 'Fútbol',     icon: '⚽', color: '#ef4444' },
  { id: 'gimnasio',   name: 'Gimnasio',   icon: '💪', color: '#8b5cf6' },
  { id: 'tenis',      name: 'Tenis',      icon: '🎾', color: '#fbbf24' },
]

const levels = [
  { id: 'any',          name: 'Todos',        icon: '🌍', desc: 'Sin restricciones' },
  { id: 'beginner',     name: 'Principiante', icon: '🌱', desc: 'Empezando ahora' },
  { id: 'intermediate', name: 'Intermedio',   icon: '⭐', desc: 'Con experiencia' },
  { id: 'advanced',     name: 'Avanzado',     icon: '🔥', desc: 'Alto nivel' },
]

const steps = ['Deporte', 'Detalles', 'Opciones']

export default function CreateEvent() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    sport: '', level: 'any',
    title: '', description: '',
    date: '', time: '',
    location: '', province: '',
    thirdPlace: false, thirdPlaceLink: '',
    maxPeople: 10, waitingList: 0,
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const canNext = () => {
    if (step === 0) return !!form.sport
    if (step === 1) return form.title && form.date && form.location && form.province
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert('¡Evento creado con éxito! (demo)')
    router.push('/')
  }

  const selectedSport = sports.find(s => s.id === form.sport)

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step > 0 ? setStep(step - 1) : router.back()}
            className="w-9 h-9 glass rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold">Crear evento</h1>
            <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>Paso {step + 1} de {steps.length} · {steps[step]}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{background: i <= step ? 'var(--primary)' : 'var(--border)'}}/>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-6">

        {/* Step 0: Sport */}
        {step === 0 && (
          <div className="animate-fade-in">
            <p className="text-base font-medium mb-5">¿Qué deporte vais a practicar?</p>
            <div className="grid grid-cols-2 gap-3">
              {sports.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => update('sport', s.id)}
                  className="relative p-4 rounded-2xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: form.sport === s.id ? s.color : 'var(--border)',
                    background: form.sport === s.id ? `${s.color}18` : 'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="text-3xl block mb-2">{s.icon}</span>
                  <span className="text-sm font-medium">{s.name}</span>
                  {form.sport === s.id && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{background: s.color}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-base font-medium mb-1">Cuéntanos los detalles</p>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>TÍTULO DEL EVENTO</label>
              <input
                type="text"
                placeholder={`Ej: Partido de ${selectedSport?.name || 'deporte'} tarde`}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="input-glass"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>DESCRIPCIÓN (opcional)</label>
              <textarea
                placeholder="Nivel, requisitos, qué llevar..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="input-glass h-24 resize-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>FECHA</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="input-glass"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>HORA</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  className="input-glass"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>UBICACIÓN</label>
              <input
                type="text"
                placeholder="Nombre del lugar o dirección"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                className="input-glass"
                required
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>PROVINCIA</label>
              <select
                value={form.province}
                onChange={(e) => update('province', e.target.value)}
                className="input-glass appearance-none"
                required
              >
                <option value="">Selecciona provincia...</option>
                {provinces.map((p) => (
                  <option key={p} value={p.toLowerCase().replace(/\s/g, '')}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Options */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-base font-medium mb-1">Últimos ajustes</p>

            {/* Level */}
            <div>
              <label className="block text-xs font-medium mb-3" style={{color: 'var(--text-secondary)'}}>NIVEL REQUERIDO</label>
              <div className="grid grid-cols-2 gap-2">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => update('level', l.id)}
                    className="p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: form.level === l.id ? 'var(--primary)' : 'var(--border)',
                      background: form.level === l.id ? 'rgba(var(--primary-rgb), 0.12)' : 'var(--glass-bg)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <span className="text-xl block mb-1">{l.icon}</span>
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max people */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Máximo de personas</label>
                <span className="text-lg font-bold" style={{color: 'var(--primary)'}}>{form.maxPeople}</span>
              </div>
              <input
                type="range" min="2" max="50"
                value={form.maxPeople}
                onChange={(e) => update('maxPeople', parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs mt-1" style={{color: 'var(--text-secondary)'}}>
                <span>2</span><span>50</span>
              </div>
            </div>

            {/* Waiting list */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Lista de espera</label>
                <span className="text-lg font-bold" style={{color: 'var(--secondary)'}}>{form.waitingList}</span>
              </div>
              <input
                type="range" min="0" max="20"
                value={form.waitingList}
                onChange={(e) => update('waitingList', parseInt(e.target.value))}
                className="w-full accent-secondary"
              />
              <p className="text-xs mt-2" style={{color: 'var(--text-secondary)'}}>
                Personas que pueden apuntarse si el evento se llena
              </p>
            </div>

            {/* Third place */}
            <div className="glass rounded-2xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-sm">🍺 Tercer tiempo</div>
                  <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>¿Habéis pensado en quedar después?</p>
                </div>
                <div
                  onClick={() => update('thirdPlace', !form.thirdPlace)}
                  className="w-12 h-6 rounded-full transition-all relative cursor-pointer flex-shrink-0"
                  style={{background: form.thirdPlace ? 'var(--primary)' : 'var(--border)'}}
                >
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow"
                    style={{left: form.thirdPlace ? '26px' : '2px'}}/>
                </div>
              </label>
              {form.thirdPlace && (
                <input
                  type="text"
                  placeholder="Link de Google Maps (opcional)"
                  value={form.thirdPlaceLink}
                  onChange={(e) => update('thirdPlaceLink', e.target.value)}
                  className="input-glass mt-3 text-sm"
                />
              )}
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-4" style={{borderColor: 'var(--border)'}}>
              <h3 className="text-xs font-semibold mb-3" style={{color: 'var(--text-secondary)'}}>RESUMEN DEL EVENTO</h3>
              <div className="space-y-1.5 text-sm">
                {selectedSport && <div className="flex gap-2"><span>{selectedSport.icon}</span><span>{selectedSport.name}</span></div>}
                {form.title && <div className="flex gap-2"><span>📌</span><span className="font-medium">{form.title}</span></div>}
                {form.date && <div className="flex gap-2"><span>📅</span><span>{form.date} {form.time}</span></div>}
                {form.location && <div className="flex gap-2"><span>📍</span><span>{form.location}</span></div>}
                <div className="flex gap-2"><span>👥</span><span>Hasta {form.maxPeople} personas</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="fixed bottom-20 left-6 right-6 z-40 flex gap-3">
          {step < 2 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="flex-1 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canNext() ? 'var(--gradient)' : 'var(--border)',
                boxShadow: canNext() ? '0 6px 24px rgba(91, 110, 245, 0.4)' : 'none',
              }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'var(--gradient)',
                boxShadow: '0 6px 24px rgba(91, 110, 245, 0.4)',
              }}
            >
              ✓ Publicar evento
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
