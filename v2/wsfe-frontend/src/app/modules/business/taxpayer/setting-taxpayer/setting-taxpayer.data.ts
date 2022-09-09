import { mailServer } from './mail-server/mail-server.data';
import { SettingTaxpayer } from './setting-taxpayer.types';

export const settingTaxpayers: SettingTaxpayer[] = [];
export const settingTaxpayer: SettingTaxpayer = {
  id_setting_taxpayer: '',
  mail_server: mailServer,
  mailing_setting_taxpayer: false,
  from_setting_taxpayer: '',
  subject_setting_taxpayer: '',
  html_setting_taxpayer: '',
  download_note_setting_taxpayer: '',
  logo_path_setting_taxpayer: '',
};
