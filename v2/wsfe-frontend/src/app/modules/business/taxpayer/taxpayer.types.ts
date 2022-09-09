import { Company } from 'app/modules/core/company/company.types';
import { User } from 'app/modules/core/user/user.types';
import { TYPE_ACCOUNTING_OBLIGED, TYPE_EMISSION } from '../business.types';
import { SettingTaxpayer } from './setting-taxpayer/setting-taxpayer.types';

export interface Taxpayer {
  id_taxpayer: string;
  company: Company;
  user: User;
  setting_taxpayer?: SettingTaxpayer;
  type_emission: TYPE_EMISSION;
  business_name_taxpayer: string;
  tradename_taxpayer: string;
  ruc_taxpayer: string;
  dir_matriz_taxpayer: string;
  signature_password_taxpayer: string;
  signature_path_taxpayer: string;
  status_taxpayer: boolean;
  accounting_obliged: TYPE_ACCOUNTING_OBLIGED;
  status_by_batch_taxpayer: boolean;
  deleted_taxpayer: boolean;
}
