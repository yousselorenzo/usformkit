'use client';

import { useMemo } from 'react';
import { buildBillOfSale } from '@/lib/documents';
import { todayISO } from '@/lib/format';
import { billOfSaleSchema, type BillOfSaleData } from '@/lib/schemas';
import { FormSection, STATE_OPTIONS, Segmented, SelectField, TextArea, TextField, Toggle, full } from '../form/Fields';
import { GeneratorShell } from './GeneratorShell';
import { useDocForm } from './useDocForm';

const DEFAULTS: BillOfSaleData = {
  itemType: 'vehicle',
  saleState: '',
  saleDate: '',
  price: '',
  paymentMethod: '',
  sellerName: '',
  sellerAddress: '',
  sellerPhone: '',
  buyerName: '',
  buyerAddress: '',
  buyerPhone: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleBody: '',
  vehicleColor: '',
  vehicleVin: '',
  vehicleOdometer: '',
  odometerStatus: 'actual',
  itemDescription: '',
  itemSerial: '',
  asIs: true,
  includeNotary: false,
};

export function BillOfSaleGenerator() {
  const f = useDocForm<BillOfSaleData>('bill-of-sale', { ...DEFAULTS, saleDate: todayISO() }, billOfSaleSchema);
  const d = f.data;
  const doc = useMemo(() => buildBillOfSale(d), [d]);
  const vehicle = d.itemType === 'vehicle';

  return (
    <GeneratorShell docType="bill-of-sale" doc={doc} data={d} validate={f.validate} setServerErrors={f.setErrors}>
      <FormSection title="What are you selling?">
        <Segmented
          className={full}
          label="Type of sale"
          name="itemType"
          value={d.itemType}
          onChange={(v) => f.set('itemType', v)}
          options={[
            { value: 'vehicle', label: 'Vehicle' },
            { value: 'general', label: 'General item' },
          ]}
        />
        <SelectField {...f.text('saleState')} label="State of sale" required options={STATE_OPTIONS} />
        <TextField {...f.text('saleDate')} label="Date of sale" type="date" required />
      </FormSection>

      <FormSection title="Seller">
        <TextField {...f.text('sellerName')} label="Full legal name" required autoComplete="name" />
        <TextField {...f.text('sellerPhone')} label="Phone" type="tel" inputMode="tel" autoComplete="tel" />
        <TextField {...f.text('sellerAddress')} className={full} label="Address" required placeholder="Street, City, State ZIP" autoComplete="street-address" />
      </FormSection>

      <FormSection title="Buyer">
        <TextField {...f.text('buyerName')} label="Full legal name" required />
        <TextField {...f.text('buyerPhone')} label="Phone" type="tel" inputMode="tel" />
        <TextField {...f.text('buyerAddress')} className={full} label="Address" required placeholder="Street, City, State ZIP" />
      </FormSection>

      {vehicle ? (
        <FormSection title="Vehicle" description="Copy these details exactly as they appear on the certificate of title.">
          <TextField {...f.text('vehicleYear')} label="Year" required inputMode="numeric" maxLength={4} placeholder="2018" />
          <TextField {...f.text('vehicleMake')} label="Make" required placeholder="Toyota" />
          <TextField {...f.text('vehicleModel')} label="Model" required placeholder="Camry" />
          <TextField {...f.text('vehicleBody')} label="Body style" placeholder="Sedan" />
          <TextField {...f.text('vehicleColor')} label="Color" />
          <TextField {...f.text('vehicleOdometer')} label="Odometer (miles)" required inputMode="numeric" placeholder="84,250" />
          <TextField
            {...f.text('vehicleVin')}
            className={full}
            label="VIN"
            required
            uppercase
            maxLength={17}
            hint="17 characters on vehicles built since 1981. Found on the dashboard, door jamb and title."
          />
          <SelectField
            {...f.text('odometerStatus')}
            className={full}
            label="Odometer disclosure"
            options={[
              { value: 'actual', label: 'Reading is the actual mileage' },
              { value: 'exceeds', label: 'Mileage exceeds mechanical limits' },
              { value: 'not_actual', label: 'NOT the actual mileage (discrepancy)' },
            ]}
          />
        </FormSection>
      ) : (
        <FormSection title="Item">
          <TextArea
            {...f.text('itemDescription')}
            className={full}
            label="Description"
            required
            rows={4}
            maxLength={1200}
            placeholder="e.g. 2021 Yamaha upright piano, model U1, black polished finish, with bench."
          />
          <TextField {...f.text('itemSerial')} className={full} label="Serial / ID number" />
        </FormSection>
      )}

      <FormSection title="Payment & terms">
        <TextField {...f.text('price')} label="Sale price" prefix="$" inputMode="decimal" required placeholder="0.00" />
        <TextField {...f.text('paymentMethod')} label="Payment method" placeholder="Cashier's check" />
        <Toggle
          {...f.toggle('asIs')}
          className={full}
          label='Sold "as is"'
          description="No warranties. Recommended for most private-party sales."
        />
        <Toggle
          {...f.toggle('includeNotary')}
          className={full}
          label="Add notary acknowledgment"
          description="Some states or buyers require the signatures to be notarized."
        />
      </FormSection>
    </GeneratorShell>
  );
}
