import { EPaymentMethod } from './enums';

export interface InstallmentResponse {
  loanReference: string;
  number: number;
  paymentReference: string;
  amount: number;
  amountPaid: number;
  dateExpiration: string;
  datePayment: string | null;
  paid: boolean;
}

export interface RegisterPaymentRequest {
  method: EPaymentMethod;
  amount: number;
}
