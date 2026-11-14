import type { DocType } from './products';

/** sessionStorage key holding the answers a customer entered before paying via a Stripe Payment Link. */
export const ORDER_KEY = 'usfk:order';

export type StoredOrder = { docType: DocType; data: unknown; savedAt: number };
