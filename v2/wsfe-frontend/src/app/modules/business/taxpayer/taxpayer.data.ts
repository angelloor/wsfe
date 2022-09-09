import { company } from 'app/modules/core/company/company.data';
import { user } from 'app/modules/core/user/user.data';
import { Taxpayer } from './taxpayer.types';

export const taxpayers: Taxpayer[] = [];

export const taxpayer: Taxpayer = {
  id_taxpayer: '',
  company: company,
  user: user,
  type_emission: '1',
  business_name_taxpayer: '',
  tradename_taxpayer: '',
  ruc_taxpayer: '',
  dir_matriz_taxpayer: '',
  signature_password_taxpayer: '',
  signature_path_taxpayer: '',
  status_taxpayer: false,
  accounting_obliged: 'NO',
  status_by_batch_taxpayer: false,
  deleted_taxpayer: false,
};
