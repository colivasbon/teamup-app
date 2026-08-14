'use client'

import { useState, useEffect, useRef } from 'react'

const VIEW_THEMES = [
  { id:'dark',         label:'Oscuro',      icon:'🌙' },
  { id:'light',        label:'Claro',        icon:'☀️' },
  { id:'dark-emerald', label:'Esmeralda',    icon:'💚' },
  { id:'dark-purple',  label:'Púrpura',      icon:'💜' },
]

export default function ThemeButton() {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const select = (id) => {
    setTheme(id)
    document.documentElement.setAttribute('data-theme', id)
    localStorage.setItem('tu-theme', id)
    setOpen(false)
  }

  if (!mounted) return null
  const currentTheme = VIEW_THEMES.find(t => t.id === theme) || {
    label: 'Tema',
    icon: '🎨',
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Cambiar tema: ${currentTheme.label}`}
        title={`Tema actual: ${currentTheme.label}`}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--glass)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s ease-out',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{currentTheme.icon}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          zIndex: 'var(--z-dropdown)',
          minWidth: 140,
        }}>
          {VIEW_THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => select(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '10px 14px',
                background: t.id === theme ? 'var(--primary-soft)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: t.id === theme ? 700 : 500,
                color: t.id === theme ? 'var(--primary)' : 'var(--text)',
                textAlign: 'left',
                transition: 'background 0.12s ease-out',
              }}
              onMouseEnter={e => { if (t.id !== theme) e.currentTarget.style.background = 'var(--surface)' }}
              onMouseLeave={e => { if (t.id !== theme) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
