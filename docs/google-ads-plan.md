# Google Ads plan — usformkit.com

Hand-off for the session that builds the campaign through the Adspirer connector.
Nothing may spend money until the owner has seen the full campaign and said yes.

## Tracking already on the site

- Google Tag Manager `GTM-5KNSS59N` and Meta Pixel `1991823935112166` load on every page
  (`src/components/TrackingScripts.tsx`).
- On a paid `/success` page the site pushes a GA4-style `purchase` event to the dataLayer
  (`ecommerce.value`, `ecommerce.currency`, `ecommerce.transaction_id` = Stripe Checkout
  Session id) and a Meta `Purchase` event (`src/components/PurchaseTracker.tsx`).
- Still to do in GTM (owner's account): a Conversion Linker tag on All Pages, and a
  Google Ads Conversion Tracking tag on Custom Event `purchase` with value
  `ecommerce.value`, transaction id `ecommerce.transaction_id`, currency USD. Then Publish.

## Economics

Prices: Bill of Sale $9.99, Lease $19.99, W-9 $4.99. With typical CPCs of $0.80–$3 and a
3–8% conversion rate, the lease is the only product with a clear chance to be profitable.
Do not advertise the W-9: the IRS form is free, and Google's "government documents and
official services" policy restricts charging for it.

## Campaign

- Type: Search only. Display Network and Search Partners off.
- Location: United States, "Presence: people in your targeted locations". Language: English.
- Budget: $10/day total ($7 Lease, $3 Bill of Sale). Two campaigns, or one with shared budget.
- Bidding: Maximize Clicks with a $1.20 max CPC cap. After 15–30 conversions, switch to
  Maximize Conversion Value.
- Primary conversion: the Google Ads purchase conversion above.

### Ad group: Lease → https://usformkit.com/lease-agreement

Keywords (phrase): "residential lease agreement", "lease agreement form", "rental agreement
form", "month to month lease agreement", "rental lease agreement", "lease agreement template"

Headlines: Residential Lease Agreement · Lease Agreement PDF – $19.99 · Fixed-Term or
Month-to-Month · Free Preview Before You Pay · Ready to Sign in Minutes · No Subscription,
No Account

Descriptions:
- Create a complete landlord-tenant lease: rent, deposit, pets, utilities and more.
- Preview your lease free, then download a ready-to-sign PDF. One-time payment.

### Ad group: Bill of Sale → https://usformkit.com/bill-of-sale

Keywords (phrase): "vehicle bill of sale", "car bill of sale", "auto bill of sale",
"motorcycle bill of sale", "boat bill of sale", "bill of sale form"

Headlines: Vehicle Bill of Sale – $9.99 · Car Bill of Sale in 5 Minutes · Includes Odometer
Disclosure · Free Preview Before You Pay · Fill on Your Phone & Print · No Account Needed

Descriptions:
- Fill out a car or item bill of sale on your phone. Free preview, pay only to download.
- Federal odometer disclosure and optional notary block included. Ready-to-sign PDF.

### Negative keywords (campaign level)

free, gratis, word, docx, sample, example, meaning, definition, lawyer, attorney, jobs,
commercial, car lease, lease a car, equipment, land, apartments, for rent, near me

## Review after 7–14 days

- Add irrelevant search terms as negatives.
- Pause any keyword that spent $15 with no sale.
- Target cost per conversion: under $19 (Lease), under $9 (Bill of Sale). If Bill of Sale
  can't get there, pause it and move its budget to Lease.
