import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a2028',
  colorScheme: 'dark light',
}

export const metadata = {
  metadataBase: new URL('https://teamupapp.es'),
  title: {
    default: 'TeamUp — App para Eventos deportivos, Unirse a Partidos y Deporte Social en España',
    template: '%s | TeamUp',
  },
  description: 'Organiza y únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running y quedadas deportivas cerca de ti en España. ¡Únete gratis y conoce deportistas!',
  applicationName: 'TeamUp',
  category: 'Deportes',
  keywords: [
    'app para eventos deportivos',
    'unirse a partidos',
    'quedadas deportivas',
    'organizar eventos deportivos',
    'partidos de padel cerca de mi',
    'futbol 7 quedadas',
    'grupos de running',
    'deporte social España',
    'buscar compañeros deporte',
    'TeamUp'
  ],
  authors: [{ name: 'TeamUp', url: 'https://teamupapp.es' }],
  creator: 'TeamUp',
  publisher: 'TeamUp',
  alternates: {
    canonical: 'https://teamupapp.es/',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://teamupapp.es',
    siteName: 'TeamUp',
    title: 'TeamUp — App para Eventos deportivos, Unirse a Partidos y Deporte Social en España',
    description: 'Organiza y únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running y eventos deportivos cerca de ti en España. ¡Haz deporte y conoce gente!',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — App de eventos deportivos y deporte social en España',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeamUp — App para Eventos deportivos y Deporte Social en España',
    description: 'Organiza y únete a eventos deportivos, partidos de pádel, grupos de running y eventos deportivos cerca de ti.',
    images: ['/favicon.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TeamUp',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://teamupapp.es/#organization',
        'name': 'TeamUp',
        'url': 'https://teamupapp.es',
        'logo': {
          '@type': 'ImageObject',
          '@id': 'https://teamupapp.es/#logo',
          'url': 'https://teamupapp.es/favicon.png',
          'width': 512,
          'height': 512,
        },
        'description': 'Plataforma social deportiva en España para organizar y unirse a eventos deportivos, partidos y quedadas deportivas.',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'ES'
        },
        'areaServed': 'ES',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer support',
          'email': 'colivasbon@gmail.com',
          'availableLanguage': 'es'
        }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://teamupapp.es/#application',
        'name': 'TeamUp',
        'operatingSystem': 'Web, Android, iOS',
        'applicationCategory': 'SportsApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'EUR'
        },
        'description': 'Aplicación web y PWA para organizar y unirse a eventos deportivos, partidos de pádel, fútbol, running y quedadas deportivas cerca de ti en España.',
        'url': 'https://teamupapp.es',
        'publisher': { '@id': 'https://teamupapp.es/#organization' }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://teamupapp.es/#website',
        'url': 'https://teamupapp.es',
        'name': 'TeamUp',
        'description': 'Encuentra y organiza eventos deportivos, eventos deportivos y partidos en todas las provincias de España.',
        'publisher': { '@id': 'https://teamupapp.es/#organization' },
        'inLanguage': 'es-ES'
      }
    ]
  }

  return (
    <html lang="es" data-theme="dark">
      <head>
        <meta name="geo.region" content="ES" />
        <meta name="geo.placename" content="España" />
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('tu-theme'); if(t)document.documentElement.setAttribute('data-theme', t);}catch(e){}})();" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
