import type { LeaseData } from '../schemas';
import { BLANK, longDate, money, ordinal, val } from '../format';
import type { Block, DocModel } from './types';

export function buildLease(d: LeaseData): DocModel {
  const tenants = d.tenantNames
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const tenantList = tenants.length ? tenants.join(', ') : BLANK;
  const state = val(d.propertyState);
  const blocks: Block[] = [];
  let n = 0;
  const h = (text: string) => blocks.push({ type: 'heading', text: `${++n}. ${text}` });
  const p = (text: string) => blocks.push({ type: 'paragraph', text });

  p(
    `This Residential Lease Agreement ("Lease") is entered into between ${val(d.landlordName)} ("Landlord") and ${tenantList} (individually and collectively, "Tenant"). Each Tenant is jointly and severally liable for all obligations under this Lease.`,
  );

  h('Premises');
  p(
    `Landlord leases to Tenant the residential premises located at ${val(d.propertyAddress)}, State of ${state} (the "Premises"), ${
      d.furnished ? 'together with the furnishings provided by Landlord' : 'unfurnished'
    }.`,
  );

  h('Term');
  p(
    d.termType === 'fixed'
      ? `The Lease begins on ${longDate(d.startDate)} and ends on ${longDate(
          d.endDate,
        )}. Unless the parties sign a renewal or a new lease, if Tenant remains in possession with Landlord's consent after the end date, the tenancy continues month-to-month under the same terms, terminable by either party with at least ${val(
          d.noticeDays,
        )} days' written notice or any longer period required by law.`
      : `The Lease begins on ${longDate(
          d.startDate,
        )} and continues on a month-to-month basis. Either party may end the tenancy by giving the other at least ${val(
          d.noticeDays,
        )} days' written notice, or any longer period required by the laws of the State of ${state}.`,
  );

  h('Rent');
  const due = /^\d+$/.test(d.rentDueDay) ? ordinal(Number(d.rentDueDay)) : BLANK;
  p(
    `Tenant shall pay monthly rent of ${money(d.monthlyRent)}, due in advance on the ${due} day of each month, by ${val(
      d.paymentMethod,
    )}. Rent for any partial month shall be prorated on a daily basis.`,
  );

  h('Late Charges and Returned Payments');
  p(
    d.lateFee.trim()
      ? `If rent is not received within ${val(d.graceDays, '0')} day(s) after the due date, Tenant shall pay a late charge of ${money(
          d.lateFee,
        )}, to the extent permitted by the laws of the State of ${state}. Tenant shall also pay any reasonable fee charged for a dishonored payment, as permitted by law.`
      : `No late charge applies under this Lease. Tenant shall pay any reasonable fee charged for a dishonored payment, as permitted by law.`,
  );

  h('Security Deposit');
  p(
    d.securityDeposit.trim() && Number(d.securityDeposit) > 0
      ? `On signing, Tenant shall pay a security deposit of ${money(
          d.securityDeposit,
        )}. Landlord may apply the deposit to unpaid rent and to repair damage beyond ordinary wear and tear. Landlord shall hold, account for and return the deposit, with an itemized statement of any deductions, within the time and in the manner required by the laws of the State of ${state}. The deposit may not be used by Tenant as the last month's rent without Landlord's written consent.`
      : 'No security deposit is required under this Lease.',
  );

  h('Use and Occupancy');
  p(
    `The Premises shall be used only as a private residence${
      d.maxOccupants.trim() ? ` by no more than ${d.maxOccupants.trim()} occupant(s)` : ''
    }, namely the Tenant(s) named above and their minor children. Guests staying more than 14 days in any six-month period require Landlord's written consent. Tenant shall comply with all applicable laws and shall not disturb neighbors' quiet enjoyment.`,
  );

  h('Utilities and Services');
  p(
    `Tenant is responsible for: ${val(d.utilitiesTenant, 'all utilities and services not listed below')}. Landlord is responsible for: ${val(
      d.utilitiesLandlord,
      'none',
    )}.`,
  );

  h('Maintenance and Repairs');
  p(
    'Tenant shall keep the Premises clean and sanitary, use all fixtures and appliances properly, and promptly notify Landlord in writing of any needed repairs. Landlord shall keep the Premises in a habitable condition and make necessary repairs within a reasonable time, as required by law. Tenant is responsible for damage caused by Tenant, occupants or guests, other than ordinary wear and tear.',
  );

  h('Landlord Entry');
  p(
    `Landlord may enter the Premises at reasonable times to inspect, make repairs, or show the Premises to prospective tenants, buyers or lenders, after giving the advance notice required by the laws of the State of ${state} (or at least 24 hours' notice if the law does not specify), except in an emergency.`,
  );

  h('Pets');
  p(
    d.petsAllowed
      ? `Pets are permitted only with Landlord's prior written approval of each animal${
          d.petDeposit.trim() && Number(d.petDeposit) > 0 ? `, and Tenant shall pay a refundable pet deposit of ${money(d.petDeposit)}` : ''
        }. Tenant is responsible for any damage or nuisance caused by pets. Assistance animals are allowed as required by fair housing laws.`
      : 'No pets are allowed on the Premises without Landlord\'s prior written consent. This restriction does not apply to assistance animals permitted under fair housing laws.',
  );

  h('Smoking');
  p(
    d.smokingAllowed
      ? 'Smoking is permitted only in areas designated by Landlord. Tenant is responsible for any smoke-related damage or odor removal beyond ordinary wear and tear.'
      : 'Smoking of any substance, including vaping, is prohibited anywhere inside the Premises.',
  );

  h('Alterations');
  p(
    "Tenant shall not paint, make alterations, install fixtures, or change or add locks without Landlord's prior written consent.",
  );

  h('Assignment and Subletting');
  p("Tenant shall not assign this Lease or sublet any part of the Premises without Landlord's prior written consent.");

  h("Renter's Insurance and Liability");
  p(
    "Landlord's insurance does not cover Tenant's personal property. Tenant is encouraged to carry renter's insurance. Except where caused by Landlord's negligence or as otherwise provided by law, Landlord is not liable for loss or damage to Tenant's property.",
  );

  if (d.builtBefore1978) {
    h('Lead-Based Paint Disclosure (Housing Built Before 1978)');
    p(
      'Housing built before 1978 may contain lead-based paint. Lead from paint, paint chips and dust can pose health hazards if not managed properly. Lead exposure is especially harmful to young children and pregnant women. Before renting pre-1978 housing, lessors must disclose the presence of known lead-based paint and/or lead-based paint hazards in the dwelling. Lessees must also receive a federally approved pamphlet on lead poisoning prevention.',
    );
    blocks.push({
      type: 'checklist',
      items: [
        {
          label: 'Lessor has no knowledge of lead-based paint and/or lead-based paint hazards in the housing.',
          checked: d.leadKnowledge === 'none',
        },
        {
          label: `Known lead-based paint and/or lead-based paint hazards are present in the housing: ${
            d.leadKnowledge === 'known' ? val(d.leadDetails) : BLANK
          }`,
          checked: d.leadKnowledge === 'known',
        },
        {
          label:
            'Lessee has received the pamphlet "Protect Your Family From Lead in Your Home" and any available records or reports. Lessee initials: ______',
          checked: false,
        },
      ],
    });
  }

  h('Default and Termination');
  p(
    `If Tenant fails to pay rent when due or breaches any other term of this Lease, Landlord may terminate the tenancy and seek possession only in accordance with the notice and court procedures required by the laws of the State of ${state}. Landlord shall not use self-help remedies such as changing locks or removing Tenant's belongings.`,
  );

  h('Notices');
  p(
    `Notices to Landlord shall be delivered in writing to: ${val(d.landlordAddress)}${
      d.landlordContact.trim() ? ` (contact: ${d.landlordContact.trim()})` : ''
    }. Notices to Tenant shall be delivered to the Premises.`,
  );

  h('Fair Housing');
  p(
    'Landlord complies with the federal Fair Housing Act and all applicable state and local fair housing laws, and does not discriminate on the basis of race, color, religion, sex, national origin, familial status, disability, or any other protected characteristic.',
  );

  h('Governing Law and Severability');
  p(
    `This Lease is governed by the laws of the State of ${state}. If any provision is found invalid or unenforceable, the remaining provisions remain in full force. Any provision that conflicts with applicable law is modified to the minimum extent needed to comply.`,
  );

  if (d.additionalTerms.trim()) {
    h('Additional Terms');
    p(d.additionalTerms.trim());
  }

  h('Entire Agreement');
  p(
    'This Lease, including any addenda signed by the parties, is the entire agreement between Landlord and Tenant. It may be changed only in writing signed by all parties.',
  );

  blocks.push({
    type: 'signatures',
    parties: [
      { role: 'Landlord', name: val(d.landlordName) },
      ...(tenants.length ? tenants : [BLANK]).map((t) => ({ role: 'Tenant', name: t })),
    ],
  });

  blocks.push({
    type: 'note',
    text: 'Landlord-tenant law varies by state and city (deposit limits, notice periods, required disclosures and rent rules). Review local requirements before signing.',
  });

  return {
    title: 'Residential Lease Agreement',
    subtitle: `${d.termType === 'fixed' ? 'Fixed-Term' : 'Month-to-Month'} Lease · State of ${state}`,
    blocks,
  };
}
