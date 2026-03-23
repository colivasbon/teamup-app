'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path 
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 z-50">
      <div className="max-w-md mx-auto flex justify-around py-4">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs">Inicio</span>
        </Link>
        <Link 
          href="/events" 
          className={`flex flex-col items-center gap-1 transition-colors ${isActive('/events') ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span className="text-xl">🔍</span>
          <span className="text-xs">Eventos</span>
        </Link>
        <Link 
          href="/create" 
          className={`flex flex-col items-center gap-1 transition-colors ${isActive('/create') ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span className="text-xl">➕</span>
          <span className="text-xs">Crear</span>
        </Link>
        <Link 
          href="/profile" 
          className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span className="text-xl">👤</span>
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}