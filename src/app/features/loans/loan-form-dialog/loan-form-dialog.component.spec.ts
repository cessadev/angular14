import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { LoanFormDialogComponent } from './loan-form-dialog.component';
import { CustomerService } from 'src/app/core/services/customer.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import {
  CustomerResponse, VehicleResponse, EDocumentType, EVehicleBrand,
  EInstallmentsTerm, CreateLoanRequest
} from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';

describe('LoanFormDialogComponent', () => {
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef<CreateLoanRequest, LoanFormDialogComponent>>;

  const customers: CustomerResponse[] = [
    {
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      name: 'Carlos',
      lastname: 'Ruiz',
      age: 35,
      address: 'Calle 50 #23-10, Barranquilla'
    }
  ];

  const vehicles: VehicleResponse[] = [
    {
      identifier: 'MK-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: 2025
    }
  ];

  beforeEach(() => {
    customerServiceSpy = jasmine.createSpyObj<CustomerService>('CustomerService', ['getAll']);
    vehicleServiceSpy = jasmine.createSpyObj<VehicleService>('VehicleService', ['getAll']);
    dialogRefSpy = jasmine.createSpyObj<DialogRef<CreateLoanRequest, LoanFormDialogComponent>>('DialogRef', ['close']);
  });

  function createComponent(): LoanFormDialogComponent {
    return new LoanFormDialogComponent(new FormBuilder(), customerServiceSpy, vehicleServiceSpy, dialogRefSpy);
  }

  // [Successful load]
  it('ngOnInit_ServicesResolve_PopulatesCustomersAndVehiclesAndStopsLoading', () => {
    customerServiceSpy.getAll.and.returnValue(of(customers));
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();
    component.ngOnInit();

    expect(component.customers).toEqual(customers);
    expect(component.vehicles).toEqual(vehicles);
    expect(component.loadingOptions).toBeFalse();
    expect(component.loadError).toBeFalse();
  });

  // [Failed load]
  it('ngOnInit_ServiceFails_SetsLoadErrorAndStopsLoading', () => {
    customerServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();
    component.ngOnInit();

    expect(component.loadingOptions).toBeFalse();
    expect(component.loadError).toBeTrue();
    expect(component.customers).toEqual([]);
  });

  // [Invalid form]
  it('save_InvalidForm_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    customerServiceSpy.getAll.and.returnValue(of(customers));
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();
    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('vehicleIdentifier')?.touched).toBeTrue();
  });

  // [Valid form]
  it('save_ValidForm_ClosesDialogWithCreateLoanRequest', () => {
    customerServiceSpy.getAll.and.returnValue(of(customers));
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();

    component.form.setValue({
      customerDocumentNumber: 123456789,
      vehicleIdentifier: 'MK-1299',
      amount: 100000000,
      installments: EInstallmentsTerm.Months12
    });

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      customerDocumentNumber: 123456789,
      vehicleIdentifier: 'MK-1299',
      amount: 100000000,
      installments: EInstallmentsTerm.Months12
    });
  });

  // [Cancel]
  it('cancel_Always_ClosesDialogWithoutValue', () => {
    customerServiceSpy.getAll.and.returnValue(of(customers));
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();
    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });
});
