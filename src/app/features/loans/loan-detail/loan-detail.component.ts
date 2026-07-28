import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { LoanService } from 'src/app/core/services/loan.service';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { LoanResponse, LoanSummary, INSTALLMENTS_TERM_MONTHS } from 'src/app/core/models';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  loan?: LoanResponse;
  summary?: LoanSummary;
  loading = true;
  notFound = false;
  termMonths = INSTALLMENTS_TERM_MONTHS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private installmentService: InstallmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const reference = this.route.snapshot.paramMap.get('reference');
    if (!reference) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    forkJoin({
      loan: this.loanService.getByReference(reference),
      summary: this.installmentService.getSummary(reference)
    }).subscribe({
      next: ({ loan, summary }) => {
        this.loan = loan;
        this.summary = summary;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.notFound = true;
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loans']);
  }

  goToInstallments(): void {
    this.router.navigate(['/installments', 'loan', this.loan?.reference]);
  }
}
