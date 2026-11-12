import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IconArrow, IconCheck } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from '@/components/JsonLd';
import { GUIDES, getGuide, type GuideNode } from '@/lib/guides';
import { PRODUCTS, formatPrice } from '@/lib/products';
import { SITE, absoluteUrl } from '@/lib/site';

type Params = { params: { slug: string } };

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const g = getGuide(params.slug);
  if (!g) return {};
  const url = `/guides/${g.slug}`;
  return {
    title: { absolute: `${g.metaTitle} | US Form Kit` },
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: g.metaTitle, description: g.description, publishedTime: g.published, modifiedTime: g.updated },
  };
}

function Node({ n }: { n: GuideNode }) {
  if (typeof n === 'string') return <p>{n}</p>;
  if ('h3' in n) return <h3>{n.h3}</h3>;
  if ('ul' in n)
    return (
      <ul>
        {n.ul.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    );
  if ('ol' in n)
    return (
      <ol>
        {n.ol.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>
    );
  return (
    <div className="my-6 rounded-xl border border-navy-100 bg-navy-50/60 px-5 py-4 text-[15.5px] leading-relaxed text-navy-900">
      {n.callout}
    </div>
  );
}

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function GuidePage({ params }: Params) {
  const g = getGuide(params.slug);
  if (!g) notFound();
  const product = PRODUCTS[g.tool];
  const related = GUIDES.filter((x) => x.slug !== g.slug);
  const url = absoluteUrl(`/guides/${g.slug}`);

  const Cta = ({ compact = false }: { compact?: boolean }) => (
    <div className={`rounded-2xl bg-navy-950 text-white ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <p className="text-sm font-medium text-navy-200">Ready when you are</p>
      <p className={`mt-1 font-semibold leading-snug ${compact ? 'text-base' : 'text-xl'}`}>
        Create your {product.shortName} with a free live preview
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-navy-100">
        {['Guided, plain-English fields', 'Watermarked preview before you pay', `${formatPrice(product.priceCents)} one-time · instant PDF`].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <IconCheck width={16} height={16} className="text-emerald-400" /> {t}
          </li>
        ))}
      </ul>
      <Link href={product.path} className="btn mt-5 w-full bg-white text-navy-950 hover:bg-navy-50">
        Start your {product.shortName} <IconArrow width={18} height={18} />
      </Link>
    </div>
  );

  return (
    <>
      <article className="container-x py-10 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-[13px] text-slate-500">
              <Link href="/" className="hover:text-navy-900">Home</Link> <span className="mx-1">/</span>
              <Link href="/guides" className="hover:text-navy-900">Guides</Link>
            </nav>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-tight text-navy-950 sm:text-5xl">{g.title}</h1>
            <p className="mt-4 text-sm text-slate-500">
              Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {g.readMinutes} min read · By the {SITE.name} editorial team
            </p>

            <div className="prose-guide mt-8">
              <p className="text-lg text-slate-700">{g.intro}</p>

              <nav aria-label="On this page" className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 not-italic">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">On this page</p>
                <ol className="!my-3 !pl-5 text-[15px]">
                  {g.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.h2}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#faq">Frequently asked questions</a>
                  </li>
                </ol>
              </nav>

              {g.sections.map((s, i) => (
                <section key={s.id}>
                  <h2 id={s.id}>{s.h2}</h2>
                  {s.body.map((n, j) => (
                    <Node key={j} n={n} />
                  ))}
                  {i === 2 && (
                    <div className="not-prose my-10 lg:hidden">
                      <Cta compact />
                    </div>
                  )}
                </section>
              ))}

              <h2 id="faq">Frequently asked questions</h2>
              {g.faqs.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}

              <p className="mt-10 rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                This guide is general information, not legal or tax advice. Rules change and vary by state; check the
                official sources listed on our <Link href="/sources">Sources &amp; Legal References</Link> page or
                consult a licensed professional.
              </p>
            </div>

            <div className="mt-12">
              <Cta />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <Cta compact />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Related guides</p>
                <ul className="mt-3 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/guides/${r.slug}`} className="text-[15px] font-medium leading-snug text-navy-900 hover:text-navy-600">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: g.title,
            description: g.description,
            datePublished: g.published,
            dateModified: g.updated,
            mainEntityOfPage: url,
            author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.svg') } },
            keywords: g.keywords.join(', '),
          },
          faqJsonLd(g.faqs),
          breadcrumbJsonLd([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Guides', url: absoluteUrl('/guides') },
            { name: g.title, url },
          ]),
        ]}
      />
    </>
  );
}
