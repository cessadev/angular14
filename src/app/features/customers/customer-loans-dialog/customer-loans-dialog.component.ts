import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/core/services/loan.service';
import { CustomerResponse, LoanResponse, INSTALLMENTS_TERM_MONTHS, EInstallmentsTerm } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services/notification.service';

export interface CustomerLoansDialogData {
  customer: CustomerResponse;
}

@Component({
  selector: 'app-customer-loans-dialog',
  templateUrl: './customer-loans-dialog.component.html',
  styleUrls: ['./customer-loans-dialog.component.scss']
})
export class CustomerLoansDialogComponent implements OnInit {
  loans: LoanResponse[] = [];
  loading = false;
  termMonths = INSTALLMENTS_TERM_MONTHS;
  displayedColumns = ['reference', 'vehicleIdentifier', 'amount', 'installments', 'dateCreation'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerLoansDialogData,
    private dialogRef: MatDialogRef<CustomerLoansDialogComponent>,
    private loanService: LoanService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loanService.getByCustomer(this.data.customer.documentType, this.data.customer.documentNumber).subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.notificationService.error(err.message);
      }
    });
  }

  viewDetail(loan: LoanResponse): void {
    this.dialogRef.close();
    this.router.navigate(['/loans', loan.reference]);
  }

  getTermMonths(term: EInstallmentsTerm): number {
    return INSTALLMENTS_TERM_MONTHS[term];
  }
}
