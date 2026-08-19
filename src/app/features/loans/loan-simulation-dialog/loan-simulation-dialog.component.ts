import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { LoanService } from 'src/app/core/services/loan.service';
import {
  VehicleResponse, EInstallmentsTerm, INSTALLMENTS_TERM_MONTHS,
  SimulateLoanRequest, LoanSimulation
} from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-loan-simulation-dialog',
  templateUrl: './loan-simulation-dialog.component.html',
  styleUrls: ['./loan-simulation-dialog.component.scss']
})
export class LoanSimulationDialogComponent implements OnInit {
  form: FormGroup;
  vehicles: VehicleResponse[] = [];
  terms = Object.values(EInstallmentsTerm);
  termMonths = INSTALLMENTS_TERM_MONTHS;
  simulation?: LoanSimulation;
  simulating = false;
  displayedColumns = ['number', 'amount', 'dateExpiration'];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private loanService: LoanService,
    private dialogRef: DialogRef<LoanSimulationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      installments: [EInstallmentsTerm.Months12, Validators.required],
      vehicleIdentifier: [null]
    });
  }

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: () => this.notificationService.error('No se pudieron cargar los vehículos')
    });
  }

  simulate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Complete los campos obligatorios para continuar.', 'Formulario incompleto');
      return;
    }

    const { amount, installments, vehicleIdentifier } = this.form.value;
    const request: SimulateLoanRequest = { amount, installments, vehicleIdentifier: vehicleIdentifier || null };

    this.simulating = true;
    this.simulation = undefined;

    this.loanService.simulate(request).subscribe({
      next: (simulation) => {
        this.simulation = simulation;
        this.simulating = false;
      },
      error: (err: Error) => {
        this.simulating = false;
        this.notificationService.error(err.message);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
