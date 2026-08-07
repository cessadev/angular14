import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanService } from 'src/app/core/services/loan.service';
import { CustomerResponse, LoanResponse, INSTALLMENTS_TERM_MONTHS, EInstallmentsTerm } from 'src/app/core/models';

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
    private snackBar: MatSnackBar
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
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
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
