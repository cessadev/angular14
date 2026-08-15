import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EDocumentType,
  DOCUMENT_TYPE_LABELS,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse
} from 'src/app/core/models';

export interface CustomerFormDialogData {
  customer: CustomerResponse;
}

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form-dialog.component.html',
  styleUrls: ['./customer-form-dialog.component.scss']
})
export class CustomerFormDialogComponent {
  form: FormGroup;
  documentTypes = Object.values(EDocumentType);
  documentTypeLabels = DOCUMENT_TYPE_LABELS;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<CreateCustomerRequest | UpdateCustomerRequest, CustomerFormDialogComponent>,
    @Optional() @Inject(DIALOG_DATA) public data: CustomerFormDialogData | null
  ) {
    const customer = data?.customer;
    this.isEditMode = !!customer;

    this.form = this.fb.group({
      documentType: [
        { value: customer?.documentType ?? EDocumentType.CedulaCiudadania, disabled: this.isEditMode },
        Validators.required
      ],
      documentNumber: [
        { value: customer?.documentNumber ?? null, disabled: this.isEditMode },
        [Validators.required, Validators.min(1)]
      ],
      name: [customer?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      lastname: [customer?.lastname ?? '', [Validators.required, Validators.maxLength(100)]],
      age: [customer?.age ?? null, [Validators.required, Validators.min(18), Validators.max(120)]],
      address: [customer?.address ?? '', [Validators.required, Validators.maxLength(200)]]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      const { name, lastname, age, address } = this.form.getRawValue();
      this.dialogRef.close({ name, lastname, age, address } as UpdateCustomerRequest);
      return;
    }

    this.dialogRef.close(this.form.value as CreateCustomerRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
