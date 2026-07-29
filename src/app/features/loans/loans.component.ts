import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoanResponse, EInstallmentsTerm, INSTALLMENTS_TERM_MONTHS } from 'src/app/core/models';
import { LoanFormDialogComponent } from './loan-form-dialog/loan-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  dataSource = new MatTableDataSource<LoanResponse>([]);
  loading = false;
  displayedColumns = ['reference', 'customerDocumentNumber', 'vehicleIdentifier', 'amount', 'installments', 'dateCreation', 'actions'];
  termMonths = INSTALLMENTS_TERM_MONTHS;

  constructor(
    private loanService: LoanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getAll().subscribe({
      next: (loans) => {
        this.dataSource.data = loans;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(LoanFormDialogComponent, { width: '520px' });

    dialogRef.afterClosed().subscribe((request) => {
      if (!request) return;

      this.loanService.create(request).subscribe({
        next: () => {
          this.snackBar.open('Préstamo creado correctamente', 'Cerrar', { duration: 3000 });
          this.loadLoans();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
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
        message: `¿Seguro que deseas eliminar el préstamo ${loan.reference}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.loanService.delete(loan.reference).subscribe({
        next: () => {
          this.snackBar.open('Préstamo eliminado', 'Cerrar', { duration: 3000 });
          this.loadLoans();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
        }
      });
    });
  }

  getTermMonths(term: EInstallmentsTerm): number {
    return INSTALLMENTS_TERM_MONTHS[term];
  }
}
