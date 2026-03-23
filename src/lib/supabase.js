import { createClient } from '@supabase/supabase-js'

// Inicialización lazy: el cliente se crea la primera vez que se llama,
// nunca durante el pre-render en servidor donde las env vars no están disponibles.
let _client = null

export function getSupabase() {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    // Durante SSR en build time, devolvemos un objeto vacío seguro
    return null
  }
  _client = createClient(url, key, {
    auth: {
      persistSession:     true,
      autoRefreshToken:   true,
      detectSessionInUrl: true,
    },
  })
  return _client
}

// Alias para compatibilidad con código existente
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getSupabase()
    if (!client) {
      // Devuelve funciones que no hacen nada durante SSR
      return () => Promise.resolve({ data: null, error: { message: 'Supabase not initialized' } })
    }
    const value = client[prop]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

// ─── Helpers de Auth ─────────────────────────────────
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
