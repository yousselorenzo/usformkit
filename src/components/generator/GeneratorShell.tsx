'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import type { DocModel } from '@/lib/documents/types';
import { PRODUCTS, formatPrice, type DocType } from '@/lib/products';
import { IconArrow, IconEye, IconLock, IconMail, IconPencil, IconShield, IconSpinner } from '../Icons';
import { DocumentPreview } from './DocumentPreview';

type Props = {
  docType: DocType;
  doc: DocModel;
  data: unknown;
  validate: () => boolean;
  setServerErrors: (e: Record<string, string>) => void;
  children: ReactNode;
};

export function GeneratorShell({ docType, doc, data, validate, setServerErrors, children }: Props) {
  const product = PRODUCTS[docType];
  const price = formatPrice(product.priceCents);
  const [tab, setTab] = useState<'form' | 'preview'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    setCanceled(new URLSearchParams(window.location.search).get('canceled') === '1');
    // Reset the loading state if the user comes back via the browser back button (bfcache).
    const onShow = (e: PageTransitionEvent) => e.persisted && setLoading(false);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const focusFirstError = () =>
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>('[data-error="true"]');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.querySelector<HTMLElement>('input,select,textarea,button')?.focus({ preventScroll: true });
    }, 60);

  async function checkout() {
    setError(null);
    if (!validate()) {
      setTab('form');
      setError('Please complete the highlighted fields.');
      focusFirstError();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, data }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string; fields?: Record<string, string> };
      if (json.fields) {
        setServerErrors(json.fields);
        setTab('form');
        focusFirstError();
      }
      if (!res.ok || !json.url) throw new Error(json.error || 'Unable to start checkout.');
      window.location.assign(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const PayButton = ({ className = '' }: { className?: string }) => (
    <button type="button" onClick={checkout} disabled={loading} className={`btn-primary ${className}`}>
      {loading ? <IconSpinner /> : <IconLock width={18} height={18} />}
      {loading ? 'Opening secure checkout…' : `Pay ${price} & download`}
    </button>
  );

  return (
    <>
      <div className="container-x pb-36 lg:pb-20">
        {canceled && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Checkout was cancelled — your answers are saved in this tab. You can pick up where you left off.
          </div>
        )}

        {/* Mobile tab switcher */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur-xl lg:hidden">
          <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {(
              [
                ['form', 'Fill out', IconPencil],
                ['preview', 'Preview', IconEye],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={tab === key}
                onClick={() => {
                  setTab(key);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition ${
                  tab === key ? 'bg-white text-navy-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'
                }`}
              >
                <Icon width={16} height={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-8 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
          <div className={tab === 'form' ? 'block' : 'hidden lg:block'}>
            <div className="space-y-4">{children}</div>
            <button type="button" onClick={() => setTab('preview')} className="btn-secondary mt-5 w-full lg:hidden">
              <IconEye width={18} height={18} /> Review the preview
            </button>
          </div>

          <aside className={tab === 'preview' ? 'block' : 'hidden lg:block'}>
            <div className="space-y-4 lg:sticky lg:top-24">
              <DocumentPreview doc={doc} />
              <div className="card hidden p-5 lg:block">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-navy-950">{product.name}</p>
                  <p className="text-xl font-semibold tracking-tight text-navy-950">{price}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">One-time payment · No subscription · Instant PDF</p>
                {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
                <PayButton className="mt-4 w-full" />
                <TrustRow />
              </div>
              <div className="lg:hidden">
                <TrustRow />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Native-style bottom action bar (mobile) */}
      <div data-action-bar className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-safe pt-3 shadow-[0_-8px_24px_-12px_rgba(14,28,54,0.15)] backdrop-blur-xl lg:hidden">
        <div className="container-x">
          {error && <p className="mb-2 text-center text-[13px] text-red-600" role="alert">{error}</p>}
          <div className="flex items-center gap-3">
            <div className="min-w-0 shrink-0">
              <p className="text-lg font-semibold leading-none tracking-tight text-navy-950">{price}</p>
              <p className="mt-1 text-[11px] text-slate-500">One-time · PDF</p>
            </div>
            {tab === 'form' ? (
              <button type="button" onClick={() => setTab('preview')} className="btn-primary flex-1 px-3">
                Preview document <IconArrow width={18} height={18} />
              </button>
            ) : (
              <PayButton className="flex-1 px-3" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TrustRow() {
  const items = [
    { Icon: IconLock, text: 'Secure checkout by Stripe' },
    { Icon: IconShield, text: 'Encrypted form data' },
    { Icon: IconMail, text: 'Backup copy emailed' },
  ];
  return (
    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
      {items.map(({ Icon, text }) => (
        <p key={text} className="flex items-center gap-2 text-[13px] text-slate-600">
          <Icon width={16} height={16} className="text-navy-500" /> {text}
        </p>
      ))}
      <p className="pt-1 text-[12px] leading-relaxed text-slate-500">
        By purchasing you agree to our <Link href="/terms" className="underline">Terms</Link> and{' '}
        <Link href="/refund-policy" className="underline">Refund Policy</Link>.
      </p>
    </div>
  );
}
