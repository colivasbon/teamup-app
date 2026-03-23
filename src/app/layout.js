'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark')

  const cycleTheme = () => {
    const next = { dark: 'light', light: 'system', system: 'dark' }[theme]
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tu-theme', next)
  }

  useEffect(() => {
    const t = localStorage.getItem('tu-theme') || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const themeIcon = theme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  ) : theme === 'light' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
  )

  return (
    <html lang="es" data-theme={theme}>
      <body className={inter.className}>
        <div className="app-shell">
          {children}
          <Navbar />
          <button
            onClick={cycleTheme}
            className="btn-icon"
            style={{ position:'fixed', top:16, right:16, zIndex:200 }}
            title="Cambiar tema"
          >
            {themeIcon}
          </button>
        </div>
      </body>
    </html>
  )
}
