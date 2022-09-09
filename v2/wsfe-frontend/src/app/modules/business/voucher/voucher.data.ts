import { _bodyVoucher } from '../business.types';
import { institution } from '../taxpayer/institution/institution.data';
import { Voucher } from './voucher.types';

export const vouchers: Voucher[] = [];
export const voucher: Voucher = {
  id_voucher: '',
  institution: institution,
  type_environment: '',
  type_emission: '',
  type_voucher: '',
  number_voucher: '',
  access_key_voucher: '',
  emission_date_voucher: '',
  authorization_date_voucher: '',
  buyer_identifier_voucher: '',
  body_voucher: _bodyVoucher,
  internal_status_voucher: '',
  global_status_voucher: '',
  action_pdf_voucher: false,
  action_email_voucher: false,
  action_alfresco_voucher: false,
  messages_voucher: '',
  deleted_voucher: false,
};
