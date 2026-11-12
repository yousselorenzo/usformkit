import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { fulfillOrder } from '@/lib/fulfillment';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Configure in Stripe Dashboard → Developers → Webhooks:
 *   Endpoint: https://usformkit.com/api/webhooks/stripe
 *   Events:   checkout.session.completed, checkout.session.async_payment_succeeded
 */
export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') {
      try {
        await fulfillOrder(session.id);
      } catch (err) {
        console.error('[webhook] fulfillment failed', session.id, err);
        // Non-2xx makes Stripe retry with backoff.
        return NextResponse.json({ error: 'Fulfillment failed.' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
