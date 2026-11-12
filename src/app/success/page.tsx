import type { Metadata } from 'next';
import Link from 'next/link';
import { PurchaseTracker } from '@/components/PurchaseTracker';
import { IconCheck, IconDownload, IconEye, IconMail, IconSpinner } from '@/components/Icons';
import { downloadWindowDays } from '@/lib/fulfillment';
import { PRODUCTS, isDocType } from '@/lib/products';
import { SITE } from '@/lib/site';
import { getStripe, isCheckoutSessionId } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your document', robots: { index: false, follow: false } };

type State =
  | {
      kind: 'paid';
      product: string;
      docType: string;
      email: string | null;
      id: string;
      expired: boolean;
      amount: number;
      currency: string;
    }
  | { kind: 'pending'; id: string }
  | { kind: 'invalid' };

async function load(id: string | undefined): Promise<State> {
  if (!isCheckoutSessionId(id)) return { kind: 'invalid' };
  try {
    const s = await getStripe().checkout.sessions.retrieve(id);
    if (s.payment_status !== 'paid') return { kind: 'pending', id };
    const docType = s.metadata?.doc_type;
    return {
      kind: 'paid',
      id,
      product: isDocType(docType) ? PRODUCTS[docType].name : 'document',
      docType: isDocType(docType) ? docType : 'document',
      amount: (s.amount_total ?? 0) / 100,
      currency: (s.currency ?? 'usd').toUpperCase(),
      email: s.customer_details?.email ?? null,
      expired: Date.now() / 1000 - s.created > downloadWindowDays() * 86400,
    };
  } catch {
    return { kind: 'invalid' };
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const state = await load(searchParams.session_id);

  return (
    <div className="container-x flex min-h-[70vh] max-w-xl flex-col justify-center py-12">
      {state.kind === 'paid' && !state.expired && (
        <div className="card p-6 text-center sm:p-10">
          <PurchaseTracker
            transactionId={state.id}
            value={state.amount}
            currency={state.currency}
            itemId={state.docType}
            itemName={state.product}
          />
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <IconCheck width={28} height={28} />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">Payment confirmed</h1>
          <p className="mt-2 text-slate-600">Your {state.product} is unlocked and ready to download.</p>
          <div className="mt-8 grid gap-3">
            <a href={`/api/download?session_id=${state.id}`} className="btn-primary w-full">
              <IconDownload width={18} height={18} /> Download PDF
            </a>
            <a href={`/api/download?session_id=${state.id}&view=1`} target="_blank" rel="noopener" className="btn-secondary w-full">
              <IconEye width={18} height={18} /> Open in browser
            </a>
          </div>
          {state.email && (
            <p className="mt-6 flex items-start justify-center gap-2 text-sm text-slate-500">
              <IconMail width={16} height={16} className="mt-0.5 shrink-0" />
              <span>
                A backup copy is on its way to <strong className="font-medium text-slate-700">{state.email}</strong>.
              </span>
            </p>
          )}
          <div className="mt-8 rounded-xl bg-slate-50 p-4 text-left text-sm leading-relaxed text-slate-600">
            <p className="font-medium text-slate-800">Next steps</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Review every field carefully.</li>
              <li>Print and sign where indicated (with a notary if your state requires it).</li>
              <li>Give each party a signed copy and keep one for your records.</li>
            </ol>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Bookmark this page — your link works for {downloadWindowDays()} days. Keep it private.
          </p>
        </div>
      )}

      {state.kind === 'paid' && state.expired && (
        <Message title="This link has expired" body={`Download links are available for ${downloadWindowDays()} days. Email ${SITE.supportEmail} with your receipt and we'll help.`} />
      )}

      {state.kind === 'pending' && (
        <div className="card p-8 text-center">
          <IconSpinner width={28} height={28} className="mx-auto text-navy-700" />
          <h1 className="mt-5 text-2xl font-semibold text-navy-950">Confirming your payment…</h1>
          <p className="mt-2 text-slate-600">
            Some payment methods take a little longer. Refresh in a moment — we&apos;ll also email you as soon as it clears.
          </p>
          <a href={`/success?session_id=${state.id}`} className="btn-secondary mt-6 w-full">
            Refresh
          </a>
        </div>
      )}

      {state.kind === 'invalid' && (
        <Message title="We couldn't find that order" body={`Check the link in your confirmation email, or contact ${SITE.supportEmail}.`} />
      )}
    </div>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-8 text-center">
      <h1 className="text-2xl font-semibold text-navy-950">{title}</h1>
      <p className="mt-2 text-slate-600">{body}</p>
      <Link href="/" className="btn-secondary mt-6 w-full">
        Back to home
      </Link>
    </div>
  );
}
