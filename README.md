# US Form Kit — usformkit.com

Mobile-first micro-SaaS for generating US documents with a live, watermarked preview and pay-to-unlock PDFs.

- **Bill of Sale** (vehicle or general item, federal odometer disclosure, optional notary block)
- **Substitute Form W-9** (lines 1–7, Part I TIN, Part II certification)
- **Residential Lease Agreement** (fixed-term or month-to-month, lead-based paint disclosure)
- SEO guides, Sources & Legal References, Privacy / Terms / Refund pages, sitemap, robots, JSON-LD

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Stripe Payment Links · pdf-lib · zod

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev                     # http://localhost:3000
```

No Stripe API keys or secrets are required.

## How payment & delivery work

```
Form (client) ──validate──▶ answers saved in this tab's sessionStorage ─▶ browser opens the Stripe Payment Link
Stripe ──after payment redirect──▶ /success?session_id={CHECKOUT_SESSION_ID}
/success ──POST /api/document──▶ zod validation ─▶ clean PDF (pdf-lib) ─▶ download
```

- **Payment Links** live in `src/lib/products.ts` (`paymentLink`). Prices live there too (`priceCents`) and must match the
  price configured on each Payment Link in Stripe.
- **Stripe dashboard setting (required):** for each Payment Link, Edit → *After payment* → *Don't show confirmation page* →
  redirect to `https://www.usformkit.com/success?session_id={CHECKOUT_SESSION_ID}`.
- **Preview ≠ PDF.** The preview is HTML with a tiled watermark. The clean PDF is built by `/api/document`.
- **Limitation:** without API keys the server cannot verify a payment, so the success page unlocks the PDF for the browser
  tab that clicked Pay. If a customer pays on another device, support sends the document manually.

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Optionally set `NEXT_PUBLIC_SITE_URL`.
3. Point `usformkit.com` at Vercel, then set `NEXT_PUBLIC_SITE_URL=https://usformkit.com`.
4. Submit `https://usformkit.com/sitemap.xml` in Google Search Console.

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                    Landing page
│  ├─ bill-of-sale/ w9-form/ lease-agreement/   Generator pages (SEO copy + FAQ + JSON-LD)
│  ├─ guides/ + guides/[slug]/    SEO guides (Article, FAQPage, Breadcrumb JSON-LD)
│  ├─ sources/ privacy/ terms/ refund-policy/
│  ├─ success/                    Post-payment download page (noindex)
│  ├─ api/document/               Renders the clean PDF from validated answers
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
   ├─ products.ts (prices + Payment Links) order.ts guides.ts site.ts format.ts
```

## Before launch

- Fill in your legal entity name and governing law in `src/app/terms/page.tsx` (marked TODO).
- Have a US attorney review the templates and legal pages.
- Re-check the external links on `/sources` and the W-9 revision (currently Rev. March 2024) periodically.
- Consider rate limiting `/api/document` (e.g. Vercel Firewall rules).

> Disclaimer: US Form Kit is not a law firm. Documents are templates for informational purposes only.
