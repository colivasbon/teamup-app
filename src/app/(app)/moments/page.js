import MomentsContent from './MomentsContent'

export const metadata = {
  title: 'Momentos Deportivos — Fotos e Historias de la Comunidad TeamUp',
  description: 'Descubre los momentos más destacados de la comunidad deportiva de TeamUp: fotos y crónicas de eventos deportivos, partidos de pádel, rutas de running y senderismo en toda España.',
  keywords: [
    'momentos deportivos',
    'fotos de eventos deportivos',
    'comunidad deportiva España',
    'experiencias deporte',
    'TeamUp'
  ],
  alternates: {
    canonical: 'https://teamupapp.es/moments',
  },
  openGraph: {
    title: 'Momentos Deportivos — Fotos e Historias de la Comunidad | TeamUp',
    description: 'Descubre los momentos más destacados de la comunidad deportiva de TeamUp en toda España.',
    type: 'website',
    url: 'https://teamupapp.es/moments',
    siteName: 'TeamUp',
    locale: 'es_ES',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — Momentos de la comunidad deportiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Momentos Deportivos — Fotos e Historias de la Comunidad | TeamUp',
    description: 'Los mejores momentos de la comunidad deportiva de TeamUp.',
    images: ['/favicon.png'],
  },
}

export default function MomentsPage() {
  return <MomentsContent />
}
