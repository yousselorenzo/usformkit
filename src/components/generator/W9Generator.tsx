'use client';

import { useMemo } from 'react';
import { buildW9 } from '@/lib/documents';
import { todayISO } from '@/lib/format';
import { TAX_CLASSES, w9Schema, type W9Data } from '@/lib/schemas';
import { IconLock } from '../Icons';
import { FormSection, Segmented, SelectField, TextArea, TextField, Toggle, full } from '../form/Fields';
import { GeneratorShell } from './GeneratorShell';
import { useDocForm } from './useDocForm';

const DEFAULTS: W9Data = {
  name: '',
  businessName: '',
  taxClass: 'individual',
  llcClass: '',
  otherClass: '',
  foreignPartners: false,
  exemptPayeeCode: '',
  fatcaCode: '',
  address: '',
  cityStateZip: '',
  accountNumbers: '',
  requester: '',
  tinType: 'ssn',
  tin: '',
  subjectToBackup: false,
  signDate: '',
};

function formatTinInput(raw: string, type: 'ssn' | 'ein') {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  if (type === 'ssn') return [d.slice(0, 3), d.slice(3, 5), d.slice(5)].filter(Boolean).join('-');
  return [d.slice(0, 2), d.slice(2)].filter(Boolean).join('-');
}

export function W9Generator() {
  const f = useDocForm<W9Data>('w9', { ...DEFAULTS, signDate: todayISO() }, w9Schema, ['tin']);
  const d = f.data;
  const doc = useMemo(() => buildW9(d, { preview: true }), [d]);
  const passThrough = ['partnership', 'trust', 'llc'].includes(d.taxClass);

  return (
    <GeneratorShell docType="w9" doc={doc} data={d} validate={f.validate} setServerErrors={f.setErrors}>
      <FormSection title="Who is filling this out?" description="Lines 1–2 of Form W-9.">
        <TextField
          {...f.text('name')}
          className={full}
          label="Name (as shown on your income tax return)"
          required
          hint="Sole proprietors and single-member LLCs: enter the owner's individual name here."
        />
        <TextField
          {...f.text('businessName')}
          className={full}
          label="Business name / disregarded entity name"
          hint="Optional. Your DBA or LLC name, if different from line 1."
        />
      </FormSection>

      <FormSection title="Federal tax classification" description="Line 3a. Check only one.">
        <SelectField
          {...f.text('taxClass')}
          className={full}
          label="Classification"
          options={Object.entries(TAX_CLASSES).map(([value, label]) => ({ value, label }))}
        />
        {d.taxClass === 'llc' && (
          <SelectField
            {...f.text('llcClass')}
            className={full}
            label="LLC tax classification"
            required
            hint="A single-member LLC that is a disregarded entity should choose the owner's classification above instead."
            options={[
              { value: '', label: 'Select…' },
              { value: 'C', label: 'C — C corporation' },
              { value: 'S', label: 'S — S corporation' },
              { value: 'P', label: 'P — Partnership' },
            ]}
          />
        )}
        {d.taxClass === 'other' && <TextField {...f.text('otherClass')} className={full} label="Describe classification" required />}
        {passThrough && (
          <Toggle
            {...f.toggle('foreignPartners')}
            className={full}
            label="Line 3b: Has foreign partners, owners, or beneficiaries"
            description="Only if you are providing this form to a partnership, trust, or estate in which you have an ownership interest."
          />
        )}
      </FormSection>

      <FormSection title="Exemptions" description="Line 4. Most individuals and sole proprietors leave these blank.">
        <TextField {...f.text('exemptPayeeCode')} label="Exempt payee code" maxLength={4} />
        <TextField {...f.text('fatcaCode')} label="FATCA exemption code" maxLength={4} uppercase />
      </FormSection>

      <FormSection title="Address" description="Lines 5–6. Where the requester will mail your information returns.">
        <TextField {...f.text('address')} className={full} label="Street address, apt. or suite" required autoComplete="street-address" />
        <TextField {...f.text('cityStateZip')} className={full} label="City, state, and ZIP code" required placeholder="Austin, TX 78701" />
        <TextField {...f.text('accountNumbers')} className={full} label="Account number(s)" hint="Line 7. Optional." />
        <TextArea {...f.text('requester')} className={full} label="Requester's name and address" rows={2} hint="Optional — the client or company asking for your W-9." />
      </FormSection>

      <FormSection title="Taxpayer Identification Number" description="Part I.">
        <Segmented
          className={full}
          label="TIN type"
          name="tinType"
          value={d.tinType}
          onChange={(v) => {
            f.set('tinType', v);
            f.set('tin', formatTinInput(d.tin, v));
          }}
          options={[
            { value: 'ssn', label: 'SSN / ITIN' },
            { value: 'ein', label: 'EIN' },
          ]}
        />
        <TextField
          {...f.text('tin')}
          onChange={(v) => f.set('tin', formatTinInput(v, d.tinType))}
          className={full}
          label={d.tinType === 'ssn' ? 'Social security number' : 'Employer identification number'}
          required
          inputMode="numeric"
          placeholder={d.tinType === 'ssn' ? '123-45-6789' : '12-3456789'}
          hint="Masked in the preview, encrypted in transit and never saved in your browser."
        />
        <p className={`${full} -mt-1 flex items-center gap-2 text-[13px] text-slate-500`}>
          <IconLock width={14} height={14} /> 256-bit encrypted before it leaves our server.
        </p>
      </FormSection>

      <FormSection title="Certification" description="Part II.">
        <Toggle
          {...f.toggle('subjectToBackup')}
          className={full}
          label="I've been notified by the IRS that I'm subject to backup withholding"
          description="Turning this on crosses out certification item 2, as the IRS instructions require."
        />
        <TextField {...f.text('signDate')} label="Date" type="date" required />
      </FormSection>
    </GeneratorShell>
  );
}
