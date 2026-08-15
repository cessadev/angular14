import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { VehiclesComponent } from './vehicles.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { VehicleResponse, EVehicleBrand, RegisterVehicleRequest, UpdateVehicleRequest } from 'src/app/core/models';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

function fakeDialogRef(result: unknown): DialogRef<any, any> {
  return { closed: of(result) } as DialogRef<any, any>;
}

describe('VehiclesComponent', () => {
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let dialogSpy: jasmine.SpyObj<Dialog>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const vehicle: VehicleResponse = {
    identifier: 'MK-1299',
    brand: EVehicleBrand.Toyota,
    model: 'Hilux Cargo',
    marketValue: 125000000,
    year: 2025
  };

  beforeEach(() => {
    vehicleServiceSpy = jasmine.createSpyObj<VehicleService>('VehicleService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj<Dialog>('Dialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    vehicleServiceSpy.getAll.and.returnValue(of([vehicle]));
  });

  function createComponent(): VehiclesComponent {
    return new VehiclesComponent(vehicleServiceSpy, dialogSpy, notificationServiceSpy);
  }

  // [ngOnInit loads and configures filtering]
  it('ngOnInit_Always_LoadsVehiclesAndConfiguresCaseInsensitiveFilter', () => {
    const component = createComponent();
    component.ngOnInit();

    expect(component.dataSource.data).toEqual([vehicle]);
    expect(component.dataSource.filterPredicate(vehicle, 'mk-12')).toBeTrue();
    expect(component.dataSource.filterPredicate(vehicle, 'zz-99')).toBeFalse();
  });

  // [Search control wiring, debounced]
  it('ngOnInit_SearchControlValueChanges_UpdatesDataSourceFilterAfterDebounce', fakeAsync(() => {
    const component = createComponent();
    component.ngOnInit();

    component.searchControl.setValue('  MK-1299  ');
    tick(200);

    expect(component.dataSource.filter).toBe('MK-1299');
  }));

  // [Load error]
  it('loadVehicles_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    vehicleServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadVehicles();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [Create dialog dismissed]
  it('openCreateDialog_DialogClosedWithoutValue_DoesNotCallCreate', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(undefined));

    const component = createComponent();
    component.openCreateDialog();

    expect(vehicleServiceSpy.create).not.toHaveBeenCalled();
  });

  // [Create succeeds]
  it('openCreateDialog_DialogClosedWithValue_CreatesAndReloadsVehicles', () => {
    const request: RegisterVehicleRequest = { ...vehicle };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    vehicleServiceSpy.create.and.returnValue(of(vehicle));

    const component = createComponent();
    component.openCreateDialog();

    expect(vehicleServiceSpy.create).toHaveBeenCalledOnceWith(request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Vehiculo registrado correctamente');
    expect(vehicleServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });

  // [Create fails]
  it('openCreateDialog_CreateFails_NotifiesError', () => {
    const request: RegisterVehicleRequest = { ...vehicle };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    vehicleServiceSpy.create.and.returnValue(throwError(() => new Error('El vehículo ya existe')));

    const component = createComponent();
    component.openCreateDialog();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('El vehículo ya existe');
  });

  // [Delete not confirmed]
  it('deleteVehicle_NotConfirmed_DoesNotCallDelete', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(false));

    const component = createComponent();
    component.deleteVehicle(vehicle);

    expect(vehicleServiceSpy.delete).not.toHaveBeenCalled();
  });

  // [Delete confirmed]
  it('deleteVehicle_Confirmed_DeletesAndReloadsVehicles', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    vehicleServiceSpy.delete.and.returnValue(of(undefined));

    const component = createComponent();
    component.deleteVehicle(vehicle);

    expect(vehicleServiceSpy.delete).toHaveBeenCalledOnceWith(vehicle.identifier);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Vehiculo eliminado');
  });

  // [Delete blocked by associated loans]
  it('deleteVehicle_ServiceRejectsWithConflict_NotifiesError', () => {
    dialogSpy.open.and.returnValue(fakeDialogRef(true));
    vehicleServiceSpy.delete.and.returnValue(
      throwError(() => new Error('El vehículo tiene préstamos asociados y no puede eliminarse'))
    );

    const component = createComponent();
    component.deleteVehicle(vehicle);

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'El vehículo tiene préstamos asociados y no puede eliminarse'
    );
  });

  // [Edit succeeds]
  it('openEditDialog_DialogClosedWithValue_UpdatesAndReloadsVehicles', () => {
    const request: UpdateVehicleRequest = {
      brand: vehicle.brand,
      model: 'Hilux Cargo 4x4',
      marketValue: 130000000,
      year: vehicle.year
    };
    dialogSpy.open.and.returnValue(fakeDialogRef(request));
    vehicleServiceSpy.update.and.returnValue(of({ ...vehicle, ...request }));

    const component = createComponent();
    component.openEditDialog(vehicle);

    expect(vehicleServiceSpy.update).toHaveBeenCalledOnceWith(vehicle.identifier, request);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith('Vehiculo actualizado correctamente');
  });
});
