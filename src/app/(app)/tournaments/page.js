import TournamentsContent from './TournamentsContent'

export const metadata = {
  title: 'Torneos Deportivos — Pádel, Tenis, Fútbol y Más en España',
  description: 'Descubre e inscríbete en torneos de pádel, tenis, bádminton, fútbol, baloncesto y vóley en tu provincia. Compite con la comunidad de TeamUp en torneos con formato de eliminación directa o grupos.',
  keywords: [
    'torneos deportivos España',
    'torneos de padel',
    'inscribirse en un torneo',
    'competiciones deportivas',
    'torneo tenis',
    'TeamUp'
  ],
  alternates: {
    canonical: 'https://teamupapp.es/tournaments',
  },
  openGraph: {
    title: 'Torneos Deportivos — Pádel, Tenis, Fútbol y Más | TeamUp',
    description: 'Descubre e inscríbete en torneos de pádel, tenis, bádminton, fútbol, baloncesto y vóley en tu provincia.',
    type: 'website',
    url: 'https://teamupapp.es/tournaments',
    siteName: 'TeamUp',
    locale: 'es_ES',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — Torneos deportivos en España',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Torneos Deportivos — Pádel, Tenis, Fútbol y Más | TeamUp',
    description: 'Descubre e inscríbete en torneos deportivos en tu provincia.',
    images: ['/favicon.png'],
  },
}

export default function TournamentsPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://teamupapp.es/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Torneos', 'item': 'https://teamupapp.es/tournaments' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TournamentsContent />
    </>
  )
}
