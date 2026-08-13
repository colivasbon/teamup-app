'use client'

import { useState, useEffect } from 'react'

const VIEW_THEMES = [
  { id:'dark',  label:'Oscuro', icon:'🌙' },
  { id:'light', label:'Claro',  icon:'☀️' },
]

export default function ThemeButton() {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  const toggle = () => {
    const currentIndex = VIEW_THEMES.findIndex(t => t.id === theme)
    const nextIndex = currentIndex === 0 ? 1 : 0
    const next = VIEW_THEMES[nextIndex].id
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tu-theme', next)
  }

  if (!mounted) return null
  const currentTheme = VIEW_THEMES.find(t => t.id === theme) || {
    label: theme === 'light' || theme === 'pure-white' ? 'Claro' : 'Oscuro',
    icon: theme === 'light' || theme === 'pure-white' ? '☀️' : '🌙',
  }

  return (
    <button
      onClick={toggle}
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
  )
}
