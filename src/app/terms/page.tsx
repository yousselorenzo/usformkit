import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of US Form Kit and the documents you purchase.',
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These Terms of Service ("Terms") govern your use of ${SITE.domain} and the documents you purchase from US Form Kit ("we", "us"). By using the site or buying a document, you agree to these Terms.`}
    >
      <h2>1. Not a law firm; no legal advice</h2>
      <p>
        <strong>US Form Kit is not a law firm, and documents are templates for informational purposes only.</strong> We
        do not provide legal, tax or financial advice, and using the site does not create an attorney-client or other
        professional relationship. Laws vary by state and change over time. You are responsible for deciding whether a
        template suits your situation and for consulting a licensed attorney or tax professional when needed.
      </p>

      <h2>2. Your responsibilities</h2>
      <ul>
        <li>Provide accurate, complete information and review every field of your document before signing it.</li>
        <li>Use the documents only for lawful purposes and only for transactions you are entitled to make.</li>
        <li>Not submit another person&apos;s tax identification number or personal data without authorization.</li>
        <li>Keep your download link confidential.</li>
      </ul>

      <h2>3. Purchases and pricing</h2>
      <p>
        Prices are shown in US dollars before checkout and are charged once per document. Payments are processed by
        Stripe. After successful payment you receive a PDF download link and a copy by email. Refunds are governed by
        our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>4. License</h2>
      <p>
        When you purchase a document, we grant you a non-exclusive, non-transferable license to use, print, sign and
        share that completed document for your own personal or business transactions. You may not resell our templates
        or use the site to build a competing template library.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        You may not attempt to remove watermarks from previews, circumvent payment, scrape the site, interfere with its
        security, or use it to commit fraud or identity theft.
      </p>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        The site and documents are provided &quot;as is&quot; and &quot;as available.&quot; To the fullest extent
        permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a
        particular purpose and non-infringement, and we do not warrant that any document will be accepted by a
        particular agency, court, lender or counterparty.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, our total liability for any claim relating to the site or a document
        is limited to the amount you paid for that document, and we are not liable for indirect, incidental, special,
        consequential or punitive damages.
      </p>

      <h2>8. Indemnity</h2>
      <p>
        You agree to indemnify us against claims arising from your misuse of the site or documents or your violation of
        these Terms.
      </p>

      <h2>9. Changes and termination</h2>
      <p>
        We may update the site, our templates and these Terms. Continued use after changes means you accept them. We may
        suspend access for violations of these Terms.
      </p>

      <h2>10. Governing law</h2>
      <p>
        {/* TODO: Replace with your company's legal name and governing jurisdiction before launch. */}
        These Terms are governed by the laws of the jurisdiction in which the operator of US Form Kit is established,
        without regard to conflict-of-law rules, except where consumer protection law of your place of residence
        provides otherwise.
      </p>

      <h2>11. Contact</h2>
      <p>
        Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
