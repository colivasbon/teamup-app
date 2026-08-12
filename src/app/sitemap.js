import { getSupabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://teamupapp.es'

  // Rutas estáticas principales
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tournaments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/moments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Eventos y torneos dinámicos desde Supabase (contexto servidor)
  let dynamicRoutes = []
  try {
    const sb = getSupabaseServer()
    if (sb) {
      const [eventsRes, tournamentsRes] = await Promise.all([
        sb.from('events')
          .select('id, created_at, updated_at')
          .neq('status', 'cancelled')
          .order('created_at', { ascending: false })
          .limit(500),
        sb.from('tournaments')
          .select('id, created_at, updated_at')
          .neq('status', 'cancelled')
          .order('created_at', { ascending: false })
          .limit(500),
      ])

      const events = eventsRes.data || []
      const tournaments = tournamentsRes.data || []

      dynamicRoutes = [
        ...events.map((event) => ({
          url: `${baseUrl}/events/${event.id}`,
          lastModified: event.updated_at ? new Date(event.updated_at) : (event.created_at ? new Date(event.created_at) : new Date()),
          changeFrequency: 'daily',
          priority: 0.7,
        })),
        ...tournaments.map((t) => ({
          url: `${baseUrl}/tournaments/${t.id}`,
          lastModified: t.updated_at ? new Date(t.updated_at) : (t.created_at ? new Date(t.created_at) : new Date()),
          changeFrequency: 'daily',
          priority: 0.7,
        })),
      ]
    }
  } catch (e) {
    // Si falla Supabase, el sitemap no se rompe
  }

  // Eventos demo estáticos de respaldo
  const demoIds = ['demo-1', 'demo-2', 'demo-3', 'demo-4', 'demo-5', 'demo-6']
  const demoRoutes = demoIds.map((id) => ({
    url: `${baseUrl}/events/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Unificar evitando duplicados
  const existingUrls = new Set(dynamicRoutes.map(r => r.url))
  const uniqueDemoRoutes = demoRoutes.filter(r => !existingUrls.has(r.url))

  return [...staticRoutes, ...dynamicRoutes, ...uniqueDemoRoutes]
}
