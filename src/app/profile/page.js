// src/app/profile/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

const userProfile = {
  name: 'Carlos Olivas',
  username: '@colivasbon',
  avatar: '🧔',
  bio: 'Apasionado del running y el senderismo. Córdoba 📍',
  sports: ['running', 'senderismo', 'futbol'],
  level: 'intermediate',
  karma: 4.8,
  karmaCount: 24,
  eventsCreated: 7,
  eventsJoined: 31,
  since: 'Marzo 2025',
}

const myEvents = [
  { id: 1, icon: '🏃', title: 'Running Dominguero', date: 'Dom 30 Mar', sport: 'running', color: '#5b6ef5', status: 'open' },
  { id: 2, icon: '🥾', title: 'Senderismo por Los Pedroches', date: 'Sáb 5 Abr', sport: 'senderismo', color: '#f59e0b', status: 'open' },
]

const reviews = [
  { user: 'Ana G.', avatar: '👩', rating: 5, text: 'Muy buen organizador, puntual y majo.', date: 'Mar 2026' },
  { user: 'Pedro L.', avatar: '👨‍🦱', rating: 5, text: 'Excelente ruta, repetiría.', date: 'Feb 2026' },
  { user: 'Lucía M.', avatar: '👩‍🦰', rating: 4, text: 'Todo bien, muy buen ambiente.', date: 'Ene 2026' },
]

const sportIcons = {
  running: '🏃', padel: '🎾', senderismo: '🥾',
  futbol: '⚽', gimnasio: '💪', tenis: '🎾',
}

const sportNames = {
  running: 'Running', padel: 'Pádel', senderismo: 'Senderismo',
  futbol: 'Fútbol', gimnasio: 'Gimnasio', tenis: 'Tenis',
}

export default function Profile() {
  const [tab, setTab] = useState('eventos')

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Mi perfil</h1>
        <Link href="/auth"
          className="w-9 h-9 glass rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </Link>
      </header>

      {/* Profile card */}
      <div className="px-6 mb-5">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #5b6ef522, #8b5cf622)', border: '2px solid rgba(91,110,245,0.3)'}}>
              {userProfile.avatar}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg leading-tight">{userProfile.name}</h2>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{userProfile.username}</p>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>{userProfile.bio}</p>
            </div>
          </div>

          {/* Karma */}
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{background: 'rgba(91,110,245,0.08)'}}>
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(userProfile.karma) ? '#f59e0b' : 'none'}
                  stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="font-bold text-sm">{userProfile.karma}</span>
            <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{userProfile.karmaCount} valoraciones</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { value: userProfile.eventsCreated, label: 'Creados' },
              { value: userProfile.eventsJoined, label: 'Asistidos' },
              { value: `${userProfile.since.split(' ')[1]}`, label: 'Miembro' },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-xl" style={{background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}}>
                <div className="font-bold text-base" style={{color: 'var(--primary)'}}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sports */}
          <div>
            <p className="text-xs font-medium mb-2" style={{color: 'var(--text-secondary)'}}>DEPORTES FAVORITOS</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.sports.map((s) => (
                <span key={s} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{background: 'rgba(91,110,245,0.12)', color: 'var(--primary)'}}>
                  {sportIcons[s]} {sportNames[s]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <div className="px-6 mb-5">
        <button className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)'}}>
          ✏️ Editar perfil
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4 flex gap-1 p-1 rounded-xl" style={{background: 'var(--border)', margin: '0 24px 16px'}}>
        {['eventos', 'valoraciones'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
            style={{
              background: tab === t ? 'var(--surface-solid)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text-secondary)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
            }}>
            {t === 'eventos' ? 'Mis eventos' : 'Valoraciones'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 space-y-3">
        {tab === 'eventos' && myEvents.map((ev, i) => (
          <Link key={ev.id} href={`/events/${ev.id}`}
            className={`glass rounded-2xl p-4 flex items-center gap-3 block transition-all hover:scale-[1.01] animate-fade-in-up delay-${i+1}`}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{background: `${ev.color}22`, border: `1px solid ${ev.color}33`}}>
              {ev.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{ev.title}</div>
              <div className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{ev.date}</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{background: '#06d6a015', color: '#06d6a0'}}>
              Activo
            </span>
          </Link>
        ))}

        {tab === 'valoraciones' && reviews.map((r, i) => (
          <div key={i} className={`glass rounded-2xl p-4 animate-fade-in-up delay-${i+1}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{r.avatar}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{r.user}</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                      fill={s <= r.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{r.date}</span>
            </div>
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
