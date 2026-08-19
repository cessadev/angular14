import { Router } from '@angular/router';
import { CustomerLoansDialogComponent, CustomerLoansDialogData } from './customer-loans-dialog.component';
import { CustomerResponse, LoanResponse, EDocumentType, EInstallmentsTerm, INSTALLMENTS_TERM_MONTHS } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';

describe('CustomerLoansDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<DialogRef<unknown, CustomerLoansDialogComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;

  const customer: CustomerResponse = {
    documentType: EDocumentType.CedulaCiudadania,
    documentNumber: 123456789,
    name: 'Carlos',
    lastname: 'Ruiz',
    age: 35,
    address: 'Calle 50 #23-10, Barranquilla'
  };

  const loan: LoanResponse = {
    reference: 'LN-ABC1234567',
    customerDocumentNumber: customer.documentNumber,
    vehicleIdentifier: 'MK-1299',
    amount: 100000000,
    installments: EInstallmentsTerm.Months12,
    dateCreation: '2026-01-15T00:00:00Z'
  };

  const data: CustomerLoansDialogData = { customer, loans: [loan] };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<DialogRef<unknown, CustomerLoansDialogComponent>>('DialogRef', ['close']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  function createComponent(): CustomerLoansDialogComponent {
    return new CustomerLoansDialogComponent(data, dialogRefSpy, routerSpy);
  }

  // [Data injection]
  it('constructor_Always_ExposesInjectedLoansData', () => {
    const component = createComponent();

    expect(component.data.loans).toEqual([loan]);
  });

  // [View detail closes the dialog first]
  it('viewDetail_Always_ClosesDialogAndNavigatesToLoanDetail', () => {
    const component = createComponent();

    component.viewDetail(loan);

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans', loan.reference]);
  });

  // [Close]
  it('close_Always_ClosesDialog', () => {
    const component = createComponent();

    component.close();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });

  // [Term months lookup]
  it('getTermMonths_ValidTerm_ReturnsMappedMonths', () => {
    const component = createComponent();

    expect(component.getTermMonths(EInstallmentsTerm.Months12)).toBe(INSTALLMENTS_TERM_MONTHS[EInstallmentsTerm.Months12]);
  });
});
