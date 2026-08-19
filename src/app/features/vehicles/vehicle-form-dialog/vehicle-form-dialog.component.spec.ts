import { FormBuilder } from '@angular/forms';
import { VehicleFormDialogComponent, VehicleFormDialogData } from './vehicle-form-dialog.component';
import { VehicleResponse, EVehicleBrand, RegisterVehicleRequest, UpdateVehicleRequest } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';

describe('VehicleFormDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<DialogRef<RegisterVehicleRequest | UpdateVehicleRequest, VehicleFormDialogComponent>>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const existingVehicle: VehicleResponse = {
    identifier: 'MK-1299',
    brand: EVehicleBrand.Mazda,
    model: 'Cargo Transportation',
    marketValue: 50000000,
    year: 2023
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<DialogRef<RegisterVehicleRequest | UpdateVehicleRequest, VehicleFormDialogComponent>>('DialogRef', ['close']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(data: VehicleFormDialogData | null): VehicleFormDialogComponent {
    return new VehicleFormDialogComponent(new FormBuilder(), dialogRefSpy, notificationServiceSpy, data);
  }

  // [Create mode]
  it('constructor_NoData_InitializesEmptyFormWithEditableIdentifier', () => {
    const component = createComponent(null);

    expect(component.isEditMode).toBeFalse();
    expect(component.form.get('identifier')?.disabled).toBeFalse();
    expect(component.form.get('identifier')?.value).toBe('');
    expect(component.form.get('brand')?.value).toBe(EVehicleBrand.Toyota);
    expect(component.form.get('year')?.value).toBe(component.currentYear);
  });

  // [Edit mode]
  it('constructor_WithVehicleData_PrefillsFormAndDisablesIdentifier', () => {
    const component = createComponent({ vehicle: existingVehicle });

    expect(component.isEditMode).toBeTrue();
    expect(component.form.get('identifier')?.disabled).toBeTrue();
    expect(component.form.get('identifier')?.value).toBe(existingVehicle.identifier);
    expect(component.form.get('brand')?.value).toBe(existingVehicle.brand);
    expect(component.form.get('marketValue')?.value).toBe(existingVehicle.marketValue);
  });

  // [Invalid form]
  it('save_InvalidForm_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    const component = createComponent(null);

    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('model')?.touched).toBeTrue();
  });

  // [Create mode, valid form, lowercase identifier]
  it('save_CreateModeValidForm_ClosesDialogWithUppercasedIdentifier', () => {
    const component = createComponent(null);

    component.form.setValue({
      identifier: 'mk-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: component.currentYear
    });

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      identifier: 'MK-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: component.currentYear
    });
  });

  // [Edit mode, valid form]
  it('save_EditModeValidForm_ClosesDialogWithOnlyEditableFields', () => {
    const component = createComponent({ vehicle: existingVehicle });

    component.form.get('model')?.setValue('Cargo Transportation 4x4');
    component.form.get('marketValue')?.setValue(52000000);

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      brand: existingVehicle.brand,
      model: 'Cargo Transportation 4x4',
      marketValue: 52000000,
      year: existingVehicle.year
    });
  });

  // [Cancel]
  it('cancel_Always_ClosesDialogWithoutValue', () => {
    const component = createComponent(null);

    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });

  // [Invalid submit]
  it('save_InvalidForm_ShowsErrorNotificationAndDoesNotClose', () => {
    const component = createComponent(null);

    component.save();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'Complete los campos obligatorios para continuar.',
      'Formulario incompleto'
    );
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
