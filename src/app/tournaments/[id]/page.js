import TournamentDetailClient from '@/components/TournamentDetailClient'
import { getSupabaseServer } from '@/lib/supabase'

const SPORT_LABELS = {
  padel: 'Pádel', tenis: 'Tenis', badminton: 'Bádminton', voleibol: 'Voleibol',
  futbol: 'Fútbol', baloncesto: 'Baloncesto', running: 'Running', natacion: 'Natación',
  ciclismo: 'Ciclismo', senderismo: 'Senderismo', yoga: 'Yoga', gimnasio: 'Gimnasio',
}

const FORMAT_LABELS = {
  single_elimination: 'eliminación directa',
  groups: 'grupos + eliminatoria',
}

async function getTournament(id) {
  try {
    const sb = getSupabaseServer()
    if (!sb) return null
    const { data } = await sb.from('tournaments').select('*').eq('id', id).maybeSingle()
    if (!data) return null
    let creatorName = null
    if (data.creator_id) {
      const { data: prof } = await sb.from('profiles')
        .select('full_name, username').eq('id', data.creator_id).maybeSingle()
      creatorName = prof?.full_name || prof?.username || null
    }
    return { ...data, creator_name: creatorName }
  } catch (e) {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const t = await getTournament(id)

  if (!t) {
    return {
      title: 'Torneos deportivos',
      alternates: { canonical: `https://teamupapp.es/tournaments/${id}` },
      robots: { index: false, follow: true },
    }
  }

  const sportName = SPORT_LABELS[t.sport] || t.sport || 'deporte'
  const title = `${t.title} — Torneo de ${sportName} en ${t.province || 'España'}`
  const description = `Torneo de ${sportName} (${FORMAT_LABELS[t.format] || t.format || 'competición'}) en ${t.location || t.province || 'España'}${t.price && t.price !== 'Gratis' ? ` · ${t.price}` : ' · Gratis'}. ¡Inscríbete en TeamUp!`

  return {
    title,
    description,
    keywords: [
      'torneo ' + sportName,
      `torneo ${sportName} ${t.province || 'España'}`,
      'inscripcion torneo deportivo',
      'competicion deportiva',
      'TeamUp',
    ],
    alternates: {
      canonical: `https://teamupapp.es/tournaments/${id}`,
    },
    openGraph: {
      title: `${title} | TeamUp`,
      description,
      type: 'website',
      url: `https://teamupapp.es/tournaments/${id}`,
      siteName: 'TeamUp',
      locale: 'es_ES',
      images: [
        {
          url: '/favicon.png',
          width: 512,
          height: 512,
          alt: `${t.title} — Torneo de ${sportName}`,
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

export default async function TournamentPage({ params }) {
  const { id } = await params
  const t = await getTournament(id)

  let jsonLd = null
  if (t) {
    const sportName = SPORT_LABELS[t.sport] || t.sport || 'deporte'
    const startDate = t.date && t.time ? `${t.date}T${t.time}` : (t.date ? `${t.date}T12:00:00` : null)
    const rawPrice = t.price === 'Gratis' || !t.price ? '0' : String(t.price).replace(/[^0-9.]/g, '')
    const eventStatus = t.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : (t.status === 'finished' || (startDate && startDate < new Date().toISOString()))
        ? 'https://schema.org/EventPast'
        : 'https://schema.org/EventScheduled'

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SportsEvent',
          '@id': `https://teamupapp.es/tournaments/${id}#event`,
          'name': t.title,
          'description': t.description || `Torneo de ${sportName} en ${t.province || 'España'}`,
          ...(startDate ? { 'startDate': startDate } : {}),
          'eventStatus': eventStatus,
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
          'inLanguage': 'es-ES',
          'image': 'https://teamupapp.es/favicon.png',
          'sport': sportName,
          'location': {
            '@type': 'Place',
            'name': t.location || `Ubicación en ${t.province || 'España'}`,
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': t.province || 'España',
              'addressCountry': 'ES',
            },
          },
          ...(t.creator_name ? { 'organizer': { '@type': 'Person', 'name': t.creator_name } } : {}),
          ...(rawPrice ? {
            'offers': {
              '@type': 'Offer',
              'price': rawPrice,
              'priceCurrency': 'EUR',
              'url': `https://teamupapp.es/tournaments/${id}`,
              'availability': 'https://schema.org/InStock',
            },
          } : {}),
          'url': `https://teamupapp.es/tournaments/${id}`,
          'mainEntityOfPage': `https://teamupapp.es/tournaments/${id}`,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `https://teamupapp.es/tournaments/${id}#breadcrumb`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://teamupapp.es/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Torneos', 'item': 'https://teamupapp.es/tournaments' },
            { '@type': 'ListItem', 'position': 3, 'name': t.title, 'item': `https://teamupapp.es/tournaments/${id}` },
          ],
        },
      ],
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TournamentDetailClient />
    </>
  )
}
