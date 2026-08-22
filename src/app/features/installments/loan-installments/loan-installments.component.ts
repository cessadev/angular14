import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { InstallmentResponse, RegisterPaymentRequest } from 'src/app/core/models';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';

type InstallmentStatus = 'paid' | 'overdue' | 'pending';

@Component({
  selector: 'app-loan-installments',
  templateUrl: './loan-installments.component.html',
  styleUrls: ['./loan-installments.component.scss']
})
export class LoanInstallmentsComponent implements OnInit {
  installments: InstallmentResponse[] = [];
  loanReference = '';
  loading = false;
  displayedColumns = ['number', 'amount', 'amountPaid', 'dateExpiration', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private installmentService: InstallmentService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loanReference = this.route.snapshot.paramMap.get('reference') ?? '';
    this.loadInstallments();
  }

  loadInstallments(): void {
    this.loading = true;
    this.installmentService.getByLoan(this.loanReference).subscribe({
      next: (installments) => {
        this.installments = installments.sort((a, b) => a.number - b.number);
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.notificationService.error(err.message);
      }
    });
  }

  status(installment: InstallmentResponse): InstallmentStatus {
    if (installment.paid) return 'paid';
    const today = new Date();
    const expiration = new Date(installment.dateExpiration);
    return expiration < today ? 'overdue' : 'pending';
  }

  statusLabel(status: InstallmentStatus): string {
    return { paid: 'Pagada', overdue: 'Vencida', pending: 'Pendiente' }[status];
  }

  openPaymentDialog(installment: InstallmentResponse): void {
    const dialogRef = this.dialog.open<RegisterPaymentRequest, unknown, PaymentDialogComponent>(PaymentDialogComponent, {
      width: '420px',
      data: { installment }
    });

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.installmentService.registerPayment(installment.paymentReference, request).subscribe({
        next: () => {
          this.notificationService.success('Pago registrado correctamente');
          this.loadInstallments();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  viewPayments(installment: InstallmentResponse): void {
    this.router.navigate(['/payments', 'loan', this.loanReference], {
      queryParams: { paymentReference: installment.paymentReference }
    });
  }

  goBack(): void {
    this.router.navigate(['/loans', this.loanReference]);
  }
}
