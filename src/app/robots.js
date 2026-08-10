export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile/', '/notifications/'],
      },
    ],
    sitemap: 'https://teamupapp.es/sitemap.xml',
  }
}
