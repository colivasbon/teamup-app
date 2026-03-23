// src/app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark')
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('teamup-theme', newTheme)
  }
  
  // Apply saved theme on mount
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('teamup-theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }

  return (
    <html lang="es" data-theme={theme}>
      <body className={inter.className}>
        {children}
        <Navbar />
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? 
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M2.343 13.657l-.707-.707m12.728 0l.707.707M2.343 7.343l-.707-.707m12.728 0l.707.707M3 12a9 9 0 11 18 0 9 9 0 11 18 0z" />
            </svg>
            :
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 14.354l-1.414-1.414c-.03-.029-.062-.059-.1-.083A10.003 10.003 0 018.5 21a8.005 8.005 0 100-16 10.003 10.003 0 015.894 9.446.997.997 0 001.414 0 2.003 2.003 0 112.83-2.83l1.414 1.414A2.003 2.003 0 0019 21a2.003 2.003 0 01-2.828-2.829z" />
            </svg>
          }
        </button>
      </body>
    </html>
  )
}