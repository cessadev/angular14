import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { LoanInstallmentsComponent } from './loan-installments.component';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { InstallmentResponse, EPaymentMethod, RegisterPaymentRequest } from 'src/app/core/models';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

function fakeActivatedRoute(reference: string | null): ActivatedRoute {
  return {
    snapshot: { paramMap: convertToParamMap(reference ? { reference } : {}) }
  } as ActivatedRoute;
}

function fakeDialogRef(result: unknown): DialogRef<any, any> {
  return { closed: of(result) } as DialogRef<any, any>;
}

describe('LoanInstallmentsComponent', () => {
  let installmentServiceSpy: jasmine.SpyObj<InstallmentService>;
  let dialogSpy: jasmine.SpyObj<Dialog>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const loanReference = 'LN-ABC1234567';

  const installment: InstallmentResponse = {
    loanReference,
    number: 2,
    paymentReference: `${loanReference}-02`,
    amount: 8333333.33,
    amountPaid: 0,
    dateExpiration: '2026-01-15T00:00:00Z',
    datePayment: null,
    paid: false
  };

  beforeEach(() => {
    installmentServiceSpy = jasmine.createSpyObj<InstallmentService>('InstallmentService', ['getByLoan', 'registerPayment']);
    dialogSpy = jasmine.createSpyObj<Dialog>('Dialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  function createComponent(): LoanInstallmentsComponent {
    return new LoanInstallmentsComponent(
      fakeActivatedRoute(loanReference),
      routerSpy,
      installmentServiceSpy,
      dialogSpy,
      notificationServiceSpy
    );
  }

  // [ngOnInit reads the route param and loads installments]
  it('ngOnInit_Always_ReadsLoanReferenceAndLoadsInstallments', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([installment]));

    const component = createComponent();
    component.ngOnInit();

    expect(component.loanReference).toBe(loanReference);
    expect(installmentServiceSpy.getByLoan).toHaveBeenCalledOnceWith(loanReference);
  });

  // [Sorts installments by number]
  it('loadInstallments_UnsortedResponse_SortsByNumberAscending', () => {
    const first = { ...installment, number: 1 };
    const third = { ...installment, number: 3 };
    installmentServiceSpy.getByLoan.and.returnValue(of([third, installment, first]));

    const component = createComponent();
    component.loadInstallments();

    expect(component.installments.map((i) => i.number)).toEqual([1, 2, 3]);
  });

  // [Load error]
  it('loadInstallments_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    installmentServiceSpy.getByLoan.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadInstallments();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [Status: paid]
  it('status_PaidInstallment_ReturnsPaid', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();

    expect(component.status({ ...installment, paid: true })).toBe('paid');
  });

  // [Status: overdue]
  it('status_UnpaidPastExpirationDate_ReturnsOverdue', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-01-20T00:00:00Z'));

    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();

    expect(component.status(installment)).toBe('overdue');
  });

  // [Status: pending]
  it('status_UnpaidFutureExpirationDate_ReturnsPending', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-01-01T00:00:00Z'));

    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();

    expect(component.status(installment)).toBe('pending');
  });

  // [Status labels]
  it('statusLabel_EachStatus_ReturnsCorrespondingSpanishLabel', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();

    expect(component.statusLabel('paid')).toBe('Pagada');
    expect(component.statusLabel('overdue')).toBe('Vencida');
    expect(component.statusLabel('pending')).toBe('Pendiente');
  });

  // [Payment dialog dismissed]
  it('openPaymentDialog_DialogClosedWithoutValue_DoesNotRegisterPayment', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openPaymentDialog(installment);

    expect(installmentServiceSpy.registerPayment).not.toHaveBeenCalled();
  });

  // [Payment registered]
  it('openPaymentDialog_DialogClosedWithValue_RegistersPaymentAndReloads', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([installment]));
    const request: RegisterPaymentRequest = { method: EPaymentMethod.PSE, amount: installment.amount };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    installmentServiceSpy.registerPayment.and.returnValue(of({ ...installment, paid: true }));

    const component = createComponent();
    component.openPaymentDialog(installment);

    expect(installmentServiceSpy.registerPayment).toHaveBeenCalledOnceWith(installment.paymentReference, request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Pago registrado correctamente');
  });

  // [Payment registration fails, e.g. amount mismatch]
  it('openPaymentDialog_RegisterPaymentFails_NotifiesError', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const request: RegisterPaymentRequest = { method: EPaymentMethod.PSE, amount: installment.amount };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    installmentServiceSpy.registerPayment.and.returnValue(
      throwError(() => new Error('El monto no coincide con el valor de la cuota'))
    );

    const component = createComponent();
    component.openPaymentDialog(installment);

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('El monto no coincide con el valor de la cuota');
  });

  // [View payments]
  it('viewPayments_Always_NavigatesWithPaymentReferenceQueryParam', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();
    component.loanReference = loanReference;

    component.viewPayments(installment);

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(
      ['/payments', 'loan', loanReference],
      { queryParams: { paymentReference: installment.paymentReference } }
    );
  });

  // [Go back]
  it('goBack_Always_NavigatesToLoanDetail', () => {
    installmentServiceSpy.getByLoan.and.returnValue(of([]));
    const component = createComponent();
    component.loanReference = loanReference;

    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans', loanReference]);
  });
});
