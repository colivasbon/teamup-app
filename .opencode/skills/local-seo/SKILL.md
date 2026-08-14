# Local SEO Skill

Use when optimizing for local search visibility — Google Business Profile, local citations, NAP consistency, LocalBusiness schema, and location-specific content. Primary focus: Albacete and Castilla-La Mancha.

## When to Use

- Local business websites
- Service area businesses (Albacete + surrounding areas)
- Google Business Profile optimization
- Local landing pages
- Citation building and NAP audit

## Core Local SEO Elements

### 1. NAP Consistency (Name, Address, Phone)

NAP must be **identical** everywhere:

```
TeamUp Solutions S.L.
Calle Ejemplo 12, 02001 Albacete
+34 967 XXX XXX
info@teamup.es
```

**Where to check:**
- Website footer and contact page
- Google Business Profile
- Social media profiles
- Local directories (Páginas Amarillas, Yelp, etc.)
- Schema markup (must match visible NAP)

### 2. Google Business Profile

**Optimization checklist:**
- [ ] Primary category: Most specific (e.g., "Software Company" not just "Company")
- [ ] Secondary categories: Related services
- [ ] Description: 750 chars, keyword-rich, natural
- [ ] Hours: Accurate, including holidays
- [ ] Photos: Logo, interior, exterior, team, products (10+)
- [ ] Posts: Weekly updates, offers, events
- [ ] Q&A: Pre-populate common questions
- [ ] Reviews: Respond to ALL reviews within 48h
- [ ] Services: List all services with descriptions
- [ ] Products: If applicable, with prices
- [ ] Attributes: Accessibility, Wi-Fi, parking, etc.

### 3. Local Content Strategy

**Location-specific pages:**
```
/servicios/alkitab-albacete
/servicios/padel-albacete
/servicios/torneos-castilla-la-mancha
```

**Each local page should include:**
- Location name in H1 and title
- Service specific to that location
- Local landmarks and references
- Google Maps embed
- Local testimonials (real, with consent)
- LocalBusiness schema with geo-coordinates

### 4. Local Citations

**High-priority directories for Albacete:**
- Páginas Amarillas
- Yelp España
- Google Business Profile
- Facebook Business
- Apple Maps
- Bing Places
- Guía de Albacete
- Cámara de Comercio de Albacete
- Directorios sectoriales específicos

**Build citations systematically:**
1. Start with Google Business Profile
2. Major aggregators (Neustar, Foursquare)
3. Industry-specific directories
4. Local directories and press

### 5. Reviews Strategy

**Generate reviews ethically:**
- Ask satisfied customers directly
- Send follow-up email with review link
- Make it easy: provide direct GBP review link
- Never buy fake reviews
- Never offer incentives for reviews

**Respond to all reviews:**
```
Positive: "Gracias [Name] por tu reseña. Nos alegra que [specific detail]. 
           Esperamos verte pronto en [specific context]."

Negative: "Lamentamos tu experiencia, [Name]. Hemos tomado nota de [issue]. 
           Por favor, contáctanos en [email/phone] para resolverlo."
```

## Schema Markup for Local SEO

### LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "TeamUp Solutions S.L.",
  "image": "https://teamup.es/logo.png",
  "url": "https://teamup.es",
  "telephone": "+34967XXXXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Ejemplo 12",
    "addressLocality": "Albacete",
    "addressRegion": "Castilla-La Mancha",
    "postalCode": "02001",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.9943,
    "longitude": -1.8585
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 38.9943,
      "longitude": -1.8585
    },
    "geoRadius": "50000"
  },
  "sameAs": [
    "https://www.facebook.com/teamup",
    "https://www.linkedin.com/company/teamup"
  ]
}
```

### Service Schema (per service)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Gestión de Torneos de Pádel",
  "description": "Sistema completo para crear y gestionar torneos de pádel en Albacete",
  "provider": {
    "@type": "LocalBusiness",
    "name": "TeamUp Solutions S.L."
  },
  "areaServed": {
    "@type": "Place",
    "name": "Albacete"
  },
  "serviceType": "Tournament Management Software"
}
```

## Local Landing Page Template

```markdown
# [Service] en [City, Province]

**[Service]** para [target audience] en **[City]**, [Province]. 
[One sentence value proposition with location].

## Servicios de [Service] en [City]

[2-3 paragraphs with local context, landmarks, references]

## ¿Por qué elegir [Company] en [City]?

- [Benefit 1 with local context]
- [Benefit 2 with local context]
- [Benefit 3 with local context]

## Zona de Cobertura

[City] y alrededores: [List nearby towns/areas]

## Testimonios en [City]

> "[Review text]" — [Name], [Business] en [City]

## Contacto en [City]

📍 [Address]
📞 [Phone]
📧 [Email]

[Google Maps embed]

*Última actualización: [Date]*
```

## Local SEO Audit Commands

```bash
# Check NAP consistency across directories
# (Manual verification required for most)

# Check Google Business Profile
# Visit: https://business.google.com/

# Check local rankings
# Search: "[service] en Albacete"

# Verify schema
# Test: https://search.google.com/test/rich-results

# Check site speed
# Test: https://pagespeedinsights.com/
```

## Tracking & Measurement

**Monitor these metrics:**
- Google Business Profile insights (views, searches, actions)
- Local pack rankings for target keywords
- Review count and rating
- Citation count and consistency
- Local organic traffic
- Direction requests and phone calls

**Tools:**
- Google Business Profile dashboard
- Google Search Console (location queries)
- BrightLocal or Whitespark for citation tracking
- Google Analytics for local traffic segments

## Common Local SEO Mistakes

1. **Inconsistent NAP** across directories
2. **Duplicate listings** on Google Business Profile
3. **Keyword stuffing** in business name
4. **Fake reviews** or review gating
5. **Missing photos** or low-quality images
6. **No review responses**
7. **Missing local content** on website
8. **Wrong categories** on GBP
9. **No mobile optimization** (local searches are mobile-first)
10. **Ignoring negative reviews**

## Important Notes

- Local SEO takes 3-6 months to show results
- Google Business Profile is the #1 local ranking factor
- Reviews are the #2 local ranking factor
- NAP consistency is foundational — fix this first
- Local content must be genuinely useful, not just keyword-stuffed
- Never create fake listings or reviews
- Update GBP hours during holidays
