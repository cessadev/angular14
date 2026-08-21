import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EPaymentMethod, PAYMENT_METHOD_LABELS, RegisterPaymentRequest, InstallmentResponse } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services/notification.service';

export interface PaymentDialogData {
  installment: InstallmentResponse;
}

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent {
  form: FormGroup;
  methods = Object.values(EPaymentMethod);
  methodLabels = PAYMENT_METHOD_LABELS;
  remainingBalance: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<RegisterPaymentRequest, PaymentDialogComponent>,
    private notificationService: NotificationService,
    @Inject(DIALOG_DATA) public data: PaymentDialogData
  ) {
    this.remainingBalance = Math.round((data.installment.amount - data.installment.amountPaid) * 100) / 100;

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
      this.notificationService.error('Complete los campos obligatorios para continuar.', 'Formulario incompleto');
      return;
    }
    this.dialogRef.close(this.form.value as RegisterPaymentRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
