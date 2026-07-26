export interface LoanSummary {
  reference: string;
  customer: string;
  vehicle: string;
  totalInstallments: number;
  installmentsPaid: number;
  installmentsOwed: number;
  totalValue: number;
  totalPaid: number;
  totalOwed: number;
}

export interface OverdueInstallment {
  loanReference: string;
  number: number;
  amount: number;
  dateExpiration: string;
  customer: string;
  vehicle: string;
  daysOverdue: number;
}
