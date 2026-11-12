import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.includes('REPLACE_ME')) {
      throw new Error('STRIPE_SECRET_KEY is not configured. Add it to your environment variables.');
    }
    client = new Stripe(key, {
      typescript: true,
      appInfo: { name: 'US Form Kit', url: 'https://usformkit.com' },
    });
  }
  return client;
}

export const isCheckoutSessionId = (id: string | null | undefined): id is string =>
  !!id && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id);
