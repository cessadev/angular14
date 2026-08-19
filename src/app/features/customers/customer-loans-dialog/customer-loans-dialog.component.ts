import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerResponse, LoanResponse, INSTALLMENTS_TERM_MONTHS, EInstallmentsTerm } from 'src/app/core/models';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface CustomerLoansDialogData {
  customer: CustomerResponse;
  loans: LoanResponse[];
}

@Component({
  selector: 'app-customer-loans-dialog',
  templateUrl: './customer-loans-dialog.component.html',
  styleUrls: ['./customer-loans-dialog.component.scss']
})
export class CustomerLoansDialogComponent {
  termMonths = INSTALLMENTS_TERM_MONTHS;

  constructor(
    @Inject(DIALOG_DATA) public data: CustomerLoansDialogData,
    private dialogRef: DialogRef<unknown, CustomerLoansDialogComponent>,
    private router: Router
  ) {}

  viewDetail(loan: LoanResponse): void {
    this.dialogRef.close();
    this.router.navigate(['/loans', loan.reference]);
  }

  close(): void {
    this.dialogRef.close();
  }

  getTermMonths(term: EInstallmentsTerm): number {
    return INSTALLMENTS_TERM_MONTHS[term];
  }
}
