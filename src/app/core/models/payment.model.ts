import { EPaymentMethod } from './enums';

export interface PaymentResponse {
  number: string;
  amount: number;
  method: EPaymentMethod;
  referencePayment: string;
  date: string;
  installmentNumber: number;
  loanReference: string;
}
