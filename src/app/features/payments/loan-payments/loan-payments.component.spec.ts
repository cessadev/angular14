import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { LoanPaymentsComponent } from './loan-payments.component';
import { PaymentService } from 'src/app/core/services/payment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaymentResponse, EPaymentMethod, PAYMENT_METHOD_LABELS } from 'src/app/core/models';

function fakeActivatedRoute(reference: string | null, paymentReference: string | null): ActivatedRoute {
  return {
    snapshot: {
      paramMap: convertToParamMap(reference ? { reference } : {}),
      queryParamMap: convertToParamMap(paymentReference ? { paymentReference } : {})
    }
  } as ActivatedRoute;
}

describe('LoanPaymentsComponent', () => {
  let paymentServiceSpy: jasmine.SpyObj<PaymentService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const loanReference = 'LN-ABC1234567';
  const paymentReference = 'LN-ABC1234567-01';

  const payment: PaymentResponse = {
    number: 'PAY-12345678',
    amount: 8333333.33,
    method: EPaymentMethod.PSE,
    referencePayment: paymentReference,
    date: '2026-01-20T00:00:00Z',
    installmentNumber: 1,
    loanReference
  };

  beforeEach(() => {
    paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', ['getByLoan', 'getByInstallment']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  function createComponent(reference: string | null, paymentRef: string | null): LoanPaymentsComponent {
    return new LoanPaymentsComponent(
      fakeActivatedRoute(reference, paymentRef),
      routerSpy,
      paymentServiceSpy,
      notificationServiceSpy
    );
  }

  // [No paymentReference query param -> loan-level history]
  it('ngOnInit_NoPaymentReferenceParam_LoadsFullLoanHistory', () => {
    paymentServiceSpy.getByLoan.and.returnValue(of([payment]));

    const component = createComponent(loanReference, null);
    component.ngOnInit();

    expect(component.loanReference).toBe(loanReference);
    expect(component.paymentReference).toBeNull();
    expect(component.payments).toEqual([payment]);
    expect(paymentServiceSpy.getByLoan).toHaveBeenCalledOnceWith(loanReference);
    expect(paymentServiceSpy.getByInstallment).not.toHaveBeenCalled();
  });

  // [With paymentReference query param -> installment-level history]
  it('ngOnInit_WithPaymentReferenceParam_LoadsInstallmentHistory', () => {
    paymentServiceSpy.getByInstallment.and.returnValue(of([payment]));

    const component = createComponent(loanReference, paymentReference);
    component.ngOnInit();

    expect(component.paymentReference).toBe(paymentReference);
    expect(paymentServiceSpy.getByInstallment).toHaveBeenCalledOnceWith(paymentReference);
    expect(paymentServiceSpy.getByLoan).not.toHaveBeenCalled();
  });

  // [Load error]
  it('loadPayments_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    paymentServiceSpy.getByLoan.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent(loanReference, null);
    component.loadPayments();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [Method label lookup]
  it('methodLabel_ValidMethod_ReturnsMappedLabel', () => {
    paymentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent(loanReference, null);

    expect(component.methodLabel(EPaymentMethod.PSE)).toBe(PAYMENT_METHOD_LABELS[EPaymentMethod.PSE]);
  });

  // [Go back]
  it('goBack_Always_NavigatesToLoanDetail', () => {
    paymentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent(loanReference, null);
    component.ngOnInit();

    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans', loanReference]);
  });
});
