'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'tu-cookie-consent'

export default function CookieBanner() {
  const [visible,  setVisible]  = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    // Solo mostrar si no hay decisión guardada
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const save = (decision) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ decision, date: new Date().toISOString() }))
    setVisible(false)
    setShowConf(false)
  }

  const acceptAll   = () => save('all')
  const rejectAll   = () => save('necessary')
  const saveConfig  = () => save(analytics ? 'analytics' : 'necessary')

  if (!visible) return null

  const btnStyle = {
    flex: 1, padding: '12px 0', border: '1px solid var(--border)', borderRadius: 12,
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
    background: 'var(--surface)', color: 'var(--text)',
    transition: 'background 0.15s ease',
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--bg)', borderTop: '1px solid var(--border)',
      padding: '20px 18px 28px',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
      maxWidth: 480, margin: '0 auto',
    }}>

      {!showConf ? (
        <>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>🍪 Uso de cookies</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
            Usamos cookies técnicas necesarias para el funcionamiento de la app. Puedes aceptar todas, rechazar las no esenciales o configurar tus preferencias.{' '}
            <Link href="/cookies" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Política de cookies
            </Link>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={rejectAll}   style={btnStyle}>Rechazar</button>
            <button onClick={() => setShowConf(true)} style={btnStyle}>Configurar</button>
            <button onClick={acceptAll}   style={{ ...btnStyle, background: '#586875', color: '#f6eddc', border: '1px solid #586875' }}>Aceptar</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Configurar cookies</div>

          {/* Técnicas — siempre activas */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14,
            padding: '12px 14px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Técnicas (necesarias)</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2 }}>
                Autenticación, sesión y preferencias básicas. No pueden desactivarse.
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#586875', background: 'rgba(88,104,117,0.12)',
              borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>
              Siempre activas
            </span>
          </div>

          {/* Analíticas — toggle */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20,
            padding: '12px 14px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Analíticas</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2 }}>
                Nos ayudan a entender cómo se usa la app para mejorarla. No se comparten con terceros.
              </div>
            </div>
            <button onClick={() => setAnalytics(p => !p)}
              style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: analytics ? '#586875' : 'var(--border)', position: 'relative',
                transition: 'background 0.2s ease', flexShrink: 0, marginTop: 2 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3, left: analytics ? 23 : 3,
                transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}/>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowConf(false)} style={btnStyle}>← Atrás</button>
            <button onClick={saveConfig} style={{ ...btnStyle, background: '#586875', color: '#f6eddc', border: '1px solid #586875' }}>
              Guardar configuración
            </button>
          </div>
        </>
      )}
    </div>
  )
}
