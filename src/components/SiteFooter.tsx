import Link from 'next/link';
import { GUIDES } from '@/lib/guides';
import { PRODUCTS } from '@/lib/products';
import { SITE } from '@/lib/site';
import { LogoMark } from './Logo';

export function SiteFooter() {
  const cols = [
    {
      title: 'Documents',
      links: Object.values(PRODUCTS).map((p) => ({ href: p.path, label: p.shortName })),
    },
    {
      title: 'Guides',
      links: GUIDES.map((g) => ({ href: `/guides/${g.slug}`, label: g.navTitle })),
    },
    {
      title: 'Company',
      links: [
        { href: '/sources', label: 'Sources & Legal References' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/refund-policy', label: 'Refund Policy' },
      ],
    },
  ];

  return (
    <footer className="no-print border-t border-slate-200 bg-slate-50/60">
      <div className="container-x py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="font-semibold text-navy-950">{SITE.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">{SITE.tagline}</p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-4 inline-flex text-sm font-medium text-navy-700 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
            >
              {SITE.supportEmail}
            </a>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{c.title}</h2>
              <ul className="mt-3 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-700 hover:text-navy-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
            <strong className="font-semibold text-slate-800">Disclaimer:</strong> US Form Kit is not a law firm.
            Documents are templates for informational purposes only.
          </p>
          <p className="mt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} {SITE.name}. Payments are processed securely by Stripe. IRS, DMV and other
            agency names are used for reference only; US Form Kit is not affiliated with any government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
