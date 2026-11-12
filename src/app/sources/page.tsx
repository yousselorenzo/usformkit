import type { Metadata } from 'next';
import Link from 'next/link';
import { IconExternal, IconHome, IconCar, IconReceipt, IconShield } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Sources & Legal References',
  description:
    'The official IRS, NHTSA, FTC, EPA and HUD sources behind US Form Kit templates: Form W-9 instructions, federal odometer disclosure rules, lead-based paint disclosure and fair housing law.',
  alternates: { canonical: '/sources' },
};

type Source = { title: string; org: string; url: string; why: string };

const GROUPS: { id: string; title: string; Icon: typeof IconCar; tool: string; href: string; sources: Source[] }[] = [
  {
    id: 'w9',
    title: 'Form W-9 (Request for Taxpayer Identification Number)',
    Icon: IconReceipt,
    tool: 'W-9 Generator',
    href: '/w9-form',
    sources: [
      {
        title: 'About Form W-9, Request for Taxpayer Identification Number and Certification',
        org: 'Internal Revenue Service',
        url: 'https://www.irs.gov/forms-pubs/about-form-w-9',
        why: 'Official form, current revision and line-by-line instructions our substitute W-9 mirrors.',
      },
      {
        title: 'Instructions for the Requester of Form W-9',
        org: 'Internal Revenue Service',
        url: 'https://www.irs.gov/instructions/iw9',
        why: 'IRS rules allowing requesters to accept substitute forms with the required certification.',
      },
      {
        title: 'Backup Withholding',
        org: 'Internal Revenue Service',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/backup-withholding',
        why: 'When the 24% backup withholding applies and why certification item 2 may need to be crossed out.',
      },
      {
        title: 'Employer Identification Number (EIN)',
        org: 'Internal Revenue Service',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers',
        why: 'How sole proprietors and entities obtain an EIN to use instead of an SSN.',
      },
      {
        title: '26 U.S. Code § 3406 — Backup withholding',
        org: 'Legal Information Institute, Cornell Law School',
        url: 'https://www.law.cornell.edu/uscode/text/26/3406',
        why: 'The federal statute behind TIN certification and backup withholding.',
      },
    ],
  },
  {
    id: 'bill-of-sale',
    title: 'Bill of Sale & Vehicle Transfers',
    Icon: IconCar,
    tool: 'Bill of Sale Generator',
    href: '/bill-of-sale',
    sources: [
      {
        title: '49 CFR Part 580 — Odometer Disclosure Requirements',
        org: 'Electronic Code of Federal Regulations (NHTSA)',
        url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-580',
        why: 'Required wording and the three mileage certifications in our odometer disclosure section.',
      },
      {
        title: '49 U.S. Code § 32705 — Disclosure requirements on transfer of motor vehicles',
        org: 'Legal Information Institute, Cornell Law School',
        url: 'https://www.law.cornell.edu/uscode/text/49/32705',
        why: 'The federal statute requiring a written mileage statement when ownership transfers.',
      },
      {
        title: 'Used Car Rule',
        org: 'Federal Trade Commission',
        url: 'https://www.ftc.gov/legal-library/browse/rules/used-car-rule',
        why: 'Background on "as is" sales and warranty disclosures in the used-vehicle market.',
      },
      {
        title: 'Motor vehicle services — find your state DMV',
        org: 'USA.gov',
        url: 'https://www.usa.gov/motor-vehicle-services',
        why: 'Directory of state motor vehicle agencies for title, registration and notarization rules.',
      },
    ],
  },
  {
    id: 'lease',
    title: 'Residential Lease Agreement',
    Icon: IconHome,
    tool: 'Lease Agreement Generator',
    href: '/lease-agreement',
    sources: [
      {
        title: 'Real Estate Disclosures About Potential Lead Hazards',
        org: 'U.S. Environmental Protection Agency',
        url: 'https://www.epa.gov/lead/real-estate-disclosure',
        why: 'Lessor obligations for housing built before 1978 and the required pamphlet.',
      },
      {
        title: '40 CFR Part 745, Subpart F — Disclosure of Known Lead-Based Paint Hazards',
        org: 'Electronic Code of Federal Regulations',
        url: 'https://www.ecfr.gov/current/title-40/chapter-I/subchapter-R/part-745/subpart-F',
        why: 'Lead warning statement and disclosure elements included in our lease.',
      },
      {
        title: '42 U.S. Code § 4852d — Disclosure of information concerning lead upon transfer',
        org: 'Legal Information Institute, Cornell Law School',
        url: 'https://www.law.cornell.edu/uscode/text/42/4852d',
        why: 'The statute that created the federal lead disclosure requirement.',
      },
      {
        title: 'Fair Housing Act',
        org: 'U.S. Department of Justice, Civil Rights Division',
        url: 'https://www.justice.gov/crt/fair-housing-act-1',
        why: 'Federal protected classes reflected in our fair housing clause.',
      },
      {
        title: 'Residential Landlord and Tenant Act',
        org: 'Uniform Law Commission',
        url: 'https://www.uniformlaws.org/',
        why: 'Model act many states drew on for deposits, entry, habitability and remedies.',
      },
    ],
  },
  {
    id: 'general',
    title: 'Electronic Records & Signatures',
    Icon: IconShield,
    tool: 'All documents',
    href: '/#documents',
    sources: [
      {
        title: '15 U.S. Code § 7001 — Electronic Signatures in Global and National Commerce Act (E-SIGN)',
        org: 'Legal Information Institute, Cornell Law School',
        url: 'https://www.law.cornell.edu/uscode/text/15/7001',
        why: 'Federal validity of electronic records and signatures in commerce.',
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="container-x py-12 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Transparency</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950 sm:text-5xl">Sources &amp; Legal References</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Our templates are drafted from official US government publications, federal statutes and regulations, and
          widely adopted model laws. Below is every primary source we rely on, with a note on what it governs in each
          document — so you can verify our work yourself.
        </p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          State and local laws (deposit limits, notice periods, notarization, DMV forms) vary and change. Always confirm
          requirements with your state agency. US Form Kit is not a law firm and is not affiliated with any government
          agency.
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {GROUPS.map(({ id, title, Icon, tool, href, sources }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-navy-950 sm:text-2xl">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-800 ring-1 ring-navy-100">
                  <Icon />
                </span>
                {title}
              </h2>
              <Link href={href} className="text-sm font-semibold text-navy-800">
                {tool} →
              </Link>
            </div>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group flex h-full flex-col p-5 transition hover:border-navy-200"
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.org}</span>
                    <span className="mt-1.5 flex items-start justify-between gap-3 font-semibold leading-snug text-navy-950 group-hover:text-navy-700">
                      {s.title}
                      <IconExternal width={16} height={16} className="mt-1 shrink-0 text-slate-400" />
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-slate-600">{s.why}</span>
                    <span className="mt-3 truncate text-xs text-slate-400">{s.url.replace(/^https?:\/\//, '')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
