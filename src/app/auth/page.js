'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Auth() {
  const router = useRouter()
  const [mode, setMode]       = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({ email:'', password:'', name:'' })
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  const submit = async e => {
    e.preventDefault(); setLoading(true)
    await new Promise(r=>setTimeout(r,1200))
    setLoading(false); router.push('/')
  }
  const google = async () => {
    setLoading(true)
    await new Promise(r=>setTimeout(r,900))
    setLoading(false); router.push('/')
  }

  return (
    <div style={{
      minHeight:'100dvh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', padding:'24px 20px',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:36 }}>
        <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
          <rect width="34" height="34" rx="11" fill="url(#alg)"/>
          <path d="M11 17L17 11L23 17L17 23Z" fill="white" opacity="0.92"/>
          <circle cx="17" cy="17" r="3.5" fill="white"/>
          <defs>
            <linearGradient id="alg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5b6ef5"/><stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.04em', background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>TeamUp</span>
      </div>

      <div style={{ width:'100%', maxWidth:380 }}>
        {/* Card */}
        <div className="card" style={{ padding:'28px 24px', borderRadius:24 }}>

          {/* Tab switcher */}
          <div style={{ display:'flex', gap:4, padding:4, borderRadius:14, background:'var(--border)', marginBottom:24 }}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{
                flex:1, padding:'10px', borderRadius:10, border:'none', cursor:'pointer',
                fontWeight:600, fontSize:14, fontFamily:'inherit',
                background: mode===m?'var(--solid)':'transparent',
                color: mode===m?'var(--text)':'var(--muted)',
                boxShadow: mode===m?'0 1px 6px rgba(0,0,0,0.12)':'none',
                transition:'all 0.18s ease',
              }}>
                {m==='login'?'Entrar':'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {mode==='register' && (
              <div>
                <div className="label" style={{marginBottom:8}}>Nombre</div>
                <input className="input" type="text" placeholder="Tu nombre"
                  value={form.name} onChange={e=>set('name',e.target.value)} required={mode==='register'}/>
              </div>
            )}
            <div>
              <div className="label" style={{marginBottom:8}}>Email</div>
              <input className="input" type="email" placeholder="tu@email.com"
                value={form.email} onChange={e=>set('email',e.target.value)} required/>
            </div>
            <div>
              <div className="label" style={{marginBottom:8}}>Contraseña</div>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e=>set('password',e.target.value)} required/>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', marginTop:4 }}>
              {loading?(
                <span style={{display:'flex',alignItems:'center',gap:8}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{animation:'spin 0.8s linear infinite'}}>
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="50" strokeDashoffset="30"/>
                  </svg>
                  Procesando...
                </span>
              ): mode==='login'?'Entrar':'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div className="divider" style={{ flex:1 }}/>
            <span style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap' }}>o continúa con</span>
            <div className="divider" style={{ flex:1 }}/>
          </div>

          {/* Google */}
          <button onClick={google} disabled={loading} className="btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        <p style={{ textAlign:'center', fontSize:13, color:'var(--muted)', marginTop:20 }}>
          {mode==='login'?'¿No tienes cuenta?':'¿Ya tienes cuenta?'}{' '}
          <button onClick={()=>setMode(mode==='login'?'register':'login')}
            style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
            {mode==='login'?'Regístrate gratis':'Entra aquí'}
          </button>
        </p>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <Link href="/" style={{ fontSize:12, color:'var(--muted)', textDecoration:'none' }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
