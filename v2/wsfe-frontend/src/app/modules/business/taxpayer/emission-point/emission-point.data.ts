import { taxpayer } from '../taxpayer.data';
import { EmissionPoint } from './emission-point.types';

export const emissionPoints: EmissionPoint[] = [];
export const emissionPoint: EmissionPoint = {
  id_emission_point: '',
  taxpayer: taxpayer,
  value_emission_point: '',
  description_emission_point: '',
  deleted_emission_point: false,
};
