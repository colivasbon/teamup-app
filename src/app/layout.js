import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a2028',
}

export const metadata = {
  metadataBase: new URL('https://teamupapp.es'),
  title: {
    default: 'TeamUp — App para Pachangas, Unirse a Partidos y Deporte Social en España',
    template: '%s | TeamUp',
  },
  description: 'Organiza y únete a pachangas, partidos de pádel, fútbol 7, grupos de running y quedadas deportivas cerca de ti en España. ¡Únete gratis y conoce deportistas!',
  keywords: [
    'app para pachangas',
    'unirse a partidos',
    'quedadas deportivas',
    'organizar pachangas',
    'partidos de padel cerca de mi',
    'futbol 7 quedadas',
    'grupos de running',
    'deporte social España',
    'buscar compañeros deporte',
    'TeamUp'
  ],
  authors: [{ name: 'TeamUp' }],
  creator: 'TeamUp',
  publisher: 'TeamUp',
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
    title: 'TeamUp — App para Pachangas, Unirse a Partidos y Deporte Social',
    description: 'Organiza y únete a eventos deportivos cerca de ti en España. Pádel, fútbol, running, senderismo y más. ¡Haz deporte y conoce gente!',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeamUp — App para Pachangas y Deporte Social en España',
    description: 'Organiza y únete a pachangas, partidos de pádel, grupos de running y eventos deportivos cerca de ti.',
    images: ['/favicon.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icons/icon-192x192.png',
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
        'description': 'Aplicación web y PWA para organizar y unirse a pachangas, partidos de pádel, fútbol, running y quedadas deportivas cerca de ti en España.',
        'url': 'https://teamupapp.es'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://teamupapp.es/#website',
        'url': 'https://teamupapp.es',
        'name': 'TeamUp',
        'description': 'Encuentra y organiza eventos deportivos, pachangas y partidos en toda España.',
        'inLanguage': 'es-ES'
      }
    ]
  }

  return (
    <html lang="es" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('tu-theme'); if(t)document.documentElement.setAttribute('data-theme', t);}catch(e){}})();" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
