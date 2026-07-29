import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { OverdueInstallment } from 'src/app/core/models';

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.scss']
})
export class InstallmentsComponent implements OnInit {
  dataSource = new MatTableDataSource<OverdueInstallment>([]);
  loading = false;
  displayedColumns = ['loanReference', 'number', 'customer', 'vehicle', 'amount', 'dateExpiration', 'daysOverdue'];

  constructor(
    private installmentService: InstallmentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOverdue();
  }

  loadOverdue(): void {
    this.loading = true;
    this.installmentService.getAllOverdue().subscribe({
      next: (overdue) => {
        this.dataSource.data = overdue;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  viewLoan(item: OverdueInstallment): void {
    this.router.navigate(['/installments', 'loan', item.loanReference]);
  }
}
