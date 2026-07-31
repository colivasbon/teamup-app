'use client'

import { useState, useEffect } from 'react'

const THEMES = [
  { id:'dark',         label:'Oscuro',       icon:'🌙' },
  { id:'dark-amoled',  label:'AMOLED',       icon:'⚫' },
  { id:'dark-emerald', label:'Esmeralda',    icon:'💚' },
  { id:'pure-white',   label:'Puro',         icon:'☀️' },
  { id:'light',        label:'Claro',        icon:'🌤️' },
]

export default function ThemeButton() {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tu-theme') || 'dark'
    const current = THEMES.some(t => t.id === saved) ? saved : 'dark'
    setTheme(current)
    document.documentElement.setAttribute('data-theme', current)
    setMounted(true)
  }, [])

  const toggle = () => {
    const currentIndex = THEMES.findIndex(t => t.id === theme)
    const nextIndex = (currentIndex + 1) % THEMES.length
    const next = THEMES[nextIndex].id
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tu-theme', next)
  }

  if (!mounted) return null
  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0]

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
        transition: 'all 0.18s ease',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{currentTheme.icon}</span>
    </button>
  )
}
