# US Form Kit — usformkit.com

Mobile-first micro-SaaS for generating US documents with a live, watermarked preview and pay-to-unlock PDFs.

- **Bill of Sale** (vehicle or general item, federal odometer disclosure, optional notary block)
- **Substitute Form W-9** (lines 1–7, Part I TIN, Part II certification)
- **Residential Lease Agreement** (fixed-term or month-to-month, lead-based paint disclosure)
- SEO guides, Sources & Legal References, Privacy / Terms / Refund pages, sitemap, robots, JSON-LD

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Stripe Checkout + webhooks · pdf-lib · Resend (email via REST) · zod

---

## Quick start

```bash
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                     # http://localhost:3000
```

In a second terminal, forward Stripe webhooks locally (requires the [Stripe CLI](https://stripe.com/docs/stripe-cli)):

```bash
npm run stripe:listen           # copy the whsec_… it prints into STRIPE_WEBHOOK_SECRET
```

Test card: `4242 4242 4242 4242`, any future date, any CVC.

## Environment variables

| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL, e.g. `https://usformkit.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` / `sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Placeholder for embedded Checkout / Stripe.js (not needed for redirect Checkout) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of your webhook endpoint |
| `DOCUMENT_ENCRYPTION_KEY` | 32+ random chars (`openssl rand -base64 48`). Don't rotate while recent orders exist. |
| `DOWNLOAD_WINDOW_DAYS` | How long paid download links work (default 30) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Verified sender, e.g. `US Form Kit <documents@usformkit.com>` |
| `ADMIN_NOTIFICATION_EMAIL` | Order notifications (default `vitalika.limited@gmail.com`) |
| `ATTACH_SENSITIVE_PDFS` | `false` = W-9 emails contain only the link, not the PDF |

## How payment & delivery work

```
Form (client) ──POST /api/checkout──▶ zod validation ─▶ AES-256-GCM encrypt ─▶ Stripe metadata (chunked)
                                                                           └▶ Stripe Checkout URL
Stripe ──checkout.session.completed──▶ /api/webhooks/stripe
          ├─ decrypt + render PDF (pdf-lib)
          ├─ email customer: download link + PDF attachment (Resend)
          ├─ mark PaymentIntent metadata.fulfilled_at (idempotent on retries)
          └─ email admin: order summary (never the PDF)
Customer ──/success?session_id=…──▶ verifies payment ─▶ /api/download (PDF regenerated on demand)
```

- **No database.** The encrypted form payload travels with the Stripe Checkout Session (≤ 44 × 490-char metadata
  chunks ≈ 21 KB ciphertext, compressed first). Stripe only ever sees ciphertext.
- **Preview ≠ PDF.** The preview is HTML with a tiled watermark, right-click/copy disabled and hidden from print.
  The clean PDF only exists server-side after payment is verified.
- **One document model.** `src/lib/documents/*` builds a renderer-agnostic `DocModel` used by both the HTML preview
  and the PDF renderer, so what users preview is what they get.

## Stripe setup checklist

1. Dashboard → Developers → Webhooks → **Add endpoint** `https://usformkit.com/api/webhooks/stripe`
   Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`.
2. Copy the endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Settings → Public details: add business name, support email and the URLs of `/terms`, `/privacy`, `/refund-policy`.
4. Prices live in `src/lib/products.ts` (`priceCents`).

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add every variable from `.env.example` (production values).
3. Point `usformkit.com` at Vercel, then set `NEXT_PUBLIC_SITE_URL=https://usformkit.com`.
4. Verify your sending domain in Resend (SPF/DKIM) before going live.
5. Submit `https://usformkit.com/sitemap.xml` in Google Search Console.

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                    Landing page
│  ├─ bill-of-sale/ w9-form/ lease-agreement/   Generator pages (SEO copy + FAQ + JSON-LD)
│  ├─ guides/ + guides/[slug]/    SEO guides (Article, FAQPage, Breadcrumb JSON-LD)
│  ├─ sources/ privacy/ terms/ refund-policy/
│  ├─ success/                    Post-payment download page (noindex)
│  ├─ api/checkout/               Creates Stripe Checkout Session
│  ├─ api/webhooks/stripe/        Fulfillment (emails, idempotency)
│  ├─ api/download/               Paid PDF download
│  ├─ sitemap.ts robots.ts opengraph-image.tsx icon.svg layout.tsx globals.css
├─ components/
│  ├─ generator/                  GeneratorShell (tabs, bottom action bar), DocumentPreview (watermark),
│  │                              useDocForm, BillOfSale/W9/Lease generators
│  ├─ form/Fields.tsx             Touch-friendly inputs, toggles, segmented controls
│  └─ SiteHeader, SiteFooter, ToolPage, LegalPage, JsonLd, Icons, Logo
└─ lib/
   ├─ documents/                  DocModel builders (shared by preview + PDF)
   ├─ pdf/render.ts               pdf-lib renderer (US Letter, footer + disclaimer on every page)
   ├─ schemas.ts                  zod validation (client + server)
   ├─ crypto.ts stripe.ts email.ts fulfillment.ts products.ts guides.ts site.ts format.ts
```

## Before launch

- Fill in your legal entity name and governing law in `src/app/terms/page.tsx` (marked TODO).
- Have a US attorney review the templates and legal pages.
- Re-check the external links on `/sources` and the W-9 revision (currently Rev. March 2024) periodically.
- Consider rate limiting `/api/checkout` (e.g. Vercel Firewall rules).

> Disclaimer: US Form Kit is not a law firm. Documents are templates for informational purposes only.
