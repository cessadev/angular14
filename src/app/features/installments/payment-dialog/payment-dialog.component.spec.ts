import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentDialogComponent, PaymentDialogData } from './payment-dialog.component';
import { InstallmentResponse, EPaymentMethod, RegisterPaymentRequest } from 'src/app/core/models';

describe('PaymentDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PaymentDialogComponent, RegisterPaymentRequest>>;

  const installment: InstallmentResponse = {
    loanReference: 'LN-ABC1234567',
    number: 1,
    paymentReference: 'LN-ABC1234567-01',
    amount: 8333333.33,
    amountPaid: 0,
    dateExpiration: '2026-02-15T00:00:00Z',
    datePayment: null,
    paid: false
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<PaymentDialogComponent, RegisterPaymentRequest>>('MatDialogRef', ['close']);
  });

  function createComponent(data: PaymentDialogData): PaymentDialogComponent {
    return new PaymentDialogComponent(new FormBuilder(), dialogRefSpy, data);
  }

  // [Constructor prefill]
  it('constructor_ValidInstallment_ComputesRemainingBalanceAndPrefillsForm', () => {
    const component = createComponent({ installment });

    expect(component.remainingBalance).toBe(8333333.33);
    expect(component.form.get('method')?.value).toBe(EPaymentMethod.Cash);
    expect(component.form.get('amount')?.value).toBe(8333333.33);
  });

  // [Partially paid installment]
  it('constructor_PartiallyPaidInstallment_ComputesRemainingBalanceFromAmountPaid', () => {
    const partiallyPaid: InstallmentResponse = { ...installment, amountPaid: 3333333.33 };

    const component = createComponent({ installment: partiallyPaid });

    expect(component.remainingBalance).toBeCloseTo(5000000, 2);
    expect(component.form.get('amount')?.value).toBeCloseTo(5000000, 2);
  });

  // [Amount exceeds remaining balance]
  it('save_AmountExceedsRemainingBalance_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    const component = createComponent({ installment });

    component.form.get('amount')?.setValue(component.remainingBalance + 1);
    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('amount')?.touched).toBeTrue();
  });

  // [Valid form]
  it('save_ValidForm_ClosesDialogWithRegisterPaymentRequest', () => {
    const component = createComponent({ installment });

    component.form.get('method')?.setValue(EPaymentMethod.PSE);
    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      method: EPaymentMethod.PSE,
      amount: installment.amount
    });
  });

  // [Cancel]
  it('cancel_Always_ClosesDialogWithoutValue', () => {
    const component = createComponent({ installment });

    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });
});
