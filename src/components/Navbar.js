'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path ? 'text-blue-600' : 'text-gray-400'
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t pb-safe z-50">
      <div className="max-w-md mx-auto flex justify-around py-3">
        <Link href="/" className={isActive('/') + ' text-2xl'}>🏠</Link>
        <Link href="/events" className={isActive('/events') + ' text-2xl'}>🔍</Link>
        <Link href="/create" className={isActive('/create') + ' text-2xl'}>➕</Link>
        <Link href="/profile" className={isActive('/profile') + ' text-2xl'}>👤</Link>
      </div>
    </nav>
  )
}