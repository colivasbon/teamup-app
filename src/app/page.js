// src/app/page.js
import Link from 'next/link'

const sports = [
  { id: 'running', name: '🏃 Running', icon: '🏃' },
  { id: 'padel', name: '🎾 Pádel', icon: '🎾' },
  { id: 'senderismo', name: '🥾 Senderismo', icon: '🥾' },
  { id: 'futbol', name: '⚽ Fútbol', icon: '⚽' },
  { id: 'gimnasio', name: '💪 Gimnasio', icon: '💪' },
  { id: 'tenis', name: '🎾 Tenis', icon: '🎾' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">TeamUp</h1>
          <button className="text-gray-600">👤</button>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¿Qué quieres hacer hoy?
        </h2>
        <p className="text-gray-500 mb-6">
          Encuentra gente para hacer deporte contigo
        </p>

        {/* Sports Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={`/events?sport=${sport.id}`}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-3xl block mb-1">{sport.icon}</span>
              <span className="font-medium text-gray-700">{sport.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <Link
          href="/create"
          className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          + Crear evento
        </Link>
      </div>
    </div>
  )
}