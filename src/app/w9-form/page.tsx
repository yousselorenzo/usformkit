import type { Metadata } from 'next';
import { ToolPage } from '@/components/ToolPage';
import { W9Generator } from '@/components/generator/W9Generator';

export const metadata: Metadata = {
  title: 'W-9 Form Generator — Fill Out a W-9 Online (Substitute Form W-9)',
  description:
    'Fill out a W-9 online for clients in minutes. Substitute Form W-9 with the March 2024 IRS content, TIN, tax classification and certification. Secure, encrypted, instant PDF.',
  alternates: { canonical: '/w9-form' },
  keywords: ['W-9 form', 'fill out W-9 online', 'W-9 for independent contractor', 'substitute W-9', 'request for taxpayer identification number'],
};

export default function Page() {
  return (
    <ToolPage
      docType="w9"
      h1="W-9 Form Generator"
      intro="Complete a Request for Taxpayer Identification Number and Certification for your clients. Your SSN or EIN is masked in the preview and encrypted before checkout."
      generator={<W9Generator />}
      included={[
        'Substitute Form W-9 with the content and certification language of IRS Form W-9 (Rev. March 2024)',
        'Lines 1–7, including line 3b for pass-through entities',
        'Part I TIN (SSN, ITIN or EIN) and Part II certification',
        'Automatic cross-out of certification item 2 when you are subject to backup withholding',
        'Signature and date block',
      ]}
      faqs={[
        {
          q: 'Is the official W-9 free?',
          a: 'Yes — the IRS publishes Form W-9 free at IRS.gov. US Form Kit charges for the guided experience, the clean substitute PDF and email delivery.',
        },
        {
          q: 'Will clients accept a substitute W-9?',
          a: 'The IRS permits requesters to use substitute forms that are substantially similar to Form W-9 and include its certification. If a client requires their own form, use theirs.',
        },
        {
          q: 'Do you store my SSN?',
          a: 'No database stores it. Your answers are encrypted with AES-256 before checkout so that only our server can decrypt them to generate your PDF.',
        },
      ]}
    />
  );
}
