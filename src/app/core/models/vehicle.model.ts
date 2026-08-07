import { EVehicleBrand } from './enums';

export interface VehicleResponse {
  identifier: string;
  brand: EVehicleBrand;
  model: string;
  marketValue: number;
  year: number;
}

export interface RegisterVehicleRequest {
  identifier: string;
  brand: EVehicleBrand;
  model: string;
  marketValue: number;
  year: number;
}

export interface UpdateVehicleRequest {
  brand: EVehicleBrand;
  model: string;
  marketValue: number;
  year: number;
}
