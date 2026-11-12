import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { LeaseGenerator } from '@/components/generator/LeaseGenerator';

export const metadata: Metadata = {
  title: 'Residential Lease Agreement Generator — Rental Lease Template PDF',
  description:
    'Create a residential lease agreement online: fixed-term or month-to-month, rent, security deposit, pets, utilities and the federal lead-based paint disclosure. Instant PDF.',
  alternates: { canonical: '/lease-agreement' },
  keywords: ['residential lease agreement', 'rental agreement template', 'lease agreement PDF', 'month to month lease', 'landlord tenant lease'],
};

export default function Page() {
  return (
    <ToolPage
      docType="lease"
      h1="Residential Lease Agreement Generator"
      intro="Build a complete fixed-term or month-to-month lease for a house, apartment or condo. State-law placeholders keep deposit and notice terms aligned with where the property is."
      generator={<LeaseGenerator />}
      included={[
        'Fixed-term or month-to-month lease with holdover clause',
        'Rent, late fees, prorating and security deposit terms',
        'Utilities, maintenance, landlord entry, pets, smoking and subletting clauses',
        'Federal lead-based paint disclosure for pre-1978 housing (40 CFR Part 745)',
        'Fair housing statement, severability and governing-law clauses',
        'Signature blocks for the landlord and every tenant',
      ]}
      faqs={[
        {
          q: 'Will this lease work in my state?',
          a: 'The lease uses terms common across the US and defers to your state\'s law for deposit return, notice and late-fee limits. Some states and cities require extra disclosures, so check local rules.',
        },
        {
          q: 'Can I add my own clauses?',
          a: 'Yes. Use the Additional terms field for things like parking, yard care or HOA rules.',
        },
        {
          q: 'Do both tenants need to sign?',
          a: 'Every adult occupant should be named and sign, which makes each one responsible for the full rent.',
        },
      ]}
    />
  );
}
