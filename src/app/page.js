// src/app/page.js
import Link from 'next/link'

const sports = [
  { id: 'running', name: 'Running', icon: '🏃', color: 'from-blue-500 to-indigo-600' },
  { id: 'padel', name: 'Pádel', icon: '🎾', color: 'from-green-500 to-emerald-600' },
  { id: 'senderismo', name: 'Senderismo', icon: '🥾', color: 'from-amber-500 to-orange-600' },
  { id: 'futbol', name: 'Fútbol', icon: '⚽', color: 'from-red-500 to-rose-600' },
  { id: 'gimnasio', name: 'Gimnasio', icon: '💪', color: 'from-purple-500 to-pink-600' },
  { id: 'tenis', name: 'Tenis', icon: '🎳', color: 'from-yellow-500 to-amber-600' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text pt-safe pb-safe">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              TeamUp
            </h1>
            <p className="text-text-secondary text-sm mt-1">Haz deporte, conoce gente</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-surface/50 flex items-center justify-center text-lg">
            👤
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">
          ¿Qué quieres hacer hoy?
        </h2>
        <p className="text-text-secondary mb-8">
          Descubre eventos deportivos cerca de ti
        </p>

        {/* Sports Grid */}
        <div className="grid grid-cols-2 gap-4">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={`/events?sport=${sport.id}`}
              className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${sport.color} group animate-fadeInUp`}
            >
              <div className="relative z-10">
                <span className="text-4xl block mb-2">{sport.icon}</span>
                <span className="font-semibold text-white">{sport.name}</span>
              </div>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-20 group-hover:opacity-30 transition-opacity animate-slideInLeft">
                {sport.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4">
        <div className="bg-surface/50 rounded-2xl p-5 flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">150+</div>
            <div className="text-xs text-text-secondary">Eventos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1.2k</div>
            <div className="text-xs text-text-secondary">Usuarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-xs text-text-secondary">Ciudades</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-6 left-6 right-6">
        <Link
          href="/create"
          className="block w-full bg-gradient-to-r from-primary to-primary-hover text-white text-center py-4 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] animate-fadeInUp"
        >
          + Crear evento
        </Link>
      </div>
      <div className="h-24"></div>
    </div>
  )
}