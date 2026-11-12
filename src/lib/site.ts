export const SITE = {
  name: 'US Form Kit',
  domain: 'usformkit.com',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://usformkit.com').replace(/\/$/, ''),
  supportEmail: 'vitalika.limited@gmail.com',
  tagline: 'Clean, ready-to-sign US legal & tax forms in minutes.',
  description:
    'Create a Bill of Sale, a W-9 (Request for Taxpayer Identification Number), or a Residential Lease Agreement online. Live preview, secure Stripe checkout, instant PDF download.',
  disclaimer:
    'Disclaimer: US Form Kit is not a law firm. Documents are templates for informational purposes only.',
  // Update when the legal pages change.
  legalUpdated: 'November 11, 2026',
} as const;

export const absoluteUrl = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
