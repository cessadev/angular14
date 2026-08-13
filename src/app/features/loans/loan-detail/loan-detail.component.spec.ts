import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { LoanDetailComponent } from './loan-detail.component';
import { LoanService } from 'src/app/core/services/loan.service';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoanResponse, LoanSummary, EInstallmentsTerm } from 'src/app/core/models';

function fakeActivatedRoute(reference: string | null): ActivatedRoute {
  return {
    snapshot: { paramMap: convertToParamMap(reference ? { reference } : {}) }
  } as ActivatedRoute;
}

describe('LoanDetailComponent', () => {
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let installmentServiceSpy: jasmine.SpyObj<InstallmentService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const loan: LoanResponse = {
    reference: 'LN-ABC1234567',
    customerDocumentNumber: 123456789,
    vehicleIdentifier: 'MK-1299',
    amount: 100000000,
    installments: EInstallmentsTerm.Months12,
    dateCreation: '2026-01-15T00:00:00Z'
  };

  const summary: LoanSummary = {
    reference: 'LN-ABC1234567',
    customer: 'Carlos Ruiz',
    vehicle: 'MK-1299',
    totalInstallments: 12,
    installmentsPaid: 3,
    installmentsOwed: 9,
    totalValue: 100000000,
    totalPaid: 25000000,
    totalOwed: 75000000
  };

  beforeEach(() => {
    loanServiceSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getByReference']);
    installmentServiceSpy = jasmine.createSpyObj<InstallmentService>('InstallmentService', ['getSummary']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  function createComponent(reference: string | null): LoanDetailComponent {
    return new LoanDetailComponent(
      fakeActivatedRoute(reference),
      routerSpy,
      loanServiceSpy,
      installmentServiceSpy,
      notificationServiceSpy
    );
  }

  // [No reference in the route]
  it('ngOnInit_NoReferenceParam_SetsNotFoundAndStopsLoading', () => {
    const component = createComponent(null);
    component.ngOnInit();

    expect(component.notFound).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(loanServiceSpy.getByReference).not.toHaveBeenCalled();
  });

  // [Both services resolve]
  it('ngOnInit_ServicesResolve_PopulatesLoanAndSummary', () => {
    loanServiceSpy.getByReference.and.returnValue(of(loan));
    installmentServiceSpy.getSummary.and.returnValue(of(summary));

    const component = createComponent(loan.reference);
    component.ngOnInit();

    expect(component.loan).toEqual(loan);
    expect(component.summary).toEqual(summary);
    expect(component.loading).toBeFalse();
    expect(component.notFound).toBeFalse();
    expect(loanServiceSpy.getByReference).toHaveBeenCalledOnceWith(loan.reference);
    expect(installmentServiceSpy.getSummary).toHaveBeenCalledOnceWith(loan.reference);
  });

  // [Either service fails]
  it('ngOnInit_ServiceFails_SetsNotFoundAndNotifiesError', () => {
    loanServiceSpy.getByReference.and.returnValue(throwError(() => new Error('Préstamo no encontrado')));
    installmentServiceSpy.getSummary.and.returnValue(of(summary));

    const component = createComponent(loan.reference);
    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.notFound).toBeTrue();
    expect(component.loan).toBeUndefined();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Préstamo no encontrado');
  });

  // [Go back]
  it('goBack_Always_NavigatesToLoansList', () => {
    const component = createComponent(loan.reference);
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans']);
  });

  // [Go to installments]
  it('goToInstallments_LoanLoaded_NavigatesToInstallmentsRouteWithReference', () => {
    loanServiceSpy.getByReference.and.returnValue(of(loan));
    installmentServiceSpy.getSummary.and.returnValue(of(summary));

    const component = createComponent(loan.reference);
    component.ngOnInit();
    component.goToInstallments();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/installments', 'loan', loan.reference]);
  });

  // [Go to payments]
  it('goToPayments_LoanLoaded_NavigatesToPaymentsRouteWithReference', () => {
    loanServiceSpy.getByReference.and.returnValue(of(loan));
    installmentServiceSpy.getSummary.and.returnValue(of(summary));

    const component = createComponent(loan.reference);
    component.ngOnInit();
    component.goToPayments();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/payments', 'loan', loan.reference]);
  });
});
