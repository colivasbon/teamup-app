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

  useEffect(() => { if (user) router.replace('/') }, [user])

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

      const { data, error: err } = await sb.auth.signUp({
        email:    form.email,
        password: form.password,
        options:  { data: { full_name: form.name } },
      })
      if (err) { setError(err.message); setLoading(false); return }

      if (data?.session) {
        router.replace('/')
      } else {
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
      options: { redirectTo: window.location.origin },
    })
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
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:36 }}>
      <svg width="42" height="42" viewBox="0 0 34 34" fill="none">
        <rect width="34" height="34" rx="11" fill="url(#aug)"/>
        <path d="M11 17L17 11L23 17L17 23Z" fill="white" opacity="0.92"/>
        <circle cx="17" cy="17" r="3.5" fill="white"/>
        <defs>
          <linearGradient id="aug" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5b6ef5"/><stop offset="1" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.05em', background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
        TeamUp
      </span>
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
                  transition: 'all 0.18s ease',
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

              {/* Apple */}
              <button onClick={()=>loginWith('apple')} className="btn btn-ghost" style={{ width:'100%', gap:10 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continuar con Apple
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
    </div>
  )
}
