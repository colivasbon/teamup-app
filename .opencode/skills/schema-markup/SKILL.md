# Schema Markup Skill

Use when generating, validating, or auditing JSON-LD structured data for SEO. Covers Organization, LocalBusiness, Service, Product, FAQPage, Article, BreadcrumbList, and more.

## When to Use

- Adding structured data to pages
- Validating existing schema
- Fixing schema errors
- Implementing new schema types
- Pre-launch schema audit

## Schema Types Reference

### Organization (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://company.es",
  "logo": "https://company.es/logo.png",
  "description": "Company description",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Ejemplo 12",
    "addressLocality": "Albacete",
    "addressRegion": "Castilla-La Mancha",
    "postalCode": "02001",
    "addressCountry": "ES"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34967XXXXXX",
    "contactType": "customer service",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": [
    "https://www.facebook.com/company",
    "https://www.linkedin.com/company/company",
    "https://twitter.com/company"
  ]
}
```

### LocalBusiness (Business with Physical Location)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://business.es/photo.jpg",
  "url": "https://business.es",
  "telephone": "+34967XXXXXX",
  "priceRange": "$$",
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
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 38.9943,
      "longitude": -1.8585
    },
    "geoRadius": "50000"
  }
}
```

### Service

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Service Name",
  "description": "Service description",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Company Name",
    "url": "https://company.es"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Albacete"
  },
  "serviceType": "Service Category"
}
```

### Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://company.es/product.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://company.es/product",
    "priceCurrency": "EUR",
    "price": "99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Company Name"
    }
  }
}
```

### FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The direct answer to the question."
      }
    },
    {
      "@type": "Question",
      "name": "Another question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Another direct answer."
      }
    }
  ]
}
```

### Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "https://company.es/article-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://company.es/team/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://company.es/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-06-20"
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://company.es"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://company.es/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Tournament Management",
      "item": "https://company.es/services/tournaments"
    }
  ]
}
```

### Website (with SearchAction)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Company Name",
  "url": "https://company.es",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://company.es/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## Implementation in Next.js

### Method 1: In Page Component (Recommended)

```tsx
// src/app/page.tsx
export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    // ... properties
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Method 2: In generateMetadata (for head)

```tsx
// src/app/layout.tsx
export const metadata = {
  other: {
    'script[type="application/ld+json"]': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      // ...
    }),
  },
};
```

### Method 3: Separate Schema Component

```tsx
// src/components/Schema.tsx
interface SchemaProps {
  data: Record<string, any>;
}

export function Schema({ data }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in page:
<Schema data={organizationSchema} />
```

## Validation Checklist

### Before Deployment
- [ ] JSON-LD is valid (no syntax errors)
- [ ] All required properties present for the type
- [ ] URLs are absolute (https://domain.com/path)
- [ ] No placeholder or example values
- [ ] Schema matches visible page content
- [ ] No hidden content in schema
- [ ] Dates in ISO 8601 format
- [ ] Phone numbers in international format

### After Deployment
- [ ] Test with Google Rich Results Test
- [ ] Check Google Search Console for schema errors
- [ ] Verify schema appears in page source
- [ ] Check multiple pages if template-based

## Validation Tools

```bash
# Google Rich Results Test
# https://search.google.com/test/rich-results

# Schema.org Validator
# https://validator.schema.org/

# JSON-LD Playground
# https://json-ld.org/playground/

# Check page source
curl -s https://company.es | grep -A 20 'application/ld+json'
```

## Common Schema Errors

1. **Missing required properties** — Each type has required fields
2. **Relative URLs** — Use absolute URLs for images, pages
3. **Wrong date format** — Must be ISO 8601 (YYYY-MM-DD)
4. **Schema doesn't match content** — FAQPage with no real FAQ
5. **Hidden content** — Schema for content not visible on page
6. **Duplicate schemas** — Same type on same page
7. **Invalid JSON** — Syntax errors, trailing commas
8. **Missing @context** — Must include "https://schema.org"

## Next.js Specific

- Use Server Components for schema (faster, no client JS)
- Dynamic schema with `generateMetadata()` for programmatic pages
- `generateStaticParams()` for pre-rendered pages with schema
- Validate in build with schema validation libraries
- Store schema templates in a `lib/schema.ts` file for reuse

## Important Rules

- **Never fake data** — If no FAQ exists, don't add FAQPage
- **Schema must match visible content** — No hidden info
- **Keep it simple** — Start with essential types, add complexity later
- **Validate before deploy** — Use Google's tools
- **Monitor Search Console** — Real data beats assumptions
- **Update when content changes** — Schema should reflect current state
