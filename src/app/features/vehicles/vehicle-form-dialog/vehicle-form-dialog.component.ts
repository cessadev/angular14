import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EVehicleBrand, RegisterVehicleRequest, UpdateVehicleRequest, VehicleResponse } from 'src/app/core/models';

export interface VehicleFormDialogData {
  vehicle: VehicleResponse;
}

@Component({
  selector: 'app-vehicle-form-dialog',
  templateUrl: './vehicle-form-dialog.component.html'
})
export class VehicleFormDialogComponent {
  form: FormGroup;
  brands = Object.values(EVehicleBrand);
  currentYear = new Date().getFullYear();
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleFormDialogComponent, RegisterVehicleRequest | UpdateVehicleRequest>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: VehicleFormDialogData | null
  ) {
    const vehicle = data?.vehicle;
    this.isEditMode = !!vehicle;

    this.form = this.fb.group({
      identifier: [
        { value: vehicle?.identifier ?? '', disabled: this.isEditMode },
        [Validators.required, Validators.maxLength(20)]
      ],
      brand: [vehicle?.brand ?? EVehicleBrand.Toyota, Validators.required],
      model: [vehicle?.model ?? '', [Validators.required, Validators.maxLength(100)]],
      marketValue: [vehicle?.marketValue ?? null, [Validators.required, Validators.min(1)]],
      year: [
        vehicle?.year ?? this.currentYear,
        [Validators.required, Validators.min(1990), Validators.max(this.currentYear + 1)]
      ]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      const { brand, model, marketValue, year } = this.form.getRawValue();
      this.dialogRef.close({ brand, model, marketValue, year } as UpdateVehicleRequest);
      return;
    }

    const value = { ...this.form.value, identifier: (this.form.value.identifier as string).toUpperCase() };
    this.dialogRef.close(value as RegisterVehicleRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
