import { createClient } from '@supabase/supabase-js'

// Valores hardcodeados — la anon key de Supabase es pública por diseño,
// no contiene ningún secreto y puede estar en el código del cliente.
const SUPABASE_URL = 'https://kbhidlhdpjcpazkubcvq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaGlkbGhkcGpjcGF6a3ViY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTc0NDEsImV4cCI6MjA4OTc3MzQ0MX0.GiYgTOHpc9gWUK7IG2G9piog_R9ONrfxR7dzjvD58vQ'

let _client = null

export function getSupabase() {
  if (_client) return _client
  // Solo crear el cliente en el navegador (no durante SSR)
  if (typeof window === 'undefined') return null
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession:     true,
      autoRefreshToken:   true,
      detectSessionInUrl: true,
    },
  })
  return _client
}

// Proxy para compatibilidad con imports existentes (supabase.auth, supabase.from, etc.)
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getSupabase()
    if (!client) {
      return () => Promise.resolve({ data: null, error: { message: 'SSR context' } })
    }
    const value = client[prop]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

export const signUp = (email, password, fullName) => {
  const sb = getSupabase()
  if (!sb) return Promise.resolve({ error: { message: 'Not initialized' } })
  return sb.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
}

export const signIn = (email, password) => {
  const sb = getSupabase()
  if (!sb) return Promise.resolve({ error: { message: 'Not initialized' } })
  return sb.auth.signInWithPassword({ email, password })
}

export const signOut = () => {
  const sb = getSupabase()
  if (!sb) return Promise.resolve({})
  return sb.auth.signOut()
}
