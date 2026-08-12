import EventsContent from './EventsContent'

export const metadata = {
  title: 'Eventos y Pachangas — Pádel, Fútbol 7, Running y Más Cerca de Ti',
  description: 'Explora y únete a pachangas, partidos de pádel, fútbol 7, grupos de running, senderismo y otros eventos deportivos cerca de ti en España. Filtra por deporte, nivel y provincia. Gratis.',
  keywords: [
    'eventos deportivos España',
    'pachangas cerca de mi',
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
    title: 'Eventos y Pachangas — Pádel, Fútbol 7, Running y Más | TeamUp',
    description: 'Únete a pachangas, partidos de pádel, fútbol 7, grupos de running y quedadas deportivas cerca de ti en España. Filtra por deporte, nivel y provincia. Gratis.',
    type: 'website',
    url: 'https://teamupapp.es/events',
    siteName: 'TeamUp',
    locale: 'es_ES',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — Eventos deportivos y pachangas en España',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos y Pachangas — Pádel, Fútbol 7, Running y Más | TeamUp',
    description: 'Únete a pachangas y eventos deportivos cerca de ti en España. Gratis.',
    images: ['/favicon.png'],
  },
}

export default function EventsPage() {
  return <EventsContent />
}
