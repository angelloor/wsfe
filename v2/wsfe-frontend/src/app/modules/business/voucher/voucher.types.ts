import { BodyVoucher } from '../business.types';
import { Institution } from '../taxpayer/institution/institution.types';

export interface Voucher {
  id_voucher: string;
  institution: Institution;
  type_environment: string;
  type_emission: string;
  type_voucher: string;
  number_voucher: string;
  access_key_voucher: string;
  emission_date_voucher: string;
  authorization_date_voucher: string;
  buyer_identifier_voucher: string;
  body_voucher: BodyVoucher;
  internal_status_voucher: string;
  global_status_voucher: string;
  action_pdf_voucher: boolean;
  action_email_voucher: boolean;
  action_alfresco_voucher: boolean;
  messages_voucher: string;
  deleted_voucher: boolean;
  /**
   * Extras Attributes (Pagination)
   */
  page_number?: number;
  amount?: number;
  order_by?: string;

  type_file_voucher?: string;
}
