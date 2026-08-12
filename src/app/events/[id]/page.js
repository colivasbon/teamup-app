import EventDetailClient from '@/components/EventDetailClient'
import { getSupabase } from '@/lib/supabase'

const DEMO = {
  'demo-1': { id:'demo-1', title:'Running Matutino', sport:'running', location:'Alameda de Córdoba', province:'Córdoba', description:'Ruta de running matutino por la Alameda. Ritmo medio 5:00–5:30/km. Todos los niveles bienvenidos. Llevar agua.', creator_name:'Carlos O.', date:'2026-03-30', time:'07:30:00', price:'Gratis' },
  'demo-2': { id:'demo-2', title:'Torneo Pádel Nivel Medio', sport:'padel', location:'Club de Pádel Centro', province:'Valencia', description:'Torneo amistoso con rotación de parejas. Raquetas disponibles en el club.', creator_name:'Laura M.', date:'2026-03-29', time:'18:00:00', price:'5€/persona' },
  'demo-3': { id:'demo-3', title:'Senderismo Sierra Norte', sport:'senderismo', location:'Plaza del Pueblo', province:'Madrid', description:'Ruta de 12 km por la Sierra Norte. Imprescindible calzado de montaña.', creator_name:'Javi M.', date:'2026-03-30', time:'09:00:00', price:'Gratis' },
  'demo-4': { id:'demo-4', title:'Fútbol 7 tarde', sport:'futbol', location:'Polideportivo Municipal', province:'Sevilla', description:'Partido amistoso de fútbol 7.', creator_name:'Diego R.', date:'2026-03-28', time:'20:00:00', price:'Gratis' },
  'demo-5': { id:'demo-5', title:'Entreno Funcional Grupal', sport:'gimnasio', location:'Box CrossFit Sur', province:'Madrid', description:'4 rondas de ejercicios funcionales.', creator_name:'Laura S.', date:'2026-03-25', time:'19:00:00', price:'Gratis' },
  'demo-6': { id:'demo-6', title:'Dobles Tenis Casual', sport:'tenis', location:'Club de Tenis Parque Sur', province:'Málaga', description:'Partidos de dobles para todos los niveles.', creator_name:'Ana G.', date:'2026-04-01', time:'10:00:00', price:'Gratis' },
}

async function getEventData(id) {
  if (DEMO[id]) return DEMO[id]
  try {
    const sb = getSupabase()
    if (sb) {
      const { data } = await sb.from('events_with_counts').select('*').eq('id', id).single()
      if (data) return data
    }
  } catch (e) {}
  return DEMO[id] || DEMO['demo-1']
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const ev = await getEventData(id)

  const title = `${ev.title} (${ev.sport}) en ${ev.province || 'España'}`
  const description = `${ev.description || 'Únete a este evento deportivo'} — Organizado en ${ev.location || ev.province || 'España'}. ¡Inscríbete gratis y haz deporte en TeamUp!`

  return {
    title,
    description,
    keywords: [
      ev.sport,
      `pachanga ${ev.sport}`,
      `jugar ${ev.sport} ${ev.province}`,
      `evento deportivo ${ev.province}`,
      'unirse a partido',
      'TeamUp'
    ],
    alternates: {
      canonical: `https://teamupapp.es/events/${id}`,
    },
    openGraph: {
      title: `${title} | TeamUp`,
      description,
      type: 'website',
      url: `https://teamupapp.es/events/${id}`,
      siteName: 'TeamUp',
      locale: 'es_ES',
      images: [
        {
          url: '/favicon.png',
          width: 512,
          height: 512,
          alt: ev.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TeamUp`,
      description,
      images: ['/favicon.png'],
    },
  }
}

export default async function EventPage({ params }) {
  const { id } = await params
  const ev = await getEventData(id)

  const startDate = ev.date && ev.time ? `${ev.date}T${ev.time}` : new Date().toISOString()
  const rawPrice = ev.price === 'Gratis' || !ev.price ? '0' : String(ev.price).replace(/[^0-9.]/g, '')
  const durationIso = ev.duration_minutes ? `PT${ev.duration_minutes}M` : null
  const isPast = ev.date && ev.date < new Date().toISOString().slice(0, 10)
  const eventStatus = ev.status === 'cancelled'
    ? 'https://schema.org/EventCancelled'
    : isPast
      ? 'https://schema.org/EventPast'
      : 'https://schema.org/EventScheduled'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsEvent',
        '@id': `https://teamupapp.es/events/${id}#event`,
        'name': ev.title,
        'description': ev.description || `Evento deportivo de ${ev.sport} en ${ev.province || 'España'}`,
        'startDate': startDate,
        ...(durationIso ? { 'duration': durationIso } : {}),
        'eventStatus': eventStatus,
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'inLanguage': 'es-ES',
        'image': 'https://teamupapp.es/favicon.png',
        'location': {
          '@type': 'Place',
          'name': ev.location || `Ubicación en ${ev.province || 'España'}`,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': ev.province || 'España',
            'addressCountry': 'ES'
          }
        },
        'organizer': {
          '@type': 'Person',
          'name': ev.creator_name || 'Organizador TeamUp'
        },
        'offers': {
          '@type': 'Offer',
          'price': rawPrice || '0',
          'priceCurrency': 'EUR',
          'url': `https://teamupapp.es/events/${id}`,
          'availability': 'https://schema.org/InStock'
        },
        'url': `https://teamupapp.es/events/${id}`,
        'mainEntityOfPage': `https://teamupapp.es/events/${id}`,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://teamupapp.es/events/${id}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://teamupapp.es/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Eventos', 'item': 'https://teamupapp.es/events' },
          { '@type': 'ListItem', 'position': 3, 'name': ev.title, 'item': `https://teamupapp.es/events/${id}` },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient />
    </>
  )
}
