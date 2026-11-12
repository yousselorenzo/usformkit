import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'When and how US Form Kit refunds document purchases.',
  alternates: { canonical: '/refund-policy' },
};

export default function Page() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Because every document is shown in a full live preview before you pay and is delivered instantly, purchases are generally final. We still want you to be satisfied, so we refund in the situations below."
    >
      <h2>We will refund you if</h2>
      <ul>
        <li>You were charged but could not download your document, and we cannot fix it within 48 hours.</li>
        <li>You were charged more than once for the same document.</li>
        <li>The PDF is materially different from the preview you saw before paying.</li>
        <li>A technical error on our side made the document unusable.</li>
      </ul>

      <h2>We generally do not refund</h2>
      <ul>
        <li>Documents downloaded and used after purchase.</li>
        <li>Mistakes in the information you entered (we&apos;re happy to help you regenerate a corrected copy).</li>
        <li>A change of mind, or a counterparty or agency preferring a different form.</li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> within 14 days of purchase with the email
        address used at checkout and a short description of the problem. Approved refunds are issued to the original
        payment method through Stripe and usually appear within 5–10 business days.
      </p>

      <h2>Corrections</h2>
      <p>
        Made a typo? Contact us within 14 days and, where reasonable, we will help you produce a corrected copy at no
        extra charge.
      </p>
    </LegalPage>
  );
}
