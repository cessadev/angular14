import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EDocumentType, DOCUMENT_TYPE_LABELS, CreateCustomerRequest } from 'src/app/core/models';

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form-dialog.component.html'
})
export class CustomerFormDialogComponent {
  form: FormGroup;
  documentTypes = Object.values(EDocumentType);
  documentTypeLabels = DOCUMENT_TYPE_LABELS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerFormDialogComponent, CreateCustomerRequest>
  ) {
    this.form = this.fb.group({
      documentType: [EDocumentType.CedulaCiudadania, Validators.required],
      documentNumber: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],
      address: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value as CreateCustomerRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
