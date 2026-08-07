import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/core/services/payment.service';
import { PaymentResponse, PAYMENT_METHOD_LABELS, EPaymentMethod } from 'src/app/core/models';

@Component({
  selector: 'app-loan-payments',
  templateUrl: './loan-payments.component.html',
  styleUrls: ['./loan-payments.component.scss']
})
export class LoanPaymentsComponent implements OnInit {
  payments: PaymentResponse[] = [];
  loanReference = '';
  paymentReference: string | null = null;
  loading = false;
  displayedColumns = ['number', 'installmentNumber', 'amount', 'method', 'date'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loanReference = this.route.snapshot.paramMap.get('reference') ?? '';
    this.paymentReference = this.route.snapshot.queryParamMap.get('paymentReference');
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;

    const request$ = this.paymentReference
      ? this.paymentService.getByInstallment(this.paymentReference)
      : this.paymentService.getByLoan(this.loanReference);

    request$.subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  methodLabel(method: EPaymentMethod): string {
    return PAYMENT_METHOD_LABELS[method];
  }

  goBack(): void {
    this.router.navigate(['/loans', this.loanReference]);
  }
}
