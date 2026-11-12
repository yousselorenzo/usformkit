import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { BillOfSaleGenerator } from '@/components/generator/BillOfSaleGenerator';

export const metadata: Metadata = {
  title: 'Bill of Sale Generator — Vehicle & General Bill of Sale PDF',
  description:
    'Create a vehicle or general bill of sale online with federal odometer disclosure, "as is" terms and optional notary block. Live preview, instant PDF download.',
  alternates: { canonical: '/bill-of-sale' },
  keywords: ['bill of sale', 'vehicle bill of sale', 'car bill of sale', 'bill of sale template', 'bill of sale PDF'],
};

export default function Page() {
  return (
    <ToolPage
      docType="bill-of-sale"
      h1="Bill of Sale Generator"
      intro="Create a vehicle or general-item bill of sale in minutes. Includes the federal odometer disclosure statement, as-is terms, lien-free representations and an optional notary acknowledgment."
      generator={<BillOfSaleGenerator />}
      included={[
        'Vehicle or general personal property version',
        'Federal odometer disclosure (49 CFR Part 580) with the three mileage statements',
        '"As is" or seller-condition clause',
        "Seller's ownership and lien-free representations",
        'Buyer and seller signature blocks, plus optional notary acknowledgment',
        'Clean US Letter PDF ready to print and sign',
      ]}
      faqs={[
        {
          q: 'Is a bill of sale the same as a title?',
          a: 'No. The certificate of title is the official proof of ownership. A bill of sale is the receipt that documents the transaction, price and terms. Most private vehicle sales use both.',
        },
        {
          q: 'Do I need a notary?',
          a: 'Most states do not require a notarized bill of sale, but some do for certain transactions. Add the notary block if your state, buyer or lender asks for it.',
        },
        {
          q: 'Can I use this for a boat, trailer or motorcycle?',
          a: 'Yes. Use the Vehicle option and enter the hull or VIN number. For items without a VIN, use the General item option.',
        },
      ]}
    />
  );
}
