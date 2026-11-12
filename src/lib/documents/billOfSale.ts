import type { BillOfSaleData } from '../schemas';
import { BLANK, longDate, money, val } from '../format';
import type { Block, DocModel } from './types';

export function buildBillOfSale(d: BillOfSaleData): DocModel {
  const vehicle = d.itemType === 'vehicle';
  const blocks: Block[] = [];
  let n = 0;
  const h = (text: string) => blocks.push({ type: 'heading', text: `${++n}. ${text}` });

  blocks.push({
    type: 'paragraph',
    text: `This ${vehicle ? 'Vehicle ' : ''}Bill of Sale ("Bill of Sale") is made and entered into on ${longDate(
      d.saleDate,
    )}, in the State of ${val(d.saleState)}, by and between the Seller and the Buyer identified below.`,
  });

  h('Seller');
  blocks.push({
    type: 'fields',
    rows: [
      { label: 'Full legal name', value: val(d.sellerName) },
      { label: 'Phone', value: val(d.sellerPhone, '—') },
      { label: 'Address', value: val(d.sellerAddress) },
    ],
  });

  h('Buyer');
  blocks.push({
    type: 'fields',
    rows: [
      { label: 'Full legal name', value: val(d.buyerName) },
      { label: 'Phone', value: val(d.buyerPhone, '—') },
      { label: 'Address', value: val(d.buyerAddress) },
    ],
  });

  h(vehicle ? 'Vehicle Description' : 'Description of Property');
  if (vehicle) {
    blocks.push({
      type: 'fields',
      rows: [
        { label: 'Year', value: val(d.vehicleYear) },
        { label: 'Make', value: val(d.vehicleMake) },
        { label: 'Model', value: val(d.vehicleModel) },
        { label: 'Body style', value: val(d.vehicleBody, '—') },
        { label: 'Color', value: val(d.vehicleColor, '—') },
        { label: 'Odometer (miles)', value: val(d.vehicleOdometer) },
        { label: 'Vehicle Identification Number (VIN)', value: val(d.vehicleVin).toUpperCase() },
      ],
    });
  } else {
    blocks.push({ type: 'paragraph', text: val(d.itemDescription) });
    if (d.itemSerial.trim())
      blocks.push({ type: 'fields', rows: [{ label: 'Serial / ID number', value: d.itemSerial.trim() }] });
  }
  h('Purchase Price');
  blocks.push({
    type: 'paragraph',
    text: `The Buyer agrees to pay, and the Seller agrees to accept, the total purchase price of ${money(
      d.price,
    )} (U.S. Dollars)${d.paymentMethod.trim() ? `, paid by ${d.paymentMethod.trim()}` : ''}. By signing below, the Seller acknowledges receipt of the full purchase price in exchange for the ${
      vehicle ? 'Vehicle' : 'Property'
    }.`,
  });

  if (vehicle) {
    h('Federal Odometer Disclosure Statement');
    blocks.push({
      type: 'paragraph',
      text: 'Federal law (and State law, if applicable) requires that you state the mileage upon transfer of ownership. Failure to complete or providing a false statement may result in fines and/or imprisonment.',
    });
    blocks.push({
      type: 'paragraph',
      text: `I, the Seller, state that the odometer now reads ${val(
        d.vehicleOdometer,
        BLANK,
      )} miles (no tenths) and, to the best of my knowledge, that it:`,
    });
    blocks.push({
      type: 'checklist',
      items: [
        { label: 'Reflects the actual mileage of the vehicle described above.', checked: d.odometerStatus === 'actual' },
        {
          label: 'Reflects the amount of mileage in excess of its mechanical limits.',
          checked: d.odometerStatus === 'exceeds',
        },
        {
          label: 'Is NOT the actual mileage. WARNING - ODOMETER DISCREPANCY.',
          checked: d.odometerStatus === 'not_actual',
        },
      ],
    });
  }

  h('Condition and Warranties');
  blocks.push({
    type: 'paragraph',
    text: d.asIs
      ? `The ${vehicle ? 'Vehicle' : 'Property'} is sold "AS IS, WHERE IS," with all faults, and without any warranty of any kind, express or implied, including any implied warranty of merchantability or fitness for a particular purpose. The Buyer acknowledges having had the opportunity to inspect the ${
          vehicle ? 'Vehicle' : 'Property'
        } and accepts it in its present condition.`
      : `The Seller represents that the ${
          vehicle ? 'Vehicle' : 'Property'
        } is delivered in the condition represented to the Buyer at the time of sale. Except as expressly stated in this Bill of Sale, no other warranties are given.`,
  });

  h("Seller's Representations");
  blocks.push({
    type: 'paragraph',
    text: `The Seller represents and warrants that the Seller is the lawful owner of the ${
      vehicle ? 'Vehicle' : 'Property'
    }, has full right and authority to sell and transfer it, and that it is free and clear of all liens, security interests and encumbrances, except as disclosed in writing to the Buyer. The Seller agrees to defend the title against the lawful claims of any other person.`,
  });

  h('Transfer, Taxes and Fees');
  blocks.push({
    type: 'paragraph',
    text: vehicle
      ? `The Seller shall deliver the signed certificate of title to the Buyer. The Buyer is responsible for titling, registration, sales or use taxes and all fees arising after the date of sale. Each party is responsible for completing any notice of transfer, release of liability, or license plate requirements of the ${val(
          d.saleState,
        )} motor vehicle agency.`
      : 'The Buyer is responsible for any sales or use taxes, registration and fees arising from this sale after the date of sale.',
  });

  h('Signatures');
  blocks.push({
    type: 'paragraph',
    text: 'The parties have executed this Bill of Sale on the date first written above.',
  });
  blocks.push({
    type: 'signatures',
    parties: [
      { role: 'Seller', name: val(d.sellerName) },
      { role: 'Buyer', name: val(d.buyerName) },
    ],
  });

  if (d.includeNotary) {
    blocks.push({ type: 'heading', text: 'Notary Acknowledgment' });
    blocks.push({
      type: 'paragraph',
      text: `State of ${BLANK}    County of ${BLANK}\n\nOn ${BLANK}, before me, ${BLANK}, a Notary Public, personally appeared ${BLANK}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies). Witness my hand and official seal.`,
    });
    blocks.push({ type: 'signatures', parties: [{ role: 'Notary Public', name: BLANK, date: 'My commission expires: ' + BLANK }] });
  }

  blocks.push({
    type: 'note',
    text: 'Some states require a specific state form, notarization, or additional disclosures for vehicle sales. Check your state motor vehicle agency before relying on this document.',
  });

  return {
    title: vehicle ? 'Vehicle Bill of Sale' : 'Bill of Sale',
    subtitle: `State of ${val(d.saleState)}`,
    blocks,
  };
}
