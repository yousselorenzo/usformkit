import { NextResponse } from 'next/server';
import { sealPayload, toMetadata } from '@/lib/crypto';
import { PRODUCTS, isDocType } from '@/lib/products';
import { SCHEMAS, issuesToErrors } from '@/lib/schemas';
import { SITE } from '@/lib/site';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 60_000;

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return NextResponse.json({ error: 'Request too large.' }, { status: 413 });

    let body: { docType?: unknown; data?: unknown };
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
    if (!isDocType(body.docType)) return NextResponse.json({ error: 'Unknown document.' }, { status: 400 });

    const docType = body.docType;
    const parsed = SCHEMAS[docType].safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please fix the highlighted fields.', fields: issuesToErrors(parsed.error) },
        { status: 422 },
      );
    }

    const product = PRODUCTS[docType];
    const metadata = { doc_type: docType, ...toMetadata(sealPayload(JSON.stringify(parsed.data))) };

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: product.priceCents,
            product_data: {
              name: `${product.name} — PDF`,
              description: product.tagline,
            },
          },
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata,
      payment_intent_data: { metadata: { doc_type: docType }, description: `US Form Kit — ${product.name}` },
      custom_text: {
        submit: {
          message: `Your PDF unlocks instantly after payment and a backup copy is emailed to you. By paying you agree to the Terms of Service at ${SITE.domain}/terms.`,
        },
      },
      success_url: `${SITE.url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}${product.path}?canceled=1`,
    });

    if (!session.url) throw new Error('Stripe did not return a checkout URL.');
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
