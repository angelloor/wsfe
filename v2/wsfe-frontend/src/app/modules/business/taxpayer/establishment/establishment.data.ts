import { taxpayer } from '../taxpayer.data';
import { Establishment } from './establishment.types';

export const establishments: Establishment[] = [];
export const establishment: Establishment = {
  id_establishment: '',
  taxpayer: taxpayer,
  value_establishment: '',
  description_establishment: '',
  deleted_establishment: false,
};
