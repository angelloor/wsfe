import { Taxpayer } from '../taxpayer.types';

export interface EmissionPoint {
  id_emission_point: string;
  taxpayer: Taxpayer;
  value_emission_point: string;
  description_emission_point: string;
  deleted_emission_point: boolean;
}
