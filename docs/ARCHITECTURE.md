# Architectuur — asbestvergelijken.nl

## Framework: Next.js 15 (App Router)

### Waarom Next.js

- **SSR/SSG hybrid** — Statische listing-pagina's voor SEO, server-side voor dynamische zoekresultaten
- **API Routes** — Backend voor lead-formulieren, webhook-endpoints, Supabase calls zonder aparte server
- **App Router** — Layouts, loading states, server components voor performance
- **Netlify-integratie** — Auto-deploys vanuit GitHub, serverless functions, ISR (Incremental Static Regeneration)
- **Interactiviteit** — Offerteformulieren, filters, zoekfunctie, dashboards voor bedrijven

### Waarom niet Astro

Astro is sneller voor pure statische sites, maar we hebben server-side logica nodig voor:
- Offerte-formulieren verwerken en leads doorsturen
- Bedrijfsdashboard (claimed listings beheren)
- Dynamische zoek- en filterfunctionaliteit
- API endpoints voor n8n workflows

## Projectstructuur

```
asbestvergelijken/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout met header/footer
│   │   ├── page.tsx                      # Homepage
│   │   ├── (marketing)/                  # Groep: publieke pagina's
│   │   │   ├── over-ons/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── bedrijven/
│   │   │   ├── page.tsx                  # Overzicht alle bedrijven
│   │   │   └── [slug]/page.tsx           # Individueel bedrijfsprofiel
│   │   ├── [provincie]/
│   │   │   ├── page.tsx                  # Provincie-overzicht
│   │   │   └── [stad]/page.tsx           # "Asbestverwijdering [stad]"
│   │   ├── kennisbank/
│   │   │   ├── page.tsx                  # Overzicht artikelen
│   │   │   └── [slug]/page.tsx           # Individueel artikel (MDX)
│   │   ├── offerte/
│   │   │   └── page.tsx                  # Offerte-aanvraagformulier
│   │   ├── asbestwijzer/
│   │   │   └── page.tsx                  # Interactieve tool
│   │   ├── api/
│   │   │   ├── leads/route.ts            # Lead ontvangst + doorstuur
│   │   │   ├── bedrijven/route.ts        # Bedrijven CRUD
│   │   │   ├── reviews/route.ts          # Review submissions
│   │   │   └── webhooks/
│   │   │       ├── mollie/route.ts       # Betalingswebhooks
│   │   │       └── n8n/route.ts          # n8n workflow triggers
│   │   └── dashboard/                    # Bedrijven-dashboard (auth required)
│   │       ├── layout.tsx
│   │       ├── page.tsx                  # Dashboard home
│   │       ├── profiel/page.tsx          # Profiel bewerken
│   │       ├── leads/page.tsx            # Ontvangen leads
│   │       └── facturen/page.tsx         # Factuuroverzicht
│   ├── components/
│   │   ├── ui/                           # Herbruikbare UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── forms/
│   │   │   ├── OfferteForm.tsx           # Offerte-aanvraag
│   │   │   ├── ReviewForm.tsx            # Review schrijven
│   │   │   └── ContactForm.tsx
│   │   ├── bedrijven/
│   │   │   ├── BedrijfCard.tsx           # Bedrijf in overzichtslijst
│   │   │   ├── BedrijfProfiel.tsx        # Volledig profiel
│   │   │   ├── CertificeringBadge.tsx    # SC-530/SC-540 badge
│   │   │   └── BedrijfFilters.tsx        # Filter op regio, certificering
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── Navigation.tsx
│   │   └── seo/
│   │       ├── StructuredData.tsx        # JSON-LD Schema.org
│   │       └── MetaTags.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Supabase browser client
│   │   │   ├── server.ts                 # Supabase server client
│   │   │   └── queries/                  # Herbruikbare queries
│   │   │       ├── bedrijven.ts
│   │   │       ├── leads.ts
│   │   │       └── reviews.ts
│   │   ├── utils/
│   │   │   ├── slug.ts                   # URL-slug generatie
│   │   │   ├── format.ts                 # Prijsformattering etc.
│   │   │   └── geo.ts                    # Provincie/stad helpers
│   │   └── constants/
│   │       ├── provincies.ts             # NL provincies + steden
│   │       └── certificeringen.ts        # SC-530, SC-540 types
│   ├── content/
│   │   └── kennisbank/                   # MDX bestanden voor pillar content
│   │       ├── wat-kost-asbest-verwijderen.mdx
│   │       ├── asbestinventarisatie-alles-wat-je-moet-weten.mdx
│   │       └── ...
│   └── styles/
│       └── globals.css                   # Tailwind base + custom styles
├── public/
│   ├── images/
│   ├── robots.txt
│   └── sitemap.xml                       # Auto-generated
├── supabase/
│   └── migrations/                       # Database migraties
│       └── 001_initial_schema.sql
├── .env.local                            # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Rendering Strategie

| Pagina-type | Rendering | Reden |
|---|---|---|
| Homepage | SSG + ISR (1 uur) | Snel laden, af en toe vernieuwen |
| Bedrijfsprofiel | SSG + ISR (24 uur) | SEO-critical, data verandert zelden |
| Stad-pagina | SSG + ISR (24 uur) | SEO-critical, lokale landing pages |
| Kennisbank artikel | SSG | Content verandert zelden |
| Zoekresultaten/filters | SSR | Dynamisch op basis van filters |
| Offerte-formulier | Client-side | Interactief formulier |
| Dashboard | SSR + Auth | Dynamisch, achter login |

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "tailwindcss": "^4",
    "next-mdx-remote": "^5",
    "zod": "^3",
    "resend": "^4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19",
    "eslint": "^9",
    "prettier": "^3"
  }
}
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# E-mail
RESEND_API_KEY=

# Betaling
MOLLIE_API_KEY=

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=asbestvergelijken.nl

# App
NEXT_PUBLIC_BASE_URL=https://asbestvergelijken.nl
```

## Deployment

1. Push naar `main` branch op GitHub
2. Netlify detecteert automatisch en bouwt
3. ISR pagina's worden on-demand geregenereerd
4. Custom domein: asbestvergelijken.nl → Netlify DNS

## Performance Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Lighthouse score:** 90+ op alle categorieën
- **Bundle size:** Minimaal client-side JS, gebruik server components waar mogelijk
