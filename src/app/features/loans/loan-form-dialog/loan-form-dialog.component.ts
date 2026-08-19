import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import {
  CustomerResponse, VehicleResponse, EInstallmentsTerm,
  INSTALLMENTS_TERM_MONTHS, CreateLoanRequest
} from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-loan-form-dialog',
  templateUrl: './loan-form-dialog.component.html',
  styleUrls: ['./loan-form-dialog.component.scss']
})
export class LoanFormDialogComponent implements OnInit {
  form: FormGroup;
  loadingOptions = true;
  loadError = false;

  customers: CustomerResponse[] = [];
  vehicles: VehicleResponse[] = [];
  terms = Object.values(EInstallmentsTerm);
  termMonths = INSTALLMENTS_TERM_MONTHS;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private dialogRef: DialogRef<CreateLoanRequest, LoanFormDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      customerDocumentNumber: [null, Validators.required],
      vehicleIdentifier: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      installments: [EInstallmentsTerm.Months12, Validators.required]
    });
  }

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      vehicles: this.vehicleService.getAll()
    }).subscribe({
      next: ({ customers, vehicles }) => {
        this.customers = customers;
        this.vehicles = vehicles;
        this.loadingOptions = false;
      },
      error: () => {
        this.loadingOptions = false;
        this.loadError = true;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Complete los campos obligatorios para continuar.', 'Formulario incompleto');
      return;
    }
    this.dialogRef.close(this.form.value as CreateLoanRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
