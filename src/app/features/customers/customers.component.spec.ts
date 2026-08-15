import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { CustomersComponent } from './customers.component';
import { CustomerService } from 'src/app/core/services/customer.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CustomerResponse, EDocumentType, CreateCustomerRequest, UpdateCustomerRequest } from 'src/app/core/models';
import { CustomerLoansDialogComponent } from './customer-loans-dialog/customer-loans-dialog.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

function fakeDialogRef(result: unknown): DialogRef<any, any> {
  return { closed: of(result) } as DialogRef<any, any>;
}

describe('CustomersComponent', () => {
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
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

  beforeEach(() => {
    customerServiceSpy = jasmine.createSpyObj<CustomerService>('CustomerService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj<Dialog>('Dialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    customerServiceSpy.getAll.and.returnValue(of([customer]));
  });

  function createComponent(): CustomersComponent {
    return new CustomersComponent(customerServiceSpy, dialogSpy, notificationServiceSpy);
  }

  // [ngOnInit loads and configures filtering]
  it('ngOnInit_Always_LoadsCustomersAndConfiguresDocumentNumberFilter', () => {
    const component = createComponent();
    component.ngOnInit();

    expect(component.dataSource.data).toEqual([customer]);
    expect(component.dataSource.filterPredicate(customer, '12345')).toBeTrue();
    expect(component.dataSource.filterPredicate(customer, '99999')).toBeFalse();
  });

  // [Search control wiring, debounced]
  it('ngOnInit_SearchControlValueChanges_UpdatesDataSourceFilterAfterDebounce', fakeAsync(() => {
    const component = createComponent();
    component.ngOnInit();

    component.searchControl.setValue('  123456789  ');
    tick(200);

    expect(component.dataSource.filter).toBe('123456789');
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
  it('openLoansDialog_Always_OpensCustomerLoansDialogWithCustomerData', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openLoansDialog(customer);

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(CustomerLoansDialogComponent, {
      width: '640px',
      data: { customer }
    });
  });

  // [Document type label lookup]
  it('getDocumentTypeLabel_ValidType_ReturnsMappedLabel', () => {
    const component = createComponent();

    expect(component.getDocumentTypeLabel(EDocumentType.CedulaCiudadania))
      .toBe(component.documentTypeLabels[EDocumentType.CedulaCiudadania]);
  });
});
