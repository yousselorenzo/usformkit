import { z } from 'zod';
import type { DocType } from './products';

const req = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);
const opt = (max = 200) => z.string().trim().max(max, 'Too long');
const date = (label: string) => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, `${label} is required`);
const amount = (label: string) =>
  z
    .string()
    .transform((s) => s.replace(/[,$\s]/g, ''))
    .pipe(z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, `Enter ${label.toLowerCase()} as a number, e.g. 1500`));
const optAmount = () =>
  z
    .string()
    .transform((s) => s.replace(/[,$\s]/g, ''))
    .pipe(z.string().regex(/^(\d{1,8}(\.\d{1,2})?)?$/, 'Enter a number, e.g. 250'));

/* ─────────────────────────── Bill of Sale ─────────────────────────── */

export const billOfSaleSchema = z
  .object({
    itemType: z.enum(['vehicle', 'general']),
    saleState: req('State of sale', 40),
    saleDate: date('Sale date'),
    price: amount('Sale price'),
    paymentMethod: opt(60),
    sellerName: req('Seller name'),
    sellerAddress: req('Seller address', 240),
    sellerPhone: opt(30),
    buyerName: req('Buyer name'),
    buyerAddress: req('Buyer address', 240),
    buyerPhone: opt(30),
    vehicleYear: opt(4),
    vehicleMake: opt(60),
    vehicleModel: opt(60),
    vehicleBody: opt(60),
    vehicleColor: opt(40),
    vehicleVin: opt(17),
    vehicleOdometer: opt(12),
    odometerStatus: z.enum(['actual', 'exceeds', 'not_actual']),
    itemDescription: opt(1200),
    itemSerial: opt(80),
    asIs: z.boolean(),
    includeNotary: z.boolean(),
  })
  .superRefine((d, ctx) => {
    const need = (path: keyof typeof d, msg: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: msg });
    if (d.itemType === 'vehicle') {
      if (!/^(19|20)\d{2}$/.test(d.vehicleYear)) need('vehicleYear', 'Enter a 4-digit year');
      if (!d.vehicleMake) need('vehicleMake', 'Make is required');
      if (!d.vehicleModel) need('vehicleModel', 'Model is required');
      if (!/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(d.vehicleVin))
        need('vehicleVin', 'VIN must be 11–17 letters/digits (no I, O or Q)');
      if (!/^\d[\d,]{0,10}$/.test(d.vehicleOdometer)) need('vehicleOdometer', 'Enter the odometer reading in miles');
    } else if (!d.itemDescription) {
      need('itemDescription', 'Describe the item being sold');
    }
  });

export type BillOfSaleData = z.input<typeof billOfSaleSchema>;

/* ─────────────────────────────── W-9 ─────────────────────────────── */

export const TAX_CLASSES = {
  individual: 'Individual/sole proprietor',
  c_corp: 'C corporation',
  s_corp: 'S corporation',
  partnership: 'Partnership',
  trust: 'Trust/estate',
  llc: 'Limited liability company (LLC)',
  other: 'Other',
} as const;

export const w9Schema = z
  .object({
    name: req('Name (line 1)'),
    businessName: opt(),
    taxClass: z.enum(['individual', 'c_corp', 's_corp', 'partnership', 'trust', 'llc', 'other']),
    llcClass: z.enum(['', 'C', 'S', 'P']),
    otherClass: opt(80),
    foreignPartners: z.boolean(),
    exemptPayeeCode: opt(4),
    fatcaCode: opt(4),
    address: req('Address (line 5)', 120),
    cityStateZip: req('City, state, and ZIP (line 6)', 120),
    accountNumbers: opt(120),
    requester: opt(240),
    tinType: z.enum(['ssn', 'ein']),
    tin: z.string().transform((s) => s.replace(/\D/g, '')),
    subjectToBackup: z.boolean(),
    signDate: date('Date'),
  })
  .superRefine((d, ctx) => {
    if (d.tin.length !== 9)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tin'],
        message: d.tinType === 'ssn' ? 'Enter a 9-digit SSN or ITIN' : 'Enter a 9-digit EIN',
      });
    if (d.taxClass === 'llc' && !d.llcClass)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['llcClass'], message: 'Select the LLC tax classification' });
    if (d.taxClass === 'other' && !d.otherClass)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherClass'], message: 'Describe the classification' });
  });

export type W9Data = z.input<typeof w9Schema>;

/* ────────────────────────────── Lease ────────────────────────────── */

export const leaseSchema = z
  .object({
    landlordName: req('Landlord name'),
    landlordAddress: req('Landlord notice address', 240),
    landlordContact: opt(120),
    tenantNames: req('At least one tenant', 600),
    propertyAddress: req('Property address', 240),
    propertyState: req('State', 40),
    furnished: z.boolean(),
    termType: z.enum(['fixed', 'month_to_month']),
    startDate: date('Start date'),
    endDate: z.string(),
    noticeDays: z.string().regex(/^\d{1,3}$/, 'Enter a number of days'),
    monthlyRent: amount('Monthly rent'),
    rentDueDay: z.string().regex(/^([1-9]|[12]\d|3[01])$/, 'Enter a day between 1 and 31'),
    paymentMethod: req('Payment method', 120),
    lateFee: optAmount(),
    graceDays: z.string().regex(/^\d{0,2}$/, 'Enter a number of days'),
    securityDeposit: optAmount(),
    maxOccupants: z.string().regex(/^\d{0,2}$/, 'Enter a number'),
    utilitiesTenant: opt(400),
    utilitiesLandlord: opt(400),
    petsAllowed: z.boolean(),
    petDeposit: optAmount(),
    smokingAllowed: z.boolean(),
    builtBefore1978: z.boolean(),
    leadKnowledge: z.enum(['none', 'known']),
    leadDetails: opt(600),
    additionalTerms: opt(3000),
  })
  .superRefine((d, ctx) => {
    if (d.termType === 'fixed') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d.endDate))
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date is required' });
      else if (d.endDate <= d.startDate)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date must be after start date' });
    }
    if (d.builtBefore1978 && d.leadKnowledge === 'known' && !d.leadDetails)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['leadDetails'], message: 'Describe the known lead hazards' });
  });

export type LeaseData = z.input<typeof leaseSchema>;

/* ─────────────────────────────────────────────────────────────────── */

export const SCHEMAS = {
  'bill-of-sale': billOfSaleSchema,
  w9: w9Schema,
  lease: leaseSchema,
} satisfies Record<DocType, z.ZodTypeAny>;

/** Flatten zod issues into { field: firstMessage }. */
export function issuesToErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
