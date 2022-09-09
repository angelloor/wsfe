import { Taxpayer } from '../taxpayer.types';

export interface Establishment {
  id_establishment: string;
  taxpayer: Taxpayer;
  value_establishment: string;
  description_establishment: string;
  deleted_establishment: boolean;
}
