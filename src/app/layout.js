// src/app/layout.js
'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark')
  
  const toggleTheme = () => {
    const themes = ['dark', 'light', 'system']
    const currentIndex = themes.indexOf(theme)
    const newTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('teamup-theme', newTheme)
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('teamup-theme') || 'dark'
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const getThemeIcon = () => {
    if (theme === 'system') return '💻'
    return theme === 'dark' ? '🌙' : '☀️'
  }

  return (
    <html lang="es" data-theme={theme}>
      <body className={inter.className}>
        {children}
        <Navbar />
        
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          title={theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          <span className="text-xl">{getThemeIcon()}</span>
        </button>
      </body>
    </html>
  )
}