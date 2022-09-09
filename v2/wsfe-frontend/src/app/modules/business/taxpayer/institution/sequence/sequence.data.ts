import { emissionPoint } from '../../emission-point/emission-point.data';
import { establishment } from '../../establishment/establishment.data';
import { institution } from '../institution.data';
import { Sequence } from './sequence.types';

export const sequences: Sequence[] = [];
export const sequence: Sequence = {
  id_sequence: '',
  institution: institution,
  establishment: establishment,
  emission_point: emissionPoint,
  type_environment: '1',
  type_voucher: '01',
  number_code_sequence: '',
  status_sequence: false,
  deleted_sequence: false,
};
