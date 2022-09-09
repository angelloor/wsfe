export interface Setting {
  id_setting: string;
  expiration_token: number;
  expiration_verification_code: number;
  inactivity_time: number;
  session_limit: number;
  save_alfresco: boolean;
  wait_autorization: number;
  batch_shipping: boolean;
  max_generation_pdf: number;
  wait_generation_pdf: number;
  deleted_setting: boolean;
}
