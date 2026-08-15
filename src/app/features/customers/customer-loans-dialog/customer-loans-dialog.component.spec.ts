import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CustomerLoansDialogComponent, CustomerLoansDialogData } from './customer-loans-dialog.component';
import { LoanService } from 'src/app/core/services/loan.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CustomerResponse, LoanResponse, EDocumentType, EInstallmentsTerm, INSTALLMENTS_TERM_MONTHS } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';

describe('CustomerLoansDialogComponent', () => {
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef<CustomerLoansDialogComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const customer: CustomerResponse = {
    documentType: EDocumentType.CedulaCiudadania,
    documentNumber: 123456789,
    name: 'Carlos',
    lastname: 'Ruiz',
    age: 35,
    address: 'Calle 50 #23-10, Barranquilla'
  };

  const data: CustomerLoansDialogData = { customer };

  const loan: LoanResponse = {
    reference: 'LN-ABC1234567',
    customerDocumentNumber: customer.documentNumber,
    vehicleIdentifier: 'MK-1299',
    amount: 100000000,
    installments: EInstallmentsTerm.Months12,
    dateCreation: '2026-01-15T00:00:00Z'
  };

  beforeEach(() => {
    loanServiceSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getByCustomer']);
    dialogRefSpy = jasmine.createSpyObj<DialogRef<CustomerLoansDialogComponent>>('DialogRef', ['close']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(): CustomerLoansDialogComponent {
    return new CustomerLoansDialogComponent(data, dialogRefSpy, loanServiceSpy, routerSpy, notificationServiceSpy);
  }

  // [Loans load successfully]
  it('ngOnInit_Always_LoadsLoansForTheGivenCustomer', () => {
    loanServiceSpy.getByCustomer.and.returnValue(of([loan]));

    const component = createComponent();
    component.ngOnInit();

    expect(component.loans).toEqual([loan]);
    expect(component.loading).toBeFalse();
    expect(loanServiceSpy.getByCustomer).toHaveBeenCalledOnceWith(customer.documentType, customer.documentNumber);
  });

  // [Load error]
  it('ngOnInit_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    loanServiceSpy.getByCustomer.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [View detail closes the dialog first]
  it('viewDetail_Always_ClosesDialogAndNavigatesToLoanDetail', () => {
    loanServiceSpy.getByCustomer.and.returnValue(of([loan]));
    const component = createComponent();

    component.viewDetail(loan);

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans', loan.reference]);
  });

  // [Term months lookup]
  it('getTermMonths_ValidTerm_ReturnsMappedMonths', () => {
    loanServiceSpy.getByCustomer.and.returnValue(of([]));
    const component = createComponent();

    expect(component.getTermMonths(EInstallmentsTerm.Months12)).toBe(INSTALLMENTS_TERM_MONTHS[EInstallmentsTerm.Months12]);
  });
});
