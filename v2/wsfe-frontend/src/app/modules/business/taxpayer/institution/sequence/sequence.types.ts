import {
  TYPE_ENVIRONMENT,
  TYPE_VOUCHER,
} from 'app/modules/business/business.types';
import { EmissionPoint } from '../../emission-point/emission-point.types';
import { Establishment } from '../../establishment/establishment.types';
import { Institution } from '../institution.types';

export interface Sequence {
  id_sequence: string;
  institution: Institution;
  establishment: Establishment;
  emission_point: EmissionPoint;
  type_environment: TYPE_ENVIRONMENT;
  type_voucher: TYPE_VOUCHER;
  number_code_sequence: string;
  status_sequence: boolean;
  deleted_sequence: boolean;
  value_sequence?: string;
}
