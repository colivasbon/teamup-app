# GEO — Generative Engine Optimization Skill

Use when optimizing content to be understood, extracted, and cited by AI-powered search engines (ChatGPT, Perplexity, Gemini, Google SGE/AI Overviews). This is NOT local SEO by geolocation — this is about making content AI-discoverable.

## When to Use

- Optimizing landing pages for AI visibility
- Restructuring content for extractability
- Adding E-E-A-T signals
- Creating FAQ and definition content
- Improving entity coverage and verifiability

## Core Principles

### 1. Answer First, Explain After

Every page must answer the primary question in the first paragraph. AI systems extract the most relevant snippet — if your answer is buried in paragraph 5, it won't be cited.

```
BAD:  "Welcome to our company. We've been serving Albacete since 2010...
       Today we're going to talk about our services..."
       
GOOD: "TeamUp es una aplicación de gestión de torneos de pádel para
       negocios en Albacete. Permite crear torneos, gestionar
       participantes y automatizar la comunicación."
```

### 2. Structured for Extraction

AI systems parse HTML structure to understand content hierarchy:

- **H1**: The main topic (one per page)
- **H2**: Major subtopics
- **H3**: Specific aspects
- **Tables**: Comparative data, pricing, features
- **Lists**: Steps, features, requirements
- **Definitions**: Clear term → definition format

### 3. Verifiable Evidence

AI systems favor sources they can verify. Include:

- **Author**: Real name, role, expertise
- **Date**: Publication and last update dates
- **Sources**: Links to primary data, government stats, official docs
- **Data**: Original statistics, user counts, case studies
- **Methodology**: How you arrived at claims
- **Contact**: Real address, phone, email (not just a form)

### 4. Entity Coverage

Cover the who/what/where/when/why explicitly:

| Entity | Example |
|--------|---------|
| Who | Company name, team, founders |
| What | Service/product, features, benefits |
| Where | Albacete, Castilla-La Mancha, Spain |
| When | Founded, hours, service area times |
| Why | Mission, problem solved, value prop |
| How | Process, methodology, technology |
| Conditions | Pricing, limitations, requirements |

### 5. No filler content

AI systems can detect and ignore generic text. Every sentence must add value. If a sentence could appear on any competitor's site, rewrite it with specifics.

## Content Checklist

### Structure
- [ ] Primary question answered in first 100 words
- [ ] H1 > H2 > H3 hierarchy (no skipped levels)
- [ ] Definitions provided for technical terms
- [ ] Tables for comparisons, pricing, features
- [ ] Numbered lists for processes and steps
- [ ] FAQs based on real user questions (not made up)

### E-E-A-T Signals
- [ ] Author name and role visible
- [ ] "Last updated" date on content
- [ ] Links to authoritative sources
- [ ] Original data or research cited
- [ ] Contact information visible
- [ ] Real testimonials (with consent)

### Entity Coverage
- [ ] Service area clearly stated (Albacete, CLM)
- [ ] Target audience defined (who is this for)
- [ ] Specific features/benefits listed
- [ ] Pricing or "contact for pricing" stated
- [ ] Technology/approach mentioned
- [ ] Differentiation from alternatives stated

### Technical
- [ ] Structured data (JSON-LD) implemented
- [ ] Page loads fast (< 3s)
- [ ] Mobile responsive
- [ ] Clean URL structure
- [ ] Internal linking to related content

## Content Template

```markdown
# [Service/Product Name] in [Location]

**[Service/Product]** is [clear definition in 1-2 sentences]. 
For **[target audience]** in **[location]**, it provides 
[main benefit] through [key differentiator].

## What is [Service/Product]?

[2-3 paragraph explanation with specifics]

## Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| [Feature 1] | [What it does] | [Why it matters] |

## How It Works

1. **Step 1**: [Description]
2. **Step 2**: [Description]
3. **Step 3**: [Description]

## Pricing

[Or "Contact us for pricing" with context]

## FAQ

### [Common Question 1]?
[Direct answer in 2-3 sentences]

### [Common Question 2]?
[Direct answer in 2-3 sentences]

## About [Author/Company]

[Author bio with credentials]

*Last updated: [Date]*
```

## GEO Anti-Patterns

### DON'T
- Promise AI citations or rankings
- Use generic "best service in Albacete" filler
- Create fake reviews or awards
- Hide important info in images or PDFs
- Use Schema markup for non-visible content
- Keyword stuff unnaturally
- Copy competitor content

### DO
- Answer real questions with real answers
- Provide verifiable facts and data
- Use clear, specific language
- Link to authoritative sources
- Update content regularly
- Include author and date information
- Structure content for machine parsing

## Verification

After optimizing, test with:

1. **Google Rich Results Test**: Validate structured data
2. **Perplexity**: Search for your topic — does your content appear?
3. **ChatGPT**: Ask about your service — is your site mentioned?
4. **Google Search Console**: Monitor impressions and clicks
5. **PageSpeed Insights**: Check Core Web Vitals

## Next.js Specific

- Use `generateMetadata()` for consistent titles/descriptions
- Implement JSON-LD in page components with `<script type="application/ld+json">`
- Use `generateStaticParams()` for pre-rendered content pages
- Implement `loading.js` for perceived performance
- Use Server Components for static content (faster, better for SEO)

## Important

- GEO is about content quality and structure, not tricks
- No guarantee of AI citations — focus on being genuinely useful
- E-E-A-T takes time to build — consistency matters
- Monitor Search Console for real performance data
- Update content quarterly to maintain freshness signals
