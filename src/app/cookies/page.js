'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const COOKIE_TYPES = [
  {
    type: 'Técnicas / Necesarias',
    required: true,
    description: 'Son imprescindibles para el funcionamiento de la aplicación. Sin ellas no es posible navegar ni utilizar las funcionalidades básicas. No pueden desactivarse.',
    cookies: [
      { name: 'sb-access-token', purpose: 'Token de autenticación de sesión. Permite mantener la sesión del usuario iniciada.', duration: 'Sesión' },
      { name: 'sb-refresh-token', purpose: 'Token de renovación de sesión. Permite renovar la autenticación sin necesidad de volver a iniciar sesión.', duration: '1 año' },
      { name: 'tu-theme', purpose: 'Guarda la preferencia de tema visual del usuario (modo oscuro o claro).', duration: 'Permanente (localStorage)' },
      { name: 'tu-cookie-consent', purpose: 'Guarda la decisión del usuario sobre el uso de cookies para no volver a mostrar el banner.', duration: 'Permanente (localStorage)' },
    ],
  },
  {
    type: 'Analíticas',
    required: false,
    description: 'Permiten conocer el comportamiento de los usuarios dentro de la aplicación con el fin de mejorar el servicio. No se utilizan actualmente. Si en el futuro se incorporaran, se solicitaría el consentimiento previo del usuario.',
    cookies: [],
  },
  {
    type: 'Publicitarias',
    required: false,
    description: 'Permiten mostrar publicidad personalizada basada en el perfil del usuario. No se utilizan en TeamUp. No se comparten datos con redes publicitarias.',
    cookies: [],
  },
]

export default function CookiesPolicy() {
  return (
    <>
      <div className="page-wrap" style={{ paddingTop: 24 }}>

        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 20, textDecoration: 'none' }}>←</Link>
          <h1 style={{ fontWeight: 900, fontSize: 20, margin: 0, letterSpacing: '-0.03em' }}>
            Política de Cookies
          </h1>
        </header>

        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
          Última actualización: mayo de 2026
        </div>

        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, marginBottom: 28 }}>
          <p>TeamUp utiliza cookies y tecnologías de almacenamiento local (localStorage) para garantizar el correcto funcionamiento de la aplicación y mejorar la experiencia del usuario.</p>
          <p style={{ marginTop: 8 }}>Una cookie es un pequeño archivo de texto que se almacena en el dispositivo del usuario cuando visita una aplicación web. Las cookies técnicas son necesarias para el funcionamiento del servicio y no requieren consentimiento previo. El resto de cookies solo se activan si el usuario otorga su consentimiento.</p>
        </div>

        {COOKIE_TYPES.map(ct => (
          <div key={ct.type} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h2 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', margin: 0 }}>{ct.type}</h2>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                background: ct.required ? 'rgba(88,104,117,0.15)' : 'var(--surface)',
                color: ct.required ? '#586875' : 'var(--muted)',
                border: `1px solid ${ct.required ? 'rgba(88,104,117,0.3)' : 'var(--border)'}`,
              }}>
                {ct.required ? 'Siempre activas' : 'No utilizadas'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>{ct.description}</p>

            {ct.cookies.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ct.cookies.map(c => (
                  <div key={c.name} className="card" style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 4, fontFamily: 'monospace' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 4 }}>{c.purpose}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Duración: {c.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Gestión de cookies</h2>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
            El usuario puede gestionar sus preferencias de cookies en cualquier momento a través del banner que aparece al acceder a la aplicación por primera vez. También puede modificar su elección desde la configuración del navegador o del dispositivo, aunque esto puede afectar al funcionamiento de la aplicación.
          </p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Cookies de terceros</h2>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
            TeamUp utiliza los servicios de Supabase para la autenticación y almacenamiento de datos, y de Vercel para el alojamiento. Estos proveedores pueden establecer sus propias cookies técnicas. Para más información, consulte sus respectivas políticas de privacidad:
          </p>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
              Política de privacidad de Supabase →
            </a>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
              Política de privacidad de Vercel →
            </a>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: '16px 18px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Para cualquier consulta sobre el uso de cookies, contacta en{' '}
          <a href="mailto:colivasbon@gmail.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            colivasbon@gmail.com
          </a>
        </div>

      </div>
      <Navbar />
    </>
  )
}
