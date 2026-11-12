import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrow } from '@/components/Icons';
import { GUIDES } from '@/lib/guides';
import { PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Guides — W-9, Bill of Sale & Lease Agreement Explained',
  description:
    'Plain-English guides to common US forms: how to fill out a W-9 as a contractor, what a vehicle bill of sale is, and the essentials of a residential lease agreement.',
  alternates: { canonical: '/guides' },
};

export default function GuidesIndex() {
  return (
    <div className="container-x py-12 sm:py-20">
      <p className="eyebrow">Resources</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-5xl">Guides</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
        Clear, sourced explanations of the forms Americans sign every day — written so you know exactly what you are
        filling out and why.
      </p>
      <div className="mt-10 grid gap-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="card group flex flex-col gap-3 p-6 transition hover:border-navy-200 hover:shadow-lg sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">
                {PRODUCTS[g.tool].shortName} · {g.readMinutes} min read
              </p>
              <h2 className="mt-1.5 text-xl font-semibold leading-snug text-navy-950 group-hover:text-navy-700">{g.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{g.description}</p>
            </div>
            <IconArrow className="hidden shrink-0 text-slate-400 transition group-hover:translate-x-1 sm:block" />
          </Link>
        ))}
      </div>
    </div>
  );
}
