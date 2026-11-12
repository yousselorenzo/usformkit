export type DocType = 'bill-of-sale' | 'w9' | 'lease';

export type Product = {
  type: DocType;
  name: string;
  shortName: string;
  path: string;
  /** Price in US cents. Edit here to change pricing site-wide. */
  priceCents: number;
  tagline: string;
  description: string;
  sensitive: boolean;
};

export const PRODUCTS: Record<DocType, Product> = {
  'bill-of-sale': {
    type: 'bill-of-sale',
    name: 'Bill of Sale',
    shortName: 'Bill of Sale',
    path: '/bill-of-sale',
    priceCents: 999,
    tagline: 'Vehicle or general item sale, with federal odometer disclosure.',
    description:
      'Record the transfer of a car, truck, motorcycle, boat or any personal item between a buyer and a seller.',
    sensitive: false,
  },
  w9: {
    type: 'w9',
    name: 'Form W-9 (Substitute)',
    shortName: 'W-9',
    path: '/w9-form',
    priceCents: 499,
    tagline: 'Request for Taxpayer Identification Number and Certification.',
    description:
      'Give clients a clean, completed W-9 with your TIN, tax classification and the IRS certification language.',
    sensitive: true,
  },
  lease: {
    type: 'lease',
    name: 'Residential Lease Agreement',
    shortName: 'Lease Agreement',
    path: '/lease-agreement',
    priceCents: 1999,
    tagline: 'Fixed-term or month-to-month residential lease.',
    description:
      'A complete landlord-tenant lease covering rent, deposit, utilities, pets, entry and federal lead-based paint disclosure.',
    sensitive: false,
  },
};

export const DOC_TYPES = Object.keys(PRODUCTS) as DocType[];

export const isDocType = (v: unknown): v is DocType =>
  typeof v === 'string' && (DOC_TYPES as string[]).includes(v);

export const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
