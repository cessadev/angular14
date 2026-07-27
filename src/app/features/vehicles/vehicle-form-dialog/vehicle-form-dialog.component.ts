import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EVehicleBrand, RegisterVehicleRequest } from 'src/app/core/models';

@Component({
  selector: 'app-vehicle-form-dialog',
  templateUrl: './vehicle-form-dialog.component.html'
})
export class VehicleFormDialogComponent {
  form: FormGroup;
  brands = Object.values(EVehicleBrand);
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleFormDialogComponent, RegisterVehicleRequest>
  ) {
    this.form = this.fb.group({
      identifier: ['', [Validators.required, Validators.maxLength(20)]],
      brand: [EVehicleBrand.Toyota, Validators.required],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      marketValue: [null, [Validators.required, Validators.min(1)]],
      year: [this.currentYear, [Validators.required, Validators.min(1990), Validators.max(this.currentYear + 1)]]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = { ...this.form.value, identifier: (this.form.value.identifier as string).toUpperCase() };
    this.dialogRef.close(value as RegisterVehicleRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
