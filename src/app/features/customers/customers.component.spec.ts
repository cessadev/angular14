import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { CustomersComponent } from './customers.component';
import { CustomerService } from 'src/app/core/services/customer.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CustomerResponse, EDocumentType, CreateCustomerRequest, UpdateCustomerRequest, EInstallmentsTerm, LoanResponse } from 'src/app/core/models';
import { CustomerLoansDialogComponent } from './customer-loans-dialog/customer-loans-dialog.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { LoanService } from 'src/app/core/services/loan.service';

function fakeDialogRef(result: unknown): DialogRef<any, any> {
  return { closed: of(result) } as DialogRef<any, any>;
}

describe('CustomersComponent', () => {
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let dialogSpy: jasmine.SpyObj<Dialog>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

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
    interestRate: 0.028,
    totalAmount: 102800000,
    installments: EInstallmentsTerm.Months12,
    dateCreation: '2026-01-15T00:00:00Z'
  };

  beforeEach(() => {
    customerServiceSpy = jasmine.createSpyObj<CustomerService>('CustomerService', ['getAll', 'create', 'update', 'delete']);
    loanServiceSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getByCustomer']);
    dialogSpy = jasmine.createSpyObj<Dialog>('Dialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error', 'info']);
    customerServiceSpy.getAll.and.returnValue(of([customer]));
  });

  function createComponent(): CustomersComponent {
    return new CustomersComponent(customerServiceSpy, loanServiceSpy, dialogSpy, notificationServiceSpy);
  }

  // [ngOnInit loads and configures filtering]
  it('ngOnInit_Always_LoadsCustomersAndConfiguresDocumentNumberFilter', () => {
    const component = createComponent();
    component.ngOnInit();

    expect(component.customers).toEqual([customer]);
    component['applyFilter']('12345');
    expect(component.filteredCustomers).toEqual([customer]);
    component['applyFilter']('99999');
    expect(component.filteredCustomers).toEqual([]);
  });

  // [Search control wiring, debounced]
  it('ngOnInit_SearchControlValueChanges_UpdatesDataSourceFilterAfterDebounce', fakeAsync(() => {
    const component = createComponent();
    component.ngOnInit();

    component.searchControl.setValue('  123456789  ');
    tick(200);

    expect(component.filteredCustomers).toEqual([customer]);
  }));

  // [Load error]
  it('loadCustomers_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    customerServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadCustomers();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [Create dialog dismissed]
  it('openCreateDialog_DialogClosedWithoutValue_DoesNotCallCreate', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openCreateDialog();

    expect(customerServiceSpy.create).not.toHaveBeenCalled();
  });

  // [Create succeeds]
  it('openCreateDialog_DialogClosedWithValue_CreatesAndReloadsCustomers', () => {
    const request: CreateCustomerRequest = { ...customer };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    customerServiceSpy.create.and.returnValue(of(customer));

    const component = createComponent();
    component.openCreateDialog();

    expect(customerServiceSpy.create).toHaveBeenCalledOnceWith(request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Cliente creado correctamente');
    expect(customerServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });

  // [Create fails]
  it('openCreateDialog_CreateFails_NotifiesError', () => {
    const request: CreateCustomerRequest = { ...customer };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    customerServiceSpy.create.and.returnValue(throwError(() => new Error('El cliente ya existe')));

    const component = createComponent();
    component.openCreateDialog();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('El cliente ya existe');
  });

  // [Edit succeeds]
  it('openEditDialog_DialogClosedWithValue_UpdatesAndReloadsCustomers', () => {
    const request: UpdateCustomerRequest = {
      name: 'Carlos',
      lastname: 'Ruiz Gómez',
      age: 36,
      address: 'Calle 72 #10-45, Barranquilla'
    };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    customerServiceSpy.update.and.returnValue(of({ ...customer, ...request }));

    const component = createComponent();
    component.openEditDialog(customer);

    expect(customerServiceSpy.update).toHaveBeenCalledOnceWith(customer.documentNumber, request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Cliente actualizado correctamente');
  });

  // [Delete not confirmed]
  it('deleteCustomer_NotConfirmed_DoesNotCallDelete', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(false));

    const component = createComponent();
    component.deleteCustomer(customer);

    expect(customerServiceSpy.delete).not.toHaveBeenCalled();
  });

  // [Delete confirmed]
  it('deleteCustomer_Confirmed_DeletesAndReloadsCustomers', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    customerServiceSpy.delete.and.returnValue(of(undefined));

    const component = createComponent();
    component.deleteCustomer(customer);

    expect(customerServiceSpy.delete).toHaveBeenCalledOnceWith(customer.documentNumber);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Cliente eliminado');
  });

  // [Delete blocked by unpaid loans]
  it('deleteCustomer_ServiceRejectsWithConflict_NotifiesError', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    customerServiceSpy.delete.and.returnValue(
      throwError(() => new Error('El cliente tiene préstamos con cuotas pendientes'))
    );

    const component = createComponent();
    component.deleteCustomer(customer);

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'El cliente tiene préstamos con cuotas pendientes'
    );
  });

  // [Open loans dialog]
  it('openLoansDialog_CustomerHasLoans_OpensCustomerLoansDialogWithLoans', () => {
    loanServiceSpy.getByCustomer.and.returnValue(of([loan]));

    const component = createComponent();
    component.openLoansDialog(customer);

    expect(loanServiceSpy.getByCustomer).toHaveBeenCalledOnceWith(customer.documentType, customer.documentNumber);
    expect(dialogSpy.open).toHaveBeenCalledOnceWith(CustomerLoansDialogComponent, {
      width: '800px',
      data: { customer, loans: [loan] }
    });
  });

  // [No loans — shows an info notification instead of an empty dialog]
  it('openLoansDialog_CustomerHasNoLoans_ShowsInfoNotificationAndDoesNotOpenDialog', () => {
    loanServiceSpy.getByCustomer.and.returnValue(of([]));

    const component = createComponent();
    component.openLoansDialog(customer);

    expect(notificationServiceSpy.info).toHaveBeenCalledOnceWith(
      'Este cliente no tiene créditos asociados.',
      'Sin créditos'
    );
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  // [Service failure]
  it('openLoansDialog_ServiceFails_NotifiesError', () => {
    loanServiceSpy.getByCustomer.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.openLoansDialog(customer);

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  // [Document type label lookup]
  it('getDocumentTypeLabel_ValidType_ReturnsMappedLabel', () => {
    const component = createComponent();

    expect(component.getDocumentTypeLabel(EDocumentType.CedulaCiudadania))
      .toBe(component.documentTypeLabels[EDocumentType.CedulaCiudadania]);
  });
});
