import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { InstallmentResponse } from 'src/app/core/models';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
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
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '420px',
      data: { installment }
    });

    dialogRef.afterClosed().subscribe((request) => {
      if (!request) return;

      this.installmentService.registerPayment(installment.paymentReference, request).subscribe({
        next: () => {
          this.snackBar.open('Pago registrado correctamente', 'Cerrar', { duration: 3000 });
          this.loadInstallments();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/loans', this.loanReference]);
  }
}
