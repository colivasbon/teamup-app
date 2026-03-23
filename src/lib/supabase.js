import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
  },
})

// ─── Helpers de Auth ───────────────────────────────────
export const signUp = (email, password, fullName) =>
  supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ─── Helpers de Events ────────────────────────────────
export const getEvents = async ({ province, sport, level } = {}) => {
  let q = supabase
    .from('events_with_counts')
    .select('*')
    .order('date', { ascending: true })

  if (province && province !== 'all') q = q.eq('province', province)
  if (sport    && sport    !== 'all') q = q.eq('sport', sport)
  if (level    && level    !== 'all') q = q.eq('level', level)

  return q
}

export const getEvent = (id) =>
  supabase.from('events_with_counts').select('*').eq('id', id).single()

export const createEvent = (data) =>
  supabase.from('events').insert(data).select().single()

export const joinEvent = (eventId, userId) =>
  supabase.from('event_participants').insert({ event_id: eventId, user_id: userId })

export const leaveEvent = (eventId, userId) =>
  supabase.from('event_participants').delete().eq('event_id', eventId).eq('user_id', userId)

export const isUserJoined = async (eventId, userId) => {
  const { data } = await supabase
    .from('event_participants')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()
  return !!data
}

// ─── Helpers de Perfil ────────────────────────────────
export const getProfile = (userId) =>
  supabase.from('profiles').select('*').eq('id', userId).single()

export const updateProfile = (userId, data) =>
  supabase.from('profiles').update(data).eq('id', userId)
