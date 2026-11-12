'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type Props = {
  /** Stripe Checkout Session id, used as the order id so a purchase is never counted twice. */
  transactionId: string;
  /** Amount actually paid, in major units (e.g. 9.99). */
  value: number;
  currency: string;
  itemId: string;
  itemName: string;
};

/**
 * Reports a completed purchase once:
 * - to Google Tag Manager as a GA4-style `purchase` event (set up GA4 / Google Ads
 *   conversion tags in GTM that fire on the custom event "purchase");
 * - to the Meta Pixel as a `Purchase` event.
 * A reload of the success page, or opening it again from the email link, does not
 * send it again.
 */
export function PurchaseTracker({ transactionId, value, currency, itemId, itemName }: Props) {
  useEffect(() => {
    const key = `purchase_tracked_${transactionId}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch {
      // Storage blocked: still report; GA4 and Meta also dedupe by transaction / event id.
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: transactionId,
        value,
        currency,
        items: [{ item_id: itemId, item_name: itemName, price: value, quantity: 1 }],
      },
    });

    window.fbq?.(
      'track',
      'Purchase',
      { value, currency, content_ids: [itemId], content_name: itemName, content_type: 'product' },
      { eventID: transactionId },
    );
  }, [transactionId, value, currency, itemId, itemName]);

  return null;
}
