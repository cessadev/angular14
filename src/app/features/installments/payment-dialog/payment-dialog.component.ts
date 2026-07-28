import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EPaymentMethod, PAYMENT_METHOD_LABELS, RegisterPaymentRequest, InstallmentResponse } from 'src/app/core/models';

export interface PaymentDialogData {
  installment: InstallmentResponse;
}

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html'
})
export class PaymentDialogComponent {
  form: FormGroup;
  methods = Object.values(EPaymentMethod);
  methodLabels = PAYMENT_METHOD_LABELS;
  remainingBalance: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent, RegisterPaymentRequest>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData
  ) {
    this.remainingBalance = data.installment.amount - data.installment.amountPaid;

    this.form = this.fb.group({
      method: [EPaymentMethod.Cash, Validators.required],
      amount: [
        this.remainingBalance,
        [Validators.required, Validators.min(1), Validators.max(this.remainingBalance)]
      ]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value as RegisterPaymentRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
