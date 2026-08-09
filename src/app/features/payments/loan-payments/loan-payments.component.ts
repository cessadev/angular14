import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/core/services/payment.service';
import { PaymentResponse, PAYMENT_METHOD_LABELS, EPaymentMethod } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services/notification.service';

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
    private notificationService: NotificationService
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
        this.notificationService.error(err.message);
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
