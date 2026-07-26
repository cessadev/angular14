import { EInstallmentsTerm } from './enums';

export interface LoanResponse {
  reference: string;
  customerDocumentNumber: number;
  vehicleIdentifier: string;
  amount: number;
  installments: EInstallmentsTerm;
  dateCreation: string;
}

export interface CreateLoanRequest {
  customerDocumentNumber: number;
  vehicleIdentifier: string;
  amount: number;
  installments: EInstallmentsTerm;
}
