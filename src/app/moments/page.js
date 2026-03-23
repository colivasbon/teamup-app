// src/app/moments/page.js
'use client'

import { useState } from 'react'

const moments = [
  {
    id: 1, user: 'Miguel R.', avatar: '🧑‍🦱', sport: 'running', icon: '🏃',
    title: 'Running Dominguero',
    caption: 'Qué buena ruta por el parque hoy. Ya ganas de la próxima 💪',
    emoji: '😮‍💨',
    color: '#5b6ef5',
    time: 'Hace 2h',
    likes: 12, liked: false,
    comments: 3,
    bg: 'linear-gradient(135deg, #5b6ef522, #818cf811)',
  },
  {
    id: 2, user: 'Laura M.', avatar: '👩‍🦳', sport: 'padel', icon: '🎾',
    title: 'Partido de Pádel',
    caption: 'Partido épico hoy en el club 🎾 Perdimos pero nos reímos mogollón. Tercer tiempo obligatorio 🍺',
    emoji: '🤣',
    color: '#06d6a0',
    time: 'Hace 4h',
    likes: 8, liked: false,
    comments: 5,
    bg: 'linear-gradient(135deg, #06d6a022, #0891b211)',
  },
  {
    id: 3, user: 'Carlos A.', avatar: '🧔', sport: 'senderismo', icon: '🥾',
    title: 'Senderismo Sierra Norte',
    caption: 'Vistas increíbles desde lo alto. 12 km que valen cada paso. Hasta la próxima aventura ⛰️',
    emoji: '😍',
    color: '#f59e0b',
    time: 'Ayer',
    likes: 24, liked: true,
    comments: 7,
    bg: 'linear-gradient(135deg, #f59e0b22, #ef444411)',
  },
  {
    id: 4, user: 'Javi P.', avatar: '👨‍🦲', sport: 'futbol', icon: '⚽',
    title: 'Fútbol 7 tarde',
    caption: 'Gol en el último minuto 🔥 Eso es TeamUp. Nos vemos el próximo viernes.',
    emoji: '🥳',
    color: '#ef4444',
    time: 'Hace 2 días',
    likes: 19, liked: false,
    comments: 11,
    bg: 'linear-gradient(135deg, #ef444422, #dc262611)',
  },
]

export default function Moments() {
  const [feed, setFeed] = useState(moments)
  const [posting, setPosting] = useState(false)
  const [newCaption, setNewCaption] = useState('')

  const toggleLike = (id) => {
    setFeed(feed.map(m => m.id === id
      ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 }
      : m
    ))
  }

  const handlePost = (e) => {
    e.preventDefault()
    if (!newCaption.trim()) return
    setFeed([{
      id: Date.now(), user: 'Tú', avatar: '😊', sport: 'running', icon: '🏃',
      title: 'Mi momento', caption: newCaption, emoji: '🌟', color: '#5b6ef5',
      time: 'Ahora', likes: 0, liked: false, comments: 0,
      bg: 'linear-gradient(135deg, #5b6ef522, #818cf811)',
    }, ...feed])
    setNewCaption('')
    setPosting(false)
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Momentos</h1>
          <p className="text-sm mt-0.5" style={{color: 'var(--text-secondary)'}}>Lo que pasó después del partido</p>
        </div>
        <button
          onClick={() => setPosting(!posting)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          style={{background: 'var(--gradient)', boxShadow: '0 2px 12px rgba(91,110,245,0.4)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </header>

      {/* Post composer */}
      {posting && (
        <div className="px-6 mb-5 animate-fade-in-up">
          <form onSubmit={handlePost} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">😊</span>
              <textarea
                placeholder="¿Cómo fue el evento? Comparte el momento..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="input-glass flex-1 h-20 resize-none text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setPosting(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                style={{background: 'var(--border)', color: 'var(--text-secondary)'}}>
                Cancelar
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{background: 'var(--gradient)'}}>
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="px-6 space-y-4">
        {feed.map((moment, i) => (
          <div key={moment.id}
            className={`glass rounded-2xl overflow-hidden animate-fade-in-up delay-${Math.min(i + 1, 6)}`}>
            
            {/* Colored top band */}
            <div className="h-1.5" style={{background: `linear-gradient(90deg, ${moment.color}, ${moment.color}66)`}}/>
            
            <div className="p-4">
              {/* User row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{moment.avatar}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{moment.user}</div>
                  <div className="flex items-center gap-1 text-xs" style={{color: 'var(--text-secondary)'}}>
                    <span>{moment.icon}</span>
                    <span>{moment.title}</span>
                    <span>·</span>
                    <span>{moment.time}</span>
                  </div>
                </div>
                <span className="text-2xl">{moment.emoji}</span>
              </div>

              {/* Caption */}
              <p className="text-sm leading-relaxed mb-4">{moment.caption}</p>

              {/* Photo placeholder with gradient */}
              <div className="rounded-xl h-32 mb-4 flex items-center justify-center"
                style={{background: moment.bg, border: `1px solid ${moment.color}22`}}>
                <div className="text-center">
                  <div className="text-3xl mb-1">{moment.icon}</div>
                  <div className="text-xs" style={{color: 'var(--text-secondary)'}}>📷 Foto del momento</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(moment.id)}
                  className="flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95"
                  style={{color: moment.liked ? '#ef4444' : 'var(--text-secondary)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    fill={moment.liked ? '#ef4444' : 'none'}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span className="text-sm font-medium">{moment.likes}</span>
                </button>

                <button className="flex items-center gap-1.5 transition-all hover:scale-110"
                  style={{color: 'var(--text-secondary)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="text-sm">{moment.comments}</span>
                </button>

                <button className="flex items-center gap-1.5 transition-all hover:scale-110 ml-auto"
                  style={{color: 'var(--text-secondary)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
