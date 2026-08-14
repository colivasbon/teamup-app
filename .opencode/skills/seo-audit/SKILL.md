# SEO Audit Skill

Use when performing technical SEO audits on web applications, especially Next.js projects. Covers indexability, metadata, structured data, performance, and crawlability.

## When to Use

- Full site SEO audit
- Pre-launch SEO review
- Post-deployment SEO verification
- Competitor SEO analysis
- Periodic SEO health checks

## Audit Checklist

### P0 — Critical (Fix Immediately)

1. **Indexability**
   - Check `robots.txt` for disallowed critical paths
   - Verify `X-Robots-Tag` headers
   - Check meta robots tags (`noindex`, `nofollow`)
   - Validate `canonical` URLs (self-referencing, correct domain)
   - Verify `sitemap.xml` exists, is valid, and is referenced in `robots.txt`
   - Check `X-Content-Type-Options` and security headers

2. **Title & Meta Description**
   - Every page has a unique `<title>` (50-60 chars)
   - Every page has a unique meta description (150-160 chars)
   - No duplicate titles/descriptions across pages
   - Primary keyword appears in title and description

3. **Structured Data (JSON-LD)**
   - Valid JSON-LD on relevant pages
   - No schema errors (test with Google Rich Results Test)
   - Organization/LocalBusiness on homepage
   - BreadcrumbList on inner pages
   - FAQPage only if real FAQ content exists
   - Article schema on blog posts

### P1 — Important (Fix Within 1 Week)

4. **Heading Structure**
   - Single H1 per page
   - Logical H1 > H2 > H3 hierarchy
   - No skipped levels
   - Keywords in headings where natural

5. **URL Structure**
   - Clean, readable URLs (`/service-name` not `/page?id=123`)
   - No excessive parameters
   - Lowercase, hyphens not underscores
   - No trailing slashes inconsistency

6. **Internal Linking**
   - All important pages reachable within 3 clicks
   - Descriptive anchor text (not "click here")
   - No orphan pages
   - Breadcrumbs implemented and marked up

7. **Images**
   - All images have descriptive `alt` text
   - Images use `next/image` or equivalent optimization
   - WebP/AVIF format preferred
   - Lazy loading for below-fold images
   - Descriptive filenames (`albacete-futbol-campo.jpg` not `IMG_2024.jpg`)

### P2 — Nice to Have (Fix Within 1 Month)

8. **Open Graph & Social**
   - `og:title`, `og:description`, `og:image` on all pages
   - `twitter:card`, `twitter:title`, `twitter:description`
   - Image dimensions correct (1200x630 for OG)
   - No broken image URLs

9. **Hreflang (if multilingual)**
   - Proper `hreflang` tags for each language variant
   - `x-default` hreflang for fallback
   - Self-referencing hreflang

10. **Performance**
    - Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
    - Font loading optimized (font-display: swap)
    - Critical CSS inlined
    - JavaScript bundle size reasonable
    - No render-blocking resources

11. **Accessibility**
    - Proper lang attribute on `<html>`
    - Skip navigation links
    - ARIA labels where needed
    - Color contrast sufficient

## Audit Workflow

```
1. Crawl the site structure (sitemap, routes, pages)
2. Check robots.txt and sitemap.xml
3. Inspect each page's <head> for meta tags
4. Validate structured data
5. Check heading hierarchy
6. Verify image optimization
7. Test performance (Lighthouse, Core Web Vitals)
8. Review internal linking
9. Check mobile responsiveness
10. Compile findings into P0/P1/P2 prioritized report
```

## Output Format

```markdown
## SEO Audit Report — [Site Name] — [Date]

### P0 — Critical Issues
| Issue | Page | Current | Recommended | File:Line |
|-------|------|---------|-------------|-----------|
| Missing canonical | /services | None | Self-referencing | src/app/services/page.tsx:12 |

### P1 — Important Issues
...

### P2 — Enhancements
...

### Summary
- P0 issues: X
- P1 issues: X
- P2 issues: X
- Estimated impact: [High/Medium/Low]
```

## Next.js Specific Checks

- `next.config.mjs` → `images.formats` for WebP/AVIF
- `generateMetadata()` in page files
- `generateSitemaps()` for dynamic sitemaps
- `headers()` in `next.config.mjs` for X-Robots-Tag
- `rewrites()` / `redirects()` for URL structure
- Route groups `(marketing)` vs `(app)` for different metadata
- `loading.js` for perceived performance
- `not-found.js` for proper 404 handling

## Commands to Run

```bash
# Check sitemap
curl -s https://domain.com/sitemap.xml | head -50

# Check robots.txt
curl -s https://domain.com/robots.txt

# Lighthouse audit
npx lighthouse https://domain.com --output=html --output-path=./audit.html

# Check structured data
# Use: https://search.google.com/test/rich-results

# Check meta tags
# Use: https://www.opengraph.xyz/
```

## Important Notes

- Never invent data — if a page has no FAQ, don't add FAQPage schema
- Verify all structured data against Google's Rich Results Test
- Check Search Console for actual indexing issues before suggesting changes
- Prioritize pages with traffic and conversion intent
- Document file paths and line numbers for every recommendation
