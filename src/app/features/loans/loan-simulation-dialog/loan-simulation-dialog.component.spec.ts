import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { LoanSimulationDialogComponent } from './loan-simulation-dialog.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { VehicleResponse, EVehicleBrand, EInstallmentsTerm, LoanSimulation } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';

describe('LoanSimulationDialogComponent', () => {
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef<LoanSimulationDialogComponent>>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const vehicles: VehicleResponse[] = [
    {
      identifier: 'MK-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: 2025
    }
  ];

  const simulation: LoanSimulation = {
    amount: 100000000,
    installments: EInstallmentsTerm.Months12,
    installmentValue: 8333333.33,
    totalToPay: 100000000,
    schedule: []
  };

  beforeEach(() => {
    vehicleServiceSpy = jasmine.createSpyObj<VehicleService>('VehicleService', ['getAll']);
    loanServiceSpy = jasmine.createSpyObj<LoanService>('LoanService', ['simulate']);
    dialogRefSpy = jasmine.createSpyObj<DialogRef<LoanSimulationDialogComponent>>('DialogRef', ['close']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(): LoanSimulationDialogComponent {
    return new LoanSimulationDialogComponent(
      new FormBuilder(),
      vehicleServiceSpy,
      loanServiceSpy,
      dialogRefSpy,
      notificationServiceSpy
    );
  }

  // [Vehicles load successfully]
  it('ngOnInit_VehicleServiceResolves_PopulatesVehicles', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));

    const component = createComponent();
    component.ngOnInit();

    expect(component.vehicles).toEqual(vehicles);
    expect(notificationServiceSpy.error).not.toHaveBeenCalled();
  });

  // [Vehicles fail to load]
  it('ngOnInit_VehicleServiceFails_NotifiesErrorAndKeepsVehiclesEmpty', () => {
    vehicleServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.ngOnInit();

    expect(component.vehicles).toEqual([]);
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('No se pudieron cargar los vehículos');
  });

  // [Invalid form]
  it('simulate_InvalidForm_DoesNotCallLoanServiceAndMarksFieldsAsTouched', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));
    const component = createComponent();

    component.simulate();

    expect(loanServiceSpy.simulate).not.toHaveBeenCalled();
    expect(component.form.get('amount')?.touched).toBeTrue();
  });

  // [Valid form, no vehicle selected]
  it('simulate_ValidFormWithoutVehicle_SendsRequestWithNullVehicleIdentifier', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));
    loanServiceSpy.simulate.and.returnValue(of(simulation));

    const component = createComponent();
    component.form.setValue({ amount: 100000000, installments: EInstallmentsTerm.Months12, vehicleIdentifier: null });

    component.simulate();

    expect(loanServiceSpy.simulate).toHaveBeenCalledOnceWith({
      amount: 100000000,
      installments: EInstallmentsTerm.Months12,
      vehicleIdentifier: null
    });
    expect(component.simulation).toEqual(simulation);
    expect(component.simulating).toBeFalse();
  });

  // [Valid form, with vehicle selected]
  it('simulate_ValidFormWithVehicle_SendsRequestWithVehicleIdentifier', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));
    loanServiceSpy.simulate.and.returnValue(of(simulation));

    const component = createComponent();
    component.form.setValue({ amount: 100000000, installments: EInstallmentsTerm.Months12, vehicleIdentifier: 'MK-1299' });

    component.simulate();

    expect(loanServiceSpy.simulate).toHaveBeenCalledOnceWith({
      amount: 100000000,
      installments: EInstallmentsTerm.Months12,
      vehicleIdentifier: 'MK-1299'
    });
  });

  // [Simulation fails]
  it('simulate_LoanServiceFails_NotifiesErrorAndStopsSimulating', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));
    loanServiceSpy.simulate.and.returnValue(
      throwError(() => new Error('El monto simulado no puede exceder el valor de mercado del vehículo'))
    );

    const component = createComponent();
    component.form.setValue({ amount: 999999999, installments: EInstallmentsTerm.Months12, vehicleIdentifier: 'MK-1299' });

    component.simulate();

    expect(component.simulating).toBeFalse();
    expect(component.simulation).toBeUndefined();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'El monto simulado no puede exceder el valor de mercado del vehículo'
    );
  });

  // [Close]
  it('close_Always_ClosesDialogWithoutValue', () => {
    vehicleServiceSpy.getAll.and.returnValue(of(vehicles));
    const component = createComponent();

    component.close();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });
});
