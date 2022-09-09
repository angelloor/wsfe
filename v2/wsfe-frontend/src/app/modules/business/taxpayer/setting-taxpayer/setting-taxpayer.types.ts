import { MailServer } from './mail-server/mail-server.types';

export interface SettingTaxpayer {
  id_setting_taxpayer: string;
  mail_server: MailServer;
  mailing_setting_taxpayer: boolean;
  from_setting_taxpayer: string;
  subject_setting_taxpayer: string;
  html_setting_taxpayer: string;
  download_note_setting_taxpayer: string;
  logo_path_setting_taxpayer: string;
}
