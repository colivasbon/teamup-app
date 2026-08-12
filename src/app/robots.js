export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile/',
          '/notifications/',
          '/auth/',
          '/create/',
          '/events/*/edit',
          '/events/*/karma',
        ],
      },
    ],
    sitemap: 'https://teamupapp.es/sitemap.xml',
  }
}
