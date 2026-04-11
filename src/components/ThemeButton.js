'use client'

import { useState, useEffect } from 'react'

export default function ThemeButton() {
  const [theme,   setTheme]   = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tu-theme', next)
  }

  if (!mounted) return null
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--glass)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.18s ease',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.5"/>
          <line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/>
          <line x1="4.22" y1="4.22" x2="5.93" y2="5.93"/><line x1="18.07" y1="18.07" x2="19.78" y2="19.78"/>
          <line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.93" y2="18.07"/><line x1="18.07" y1="5.93" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}
