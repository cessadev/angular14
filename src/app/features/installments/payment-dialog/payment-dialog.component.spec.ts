import { FormBuilder } from '@angular/forms';
import { PaymentDialogComponent, PaymentDialogData } from './payment-dialog.component';
import { InstallmentResponse, EPaymentMethod, RegisterPaymentRequest } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';

describe('PaymentDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<DialogRef<RegisterPaymentRequest, PaymentDialogComponent>>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

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
    dialogRefSpy = jasmine.createSpyObj<DialogRef<RegisterPaymentRequest, PaymentDialogComponent>>('DialogRef', ['close']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(data: PaymentDialogData): PaymentDialogComponent {
    return new PaymentDialogComponent(new FormBuilder(), dialogRefSpy, notificationServiceSpy, data);
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

  // [Floating point noise from JS subtraction]
  it('constructor_SubtractionProducesFloatingPointNoise_RoundsRemainingBalanceToTwoDecimals', () => {
    const noisyInstallment: InstallmentResponse = { ...installment, amount: 833333.33, amountPaid: 755555.56 };

    const component = createComponent({ installment: noisyInstallment });

    // Raw JS subtraction (833333.33 - 755555.56) yields 77777.7699999999 without rounding.
    expect(component.remainingBalance).toBe(77777.77);
  });

  // [Amount exceeds remaining balance]
  it('save_AmountExceedsRemainingBalance_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    const component = createComponent({ installment });

    component.form.get('amount')?.setValue(component.remainingBalance + 1);
    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('amount')?.touched).toBeTrue();
  });

  // [Cents-only abono, below one whole peso]
  it('save_CentsOnlyAmountBelowOnePeso_ClosesDialogWithRegisterPaymentRequest', () => {
    const component = createComponent({ installment });

    component.form.get('amount')?.setValue(0.33);
    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      method: EPaymentMethod.Cash,
      amount: 0.33
    });
  });

  // [Zero amount rejected]
  it('save_ZeroAmount_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    const component = createComponent({ installment });

    component.form.get('amount')?.setValue(0);
    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('amount')?.hasError('min')).toBeTrue();
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

  // [Invalid submit]
  it('save_InvalidForm_ShowsErrorNotificationAndDoesNotClose', () => {
    const component = createComponent({ installment });
    component.form.get('amount')?.setValue(null);

    component.save();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'Complete los campos obligatorios para continuar.',
      'Formulario incompleto'
    );
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
