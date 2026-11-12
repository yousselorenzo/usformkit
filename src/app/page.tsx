import Link from 'next/link';
import { IconArrow, IconBolt, IconBook, IconCar, IconCheck, IconHome, IconLock, IconReceipt, IconShield } from '@/components/Icons';
import { JsonLd, faqJsonLd } from '@/components/JsonLd';
import { GUIDES } from '@/lib/guides';
import { PRODUCTS, formatPrice } from '@/lib/products';

const TOOL_ICONS = { 'bill-of-sale': IconCar, w9: IconReceipt, lease: IconHome } as const;

const FAQS = [
  {
    q: 'Can I see my document before paying?',
    a: 'Yes. Every form shows a live, watermarked preview that updates as you type. You only pay when you are happy with it, and the clean PDF unlocks instantly.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. Each document is a one-time purchase. There is no account to create and nothing renews.',
  },
  {
    q: 'What happens after I pay?',
    a: 'You are redirected to a download page with your clean, unwatermarked PDF. A backup copy and a download link are also emailed to the address you enter at checkout.',
  },
  {
    q: 'Is my information secure?',
    a: 'Payments are handled by Stripe; we never see your card number. Your form answers are encrypted with AES-256 before checkout and are not stored in a database.',
  },
  {
    q: 'Are these documents legally binding?',
    a: 'Our templates are drafted from federal sources and common US practice, and a properly completed and signed document is generally enforceable. Laws vary by state, and US Form Kit is not a law firm, so consider having an attorney review documents for complex situations.',
  },
];

export default function HomePage() {
  const products = Object.values(PRODUCTS);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_0%,#E3E9F3_0%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(#E3E9F3_1px,transparent_1px),linear-gradient(90deg,#E3E9F3_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_20%,transparent_75%)]"
        />
        <div className="container-x relative pb-16 pt-14 sm:pb-24 sm:pt-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <IconShield width={14} height={14} className="text-emerald-600" />
              Built from IRS, NHTSA &amp; EPA references
            </p>
            <h1 className="mt-5 text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-navy-950 sm:text-6xl">
              US legal &amp; tax forms,
              <br className="hidden sm:block" /> done right in minutes.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Fill in a Bill of Sale, W-9 or Lease Agreement and watch the document build itself in real time. Pay
              once, download a clean PDF, and get a backup copy by email.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#documents" className="btn-primary">
                Choose a document <IconArrow width={18} height={18} />
              </Link>
              <Link href="/sources" className="btn-secondary">
                See our legal sources
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {['Free live preview', 'No account needed', 'One-time payment'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <IconCheck width={16} height={16} className="text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="documents" className="scroll-mt-20 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Documents</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">Pick a form to get started</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Each generator walks you through the fields that matter, with plain-English hints and a live preview.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {products.map((p) => {
              const Icon = TOOL_ICONS[p.type];
              return (
                <Link
                  key={p.type}
                  href={p.path}
                  className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800 ring-1 ring-navy-100">
                      <Icon width={22} height={22} />
                    </span>
                    <span className="text-sm font-semibold text-navy-950">{formatPrice(p.priceCents)}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-navy-950">{p.name}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-slate-600">{p.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                    Start now <IconArrow width={16} height={16} className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">Three steps. About five minutes.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Fill out the form', 'Answer guided questions on any device. Your progress is kept in this browser tab.'],
              ['Check the live preview', 'See exactly what your finished document will look like before you pay anything.'],
              ['Pay & download', 'Secure Stripe checkout unlocks your clean PDF instantly, plus a backup copy by email.'],
            ].map(([title, text], i) => (
              <li key={title} className="card p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-navy-950">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Trust &amp; security</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
              Built to be checked, not just believed.
            </h2>
            <p className="mt-4 text-slate-600">
              Every template cites the official source it follows — IRS instructions for the W-9, NHTSA odometer rules
              for vehicle sales, and the EPA/HUD lead disclosure rule for leases. Read them yourself on our{' '}
              <Link href="/sources" className="font-medium text-navy-800 underline decoration-navy-200 underline-offset-4">
                Sources &amp; Legal References
              </Link>{' '}
              page.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [IconLock, 'Stripe-secured payments', 'Card details never touch our servers.'],
              [IconShield, 'AES-256 encryption', 'Form answers are encrypted before checkout.'],
              [IconBolt, 'Instant delivery', 'Download immediately; backup copy emailed.'],
              [IconBook, 'Cited sources', 'Official government references for every form.'],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof IconLock;
              return (
                <div key={t as string} className="card p-5">
                  <I width={22} height={22} className="text-navy-700" />
                  <p className="mt-3 font-semibold text-navy-950">{t as string}</p>
                  <p className="mt-1 text-sm text-slate-600">{d as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Guides</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">Know what you&apos;re signing</h2>
            </div>
            <Link href="/guides" className="text-sm font-semibold text-navy-800">
              All guides →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GUIDES.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card group p-6 transition hover:border-navy-200 hover:shadow-lg">
                <p className="text-xs font-medium text-slate-500">{g.readMinutes} min read</p>
                <h3 className="mt-2 font-semibold leading-snug text-navy-950 group-hover:text-navy-700">{g.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-3xl">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">Questions, answered</h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-navy-950 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={faqJsonLd(FAQS)} />
    </>
  );
}
