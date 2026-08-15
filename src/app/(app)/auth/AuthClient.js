'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Modo: 'login' | 'register' | 'forgot'
export default function Auth() {
  const router = useRouter()
  const { user } = useAuth()

  const [mode,    setMode]    = useState('login')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [form,    setForm]    = useState({ email:'', password:'', name:'' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Casillas legales del registro
  const [acceptPrivacy,   setAcceptPrivacy]   = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)

  useEffect(() => { if (user) router.replace('/start') }, [user])
  const reset = () => { setError(''); setSuccess('') }

  /* ── Registro / Login ── */
  const submit = async e => {
    e.preventDefault()
    setLoading(true); reset()
    const sb = getSupabase()
    if (!sb) { setError('Error de conexión. Recarga la página.'); setLoading(false); return }

    if (mode === 'login') {
      const { error: err } = await sb.auth.signInWithPassword({ email: form.email, password: form.password })
      if (err) {
        setError(
          err.message === 'Invalid login credentials'  ? 'Email o contraseña incorrectos' :
          err.message === 'Email not confirmed'        ? 'Confirma tu email antes de entrar. Revisa tu bandeja de entrada.' :
          err.message
        )
        setLoading(false)
      }
      // Si no hay error, AuthContext redirige solo

    } else {
      if (!form.name.trim())       { setError('Escribe tu nombre');                               setLoading(false); return }
      if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); setLoading(false); return }
      if (!acceptPrivacy)            { setError('Debes aceptar la política de privacidad para registrarte'); setLoading(false); return }

      const { data, error: err } = await sb.auth.signUp({
        email:    form.email,
        password: form.password,
        options:  { data: { full_name: form.name } },
      })
      if (err) { setError(err.message); setLoading(false); return }

      if (data?.session) {
          router.replace('/start')      } else {
        setSuccess('¡Cuenta creada! Revisa tu email y confirma tu cuenta para entrar.')
        setLoading(false)
      }
    }
  }

  /* ── Recuperar contraseña ── */
  const sendReset = async e => {
    e.preventDefault()
    if (!form.email) { setError('Introduce tu email'); return }
    setLoading(true); reset()
    const sb = getSupabase()
    if (!sb) { setError('Error de conexión.'); setLoading(false); return }

    const { error: err } = await sb.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    if (err) {
      setError(err.message)
    } else {
      setSuccess('Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.')
    }
    setLoading(false)
  }

  /* ── OAuth ── */
  const loginWith = async (provider) => {
    const sb = getSupabase()
    if (!sb) { setError('Error de conexión.'); return }
    reset()
    const { error: err } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/start` },    })
    if (err) {
      const notEnabled = err.message.includes('not enabled') || err.message.includes('provider')
      setError(notEnabled
        ? `El acceso con ${provider === 'google' ? 'Google' : 'Apple'} no está activado aún. Usa email y contraseña.`
        : err.message
      )
    }
  }

  /* ── UI ── */
  const Logo = () => (
    <div style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
      <svg width={140} height={56} viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" aria-label="TeamUp" style={{ display:'block', color:'var(--text)' }}>
        <g fill="currentColor">
          <path d="M149.49,25.61v37.21c0,6.22-5.04,11.26-11.26,11.26h-29.11c-.78,0-1.41.63-1.41,1.41v170.35c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V75.49c0-.78-.63-1.41-1.41-1.41h-29.11c-6.22,0-11.26-5.04-11.26-11.26V25.61c0-6.22,5.04-11.26,11.26-11.26h112.92c6.22,0,11.26,5.04,11.26,11.26Z"/>
          <path d="M204.2,75.49v35.48h5.17c6.22,0,11.26,5.04,11.26,11.26v29.37c0,6.22-5.04,11.26-11.26,11.26h-5.17v33.09c0,.78.63,1.41,1.41,1.41h15.14c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-57.19c-6.22,0-11.26-5.04-11.26-11.26V25.48c0-6.22,5.04-11.26,11.26-11.26h40.63v.13h16.55c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-15.14c-.78,0-1.41.63-1.41,1.41Z"/>
          <path d="M234.83,25.22v220.23c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26v-79.73c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v79.73c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26V25.22c0-6.22-5.04-11.26-11.26-11.26h-87.76c-6.22,0-11.26,5.04-11.26,11.26ZM286.72,107.34v-30.4c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v30.4c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24Z"/>
          <path d="M518.32,25.48v220.36c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.2c0-1.79-1.45-3.24-3.24-3.24h0c-1.79,0-3.24,1.45-3.24,3.24v168.64c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.37c0-1.89-1.53-3.41-3.41-3.41h0c-1.89,0-3.41,1.53-3.41,3.41v168.47c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V56.45c0-23.32,18.9-42.22,42.22-42.22h115.51c6.22,0,11.26,5.04,11.26,11.26Z"/>
          <path d="M617.53,25.17v168.64c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24V25.17c0-6.22-5.04-11.26-11.26-11.26h-29.43c-6.22,0-11.26,5.04-11.26,11.26v220.35c0,6.22,5.04,11.26,11.26,11.26h81.27c6.22,0,11.26-5.04,11.26-11.26V25.17c0-6.22-5.04-11.26-11.26-11.26h-22.83c-6.22,0-11.26,5.04-11.26,11.26Z"/>
          <path d="M730.13,13.79v.11h-50.26c-6.22,0-11.26,5.04-11.26,11.26v220.46c0,6.22,5.04,11.26,11.26,11.26h32.46c6.22,0,11.26-5.04,11.26-11.26v-97.34c0-.78.63-1.41,1.41-1.41h5.14c30.83,0,55.82-24.99,55.82-55.82v-21.44c0-30.83-24.99-55.82-55.82-55.82h0ZM723.59,90.35v-26.11c0-1.81,1.47-3.27,3.27-3.27h0c1.81,0,3.27,1.47,3.27,3.27v26.11c0,1.81-1.47,3.27-3.27,3.27h0c-1.81,0-3.27-1.47-3.27-3.27Z"/>
        </g>
      </svg>
    </div>
  )

  const Spinner = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
      <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px 22px' }}>

      <Logo />

      <div className="card scale-in" style={{ width:'100%', maxWidth:380, padding:'28px 24px' }}>

        {/* ─── MODO: RECUPERAR CONTRASEÑA ─── */}
        {mode === 'forgot' ? (
          <>
            <div style={{ textAlign:'center', marginBottom:22 }}>
              <div style={{ fontSize:38, marginBottom:10 }}>🔑</div>
              <div style={{ fontWeight:800, fontSize:18, letterSpacing:'-0.03em', marginBottom:6 }}>¿Olvidaste tu contraseña?</div>
              <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.5 }}>
                Escribe tu email y te mandamos un enlace para crear una nueva.
              </div>
            </div>

            <form onSubmit={sendReset} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Email</label>
                <input className="input" type="email" placeholder="tu@email.com"
                  value={form.email} onChange={e=>set('email',e.target.value)} required/>
              </div>
              {error   && <div className="error-msg">{error}</div>}
              {success && <div className="success-msg">{success}</div>}
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:'100%', fontSize:15 }}>
                {loading ? <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}><Spinner/> Enviando...</span> : 'Enviar enlace'}
              </button>
            </form>

            <button onClick={()=>{setMode('login'); reset()}}
              style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:600, cursor:'pointer', fontSize:13, fontFamily:'inherit', display:'block', margin:'18px auto 0', textAlign:'center' }}>
              ← Volver al inicio de sesión
            </button>
          </>
        ) : (
          <>
            {/* ─── SWITCHER LOGIN / REGISTRO ─── */}
            <div style={{ display:'flex', gap:4, padding:4, borderRadius:14, background:'var(--border2)', marginBottom:24 }}>
              {['login','register'].map(m=>(
                <button key={m} onClick={()=>{setMode(m); reset()}} style={{
                  flex:1, padding:'10px 0', borderRadius:10, border:'none',
                  fontWeight:600, fontSize:14, fontFamily:'inherit', cursor:'pointer',
                  background: mode===m ? 'var(--solid)' : 'transparent',
                  color:      mode===m ? 'var(--text)'  : 'var(--muted)',
                  boxShadow:  mode===m ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                  transition: 'background 0.18s ease-out, color 0.18s ease-out, box-shadow 0.18s ease-out',
                }}>
                  {m==='login' ? 'Entrar' : 'Registrarse'}
                </button>
              ))}
            </div>

            {/* ─── FORMULARIO ─── */}
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {mode==='register' && (
                <div>
                  <label className="label" style={{ marginBottom:8 }}>Tu nombre</label>
                  <input className="input" type="text" placeholder="Carlos García"
                    value={form.name} onChange={e=>set('name',e.target.value)} required/>
                </div>
              )}
              <div>
                <label className="label" style={{ marginBottom:8 }}>Email</label>
                <input className="input" type="email" placeholder="tu@email.com"
                  value={form.email} onChange={e=>set('email',e.target.value)} required/>
              </div>
              <div>
                <label className="label" style={{ marginBottom:8 }}>Contraseña</label>
                <input className="input" type="password" placeholder="••••••••"
                  value={form.password} onChange={e=>set('password',e.target.value)} required/>
                {/* Olvidé mi contraseña — solo en login */}
                {mode==='login' && (
                  <button type="button" onClick={()=>{setMode('forgot'); reset()}}
                    style={{ background:'none', border:'none', color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:'inherit', marginTop:6, padding:0, display:'block', textAlign:'right', width:'100%' }}>
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>

              {/* Casillas legales — solo en registro, nunca premarcadas */}
              {mode === 'register' && (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

                  {/* Resumen de política de privacidad */}
                  <div style={{
                    background:'var(--surface)', border:'1px solid var(--border)',
                    borderRadius:12, padding:'12px 14px', fontSize:12,
                    color:'var(--muted)', lineHeight:1.6,
                  }}>
                    <div style={{ fontWeight:700, color:'var(--text)', marginBottom:4, fontSize:12 }}>Información básica sobre protección de datos</div>
                    <div><strong>Responsable:</strong> Carlos Olivas &middot; <strong>Finalidad:</strong> Gestión de tu cuenta y prestación del servicio TeamUp &middot; <strong>Legitimación:</strong> Ejecución de contrato y consentimiento &middot; <strong>Derechos:</strong> Acceso, rectificación, supresión y oposición dirigiéndote a <a href="mailto:colivasbon@gmail.com" style={{ color:'var(--primary)' }}>colivasbon@gmail.com</a> &middot; <strong>Información adicional:</strong>{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color:'var(--primary)', fontWeight:600 }}>Política de Privacidad completa</a>.</div>
                  </div>
                  {/* Obligatoria: política de privacidad */}
                  <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={e => setAcceptPrivacy(e.target.checked)}
                      style={{ marginTop:2, width:16, height:16, flexShrink:0, accentColor:'#586875' }}
                    />
                    <span style={{ fontSize:12, color:'var(--text)', lineHeight:1.55 }}>
                      He leído y acepto la{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer"
                        style={{ color:'var(--primary)', fontWeight:700, textDecoration:'underline' }}>
                        Política de Privacidad
                      </a>
                      {' '}de TeamUp. <span style={{ color:'#ef4444' }}>*</span>
                    </span>
                  </label>

                  {/* Opcional: comunicaciones comerciales */}
                  <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptMarketing}
                      onChange={e => setAcceptMarketing(e.target.checked)}
                      style={{ marginTop:2, width:16, height:16, flexShrink:0, accentColor:'#586875' }}
                    />
                    <span style={{ fontSize:12, color:'var(--muted)', lineHeight:1.55 }}>
                      Acepto recibir comunicaciones comerciales y promociones de TeamUp. (Opcional)
                    </span>
                  </label>
                </div>
              )}

              {error   && <div className="error-msg">{error}</div>}
              {success && <div className="success-msg">{success}</div>}

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:'100%', marginTop:4, fontSize:16 }}>
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}><Spinner/> Procesando...</span>
                  : mode==='login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            </form>

            {/* ─── DIVIDER ─── */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
              <div className="divider" style={{ flex:1 }}/>
              <span style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap' }}>o continúa con</span>
              <div className="divider" style={{ flex:1 }}/>
            </div>

            {/* ─── OAUTH BUTTONS ─── */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {/* Google */}
              <button onClick={()=>loginWith('google')} className="btn btn-ghost" style={{ width:'100%', gap:10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>


            </div>

            {/* ─── CAMBIAR MODO ─── */}
            <p style={{ textAlign:'center', fontSize:13, color:'var(--muted)', marginTop:22, marginBottom:0 }}>
              {mode==='login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button onClick={()=>{setMode(mode==='login'?'register':'login'); reset()}}
                style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
                {mode==='login' ? 'Regístrate gratis' : 'Entra aquí'}
              </button>
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop:24 }}>
        <Link href="/" style={{ fontSize:12, color:'var(--muted)' }}>← Volver al inicio</Link>
      </div>

      {/* Bloque captación empresas */}
      <div style={{
        marginTop:32,
        background:'var(--surface)',
        border:'1px solid var(--border)',
        borderRadius:18,
        padding:'20px 22px',
        maxWidth:360,
        width:'100%',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <span style={{ fontSize:26 }}>🏢</span>
          <span style={{ fontWeight:800, fontSize:15, color:'var(--text)' }}>¿Eres un club o negocio deportivo?</span>
        </div>
        <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.55, margin:'0 0 14px 0' }}>
          Si gestionas un club, gimnasio, escuela deportiva o marca, podemos darte un perfil verificado para publicar y destacar tus eventos ante toda la comunidad de TeamUp.
        </p>
        <a
          href="mailto:colivasbon@gmail.com?subject=TeamUp%20%E2%80%94%20Solicitud%20perfil%20empresa&body=Hola%2C%20me%20gustar%C3%ADa%20obtener%20un%20perfil%20de%20empresa%20en%20TeamUp.%0A%0ANombre%20del%20negocio%3A%20%0ATipo%20de%20negocio%3A%20%0AWeb%2FRRSS%3A%20%0AContacto%3A%20"
          style={{
            display:'block', textAlign:'center',
            background:'#586875', color:'#f6eddc',
            borderRadius:12, padding:'11px 0',
            fontWeight:700, fontSize:13,
            textDecoration:'none',
          }}
        >
          Contáctanos para saber más
        </a>
      </div>

    </div>
  )
}
