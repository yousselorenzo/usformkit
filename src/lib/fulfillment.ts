import 'server-only';
import type Stripe from 'stripe';
import { fromMetadata, openPayload } from './crypto';
import { buildDocument } from './documents';
import { adminEmail, customerEmail, sendEmail } from './email';
import { renderPdf } from './pdf/render';
import { PRODUCTS, isDocType } from './products';
import { SCHEMAS } from './schemas';
import { absoluteUrl } from './site';
import { getStripe } from './stripe';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const downloadWindowDays = () => Number(process.env.DOWNLOAD_WINDOW_DAYS || 30);

/** Decrypts the order's form data from Stripe metadata and renders the final PDF. */
export async function materialize(session: Stripe.Checkout.Session) {
  const docType = session.metadata?.doc_type;
  if (!isDocType(docType)) throw new HttpError(400, 'Unknown document type.');
  const json = openPayload(fromMetadata(session.metadata));
  const data = SCHEMAS[docType].parse(JSON.parse(json));
  const model = buildDocument(docType, data, { preview: false });
  const pdf = await renderPdf(model, { reference: session.id.slice(-10).toUpperCase() });
  const date = new Date(session.created * 1000).toISOString().slice(0, 10);
  return { docType, product: PRODUCTS[docType], pdf, filename: `us-form-kit-${docType}-${date}.pdf` };
}

export async function getPaidSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') throw new HttpError(402, 'Payment has not been completed.');
  if (Date.now() / 1000 - session.created > downloadWindowDays() * 86400)
    throw new HttpError(410, 'This download link has expired. Contact support for a new copy.');
  return session;
}

/** Idempotent order fulfillment, called from the Stripe webhook. */
export async function fulfillOrder(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
  if (session.payment_status !== 'paid') return;

  const pi = typeof session.payment_intent === 'object' ? session.payment_intent : null;
  if (pi?.metadata?.fulfilled_at) return; // already delivered (Stripe retries webhooks)

  const { product, pdf, filename } = await materialize(session);
  const email = session.customer_details?.email || '';
  const downloadUrl = absoluteUrl(`/success?session_id=${session.id}`);
  const attach = !product.sensitive || process.env.ATTACH_SENSITIVE_PDFS !== 'false';

  if (email) {
    const msg = customerEmail({ productName: product.name, downloadUrl, attached: attach, days: downloadWindowDays() });
    await sendEmail({
      to: email,
      ...msg,
      attachments: attach ? [{ filename, content: Buffer.from(pdf).toString('base64') }] : undefined,
    });
  }

  if (pi) {
    await stripe.paymentIntents.update(pi.id, {
      metadata: { fulfilled_at: new Date().toISOString(), doc_type: product.type },
    });
  }

  // Admin notification never includes the PDF (it may contain an SSN/EIN).
  try {
    const amount = ((session.amount_total ?? 0) / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: (session.currency || 'usd').toUpperCase(),
    });
    const to = process.env.ADMIN_NOTIFICATION_EMAIL || 'vitalika.limited@gmail.com';
    await sendEmail({
      to,
      ...adminEmail({ productName: product.name, amount, customerEmail: email, sessionId: session.id, livemode: session.livemode }),
    });
  } catch (err) {
    console.error('[fulfillment] admin notification failed', err);
  }
}
