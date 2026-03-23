// src/app/layout.js
'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('teamup-theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'system']
    const currentIndex = themes.indexOf(theme)
    const newTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('teamup-theme', newTheme)
  }

  const getThemeIcon = () => {
    if (theme === 'system') return '💻'
    return theme === 'dark' ? '🌙' : '☀️'
  }

  return (
    <html lang="es" data-theme={theme} className="dark">
      <body className={`${inter.className} bg-background text-text min-h-screen`}>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md border border-border flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform"
          title={`Tema: ${theme}`}
        >
          {getThemeIcon()}
        </button>

        {children}
        <Navbar />
      </body>
    </html>
  )
}