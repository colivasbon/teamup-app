// src/app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TeamUp - Hacer deporte con gente',
  description: 'Encuentra gente para hacer deporte cerca de ti',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Navbar />
      </body>
    </html>
  )
}