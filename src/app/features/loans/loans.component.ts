import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoanResponse, EInstallmentsTerm, INSTALLMENTS_TERM_MONTHS, CreateLoanRequest } from 'src/app/core/models';
import { LoanFormDialogComponent } from './loan-form-dialog/loan-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { LoanSimulationDialogComponent } from './loan-simulation-dialog/loan-simulation-dialog.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  loans: LoanResponse[] = [];
  loading = false;
  termMonths = INSTALLMENTS_TERM_MONTHS;

  constructor(
    private loanService: LoanService,
    private dialog: Dialog,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getAll().subscribe({
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open<CreateLoanRequest, unknown, LoanFormDialogComponent>(LoanFormDialogComponent, { width: '520px' });

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.loanService.create(request).subscribe({
        next: () => {
          this.notificationService.success('Préstamo creado correctamente');
          this.loadLoans();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  viewDetail(loan: LoanResponse): void {
    this.router.navigate(['/loans', loan.reference]);
  }

  deleteLoan(loan: LoanResponse, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar préstamo',
        message: `¿Seguro que desea eliminar el préstamo ${loan.reference}?`
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loanService.delete(loan.reference).subscribe({
        next: () => {
          this.notificationService.success('Préstamo eliminado');
          this.loadLoans();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  openSimulationDialog(): void {
    this.dialog.open(LoanSimulationDialogComponent, { width: '560px' });
  }

  getTermMonths(term: EInstallmentsTerm): number {
    return INSTALLMENTS_TERM_MONTHS[term];
  }
}
