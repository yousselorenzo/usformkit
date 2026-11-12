import Link from 'next/link';
import type { ReactNode } from 'react';
import { guideForTool } from '@/lib/guides';
import { PRODUCTS, type DocType } from '@/lib/products';
import { absoluteUrl } from '@/lib/site';
import { IconArrow, IconBook } from './Icons';
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from './JsonLd';

type Props = {
  docType: DocType;
  h1: string;
  intro: string;
  generator: ReactNode;
  included: string[];
  faqs: { q: string; a: string }[];
};

export function ToolPage({ docType, h1, intro, generator, included, faqs }: Props) {
  const p = PRODUCTS[docType];
  const guide = guideForTool(docType);
  return (
    <>
      <div className="border-b border-slate-200 bg-gradient-to-b from-navy-50/60 to-white">
        <div className="container-x py-7 sm:py-10">
          <nav aria-label="Breadcrumb" className="text-[13px] text-slate-500">
            <Link href="/" className="hover:text-navy-900">Home</Link> <span className="mx-1">/</span> {p.shortName}
          </nav>
          <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-navy-950 sm:text-4xl">{h1}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">{intro}</p>
        </div>
      </div>

      <div className="pt-0 lg:pt-8">{generator}</div>

      <section className="border-t border-slate-200 bg-slate-50/70 py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-navy-950">What&apos;s included</h2>
            <ul className="mt-5 space-y-3">
              {included.map((i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                  {i}
                </li>
              ))}
            </ul>
            <Link href={`/guides/${guide.slug}`} className="card mt-8 flex items-center gap-4 p-5 transition hover:border-navy-200">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                <IconBook />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-slate-500">Free guide</span>
                <span className="block font-semibold leading-snug text-navy-950">{guide.title}</span>
              </span>
              <IconArrow className="shrink-0 text-slate-400" />
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-navy-950">Frequently asked questions</h2>
            <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy-950 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2.5 leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${p.name} Generator`,
            description: p.description,
            brand: { '@type': 'Brand', name: 'US Form Kit' },
            url: absoluteUrl(p.path),
            offers: {
              '@type': 'Offer',
              price: (p.priceCents / 100).toFixed(2),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: absoluteUrl(p.path),
            },
          },
          faqJsonLd(faqs),
          breadcrumbJsonLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: p.shortName, url: absoluteUrl(p.path) },
          ]),
        ]}
      />
    </>
  );
}
