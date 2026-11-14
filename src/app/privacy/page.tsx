import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How US Form Kit collects, encrypts, uses and protects the information you enter.',
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We built US Form Kit to collect as little as possible and to protect what we do handle. This policy explains what we collect, why, and the choices you have."
    >
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Form answers.</strong> The details you type into a generator (for example names, addresses, vehicle
          information, rent amounts, and — for the W-9 — your Social Security number or EIN).
        </li>
        <li>
          <strong>Checkout information.</strong> Your email address and billing details are collected by Stripe during
          checkout. We never receive or store your full card number.
        </li>
        <li>
          <strong>Technical data.</strong> Standard server logs (IP address, browser type, pages requested) kept by our
          hosting provider for security and reliability.
        </li>
      </ul>

      <h2>How your form answers are handled</h2>
      <p>
        Your answers are not sent to Stripe and are not kept in a database. While you fill out a form, a draft is kept in
        your browser&apos;s session storage (cleared when you close the tab); W-9 tax identification numbers are not
        saved in that draft. When you click Pay, your answers are held in your browser&apos;s session storage for that tab
        only, so we can generate your PDF when Stripe returns you to our site. Your answers are sent to our server
        briefly to produce the PDF and are not stored.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To generate and deliver the document you purchased, including a download link and backup copy by email.</li>
        <li>To process payments, prevent fraud and handle refunds.</li>
        <li>To respond to support requests.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <p>We do not sell or rent your personal information, and we do not use your form answers for advertising.</p>

      <h2>Service providers</h2>
      <ul>
        <li><strong>Stripe</strong> — payment processing.</li>
        <li><strong>Resend</strong> — transactional email delivery.</li>
        <li><strong>Our hosting provider</strong> — website and server infrastructure.</li>
      </ul>
      <p>Each provider processes data only to provide its service to us and under its own privacy and security terms.</p>

      <h2>Cookies</h2>
      <p>
        US Form Kit does not use advertising or cross-site tracking cookies. Stripe may set cookies on its checkout page
        for fraud prevention.
      </p>

      <h2>Retention</h2>
      <p>
        Payment records are retained by Stripe as required for accounting, tax and dispute
        purposes. You may ask us to delete your information at any time, subject to legal retention requirements.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example California under the CCPA/CPRA), you may have the right to access,
        correct or delete your personal information and to opt out of its sale (we do not sell it). Email{' '}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> to make a request. We will not discriminate
        against you for exercising your rights.
      </p>

      <h2>Security</h2>
      <p>
        We use HTTPS everywhere, encryption of form data, and least-privilege access to our systems. No method of
        transmission or storage is 100% secure, but we work to protect your information. Keep your download link private.
      </p>

      <h2>Children</h2>
      <p>US Form Kit is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>We may update this policy. The &quot;Last updated&quot; date above shows when it last changed.</p>
    </LegalPage>
  );
}
