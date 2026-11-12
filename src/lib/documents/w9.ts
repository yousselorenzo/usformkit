import { TAX_CLASSES, type W9Data } from '../schemas';
import { formatTin, longDate, maskTin, val } from '../format';
import type { BuildOptions, DocModel } from './types';

export function buildW9(d: W9Data, opts: BuildOptions): DocModel {
  const classification =
    d.taxClass === 'llc'
      ? `${TAX_CLASSES.llc} - tax classification: ${d.llcClass || '__'} (C=C corporation, S=S corporation, P=Partnership)`
      : d.taxClass === 'other'
        ? `Other: ${val(d.otherClass)}`
        : TAX_CLASSES[d.taxClass];

  const showsForeignPartners = ['partnership', 'trust', 'llc'].includes(d.taxClass);
  const tin = opts.preview ? maskTin(d.tin, d.tinType) : formatTin(d.tin, d.tinType);

  const item2 =
    '2. I am not subject to backup withholding because (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and';

  return {
    title: 'Form W-9 (Substitute)',
    subtitle: 'Request for Taxpayer Identification Number and Certification',
    blocks: [
      {
        type: 'note',
        text: 'Substitute Form W-9 containing the content and certification of IRS Form W-9 (Rev. March 2024). Give this form to the requester. Do not send it to the IRS.',
      },
      { type: 'heading', text: 'Taxpayer Information' },
      {
        type: 'fields',
        rows: [
          { label: '1  Name (as shown on your income tax return)', value: val(d.name) },
          { label: '2  Business name / disregarded entity name', value: val(d.businessName, '—') },
          { label: '3a  Federal tax classification', value: classification },
          ...(showsForeignPartners
            ? [
                {
                  label: '3b  Has foreign partners, owners, or beneficiaries',
                  value: d.foreignPartners ? 'Yes' : 'No',
                },
              ]
            : []),
          { label: '4  Exempt payee code (if any)', value: val(d.exemptPayeeCode, '—') },
          { label: '4  Exemption from FATCA reporting code (if any)', value: val(d.fatcaCode, '—') },
          { label: '5  Address (number, street, and apt. or suite no.)', value: val(d.address) },
          { label: '6  City, state, and ZIP code', value: val(d.cityStateZip) },
          { label: '7  Account number(s) (optional)', value: val(d.accountNumbers, '—') },
          { label: "Requester's name and address (optional)", value: val(d.requester, '—') },
        ],
      },
      { type: 'heading', text: 'Part I - Taxpayer Identification Number (TIN)' },
      {
        type: 'fields',
        rows: [
          {
            label: d.tinType === 'ssn' ? 'Social security number (or ITIN)' : 'Employer identification number',
            value: tin,
          },
        ],
      },
      { type: 'heading', text: 'Part II - Certification' },
      { type: 'paragraph', text: 'Under penalties of perjury, I certify that:' },
      {
        type: 'paragraph',
        text: '1. The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and',
      },
      {
        type: 'paragraph',
        text: d.subjectToBackup
          ? '2. [ITEM 2 CROSSED OUT - The certifier has been notified by the IRS that they are currently subject to backup withholding.]'
          : item2,
      },
      { type: 'paragraph', text: '3. I am a U.S. citizen or other U.S. person (defined in the IRS instructions); and' },
      {
        type: 'paragraph',
        text: '4. The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.',
      },
      {
        type: 'signatures',
        parties: [{ role: 'Signature of U.S. person', name: val(d.name), date: longDate(d.signDate) }],
      },
      {
        type: 'note',
        text: 'Keep this form confidential. It contains your taxpayer identification number. Share it only with the person or business that requested it, through a secure channel.',
      },
    ],
  };
}
