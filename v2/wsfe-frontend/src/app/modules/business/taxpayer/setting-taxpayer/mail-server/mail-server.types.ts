import { TYPE_MAIL_SERVER } from 'app/modules/business/business.types';
import { Taxpayer } from '../../taxpayer.types';

export interface MailServer {
  id_mail_server: string;
  taxpayer: Taxpayer;
  type_mail_server: TYPE_MAIL_SERVER;
  host_mail_server: string;
  port_mail_server: number;
  secure_mail_server: boolean;
  user_mail_server: string;
  password_mail_server: string;
  status_mail_server: boolean;
}
