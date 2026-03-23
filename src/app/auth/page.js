// src/app/auth/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Auth() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Demo: simular auth
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    router.push('/')
  }

  const handleGoogle = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-label="TeamUp">
          <rect width="32" height="32" rx="10" fill="url(#authLogoGrad)"/>
          <path d="M10 16 L16 10 L22 16 L16 22 Z" fill="white" opacity="0.9"/>
          <circle cx="16" cy="16" r="3" fill="white"/>
          <defs>
            <linearGradient id="authLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5b6ef5"/><stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span className="text-2xl font-bold" style={{background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
          TeamUp
        </span>
      </div>

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="glass rounded-3xl p-6">
          {/* Mode switcher */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{background: 'var(--border)'}}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'var(--surface-solid)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--text-secondary)',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                }}>
                {m === 'login' ? 'Entrar' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>NOMBRE</label>
                <input
                  type="text" placeholder="Tu nombre"
                  value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="input-glass" required={mode === 'register'}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>EMAIL</label>
              <input
                type="email" placeholder="tu@email.com"
                value={form.email} onChange={(e) => update('email', e.target.value)}
                className="input-glass" required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>CONTRASEÑA</label>
              <input
                type="password" placeholder="••••••••"
                value={form.password} onChange={(e) => update('password', e.target.value)}
                className="input-glass" required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'var(--gradient)',
                boxShadow: '0 4px 20px rgba(91, 110, 245, 0.35)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="50" strokeDashoffset="30"/>
                  </svg>
                  Procesando...
                </span>
              ) : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{background: 'var(--border)'}}/>
            <span className="text-xs" style={{color: 'var(--text-secondary)'}}>o continúa con</span>
            <div className="flex-1 h-px" style={{background: 'var(--border)'}}/>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        {/* Link */}
        <p className="text-center text-sm mt-5" style={{color: 'var(--text-secondary)'}}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-semibold" style={{color: 'var(--primary)'}}>
            {mode === 'login' ? 'Regístrate gratis' : 'Entra aquí'}
          </button>
        </p>
      </div>

      <div className="mt-8 text-xs text-center" style={{color: 'var(--text-secondary)'}}>
        <Link href="/" style={{color: 'var(--text-secondary)'}}>← Volver al inicio</Link>
      </div>
    </div>
  )
}
