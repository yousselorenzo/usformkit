import type { ReactNode } from 'react';
import { SITE } from '@/lib/site';

export function LegalPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-12 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-slate-500">Last updated {SITE.legalUpdated}</p>
      {intro && <p className="mt-6 text-lg leading-relaxed text-slate-600">{intro}</p>}
      <div className="prose-guide mt-6">{children}</div>
      <p className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Questions about this policy? Email{' '}
        <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-navy-800 underline">
          {SITE.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
