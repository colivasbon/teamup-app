// src/app/page.js
import Link from 'next/link'

const sports = [
  { id: 'running',    name: 'Running',    icon: '🏃', from: '#5b6ef5', to: '#818cf8' },
  { id: 'padel',      name: 'Pádel',      icon: '🎾', from: '#06d6a0', to: '#0891b2' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾', from: '#f59e0b', to: '#ef4444' },
  { id: 'futbol',     name: 'Fútbol',     icon: '⚽', from: '#ef4444', to: '#dc2626' },
  { id: 'gimnasio',   name: 'Gimnasio',   icon: '💪', from: '#8b5cf6', to: '#d946ef' },
  { id: 'tenis',      name: 'Tenis',      icon: '🎾', from: '#f59e0b', to: '#fbbf24' },
]

const stats = [
  { value: '150+', label: 'Eventos activos' },
  { value: '1.2k', label: 'Deportistas' },
  { value: '50',   label: 'Provincias' },
]

export default function Home() {
  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Logo SVG */}
            <div className="flex items-center gap-2 mb-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="TeamUp logo">
                <rect width="32" height="32" rx="10" fill="url(#logoGrad)"/>
                <path d="M10 16 L16 10 L22 16 L16 22 Z" fill="white" opacity="0.9"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5b6ef5"/>
                    <stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-bold tracking-tight" style={{background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                TeamUp
              </span>
            </div>
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Haz deporte, conoce gente</p>
          </div>
          <Link href="/profile" className="w-10 h-10 glass rounded-full flex items-center justify-center text-base hover:scale-105 transition-transform">
            👤
          </Link>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="glass rounded-2xl p-4 flex justify-around">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold" style={{color: 'var(--primary)'}}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 mb-4">
        <h2 className="text-lg font-semibold">¿Qué quieres hacer hoy?</h2>
        <p className="text-sm mt-0.5" style={{color: 'var(--text-secondary)'}}>Elige tu deporte y únete a un evento</p>
      </div>

      {/* Sports Grid */}
      <div className="px-6 grid grid-cols-2 gap-3">
        {sports.map((sport, i) => (
          <Link
            key={sport.id}
            href={`/events?sport=${sport.id}`}
            className={`relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98] animate-fade-in-up delay-${i + 1}`}
            style={{
              background: `linear-gradient(135deg, ${sport.from}, ${sport.to})`,
              boxShadow: `0 4px 20px ${sport.from}40`,
            }}
          >
            {/* Blur orb */}
            <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full opacity-20 group-hover:opacity-35 transition-opacity"
              style={{background: 'white', filter: 'blur(8px)'}}/>
            
            <div className="relative z-10">
              <span className="text-3xl block mb-2">{sport.icon}</span>
              <span className="font-semibold text-white text-sm">{sport.name}</span>
            </div>
            
            {/* Big faded icon */}
            <div className="absolute -right-1 -bottom-1 text-5xl opacity-15 group-hover:opacity-25 transition-opacity select-none pointer-events-none">
              {sport.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity section */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Eventos cercanos</h3>
          <Link href="/events" className="text-sm font-medium" style={{color: 'var(--primary)'}}>Ver todos →</Link>
        </div>

        {/* Preview cards */}
        <div className="space-y-3">
          {[
            { icon: '🏃', sport: 'Running', title: 'Running Dominguero', location: 'Parque de la Ciudad · Madrid', time: 'Hoy 10:00', people: 8, max: 15, color: '#5b6ef5' },
            { icon: '🎾', sport: 'Pádel', title: 'Partido de Pádel', location: 'Club de Pádel Centro · Valencia', time: 'Mañana 18:00', people: 2, max: 4, color: '#06d6a0' },
          ].map((ev, i) => (
            <Link href="/events" key={i} className="glass rounded-2xl p-4 flex items-center gap-4 block hover:scale-[1.01] transition-transform active:scale-[0.99]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{background: `${ev.color}22`, border: `1px solid ${ev.color}44`}}>
                {ev.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{ev.title}</div>
                <div className="text-xs mt-0.5 truncate" style={{color: 'var(--text-secondary)'}}>{ev.location}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{ev.time}</span>
                  <div className="flex-1 max-w-16">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${(ev.people / ev.max) * 100}%`}}/>
                    </div>
                  </div>
                  <span className="text-xs" style={{color: 'var(--primary)'}}>{ev.people}/{ev.max}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA fixed */}
      <div className="fixed bottom-20 left-6 right-6 z-40">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'var(--gradient)',
            boxShadow: '0 6px 24px rgba(91, 110, 245, 0.4)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear evento
        </Link>
      </div>
    </div>
  )
}
