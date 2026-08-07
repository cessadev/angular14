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

export interface SimulateLoanRequest {
  amount: number;
  installments: EInstallmentsTerm;
  vehicleIdentifier?: string | null;
}

export interface SimulatedInstallment {
  number: number;
  amount: number;
  dateExpiration: string;
}

export interface LoanSimulation {
  amount: number;
  installments: EInstallmentsTerm;
  installmentValue: number;
  totalToPay: number;
  schedule: SimulatedInstallment[];
}
