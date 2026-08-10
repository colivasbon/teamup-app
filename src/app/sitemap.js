import { getSupabase } from '@/lib/supabase'

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
      url: `${baseUrl}/moments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Eventos dinámicos desde Supabase
  let dynamicEventRoutes = []
  try {
    const sb = getSupabase()
    if (sb) {
      const { data: events } = await sb
        .from('events')
        .select('id, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(500)

      if (events && events.length > 0) {
        dynamicEventRoutes = events.map((event) => ({
          url: `${baseUrl}/events/${event.id}`,
          lastModified: event.created_at ? new Date(event.created_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        }))
      }
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
  const existingUrls = new Set(dynamicEventRoutes.map(r => r.url))
  const uniqueDemoRoutes = demoRoutes.filter(r => !existingUrls.has(r.url))

  return [...staticRoutes, ...dynamicEventRoutes, ...uniqueDemoRoutes]
}
