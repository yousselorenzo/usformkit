'use client';

import { useMemo } from 'react';
import { buildLease } from '@/lib/documents';
import { leaseSchema, type LeaseData } from '@/lib/schemas';
import { FormSection, STATE_OPTIONS, Segmented, SelectField, TextArea, TextField, Toggle, full } from '../form/Fields';
import { GeneratorShell } from './GeneratorShell';
import { useDocForm } from './useDocForm';

const DEFAULTS: LeaseData = {
  landlordName: '',
  landlordAddress: '',
  landlordContact: '',
  tenantNames: '',
  propertyAddress: '',
  propertyState: '',
  furnished: false,
  termType: 'fixed',
  startDate: '',
  endDate: '',
  noticeDays: '30',
  monthlyRent: '',
  rentDueDay: '1',
  paymentMethod: 'bank transfer',
  lateFee: '',
  graceDays: '5',
  securityDeposit: '',
  maxOccupants: '',
  utilitiesTenant: 'electricity, gas, internet',
  utilitiesLandlord: 'water, sewer, trash',
  petsAllowed: false,
  petDeposit: '',
  smokingAllowed: false,
  builtBefore1978: false,
  leadKnowledge: 'none',
  leadDetails: '',
  additionalTerms: '',
};

export function LeaseGenerator() {
  const f = useDocForm<LeaseData>('lease', DEFAULTS, leaseSchema);
  const d = f.data;
  const doc = useMemo(() => buildLease(d), [d]);

  return (
    <GeneratorShell docType="lease" doc={doc} data={d} validate={f.validate} setServerErrors={f.setErrors}>
      <FormSection title="Parties">
        <TextField {...f.text('landlordName')} className={full} label="Landlord / property owner" required />
        <TextField
          {...f.text('landlordAddress')}
          className={full}
          label="Landlord address for notices"
          required
          placeholder="Street, City, State ZIP"
        />
        <TextField {...f.text('landlordContact')} className={full} label="Landlord phone or email" />
        <TextArea
          {...f.text('tenantNames')}
          className={full}
          label="Tenant name(s)"
          required
          rows={3}
          placeholder={'Jane Doe\nJohn Doe'}
          hint="One adult tenant per line. Every adult occupant should sign."
        />
      </FormSection>

      <FormSection title="Property">
        <TextField {...f.text('propertyAddress')} className={full} label="Rental property address" required placeholder="Street, Unit, City, State ZIP" />
        <SelectField {...f.text('propertyState')} label="State" required options={STATE_OPTIONS} />
        <TextField {...f.text('maxOccupants')} label="Maximum occupants" inputMode="numeric" maxLength={2} />
        <Toggle {...f.toggle('furnished')} className={full} label="Furnished" />
        <Toggle
          {...f.toggle('builtBefore1978')}
          className={full}
          label="Built before 1978"
          description="Adds the federally required lead-based paint disclosure."
        />
        {d.builtBefore1978 && (
          <>
            <Segmented
              className={full}
              label="Known lead-based paint hazards?"
              name="leadKnowledge"
              value={d.leadKnowledge}
              onChange={(v) => f.set('leadKnowledge', v)}
              options={[
                { value: 'none', label: 'None known' },
                { value: 'known', label: 'Yes, known' },
              ]}
            />
            {d.leadKnowledge === 'known' && (
              <TextArea {...f.text('leadDetails')} className={full} label="Describe known hazards" required rows={2} />
            )}
          </>
        )}
      </FormSection>

      <FormSection title="Lease term">
        <Segmented
          className={full}
          label="Term type"
          name="termType"
          value={d.termType}
          onChange={(v) => f.set('termType', v)}
          options={[
            { value: 'fixed', label: 'Fixed term' },
            { value: 'month_to_month', label: 'Month-to-month' },
          ]}
        />
        <TextField {...f.text('startDate')} label="Start date" type="date" required />
        {d.termType === 'fixed' && <TextField {...f.text('endDate')} label="End date" type="date" required />}
        <TextField
          {...f.text('noticeDays')}
          label="Termination notice (days)"
          inputMode="numeric"
          maxLength={3}
          hint="Check your state's minimum."
        />
      </FormSection>

      <FormSection title="Rent & deposit">
        <TextField {...f.text('monthlyRent')} label="Monthly rent" prefix="$" inputMode="decimal" required />
        <TextField {...f.text('rentDueDay')} label="Due on day of month" inputMode="numeric" maxLength={2} required />
        <TextField {...f.text('paymentMethod')} className={full} label="Payment method" required placeholder="Zelle, check, bank transfer…" />
        <TextField {...f.text('lateFee')} label="Late fee" prefix="$" inputMode="decimal" hint="Leave blank for none. Many states cap late fees." />
        <TextField {...f.text('graceDays')} label="Grace period (days)" inputMode="numeric" maxLength={2} />
        <TextField
          {...f.text('securityDeposit')}
          className={full}
          label="Security deposit"
          prefix="$"
          inputMode="decimal"
          hint="Many states limit the deposit amount and set a deadline to return it."
        />
      </FormSection>

      <FormSection title="Utilities & house rules">
        <TextField {...f.text('utilitiesTenant')} className={full} label="Utilities paid by tenant" />
        <TextField {...f.text('utilitiesLandlord')} className={full} label="Utilities paid by landlord" />
        <Toggle {...f.toggle('petsAllowed')} className={full} label="Pets allowed (with approval)" />
        {d.petsAllowed && <TextField {...f.text('petDeposit')} className={full} label="Pet deposit" prefix="$" inputMode="decimal" />}
        <Toggle {...f.toggle('smokingAllowed')} className={full} label="Smoking allowed in designated areas" />
        <TextArea {...f.text('additionalTerms')} className={full} label="Additional terms" rows={4} maxLength={3000} placeholder="Parking space #12 included. Tenant mows the lawn." />
      </FormSection>
    </GeneratorShell>
  );
}
