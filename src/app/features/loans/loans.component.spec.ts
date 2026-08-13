import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoansComponent } from './loans.component';
import { LoanService } from 'src/app/core/services/loan.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoanResponse, EInstallmentsTerm, CreateLoanRequest, INSTALLMENTS_TERM_MONTHS } from 'src/app/core/models';
import { LoanSimulationDialogComponent } from './loan-simulation-dialog/loan-simulation-dialog.component';

function fakeDialogRef(result: unknown): MatDialogRef<any, any> {
  return { afterClosed: () => of(result) } as MatDialogRef<any, any>;
}

describe('LoansComponent', () => {
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
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

  beforeEach(() => {
    loanServiceSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getAll', 'create', 'delete']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    loanServiceSpy.getAll.and.returnValue(of([loan]));
  });

  function createComponent(): LoansComponent {
    return new LoansComponent(loanServiceSpy, dialogSpy, notificationServiceSpy, routerSpy);
  }

  // [ngOnInit loads loans]
  it('ngOnInit_Always_LoadsLoans', () => {
    const component = createComponent();
    component.ngOnInit();

    expect(component.dataSource.data).toEqual([loan]);
    expect(component.loading).toBeFalse();
  });

  // [Load error]
  it('loadLoans_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    loanServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadLoans();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [Create dialog dismissed]
  it('openCreateDialog_DialogClosedWithoutValue_DoesNotCallCreate', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openCreateDialog();

    expect(loanServiceSpy.create).not.toHaveBeenCalled();
  });

  // [Create succeeds]
  it('openCreateDialog_DialogClosedWithValue_CreatesAndReloadsLoans', () => {
    const request: CreateLoanRequest = {
      customerDocumentNumber: loan.customerDocumentNumber,
      vehicleIdentifier: loan.vehicleIdentifier,
      amount: loan.amount,
      installments: loan.installments
    };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    loanServiceSpy.create.and.returnValue(of(loan));

    const component = createComponent();
    component.openCreateDialog();

    expect(loanServiceSpy.create).toHaveBeenCalledOnceWith(request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Préstamo creado correctamente');
    expect(loanServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });

  // [Create fails]
  it('openCreateDialog_CreateFails_NotifiesError', () => {
    const request: CreateLoanRequest = {
      customerDocumentNumber: loan.customerDocumentNumber,
      vehicleIdentifier: loan.vehicleIdentifier,
      amount: loan.amount,
      installments: loan.installments
    };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    loanServiceSpy.create.and.returnValue(
      throwError(() => new Error('El vehículo ya tiene un crédito activo'))
    );

    const component = createComponent();
    component.openCreateDialog();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('El vehículo ya tiene un crédito activo');
  });

  // [View detail]
  it('viewDetail_Always_NavigatesToLoanDetailRoute', () => {
    const component = createComponent();
    component.viewDetail(loan);

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/loans', loan.reference]);
  });

  // [Delete stops row-click propagation]
  it('deleteLoan_Always_StopsEventPropagation', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(false));
    const eventSpy = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);

    const component = createComponent();
    component.deleteLoan(loan, eventSpy);

    expect(eventSpy.stopPropagation).toHaveBeenCalledTimes(1);
  });

  // [Delete not confirmed]
  it('deleteLoan_NotConfirmed_DoesNotCallDelete', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(false));
    const eventSpy = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);

    const component = createComponent();
    component.deleteLoan(loan, eventSpy);

    expect(loanServiceSpy.delete).not.toHaveBeenCalled();
  });

  // [Delete confirmed]
  it('deleteLoan_Confirmed_DeletesAndReloadsLoans', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    loanServiceSpy.delete.and.returnValue(of(undefined));
    const eventSpy = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);

    const component = createComponent();
    component.deleteLoan(loan, eventSpy);

    expect(loanServiceSpy.delete).toHaveBeenCalledOnceWith(loan.reference);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Préstamo eliminado');
  });

  // [Delete blocked by unpaid installments]
  it('deleteLoan_ServiceRejectsWithConflict_NotifiesError', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    loanServiceSpy.delete.and.returnValue(
      throwError(() => new Error('El préstamo tiene cuotas pendientes por pagar'))
    );
    const eventSpy = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);

    const component = createComponent();
    component.deleteLoan(loan, eventSpy);

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('El préstamo tiene cuotas pendientes por pagar');
  });

  // [Open simulation dialog]
  it('openSimulationDialog_Always_OpensLoanSimulationDialogComponent', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openSimulationDialog();

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(LoanSimulationDialogComponent, { width: '560px' });
  });

  // [Term months lookup]
  it('getTermMonths_ValidTerm_ReturnsMappedMonths', () => {
    const component = createComponent();

    expect(component.getTermMonths(EInstallmentsTerm.Months12))
      .toBe(INSTALLMENTS_TERM_MONTHS[EInstallmentsTerm.Months12]);
  });
});
