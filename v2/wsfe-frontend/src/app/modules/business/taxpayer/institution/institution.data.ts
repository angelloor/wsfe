import { taxpayer } from '../taxpayer.data';
import { Institution } from './institution.types';

export const institutions: Institution[] = [];
export const institution: Institution = {
  id_institution: '',
  taxpayer: taxpayer,
  type_environment: '1',
  name_institution: '',
  description_institution: '',
  address_institution: '',
  status_institution: false,
  status_by_batch_institution: false,
  deleted_institution: false,
};
