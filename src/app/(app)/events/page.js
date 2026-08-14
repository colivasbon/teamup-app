import EventsContent from './EventsContent'

export const metadata = {
  title: 'Eventos y Eventos deportivos — Pádel, Fútbol 7, Running y Más Cerca de Ti',
  description: 'Explora y únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running, senderismo y otros eventos deportivos cerca de ti en España. Filtra por deporte, nivel y provincia. Gratis.',
  keywords: [
    'eventos deportivos España',
    'eventos deportivos cerca de mi',
    'partidos de padel',
    'futbol 7',
    'grupos de running',
    'quedadas deportivas',
    'apuntarse a un partido',
    'TeamUp'
  ],
  alternates: {
    canonical: 'https://teamupapp.es/events',
  },
  openGraph: {
    title: 'Eventos y Eventos deportivos — Pádel, Fútbol 7, Running y Más | TeamUp',
    description: 'Únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running y quedadas deportivas cerca de ti en España. Filtra por deporte, nivel y provincia. Gratis.',
    type: 'website',
    url: 'https://teamupapp.es/events',
    siteName: 'TeamUp',
    locale: 'es_ES',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — Eventos deportivos y eventos deportivos en España',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos y Eventos deportivos — Pádel, Fútbol 7, Running y Más | TeamUp',
    description: 'Únete a eventos deportivos y eventos deportivos cerca de ti en España. Gratis.',
    images: ['/favicon.png'],
  },
}

const SPORT_IDS = new Set(['all','running','padel','senderismo','futbol','gimnasio','tenis','natacion','ciclismo','yoga','baloncesto','voleibol','badminton'])
const PROV_IDS  = new Set(['all','madrid','barcelona','valencia','sevilla','cordoba','granada','malaga','alicante','murcia','zaragoza','bilbao','cadiz','huelva','jaen','almeria'])
const LEVEL_IDS = new Set(['all','beginner','intermediate','advanced'])

export default async function EventsPage({ searchParams }) {
  const sp = await searchParams

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://teamupapp.es/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Eventos', 'item': 'https://teamupapp.es/events' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <EventsContent
        initialSport={SPORT_IDS.has(sp?.sport) ? sp.sport : 'all'}
        initialProv={PROV_IDS.has(sp?.prov) ? sp.prov : 'all'}
        initialLevel={LEVEL_IDS.has(sp?.level) ? sp.level : 'all'}
      />
    </>
  )
}
