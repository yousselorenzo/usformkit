'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ORDER_KEY, type StoredOrder } from '@/lib/order';
import { PRODUCTS, isDocType } from '@/lib/products';
import { SITE } from '@/lib/site';
import { IconCheck, IconDownload, IconEye, IconSpinner } from './Icons';
import { PurchaseTracker } from './PurchaseTracker';

type State =
  | { kind: 'loading' }
  | { kind: 'missing' }
  | { kind: 'error' }
  | { kind: 'ready'; docType: keyof typeof PRODUCTS; url: string; filename: string; sessionId: string | null };

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export function SuccessClient() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      let order: StoredOrder | null = null;
      try {
        order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
      } catch {
        order = null;
      }
      if (!order || !isDocType(order.docType)) return setState({ kind: 'missing' });

      const id = new URLSearchParams(window.location.search).get('session_id');
      const sessionId = id && SESSION_ID.test(id) ? id : null;

      try {
        const res = await fetch('/api/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docType: order.docType, data: order.data, reference: sessionId }),
        });
        if (!res.ok) throw new Error('render failed');
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10);
        setState({
          kind: 'ready',
          docType: order.docType,
          url: objectUrl,
          filename: `us-form-kit-${order.docType}-${date}.pdf`,
          sessionId,
        });
      } catch {
        if (!cancelled) setState({ kind: 'error' });
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  if (state.kind === 'loading') {
    return (
      <div className="card p-8 text-center">
        <IconSpinner width={28} height={28} className="mx-auto text-navy-700" />
        <h1 className="mt-5 text-2xl font-semibold text-navy-950">Preparing your document…</h1>
      </div>
    );
  }

  if (state.kind === 'missing' || state.kind === 'error') {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-semibold text-navy-950">
          {state.kind === 'missing' ? "We couldn't find your answers" : "We couldn't build your document"}
        </h1>
        <p className="mt-2 text-slate-600">
          {state.kind === 'missing'
            ? 'Your answers are only kept in the browser tab you used to pay. If you paid in a different tab or device, '
            : 'Please try again in a moment. If it keeps failing, '}
          email <a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> with your Stripe
          receipt and we&apos;ll send your document.
        </p>
        <Link href="/" className="btn-secondary mt-6 w-full">
          Back to home
        </Link>
      </div>
    );
  }

  const product = PRODUCTS[state.docType];
  return (
    <div className="card p-6 text-center sm:p-10">
      {state.sessionId && (
        <PurchaseTracker
          transactionId={state.sessionId}
          value={product.priceCents / 100}
          currency="USD"
          itemId={product.type}
          itemName={product.name}
        />
      )}
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <IconCheck width={28} height={28} />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">Thank you</h1>
      <p className="mt-2 text-slate-600">Your {product.name} is ready to download.</p>
      <div className="mt-8 grid gap-3">
        <a href={state.url} download={state.filename} className="btn-primary w-full">
          <IconDownload width={18} height={18} /> Download PDF
        </a>
        <a href={state.url} target="_blank" rel="noopener" className="btn-secondary w-full">
          <IconEye width={18} height={18} /> Open in browser
        </a>
      </div>
      <div className="mt-8 rounded-xl bg-slate-50 p-4 text-left text-sm leading-relaxed text-slate-600">
        <p className="font-medium text-slate-800">Next steps</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Review every field carefully.</li>
          <li>Print and sign where indicated (with a notary if your state requires it).</li>
          <li>Give each party a signed copy and keep one for your records.</li>
        </ol>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Download your PDF now: it is only available in this browser tab. Stripe emails your receipt. Questions? Email{' '}
        {SITE.supportEmail}.
      </p>
    </div>
  );
}
