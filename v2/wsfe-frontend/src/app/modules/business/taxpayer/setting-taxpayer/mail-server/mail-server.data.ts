import { taxpayer } from '../../taxpayer.data';
import { MailServer } from './mail-server.types';

export const mailServers: MailServer[] = [];
export const mailServer: MailServer = {
  id_mail_server: '',
  taxpayer: taxpayer,
  type_mail_server: 'office365',
  host_mail_server: '',
  port_mail_server: 1,
  secure_mail_server: false,
  user_mail_server: '',
  password_mail_server: '',
  status_mail_server: false,
};
