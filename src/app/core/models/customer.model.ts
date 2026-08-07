import { EDocumentType } from './enums';

export interface CustomerResponse {
  documentType: EDocumentType;
  documentNumber: number;
  name: string;
  lastname: string;
  age: number;
  address: string;
}

export interface CreateCustomerRequest {
  documentType: EDocumentType;
  documentNumber: number;
  name: string;
  lastname: string;
  age: number;
  address: string;
}

export interface UpdateCustomerRequest {
  name: string;
  lastname: string;
  age: number;
  address: string;
}
