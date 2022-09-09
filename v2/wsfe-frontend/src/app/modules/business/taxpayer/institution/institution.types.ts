import { TYPE_ENVIRONMENT } from '../../business.types';
import { Taxpayer } from '../taxpayer.types';

export interface Institution {
  id_institution: string;
  taxpayer: Taxpayer;
  type_environment: TYPE_ENVIRONMENT;
  name_institution: string;
  description_institution: string;
  address_institution: string;
  status_institution: boolean;
  status_by_batch_institution: boolean;
  deleted_institution: boolean;
  value_sequence?: string;
}
