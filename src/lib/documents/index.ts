import type { DocType } from '../products';
import type { BillOfSaleData, LeaseData, W9Data } from '../schemas';
import { buildBillOfSale } from './billOfSale';
import { buildLease } from './lease';
import { buildW9 } from './w9';
import type { BuildOptions, DocModel } from './types';

export type { Block, DocModel, BuildOptions } from './types';
export { buildBillOfSale, buildLease, buildW9 };

export function buildDocument(docType: DocType, data: unknown, opts: BuildOptions): DocModel {
  switch (docType) {
    case 'bill-of-sale':
      return buildBillOfSale(data as BillOfSaleData);
    case 'w9':
      return buildW9(data as W9Data, opts);
    case 'lease':
      return buildLease(data as LeaseData);
  }
}
