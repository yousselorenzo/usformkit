import type { DocType } from './products';

export type GuideNode = string | { h3: string } | { ul: string[] } | { ol: string[] } | { callout: string };

export type Guide = {
  slug: string;
  title: string;
  navTitle: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  published: string;
  updated: string;
  readMinutes: number;
  tool: DocType;
  intro: string;
  sections: { id: string; h2: string; body: GuideNode[] }[];
  faqs: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  /* ───────────────────────────────── W-9 ───────────────────────────────── */
  {
    slug: 'how-to-fill-out-w9-independent-contractor',
    title: 'How to Fill Out a W-9 Form as an Independent Contractor',
    navTitle: 'How to fill out a W-9',
    metaTitle: 'How to Fill Out a W-9 as an Independent Contractor (2026 Guide)',
    description:
      'Line-by-line instructions for completing IRS Form W-9 as a freelancer, 1099 contractor, sole proprietor or single-member LLC — tax classification, TIN, exemptions and certification.',
    keywords: [
      'how to fill out a W-9',
      'W-9 form for independent contractor',
      'W-9 sole proprietor',
      'W-9 single member LLC',
      'request for taxpayer identification number',
      '1099-NEC W-9',
      'backup withholding',
    ],
    published: '2026-11-11',
    updated: '2026-11-11',
    readMinutes: 8,
    tool: 'w9',
    intro:
      'If a client is about to pay you for freelance or contract work, they will almost always ask for a Form W-9 first. The form gives the payer your legal name, federal tax classification and Taxpayer Identification Number (TIN) so they can report what they paid you to the IRS. It takes about five minutes to complete correctly — here is exactly what to put on every line.',
    sections: [
      {
        id: 'what-is-a-w9',
        h2: 'What is Form W-9 and why clients ask for it',
        body: [
          'Form W-9, "Request for Taxpayer Identification Number and Certification," is an IRS form that a U.S. person gives to a business that will pay them. The business uses it to prepare information returns such as Form 1099-NEC (nonemployee compensation) or Form 1099-MISC.',
          'For payments made in 2026, the federal reporting threshold for most Form 1099-NEC and 1099-MISC payments rose from $600 to $2,000 per payee per year, and it is scheduled to be adjusted for inflation after 2026. Clients still commonly collect a W-9 before the first payment, because they need your TIN on file in case your total crosses the threshold.',
          { callout: 'You give a W-9 to the requester — never mail it to the IRS. The client keeps it in their records.' },
          'A W-9 is not an employment form. Employees fill out Form W-4. If you receive a W-9 request, the payer is treating you as an independent contractor, vendor or other non-employee payee.',
        ],
      },
      {
        id: 'before-you-start',
        h2: 'What you need before you start',
        body: [
          {
            ul: [
              'Your legal name exactly as it appears on your federal income tax return.',
              'Your business or "doing business as" (DBA) name, if you have one.',
              'Your federal tax classification (individual/sole proprietor, LLC, S corporation, etc.).',
              'Your Social Security number (SSN), Individual Taxpayer Identification Number (ITIN), or Employer Identification Number (EIN).',
              'The mailing address where you want to receive your Form 1099.',
            ],
          },
        ],
      },
      {
        id: 'line-by-line',
        h2: 'Line-by-line instructions for Form W-9',
        body: [
          { h3: 'Line 1 — Name' },
          'Enter the name shown on your income tax return. If you are a sole proprietor, this is your individual name, not your business name. If you are a single-member LLC that is disregarded for federal tax purposes, line 1 is the owner\'s name — not the LLC\'s name.',
          { h3: 'Line 2 — Business name / disregarded entity name' },
          'Enter your DBA, trade name or the name of your disregarded LLC here. Leave it blank if you work under your own name.',
          { h3: 'Line 3a — Federal tax classification' },
          'Check exactly one box. Most freelancers check "Individual/sole proprietor." If you have a single-member LLC that has not elected corporate taxation, you also check the box for the owner\'s classification (usually individual/sole proprietor) rather than the LLC box. Multi-member LLCs and LLCs that elected to be taxed as a corporation check "LLC" and write C, S or P for their tax classification.',
          { h3: 'Line 3b — Foreign partners, owners or beneficiaries' },
          'Added in the March 2024 revision, line 3b applies only to partnerships, trusts, estates and LLCs taxed as partnerships that are giving the form to a partnership, trust or estate in which they hold an interest. Most individual contractors skip it.',
          { h3: 'Line 4 — Exemptions' },
          'Exempt payee codes and FATCA exemption codes apply mainly to corporations, tax-exempt organizations and financial institutions. If you are an individual or sole proprietor, leave both boxes blank.',
          { h3: 'Lines 5 and 6 — Address' },
          'Enter the street address, city, state and ZIP code where the payer should mail your information return. A P.O. box is acceptable.',
          { h3: 'Line 7 — Account numbers (optional)' },
          'Only fill this in if the requester asks you to list an account or vendor number.',
          { h3: 'Part I — Taxpayer Identification Number' },
          'Individuals and sole proprietors may enter either an SSN (or ITIN) or an EIN. A single-member LLC that is a disregarded entity should use the owner\'s SSN or EIN — not an EIN issued to the LLC solely for employment tax purposes. Corporations and partnerships enter their EIN. The name on line 1 must match the TIN you enter, or the payer\'s TIN match may fail.',
          { h3: 'Part II — Certification and signature' },
          'Signing certifies, under penalties of perjury, that your TIN is correct, that you are not subject to backup withholding (or have been told you no longer are), that you are a U.S. person, and that any FATCA code is correct. If the IRS has notified you that you are currently subject to backup withholding, you must cross out item 2 before signing. Then sign and date the form.',
        ],
      },
      {
        id: 'backup-withholding',
        h2: 'Backup withholding: what happens if you don\'t provide a W-9',
        body: [
          'If you fail to give a payer a correct TIN, or the IRS notifies the payer that your name and TIN do not match, the payer may be required to withhold federal income tax from your reportable payments at the backup withholding rate of 24% and send it to the IRS. You can claim the withheld amount as a credit on your tax return, but it reduces your cash flow in the meantime.',
          'Providing an accurate, signed W-9 before the first invoice is the simplest way to avoid backup withholding and payment delays.',
        ],
      },
      {
        id: 'common-mistakes',
        h2: 'Common W-9 mistakes contractors make',
        body: [
          {
            ul: [
              'Putting a business name on line 1 when you are a sole proprietor.',
              'Checking the LLC box for a single-member LLC that is a disregarded entity.',
              'Using a name/TIN combination that doesn\'t match IRS records (for example, a new married name not yet updated with the Social Security Administration).',
              'Forgetting to sign and date the certification.',
              'Emailing an unencrypted W-9 to an unverified address — a common identity-theft and phishing vector.',
            ],
          },
        ],
      },
      {
        id: 'send-securely',
        h2: 'How to send your W-9 safely',
        body: [
          'Your W-9 contains your SSN or EIN. Before sending it, confirm the request is genuine by contacting the client through a known phone number or portal. Prefer the client\'s secure vendor portal or an encrypted file-sharing link over plain email, and never share it in response to an unexpected request.',
          'The official IRS Form W-9 and its instructions are available free on IRS.gov. US Form Kit produces a clean substitute Form W-9 with the same content and certification, so you get a polished, ready-to-sign PDF in minutes.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I send my W-9 to the IRS?',
        a: 'No. You give the completed Form W-9 to the person or business that requested it. They keep it on file and use it to prepare information returns such as Form 1099-NEC.',
      },
      {
        q: 'Should a sole proprietor use an SSN or an EIN on a W-9?',
        a: 'Either is allowed. Many freelancers obtain a free EIN from the IRS so they don\'t have to share their Social Security number with every client.',
      },
      {
        q: 'Does a single-member LLC check the LLC box on Form W-9?',
        a: 'Not if the LLC is a disregarded entity. The owner\'s name goes on line 1, the LLC name on line 2, and the box for the owner\'s tax classification is checked on line 3a.',
      },
      {
        q: 'What is the 1099-NEC threshold for 2026?',
        a: 'For payments made after December 31, 2025, the reporting threshold for most Form 1099-NEC and 1099-MISC payments is $2,000 per payee for the year, adjusted for inflation after 2026. Income below the threshold is still taxable.',
      },
      {
        q: 'Is a substitute W-9 acceptable?',
        a: 'Yes. The IRS allows requesters to accept a substitute form that is substantially similar to the official Form W-9 and includes the required certification language.',
      },
    ],
  },

  /* ─────────────────────────────── Bill of Sale ─────────────────────────────── */
  {
    slug: 'what-is-a-vehicle-bill-of-sale',
    title: 'What Is a Vehicle Bill of Sale and Why You Need One',
    navTitle: 'Vehicle bill of sale explained',
    metaTitle: 'What Is a Vehicle Bill of Sale? Requirements & What to Include',
    description:
      'A vehicle bill of sale proves a private car sale happened. Learn what to include, how it differs from a title, the federal odometer disclosure rules, and when states require notarization.',
    keywords: [
      'vehicle bill of sale',
      'car bill of sale',
      'bill of sale for car private sale',
      'what is a bill of sale',
      'odometer disclosure statement',
      'as is bill of sale',
      'DMV bill of sale',
    ],
    published: '2026-11-11',
    updated: '2026-11-11',
    readMinutes: 7,
    tool: 'bill-of-sale',
    intro:
      'Selling or buying a used car from a private party? The certificate of title transfers ownership, but a vehicle bill of sale is the receipt that proves the transaction happened — when, for how much, and on what terms. Here is what a bill of sale does, what it must contain, and the federal and state rules to keep in mind.',
    sections: [
      {
        id: 'definition',
        h2: 'What is a vehicle bill of sale?',
        body: [
          'A vehicle bill of sale is a written record, signed by the seller and the buyer, documenting the transfer of a car, truck, motorcycle, RV, boat or trailer. It identifies both parties and the vehicle, states the purchase price and the date of sale, and records the terms — most often that the vehicle is sold "as is."',
          'A general bill of sale does the same job for other personal property: furniture, equipment, electronics, musical instruments, livestock and more.',
        ],
      },
      {
        id: 'title-vs-bill-of-sale',
        h2: 'Bill of sale vs. certificate of title',
        body: [
          'The certificate of title is the official, state-issued proof of ownership; it must be signed over to the buyer to transfer a titled vehicle. A bill of sale does not replace the title. Instead, it supports it — giving the buyer evidence of the purchase price for sales-tax purposes and giving the seller proof of the date they stopped owning the vehicle.',
          { callout: 'Many state DMVs ask for a bill of sale when registering a vehicle, when the title has no space for the price, or when titling a vehicle that is exempt from titling (such as some older cars, trailers or boats).' },
        ],
      },
      {
        id: 'why-you-need-one',
        h2: 'Why buyers and sellers both need one',
        body: [
          { h3: 'For the seller' },
          {
            ul: [
              'Proof of the exact date and time ownership transferred — critical if the buyer gets parking tickets, tolls or is in an accident before re-registering.',
              'Documentation that the vehicle was sold "as is," limiting later disputes about its condition.',
              'Support for any release-of-liability or notice-of-transfer filing your state requires.',
            ],
          },
          { h3: 'For the buyer' },
          {
            ul: [
              'Proof of purchase price for calculating sales or use tax at registration.',
              'Evidence of ownership while the new title is being processed.',
              'A written record of the seller\'s promise that the vehicle is free of liens.',
            ],
          },
        ],
      },
      {
        id: 'what-to-include',
        h2: 'What to include in a vehicle bill of sale',
        body: [
          {
            ol: [
              'Full legal names and addresses of the seller and buyer.',
              'Date of sale and the state where the sale occurred.',
              'Vehicle year, make, model, body style and color.',
              'The 17-character Vehicle Identification Number (VIN), copied exactly from the title and the vehicle.',
              'Odometer reading at the time of sale, with the federal odometer disclosure.',
              'Purchase price and method of payment.',
              'An "as is" clause or a description of any warranty.',
              'The seller\'s statement that they own the vehicle and it is free of liens.',
              'Signatures and printed names of both parties — and a notary block if your state requires one.',
            ],
          },
        ],
      },
      {
        id: 'odometer-disclosure',
        h2: 'The federal odometer disclosure requirement',
        body: [
          'Federal law (49 U.S.C. § 32705 and NHTSA\'s regulations at 49 CFR Part 580) requires the seller to disclose the mileage in writing when ownership of a motor vehicle is transferred. The disclosure states whether the reading reflects the actual mileage, mileage in excess of the odometer\'s mechanical limits, or is not the actual mileage.',
          'Under NHTSA\'s rule effective January 1, 2021, vehicles of model year 2011 and newer are exempt from the odometer disclosure requirement only once they are 20 years old; model year 2010 and older vehicles remain exempt after 10 years. For most cars sold today, the disclosure is required. It is usually made on the title itself — recording it on the bill of sale as well gives both parties a matching record.',
        ],
      },
      {
        id: 'as-is',
        h2: 'Selling a car "as is"',
        body: [
          'In most private-party sales, the vehicle is sold "as is, where is," meaning the seller makes no warranty about its condition and the buyer accepts it with any existing faults. Putting this language in writing protects the seller. Buyers should get an independent pre-purchase inspection and a vehicle history report before signing.',
          'Note that dealers are subject to the FTC Used Car Rule and must display a Buyers Guide; private sellers are not, but "as is" terms should still be stated clearly in the bill of sale.',
        ],
      },
      {
        id: 'notarization',
        h2: 'Does a bill of sale need to be notarized?',
        body: [
          'Most states do not require a vehicle bill of sale to be notarized, but a few states require notarization for certain title or bill-of-sale documents, and some buyers or lenders ask for it anyway. Because requirements vary and change, check your state motor vehicle agency\'s website before the sale. US Form Kit lets you add an optional notary acknowledgment block in one tap.',
        ],
      },
      {
        id: 'after-the-sale',
        h2: 'After the sale: checklist',
        body: [
          {
            ul: [
              'Sign the title over to the buyer and complete the odometer section.',
              'Give the buyer a signed copy of the bill of sale and keep one yourself.',
              'Remove your license plates if your state requires it.',
              'File any notice of transfer or release of liability with your state.',
              'Cancel or transfer your insurance only after the transfer is complete.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'Is a handwritten bill of sale legal?',
        a: 'Generally yes, as long as it contains the required information and is signed by both parties. Some states publish their own bill-of-sale form, which you may be asked to use for registration.',
      },
      {
        q: 'Does a bill of sale prove ownership of a car?',
        a: 'A bill of sale proves a sale took place, but the certificate of title is the legal proof of ownership for titled vehicles. Use both together.',
      },
      {
        q: 'Who keeps the original bill of sale?',
        a: 'Both the buyer and the seller should keep a signed copy. The buyer may need it at the DMV; the seller keeps it as proof of the transfer date.',
      },
      {
        q: 'What does "as is" mean on a bill of sale?',
        a: 'It means the seller provides no warranty about the vehicle\'s condition and the buyer accepts it with any existing defects.',
      },
    ],
  },

  /* ─────────────────────────────── Lease ─────────────────────────────── */
  {
    slug: 'residential-lease-agreement-essentials',
    title: 'Residential Lease Agreement Essentials in the US',
    navTitle: 'Lease agreement essentials',
    metaTitle: 'Residential Lease Agreement Essentials: What Every US Lease Needs',
    description:
      'The clauses every US residential lease agreement should include — rent, security deposit, term, maintenance, entry, pets — plus the federal lead-based paint disclosure and fair housing rules.',
    keywords: [
      'residential lease agreement',
      'rental lease agreement template',
      'what to include in a lease agreement',
      'month-to-month lease',
      'security deposit laws',
      'lead-based paint disclosure',
      'landlord tenant agreement',
    ],
    published: '2026-11-11',
    updated: '2026-11-11',
    readMinutes: 9,
    tool: 'lease',
    intro:
      'A clear written lease is the single best way for landlords and tenants to avoid disputes. It sets expectations about money, maintenance and move-out before problems arise. This guide walks through the essential clauses of a US residential lease agreement and the federal rules that apply in every state.',
    sections: [
      {
        id: 'what-is-a-lease',
        h2: 'What is a residential lease agreement?',
        body: [
          'A residential lease agreement is a contract in which a landlord grants a tenant the right to occupy a home, apartment or room for a period of time in exchange for rent. Landlord-tenant law is primarily state law, with additional city and county rules in many places, but most leases share the same core structure.',
        ],
      },
      {
        id: 'fixed-vs-month-to-month',
        h2: 'Fixed-term lease vs. month-to-month',
        body: [
          'A fixed-term lease runs for a set period — usually 12 months — and locks in the rent and terms for both sides. A month-to-month rental agreement renews automatically each month and can be ended by either party with written notice, typically 30 days, although many states and cities require longer notice periods for long-term tenants or for rent increases.',
        ],
      },
      {
        id: 'essential-clauses',
        h2: 'Essential clauses every lease should include',
        body: [
          { h3: 'Parties and premises' },
          'Name every adult occupant as a tenant and identify the property address, including the unit number. Naming all adults makes each one responsible for the full rent ("joint and several liability").',
          { h3: 'Term' },
          'State the start date and, for fixed-term leases, the end date — and what happens if the tenant stays after it ends.',
          { h3: 'Rent' },
          'Specify the monthly amount, due date, accepted payment methods and how partial months are prorated.',
          { h3: 'Late fees' },
          'If you charge a late fee, state the grace period and amount. Many states limit late fees or require them to be "reasonable."',
          { h3: 'Security deposit' },
          'State the deposit amount and how it may be used. Many states cap the deposit (often at one or two months\' rent), and most set a deadline — commonly 14 to 30 days after move-out — to return it with an itemized list of deductions.',
          { h3: 'Use, occupancy and guests' },
          'Limit occupancy to the named tenants and their children, and define how long guests may stay.',
          { h3: 'Utilities' },
          'List which utilities and services each party pays.',
          { h3: 'Maintenance and repairs' },
          'In nearly every state, landlords must keep rental housing habitable under the "implied warranty of habitability." The lease should explain how tenants report repairs and who pays for tenant-caused damage.',
          { h3: 'Landlord entry' },
          'Most states require advance notice — frequently 24 hours — before a landlord enters, except in emergencies.',
          { h3: 'Pets, smoking and alterations' },
          'Spell out pet rules and deposits, smoking restrictions, and whether tenants may paint or change locks. Assistance animals for people with disabilities must be accommodated under fair housing law and are not "pets."',
          { h3: 'Subletting, default and notices' },
          'Require written consent for subletting, describe what counts as a default, and give an address for legal notices. Evictions must follow court procedures; self-help evictions such as changing locks are illegal.',
        ],
      },
      {
        id: 'federal-rules',
        h2: 'Federal rules that apply to every lease',
        body: [
          { h3: 'Lead-based paint disclosure (pre-1978 housing)' },
          'Under 42 U.S.C. § 4852d and the EPA/HUD rule at 40 CFR Part 745, Subpart F, landlords of most housing built before 1978 must disclose known lead-based paint and hazards, provide available records, give tenants the EPA pamphlet "Protect Your Family From Lead in Your Home," and include a lead warning statement in or attached to the lease. Signed disclosures should be kept for three years.',
          { h3: 'Fair Housing Act' },
          'The federal Fair Housing Act prohibits discrimination in renting based on race, color, religion, sex, national origin, familial status or disability. Many states and cities add protected classes such as source of income. Lease terms must apply equally to all tenants.',
        ],
      },
      {
        id: 'state-rules',
        h2: 'State and local rules to check',
        body: [
          {
            ul: [
              'Security deposit caps, holding requirements and return deadlines.',
              'Required notice periods to end a tenancy or raise rent.',
              'Late fee limits and grace periods.',
              'Rent control or rent stabilization ordinances in certain cities.',
              'Required disclosures (for example mold, bed bugs, flood zones or smoke detectors).',
            ],
          },
          'A lease clause that conflicts with state law is generally unenforceable. Our lease template includes a severability clause and refers to state law for deposit and notice timelines, but you should confirm local rules before signing.',
        ],
      },
      {
        id: 'signing',
        h2: 'Signing and keeping the lease',
        body: [
          'Every landlord and adult tenant should sign and date the lease, and each should keep a complete copy. Electronic signatures are generally valid under the federal E-SIGN Act and state UETA laws. Do a documented move-in inspection with photos to support any future deposit deductions.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does a lease need to be notarized?',
        a: 'Residential leases generally do not need to be notarized to be valid. A few situations, such as long-term leases recorded with the county, may have special requirements.',
      },
      {
        q: 'How much can a landlord charge for a security deposit?',
        a: 'It depends on the state. Some states cap deposits at one or two months\' rent; others have no cap. Check your state\'s landlord-tenant statute.',
      },
      {
        q: 'Is the lead-based paint disclosure required for every rental?',
        a: 'It is required for most housing built before 1978. Exemptions include certain zero-bedroom units, housing for the elderly or disabled where no children under six live, short-term leases of 100 days or less, and housing certified lead-free.',
      },
      {
        q: 'Can a landlord enter without notice?',
        a: 'Except in emergencies, most states require reasonable advance notice — often 24 hours — before a landlord enters an occupied rental.',
      },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guideForTool = (tool: DocType) => GUIDES.find((g) => g.tool === tool)!;
